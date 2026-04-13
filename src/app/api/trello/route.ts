import { NextResponse } from "next/server";
import type { BoardTask } from "@/types/board-task";

const TRELLO_API = "https://api.trello.com/1";

function getCredentials() {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_TOKEN;
  const boardId = process.env.TRELLO_BOARD_ID;
  return { key, token, boardId };
}

function authParams(key: string, token: string) {
  return `key=${key}&token=${token}`;
}

// Normalize Trello list names to board statuses
const LIST_NAME_ALIASES: Record<string, string> = {
  "To Do": "To Do",
  "Backlog": "To Do",
  "Open": "To Do",
  "Todo": "To Do",
  "In Progress": "In Progress",
  "Doing": "In Progress",
  "WIP": "In Progress",
  "Blocked": "Blocked",
  "On Hold": "Blocked",
  "Done": "Done",
  "Complete": "Done",
  "Completed": "Done",
};

function normalizeListName(name: string): string {
  return LIST_NAME_ALIASES[name] ?? "To Do";
}

interface TrelloList {
  id: string;
  name: string;
}

interface TrelloMember {
  id: string;
  fullName: string;
}

// GET — fetch all cards from the board
export async function GET(request: Request) {
  const { key, token, boardId } = getCredentials();

  // Check for test connection request
  const url = new URL(request.url);
  if (url.searchParams.get("test") === "true") {
    if (!key || !token || !boardId) {
      return NextResponse.json(
        { error: "Missing Trello credentials. Set TRELLO_API_KEY, TRELLO_TOKEN, and TRELLO_BOARD_ID." },
        { status: 400 }
      );
    }
    try {
      const res = await fetch(`${TRELLO_API}/boards/${boardId}?${authParams(key, token)}&fields=name`);
      if (!res.ok) throw new Error(`Trello API returned ${res.status}`);
      const board = await res.json();
      return NextResponse.json({ success: true, boardName: board.name });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (!key || !token || !boardId) {
    return NextResponse.json(
      { error: "Missing Trello credentials" },
      { status: 400 }
    );
  }

  try {
    // Fetch lists, members, and cards in parallel
    const [listsRes, membersRes, cardsRes] = await Promise.all([
      fetch(`${TRELLO_API}/boards/${boardId}/lists?${authParams(key, token)}&fields=id,name`),
      fetch(`${TRELLO_API}/boards/${boardId}/members?${authParams(key, token)}&fields=id,fullName`),
      fetch(`${TRELLO_API}/boards/${boardId}/cards?${authParams(key, token)}&fields=name,desc,due,idList,idMembers,labels&filter=open`),
    ]);

    if (!listsRes.ok || !membersRes.ok || !cardsRes.ok) {
      throw new Error("Failed to fetch from Trello API");
    }

    const lists: TrelloList[] = await listsRes.json();
    const members: TrelloMember[] = await membersRes.json();
    const cards = await cardsRes.json();

    // Build lookup maps
    const listMap = new Map(lists.map((l) => [l.id, l.name]));
    const memberMap = new Map(members.map((m) => [m.id, m.fullName]));

    const tasks: BoardTask[] = cards.map((card: any) => ({
      id: card.id,
      title: card.name,
      status: normalizeListName(listMap.get(card.idList) ?? ""),
      area: card.labels?.[0]?.name ?? "",
      owner: card.idMembers?.[0] ? (memberMap.get(card.idMembers[0]) ?? "") : "",
      dueDate: card.due ? card.due.split("T")[0] : null,
      notes: card.desc ?? "",
      source: "trello" as const,
    }));

    return NextResponse.json({ tasks, lists });
  } catch (error: any) {
    console.error("Trello API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a new card
export async function POST(request: Request) {
  const { key, token, boardId } = getCredentials();
  if (!key || !token || !boardId) {
    return NextResponse.json({ error: "Missing Trello credentials" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, status, notes, dueDate } = body;

    // Resolve status to list ID
    const listsRes = await fetch(
      `${TRELLO_API}/boards/${boardId}/lists?${authParams(key, token)}&fields=id,name`
    );
    if (!listsRes.ok) throw new Error("Failed to fetch lists");
    const lists: TrelloList[] = await listsRes.json();

    // Find the list whose normalized name matches the requested status
    const targetList = lists.find((l) => normalizeListName(l.name) === (status || "To Do"))
      ?? lists[0];

    const params = new URLSearchParams({
      key,
      token,
      name: title,
      idList: targetList.id,
    });
    if (notes) params.set("desc", notes);
    if (dueDate) params.set("due", dueDate);

    const res = await fetch(`${TRELLO_API}/cards?${params.toString()}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to create card");
    const card = await res.json();

    return NextResponse.json({ id: card.id });
  } catch (error: any) {
    console.error("Trello create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update a card
export async function PATCH(request: Request) {
  const { key, token, boardId } = getCredentials();
  if (!key || !token || !boardId) {
    return NextResponse.json({ error: "Missing Trello credentials" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const params: Record<string, string> = {};
    if (updates.title) params.name = updates.title;
    if (updates.notes !== undefined) params.desc = updates.notes;
    if (updates.dueDate !== undefined) params.due = updates.dueDate ?? "";

    // If status changed, resolve to list ID
    if (updates.status) {
      const listsRes = await fetch(
        `${TRELLO_API}/boards/${boardId}/lists?${authParams(key, token)}&fields=id,name`
      );
      if (!listsRes.ok) throw new Error("Failed to fetch lists");
      const lists: TrelloList[] = await listsRes.json();

      const targetList = lists.find((l) => normalizeListName(l.name) === updates.status)
        ?? lists[0];
      params.idList = targetList.id;
    }

    const queryParams = new URLSearchParams({ key, token, ...params });
    const res = await fetch(`${TRELLO_API}/cards/${id}?${queryParams.toString()}`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to update card");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Trello update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — archive a card
export async function DELETE(request: Request) {
  const { key, token } = getCredentials();
  if (!key || !token) {
    return NextResponse.json({ error: "Missing Trello credentials" }, { status: 400 });
  }

  try {
    const { id } = await request.json();

    const queryParams = new URLSearchParams({ key, token, closed: "true" });
    const res = await fetch(`${TRELLO_API}/cards/${id}?${queryParams.toString()}`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to archive card");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Trello delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
