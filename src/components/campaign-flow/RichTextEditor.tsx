"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const RichTextEditorInner = dynamic(() => import("./RichTextEditorInner").then((m) => m.RichTextEditorInner), {
  ssr: false,
  loading: () => (
    <div className="overflow-hidden rounded-[14px] border border-foreground/[0.06]">
      <div className="flex items-center gap-1 border-b border-foreground/[0.06] p-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="size-8 rounded-[10px] bg-foreground/[0.03]" />
        ))}
      </div>
      <div className="h-[104px] bg-foreground/[0.04]" />
    </div>
  ),
});

export function RichTextEditor(props: RichTextEditorProps) {
  return <RichTextEditorInner {...props} />;
}
