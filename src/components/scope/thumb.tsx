import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Thumb({
  aspect = "9/16",
  duration,
  imageUrl,
  seed,
  children,
  className,
}: {
  aspect?: string;
  /** Deprecated: retained for call-site compatibility, not rendered. */
  label?: string;
  duration?: string;
  imageUrl?: string | null;
  /** Stable seed for picsum.photos when no imageUrl is provided. */
  seed?: string;
  children?: ReactNode;
  className?: string;
}) {
  const src =
    imageUrl ||
    (seed ? `https://picsum.photos/seed/${encodeURIComponent(seed)}/320/480` : null);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-foreground/[0.06] bg-foreground/[0.04] dark:border-[rgba(224,224,224,0.03)]",
        className,
      )}
      style={{ aspectRatio: aspect }}
    >
      {src ? (
        <Image src={src} alt="" fill sizes="320px" className="object-cover" unoptimized />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {duration && (
        <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {duration}
        </span>
      )}
      {children}
    </div>
  );
}
