import { cn } from "@/lib/utils";

export function StatMiniCard({
  value,
  label,
  valueColor,
  variant = "filled",
  className,
}: {
  value: string;
  label: string;
  valueColor?: string;
  variant?: "filled" | "outlined";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col justify-center gap-2 rounded-2xl p-3",
        variant === "filled"
          ? "bg-foreground/[0.04] dark:bg-white/[0.04]"
          : "border border-[rgba(37,37,37,0.06)] bg-[#FBFBFB] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-inner-bg",
        className,
      )}
    >
      <span
        className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-page-text"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
      <span className="font-inter text-xs leading-none tracking-[-0.02em] text-page-text-muted">
        {label}
      </span>
    </div>
  );
}
