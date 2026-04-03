"use client";

import { useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const copyButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full text-sm font-medium tracking-[-0.02em] transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-foreground/[0.06] text-page-text hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]",
        secondary:
          "bg-foreground/[0.06] text-page-text hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]",
        outline:
          "border border-foreground/[0.06] bg-white text-page-text hover:bg-foreground/[0.02] dark:border-white/[0.06] dark:bg-card-bg dark:hover:bg-white/[0.04]",
        ghost:
          "text-page-text hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04]",
        dark:
          "bg-page-text text-white hover:bg-page-text/90 dark:bg-white dark:text-[#252525] dark:hover:bg-white/90",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-5",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="5.333" y="5.333" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.33" />
      <path d="M3.333 10.667h-.5A1.5 1.5 0 0 1 1.333 9.167v-6A1.5 1.5 0 0 1 2.833 1.667h6A1.5 1.5 0 0 1 10.333 3.167v.5" stroke="currentColor" strokeWidth="1.33" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3.33 8L6.67 11.33 12.67 5.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof copyButtonVariants> {
  /** The text to copy to clipboard */
  text: string;
  /** Optional label — if omitted, shows icon only */
  children?: ReactNode;
  /** Duration to show "Copied" state in ms */
  resetDelay?: number;
}

export function CopyButton({
  text,
  children,
  variant,
  size,
  className,
  resetDelay = 2000,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
      onClick?.(e);
    },
    [text, resetDelay, onClick]
  );

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(copyButtonVariants({ variant, size }), className)}
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {children && (
        <span className="grid overflow-hidden">
          <span className="col-start-1 row-start-1 text-center">
            {copied ? "Copied!" : children}
          </span>
        </span>
      )}
    </button>
  );
}
