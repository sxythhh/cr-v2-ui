import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// POST — append blocks to a page
export async function POST(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;
    const { children } = await request.json();

    await notion.blocks.children.append({
      block_id: pageId,
      children,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — update a single block
export async function PATCH(request: Request) {
  try {
    const { blockId, ...data } = await request.json();

    await notion.blocks.update({
      block_id: blockId,
      ...data,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — delete a block
export async function DELETE(request: Request) {
  try {
    const { blockId } = await request.json();

    await notion.blocks.delete({ block_id: blockId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
