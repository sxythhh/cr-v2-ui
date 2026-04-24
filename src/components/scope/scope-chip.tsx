import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ScopeChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children?: ReactNode;
};

export const ScopeChip = forwardRef<HTMLButtonElement, ScopeChipProps>(function ScopeChip(
  { active, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      data-active={active ? "true" : undefined}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white px-3 font-[family-name:var(--font-inter)] text-xs text-page-text-muted transition-colors hover:bg-foreground/[0.03] hover:text-page-text dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg",
        "data-[active=true]:border-scope-accent/40 data-[active=true]:bg-scope-accent/10 data-[active=true]:text-page-text",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
