"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "./icons";
import { CheckRow } from "./CheckRow";
import type { CheckItem } from "./types";

export function CheckSection({
  icon,
  title,
  passed,
  total,
  checks,
}: {
  icon: ReactNode;
  title: string;
  passed: number;
  total: number;
  checks: CheckItem[];
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="overflow-hidden rounded-[10px] border border-foreground/[0.06] bg-card-bg dark:border-card-inner-border dark:bg-card-inner-bg">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 transition-colors hover:bg-foreground/[0.04]"
      >
        <div className="flex flex-1 items-center gap-1.5">
          {icon}
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text">
            {title}
          </span>
        </div>
        <div
          className="flex items-center justify-center rounded-full border border-foreground/[0.06] px-1.5"
          style={{ height: 18 }}
        >
          <span className="font-inter text-xs font-medium leading-none tracking-[-0.02em] text-[#FF2626]">
            {passed}/{total}
          </span>
        </div>
        <div className={cn("ml-2 transition-transform", expanded && "rotate-180")}>
          <ChevronDownIcon />
        </div>
      </button>

      {/* Checks */}
      {expanded && (
        <div className="border-t border-foreground/[0.06]">
          {checks.map((check, i) => (
            <CheckRow key={check.name + i} check={check} isLast={i === checks.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}
