/* ── Notion Block ↔ Markdown converter ── */

// Rich text → markdown inline
function richTextToMd(richTexts: any[]): string {
  if (!richTexts?.length) return "";
  return richTexts
    .map((rt: any) => {
      let text = rt.plain_text ?? "";
      if (!text) return "";
      const a = rt.annotations ?? {};
      if (a.code) text = `\`${text}\``;
      if (a.bold) text = `**${text}**`;
      if (a.italic) text = `*${text}*`;
      if (a.strikethrough) text = `~~${text}~~`;
      if (rt.href) text = `[${text}](${rt.href})`;
      return text;
    })
    .join("");
}

// Single block → markdown lines
function blockToMd(block: any, depth = 0): string[] {
  const indent = "  ".repeat(depth);
  const t = block.type;
  const data = block[t];
  if (!data && t !== "divider") return [];

  switch (t) {
    case "paragraph":
      return [indent + richTextToMd(data.rich_text)];
    case "heading_1":
      return ["# " + richTextToMd(data.rich_text)];
    case "heading_2":
      return ["## " + richTextToMd(data.rich_text)];
    case "heading_3":
      return ["### " + richTextToMd(data.rich_text)];
    case "bulleted_list_item": {
      const lines = [indent + "- " + richTextToMd(data.rich_text)];
      if (data.children) for (const c of data.children) lines.push(...blockToMd(c, depth + 1));
      return lines;
    }
    case "numbered_list_item": {
      const lines = [indent + "1. " + richTextToMd(data.rich_text)];
      if (data.children) for (const c of data.children) lines.push(...blockToMd(c, depth + 1));
      return lines;
    }
    case "to_do": {
      const check = data.checked ? "x" : " ";
      return [indent + `- [${check}] ` + richTextToMd(data.rich_text)];
    }
    case "toggle": {
      const lines = [indent + "<details><summary>" + richTextToMd(data.rich_text) + "</summary>"];
      if (data.children) for (const c of data.children) lines.push(...blockToMd(c, depth));
      lines.push(indent + "</details>");
      return lines;
    }
    case "code":
      return [
        "```" + (data.language ?? ""),
        richTextToMd(data.rich_text),
        "```",
      ];
    case "quote":
      return [indent + "> " + richTextToMd(data.rich_text)];
    case "callout": {
      const icon = data.icon?.emoji ?? "💡";
      return [indent + `> ${icon} ` + richTextToMd(data.rich_text)];
    }
    case "divider":
      return ["---"];
    case "image": {
      const url = data.file?.url ?? data.external?.url ?? "";
      const caption = data.caption?.length ? richTextToMd(data.caption) : "image";
      return [`![${caption}](${url})`];
    }
    case "table": {
      const lines: string[] = [];
      const rows = data.children ?? [];
      for (let r = 0; r < rows.length; r++) {
        const cells = (rows[r]?.table_row?.cells ?? []).map((cell: any[]) => richTextToMd(cell));
        lines.push("| " + cells.join(" | ") + " |");
        if (r === 0) lines.push("| " + cells.map(() => "---").join(" | ") + " |");
      }
      return lines;
    }
    case "table_row":
      return []; // handled by table parent
    case "child_page":
      return [`📄 **${data.title}** *(sub-page)*`];
    case "child_database":
      return [`📊 **${data.title}** *(database)*`];
    case "bookmark":
      return [`🔗 [${data.url}](${data.url})`];
    case "embed":
      return [`📎 [Embedded: ${data.url}](${data.url})`];
    case "link_preview":
      return [`🔗 [${data.url}](${data.url})`];
    default:
      return [indent + `*[${t} block]*`];
  }
}

// All blocks → markdown string
export function blocksToMarkdown(blocks: any[]): string {
  const lines: string[] = [];
  for (const block of blocks) {
    lines.push(...blockToMd(block));
  }
  return lines.join("\n");
}

// Markdown → Notion blocks (simple line-based parser)
export function markdownToBlocks(md: string): any[] {
  const lines = md.split("\n");
  const blocks: any[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        object: "block",
        type: "code",
        code: {
          rich_text: [{ type: "text", text: { content: codeLines.join("\n") } }],
          language: lang || "plain text",
        },
      });
      continue;
    }

    // Divider
    if (line.trim() === "---" || line.trim() === "***") {
      blocks.push({ object: "block", type: "divider", divider: {} });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push({ object: "block", type: "heading_3", heading_3: { rich_text: mdTextToRichText(line.slice(4)) } });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ object: "block", type: "heading_2", heading_2: { rich_text: mdTextToRichText(line.slice(3)) } });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ object: "block", type: "heading_1", heading_1: { rich_text: mdTextToRichText(line.slice(2)) } });
      i++;
      continue;
    }

    // To-do
    const todoMatch = line.match(/^- \[([ x])\] (.*)$/);
    if (todoMatch) {
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: {
          rich_text: mdTextToRichText(todoMatch[2]),
          checked: todoMatch[1] === "x",
        },
      });
      i++;
      continue;
    }

    // Bulleted list
    if (line.match(/^[-*] /)) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: mdTextToRichText(line.replace(/^[-*] /, "")) },
      });
      i++;
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      blocks.push({
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: { rich_text: mdTextToRichText(line.replace(/^\d+\. /, "")) },
      });
      i++;
      continue;
    }

    // Quote
    if (line.startsWith("> ")) {
      blocks.push({
        object: "block",
        type: "quote",
        quote: { rich_text: mdTextToRichText(line.slice(2)) },
      });
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph (default)
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: { rich_text: mdTextToRichText(line) },
    });
    i++;
  }

  return blocks;
}

// Markdown inline → Notion rich_text array (preserves bold, italic, code, links)
function mdTextToRichText(text: string): any[] {
  const segments: any[] = [];
  // Regex matches: **bold**, *italic*, `code`, [link](url), ~~strike~~, or plain text
  const pattern = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))|(~~(.+?)~~)|([^*`\[~]+|[*`\[~])/g;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match[1]) {
      // **bold**
      segments.push({
        type: "text",
        text: { content: match[2] },
        annotations: { bold: true },
      });
    } else if (match[3]) {
      // *italic*
      segments.push({
        type: "text",
        text: { content: match[4] },
        annotations: { italic: true },
      });
    } else if (match[5]) {
      // `code`
      segments.push({
        type: "text",
        text: { content: match[6] },
        annotations: { code: true },
      });
    } else if (match[7]) {
      // [link](url)
      segments.push({
        type: "text",
        text: { content: match[8], link: { url: match[9] } },
      });
    } else if (match[10]) {
      // ~~strikethrough~~
      segments.push({
        type: "text",
        text: { content: match[11] },
        annotations: { strikethrough: true },
      });
    } else if (match[12]) {
      // plain text
      segments.push({
        type: "text",
        text: { content: match[12] },
      });
    }
  }

  return segments.length > 0 ? segments : [{ type: "text", text: { content: text } }];
}

// Extract page title from any Notion page object
export function extractPageTitle(page: any): string {
  const props = page.properties ?? {};
  for (const key of Object.keys(props)) {
    const p = props[key];
    if (p.type === "title" && p.title?.length) {
      return p.title.map((t: any) => t.plain_text).join("");
    }
  }
  return "Untitled";
}
