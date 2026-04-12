import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { blocksToMarkdown, markdownToBlocks, extractPageTitle } from "@/lib/notion-blocks";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Recursively fetch blocks with children (depth-limited)
async function fetchBlocks(blockId: string, depth = 0): Promise<any[]> {
  if (depth > 3) return [];
  const blocks: any[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });

    for (const block of response.results as any[]) {
      if (block.has_children && block.type !== "child_page" && block.type !== "child_database") {
        const children = await fetchBlocks(block.id, depth + 1);
        block[block.type].children = children;
      }
      blocks.push(block);
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const [page, blocks] = await Promise.all([
      notion.pages.retrieve({ page_id: pageId }),
      fetchBlocks(pageId),
    ]);

    const p = page as any;

    return NextResponse.json({
      page: {
        id: p.id,
        title: extractPageTitle(p),
        icon: p.icon?.emoji ?? p.icon?.external?.url ?? null,
        url: p.url,
        parentId: p.parent?.page_id ?? p.parent?.database_id ?? null,
        lastEdited: p.last_edited_time,
        properties: p.properties,
      },
      markdown: blocksToMarkdown(blocks),
      blocks,
    });
  } catch (error: any) {
    console.error("Notion page fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const body = await request.json();

    // Update page title if provided
    if (body.title) {
      const page = await notion.pages.retrieve({ page_id: pageId }) as any;
      const titleProp = Object.keys(page.properties).find(
        (k) => page.properties[k].type === "title"
      );
      if (titleProp) {
        await notion.pages.update({
          page_id: pageId,
          properties: {
            [titleProp]: { title: [{ text: { content: body.title } }] },
          },
        });
      }
    }

    // Update content if markdown provided — safe two-phase: append new, then delete old
    if (body.markdown !== undefined) {
      // 1. Fetch existing block IDs first
      const existingIds: string[] = [];
      let cursor: string | undefined;
      do {
        const res = await notion.blocks.children.list({ block_id: pageId, page_size: 100, start_cursor: cursor });
        for (const b of res.results) existingIds.push((b as any).id);
        cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
      } while (cursor);

      // 2. Append new blocks from markdown
      const newBlocks = markdownToBlocks(body.markdown);
      if (newBlocks.length > 0) {
        for (let i = 0; i < newBlocks.length; i += 100) {
          await notion.blocks.children.append({
            block_id: pageId,
            children: newBlocks.slice(i, i + 100) as any,
          });
        }
      }

      // 3. Delete old blocks only after new ones are confirmed appended
      for (const blockId of existingIds) {
        try {
          await notion.blocks.delete({ block_id: blockId });
        } catch {
          // Ignore individual block delete failures (may already be gone)
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notion page update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — archive a page
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Notion page delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
