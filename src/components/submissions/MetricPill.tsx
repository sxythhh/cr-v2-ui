import { cn } from "@/lib/utils";
import { CheckCircleIcon, EmptyCircleIcon } from "./icons";

export function MetricPill({
  label,
  value,
  color,
  bg,
  active = true,
  onClick,
}: {
  label: string;
  value: string;
  color: string;
  bg: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-6 cursor-pointer items-center gap-1 rounded-full border py-2 pr-2 pl-1 transition-colors",
        active ? "border-transparent" : "border-[rgba(224,224,224,0.03)] bg-[rgba(224,224,224,0.03)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
      )}
      style={{ backgroundColor: active ? bg : undefined }}
    >
      <div className="flex items-center gap-1">
        {active ? (
          <CheckCircleIcon color={color} size={16} />
        ) : (
          <EmptyCircleIcon />
        )}
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "font-inter text-xs leading-none tracking-[-0.02em]",
            active ? "text-page-text" : "text-page-text-subtle",
          )}>
            {label}
          </span>
          <span
            className={cn("font-inter text-xs font-medium leading-none tracking-[-0.02em]", !active && "text-page-text-subtle")}
            style={active ? { color } : undefined}
          >
            {value}
          </span>
        </div>
      </div>
    </button>
  );
}
