"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

function BoldIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2.667h5.333a2.667 2.667 0 0 1 0 5.333H4V2.667ZM4 8h6a2.667 2.667 0 0 1 0 5.333H4V8Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ItalicIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.667 2.667H6.667M9.333 13.333H5.333M10 2.667L6 13.333" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function UnderlineIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2.667v4a4 4 0 0 0 8 0v-4M3.333 13.333h9.334" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function LinkIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 8.667a3.333 3.333 0 0 0 4.994.36l2-2a3.334 3.334 0 0 0-4.714-4.714l-1.147 1.14M9.333 7.333a3.333 3.333 0 0 0-4.994-.36l-2 2a3.334 3.334 0 0 0 4.714 4.714l1.14-1.14" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function OrderedListIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 3h6.666M6.667 8h6.666M6.667 13h6.666M2.667 3h.667v2M2.667 7.333h1.666L2.667 9.333h2M2.667 12.333v1.334h1.666v-1.334h-1.666v-1h1.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function BulletListIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.667 3.333h6.666M6.667 8h6.666M6.667 12.667h6.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /><circle cx="3.333" cy="3.333" r="0.667" fill="currentColor" /><circle cx="3.333" cy="8" r="0.667" fill="currentColor" /><circle cx="3.333" cy="12.667" r="0.667" fill="currentColor" /></svg>; }
function AlignLeftIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.667 3.333h10.666M2.667 6.667h6.666M2.667 10h10.666M2.667 13.333h6.666" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

interface RichTextEditorInnerProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export function RichTextEditorInner({ content, onChange, placeholder = "Start typing...", maxLength = 300, className }: RichTextEditorInnerProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, codeBlock: false, code: false, blockquote: false, horizontalRule: false }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-[#3B82F6] underline" } }),
      TextAlign.configure({ types: ["paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor: e }) => {
      const text = e.getText();
      if (maxLength && text.length > maxLength) return;
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: "h-[104px] w-full cursor-text resize-none bg-transparent px-3.5 py-3 font-inter text-sm tracking-[-0.02em] text-page-text outline-none overflow-y-auto scrollbar-hide [&_p]:m-0 [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal",
      },
    },
  });

  if (!editor) return null;

  const charCount = editor.getText().length;

  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt("URL");
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const buttons = [
    { icon: BoldIcon, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: ItalicIcon, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
    { icon: LinkIcon, action: toggleLink, active: editor.isActive("link") },
    { icon: OrderedListIcon, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { icon: BulletListIcon, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: AlignLeftIcon, action: () => editor.chain().focus().setTextAlign("left").run(), active: false },
  ];

  return (
    <div className={cn("overflow-hidden rounded-[14px] border border-foreground/[0.06]", className)}>
      <div className="flex items-center gap-1 border-b border-foreground/[0.06] p-1">
        {buttons.map((btn, i) => (
          <button
            key={i}
            type="button"
            onClick={btn.action}
            className={cn(
              "flex size-8 items-center justify-center rounded-[10px] transition-colors",
              btn.active ? "bg-foreground/[0.06] text-page-text" : "text-page-text-subtle hover:bg-foreground/[0.04]",
            )}
          >
            <btn.icon />
          </button>
        ))}
      </div>
      <div className="relative bg-foreground/[0.04]">
        <EditorContent editor={editor} />
        <span className="absolute bottom-3 right-3.5 font-inter text-xs tracking-[-0.02em] text-page-text-muted">{charCount}/{maxLength}</span>
      </div>
    </div>
  );
}
