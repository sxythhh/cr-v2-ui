import { cn } from "@/lib/utils";

export function Velocity({
  level = 3,
  down = false,
  className,
}: {
  level?: number;
  down?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-end gap-[2px]", className)} aria-label={`Velocity ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const on = i <= level;
        const hot = on && level === 5 && !down;
        return (
          <span
            key={i}
            className={cn(
              "w-[3px] rounded-sm",
              !on && "bg-foreground/[0.12]",
              on && !hot && !down && "bg-scope-accent",
              on && down && "bg-red-500/80",
              hot && "bg-red-500",
            )}
            style={{ height: `${3 + i * 1.7}px` }}
          />
        );
      })}
    </span>
  );
}
