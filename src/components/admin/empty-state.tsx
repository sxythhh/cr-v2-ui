"use client";

import { CentralIcon } from "@central-icons-react/all";

const ci = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = "IconInbox", title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4" style={{ color: "var(--muted-fg)" }}>
      <div className="flex items-center justify-center rounded-2xl mb-3" style={{ width: 48, height: 48, background: "var(--accent)" }}>
        <CentralIcon name={icon as any} size={24} color="var(--muted-fg)" {...ci} />
      </div>
      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)", margin: "0 0 4px" }}>{title}</p>
      {description && <p style={{ fontSize: 13, color: "var(--muted-fg)", margin: 0, textAlign: "center", maxWidth: 280 }}>{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-3 flex items-center gap-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-90"
          style={{ padding: "6px 14px", background: "var(--fg)", border: "none", fontSize: 12, fontWeight: 500, color: "var(--bg)", fontFamily: "inherit" }}
        >
          <CentralIcon name="IconPlusMedium" size={12} color="var(--bg)" {...ci} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
