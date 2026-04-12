import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { extractPageTitle } from "@/lib/notion-blocks";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export interface NotionPageSummary {
  id: string;
  title: string;
  type: "page" | "database";
  icon: string | null;
  parentId: string | null;
  lastEdited: string;
}

function getIcon(page: any): string | null {
  const icon = page.icon;
  if (!icon) return null;
  if (icon.type === "emoji") return icon.emoji;
  if (icon.type === "external") return icon.external?.url ?? null;
  if (icon.type === "file") return icon.file?.url ?? null;
  return null;
}

function getParentId(page: any): string | null {
  const parent = page.parent;
  if (!parent) return null;
  if (parent.type === "page_id") return parent.page_id;
  if (parent.type === "database_id") return parent.database_id;
  if (parent.type === "block_id") return parent.block_id;
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const cursor = searchParams.get("cursor") || undefined;

    const response = await notion.search({
      query,
      page_size: 50,
      start_cursor: cursor,
    });

    const pages: NotionPageSummary[] = response.results.map((item: any) => ({
      id: item.id,
      title: item.object === "database" ? (item.title?.[0]?.plain_text ?? "Untitled DB") : extractPageTitle(item),
      type: item.object === "database" ? "database" : "page",
      icon: getIcon(item),
      parentId: getParentId(item),
      lastEdited: item.last_edited_time,
    }));

    return NextResponse.json({
      pages,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    });
  } catch (error: any) {
    console.error("Notion workspace search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a new page in the workspace
export async function POST(request: Request) {
  try {
    const { title, parentId } = await request.json();

    // Create as a top-level page in the workspace (under the team space)
    const page = await notion.pages.create({
      parent: parentId
        ? { page_id: parentId }
        : { page_id: "3243c5a3-6316-8121-b8fa-d19557e511ac" }, // Growth page as default parent
      properties: {
        title: { title: [{ text: { content: title } }] },
      },
    });

    return NextResponse.json({ id: (page as any).id });
  } catch (error: any) {
    console.error("Notion create page error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
