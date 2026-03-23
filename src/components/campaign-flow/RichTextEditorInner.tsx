"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

/* ── Toolbar icons (user-provided, centered in 16×16 viewBox) ──── */

function ItalicIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.66659 2.66797L9.66659 2.66797M12.6666 2.66797L9.66659 2.66797M9.66659 2.66797L6.33325 13.3346M6.33325 13.3346H3.33325M6.33325 13.3346L9.33325 13.3346" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function BoldIcon() { return <svg width="16" height="16" viewBox="0 0 10 12" fill="none"><path d="M5.33341 6.0013H0.666748M5.33341 6.0013C6.80617 6.0013 8.00008 4.80739 8.00008 3.33464C8.00008 1.86188 6.80617 0.667969 5.33341 0.667969H2.00008C1.2637 0.667969 0.666748 1.26492 0.666748 2.0013V6.0013M5.33341 6.0013H6.00008C7.47284 6.0013 8.66675 7.19521 8.66675 8.66797C8.66675 10.1407 7.47284 11.3346 6.00008 11.3346H2.00008C1.2637 11.3346 0.666748 10.7377 0.666748 10.0013V6.0013" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="square" strokeLinejoin="round" /></svg>; }
function UnderlineIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 14.0013H12M4 2.66797V8.0013C4 10.2104 5.79086 12.0013 8 12.0013C10.2091 12.0013 12 10.2104 12 8.0013V2.66797" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" /></svg>; }
function LinkIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.66667 12.665L6.55229 12.7793C5.51089 13.8207 3.82245 13.8207 2.78105 12.7793L2.55229 12.5506C1.51089 11.5092 1.51089 9.82074 2.55229 8.77934L4.78105 6.55058C5.82245 5.50918 7.51089 5.50918 8.55229 6.55058L8.78105 6.77934C9.2168 7.21509 9.47022 7.76411 9.54131 8.33162" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.45874 8.33423C6.52983 8.90174 6.78325 9.45077 7.219 9.88652L7.44776 10.1153C8.48916 11.1567 10.1776 11.1567 11.219 10.1153L13.4478 7.88652C14.4892 6.84512 14.4892 5.15668 13.4478 4.11528L13.219 3.88652C12.1776 2.84512 10.4892 2.84512 9.44776 3.88652L9.33341 4.0009" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function OrderedListIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.00008 11.3333H13.3334M8.00008 4.66667H13.3334M4.00008 6.33333V3L2.66675 3.66667M2.83341 10C2.83341 10 3.26675 9.66667 3.74076 9.66667C4.25217 9.66667 4.66675 10.0812 4.66675 10.5927C4.66675 11.7923 2.66675 12 2.66675 13H4.83341" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function BulletListIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.66675 11.332H13.3334M8.66675 4.66536H13.3334M5.33341 4.66536C5.33341 5.40174 4.73646 5.9987 4.00008 5.9987C3.2637 5.9987 2.66675 5.40174 2.66675 4.66536C2.66675 3.92898 3.2637 3.33203 4.00008 3.33203C4.73646 3.33203 5.33341 3.92898 5.33341 4.66536ZM5.33341 11.332C5.33341 12.0684 4.73646 12.6654 4.00008 12.6654C3.2637 12.6654 2.66675 12.0684 2.66675 11.332C2.66675 10.5957 3.2637 9.9987 4.00008 9.9987C4.73646 9.9987 5.33341 10.5957 5.33341 11.332Z" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" /></svg>; }
function AlignLeftIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3.33203V12.6654M6 3.9987H14M6 7.9987H14M6 11.9987H10.6667" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

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
        class: "h-[104px] w-full resize-none bg-transparent px-3.5 py-3 font-inter text-sm tracking-[-0.02em] text-page-text outline-none overflow-y-auto scrollbar-hide [&_p]:m-0 [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal",
        style: "cursor: text;",
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
    { icon: AlignLeftIcon, action: () => { /* placeholder — no text-align extension */ }, active: false },
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
      <div
        className="relative bg-foreground/[0.04]"
        style={{ cursor: "text" }}
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} className="[&_*[contenteditable]]:!cursor-text [&_.tiptap]:!cursor-text [&_.ProseMirror]:!cursor-text" />
        <span className="absolute bottom-3 right-3.5 pointer-events-none font-inter text-xs tracking-[-0.02em] text-page-text-muted">{charCount}/{maxLength}</span>
      </div>
    </div>
  );
}
