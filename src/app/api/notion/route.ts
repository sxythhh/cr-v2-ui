import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Data source ID from the Growth Tasks database
const GROWTH_TASKS_DS = "2ff51bc5-8f98-4b7b-b04d-40c0a3514fd6";
const GROWTH_TASKS_DB = "ab8bcdb7-e599-40a1-8b7c-4381777975d9";

export interface NotionTask {
  id: string;
  title: string;
  status: string;
  area: string;
  owner: string;
  dueDate: string | null;
  notes: string;
}

function extractProp(props: any, name: string): string {
  const p = props?.[name];
  if (!p) return "";
  if (p.type === "title") return p.title?.map((t: any) => t.plain_text).join("") ?? "";
  if (p.type === "rich_text") return p.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
  if (p.type === "select") return p.select?.name ?? "";
  return "";
}

// GET — fetch all tasks
export async function GET() {
  try {
    const response = await notion.dataSources.query({
      data_source_id: GROWTH_TASKS_DS,
      page_size: 100,
    });

    const tasks: NotionTask[] = response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: extractProp(props, "Task"),
        status: extractProp(props, "Status") || "To Do",
        area: extractProp(props, "Area") || "Other",
        owner: extractProp(props, "Owner") || "",
        dueDate: props?.["Due Date"]?.date?.start ?? null,
        notes: extractProp(props, "Notes"),
      };
    });

    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error("Notion API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, status, area, owner, dueDate, notes } = body;

    const properties: any = {
      Task: { title: [{ text: { content: title } }] },
    };
    if (status) properties.Status = { select: { name: status } };
    if (area) properties.Area = { select: { name: area } };
    if (owner) properties.Owner = { select: { name: owner } };
    if (dueDate) properties["Due Date"] = { date: { start: dueDate } };
    if (notes) properties.Notes = { rich_text: [{ text: { content: notes } }] };

    const page = await notion.pages.create({
      parent: { database_id: GROWTH_TASKS_DB },
      properties,
    });

    return NextResponse.json({ id: page.id });
  } catch (error: any) {
    console.error("Notion create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update a task
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const properties: any = {};
    if (updates.title) properties.Task = { title: [{ text: { content: updates.title } }] };
    if (updates.status) properties.Status = { select: { name: updates.status } };
    if (updates.area) properties.Area = { select: { name: updates.area } };
    if (updates.owner) properties.Owner = { select: { name: updates.owner } };
    if (updates.dueDate !== undefined) {
      properties["Due Date"] = updates.dueDate ? { date: { start: updates.dueDate } } : { date: null };
    }
    if (updates.notes !== undefined) {
      properties.Notes = { rich_text: [{ text: { content: updates.notes } }] };
    }

    await notion.pages.update({
      page_id: id,
      properties,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notion update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — archive a task
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await notion.pages.update({
      page_id: id,
      archived: true,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notion delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
