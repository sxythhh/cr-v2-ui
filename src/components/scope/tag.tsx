import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TagKind = "new" | "hot" | "success" | "info" | "neutral";

const KIND_CLASSES: Record<TagKind, string> = {
  new: "bg-scope-accent/15 text-scope-accent",
  hot: "bg-red-500/15 text-red-600 dark:text-red-400",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  info: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  neutral: "bg-foreground/[0.08] text-page-text-muted",
};

export function Tag({
  children,
  kind = "neutral",
  className,
}: {
  children: ReactNode;
  kind?: TagKind;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 font-inter text-[10px] font-semibold uppercase tracking-[0.04em]",
        KIND_CLASSES[kind],
        className,
      )}
    >
      {children}
    </span>
  );
}
