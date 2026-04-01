import { cn } from "@/lib/utils";
import { CheckCircleIcon, XCircleIcon } from "./icons";
import type { CheckItem } from "./types";

export function CheckRow({ check, isLast }: { check: CheckItem; isLast: boolean }) {
  return (
    <div className="flex items-center px-3 gap-2">
      {check.passed ? (
        <CheckCircleIcon color="#00B259" />
      ) : (
        <XCircleIcon color="#FF2525" />
      )}
      <div
        className={cn(
          "flex flex-1 items-center gap-2 py-3",
          !isLast && "border-b border-foreground/[0.06]",
        )}
      >
        <span className="flex-1 font-inter text-xs font-medium leading-none tracking-[-0.02em] text-page-text-subtle">
          {check.name}
        </span>
        <span className="flex-1 text-right font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
          {check.detail}
        </span>
        <span
          className="w-[21px] text-right font-inter text-xs font-medium leading-none tracking-[-0.02em]"
          style={{ color: check.passed ? "#00B259" : "#FF2525" }}
        >
          {check.score}
        </span>
      </div>
    </div>
  );
}
