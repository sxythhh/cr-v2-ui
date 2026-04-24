import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const CARD_BASE =
  "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg";

export function ScopeCard({
  className,
  accent,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { accent?: boolean }) {
  return (
    <div
      className={cn(
        CARD_BASE,
        accent && "border-scope-accent/40 bg-[linear-gradient(135deg,rgba(242,130,24,0.06),transparent_55%)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ScopeCardHeader({
  title,
  icon,
  actions,
  className,
}: {
  title: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-foreground/[0.06] px-4 py-3 dark:border-[rgba(224,224,224,0.03)]",
        className,
      )}
    >
      <span className="flex items-center gap-2 font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.01em] text-page-text">
        {icon}
        {title}
      </span>
      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </div>
  );
}

export function ScopeCardInner({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-foreground/[0.03] bg-foreground/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-card-inner-border dark:bg-card-inner-bg dark:shadow-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
