import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

type Variant = "default" | "primary" | "ghost" | "icon";
type Size = "xs" | "sm" | "md";

const BASE =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-[family-name:var(--font-inter)] font-medium tracking-[-0.01em] transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const VARIANT: Record<Variant, string> = {
  default:
    "bg-foreground/[0.03] text-page-text hover:bg-foreground/[0.06]",
  primary:
    "bg-scope-accent text-white hover:bg-scope-accent/90",
  ghost:
    "bg-transparent text-page-text-muted hover:bg-foreground/[0.03] hover:text-page-text",
  icon:
    "bg-foreground/[0.03] text-page-text-muted hover:bg-foreground/[0.06] hover:text-page-text justify-center",
};

const SIZE: Record<Size, string> = {
  xs: "h-7 px-2.5 text-[11px]",
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
};

const ICON_SIZE: Record<Size, string> = {
  xs: "size-7 p-0",
  sm: "size-8 p-0",
  md: "size-9 p-0",
};

export type ScopeButtonProps = {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  className?: string;
};

export const ScopeButton = forwardRef<
  HTMLButtonElement,
  ScopeButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(function ScopeButton({ variant = "default", size = "sm", className, children, ...props }, ref) {
  const iconOnly = variant === "icon";
  return (
    <button
      ref={ref}
      className={cn(BASE, iconOnly ? ICON_SIZE[size] : SIZE[size], VARIANT[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
});

export const ScopeLinkButton = forwardRef<
  HTMLAnchorElement,
  ScopeButtonProps & LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">
>(function ScopeLinkButton({ variant = "default", size = "sm", className, children, ...props }, ref) {
  const iconOnly = variant === "icon";
  return (
    <Link
      ref={ref}
      className={cn(BASE, iconOnly ? ICON_SIZE[size] : SIZE[size], VARIANT[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
});
