"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────

export interface ExportModalColumn {
  id: string;
  label: string;
}

export interface ExportModalGroup {
  /** Optional section heading rendered above the column grid */
  title?: string;
  columns: ExportModalColumn[];
}

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  /** Modal title — defaults to "Export analytics" */
  title?: string;
  /** Description shown beneath the title */
  description?: string;
  /** Column groups to render as the checkbox grid */
  groups: ExportModalGroup[];
  /** Initial selected ids — defaults to all columns selected */
  initialSelected?: string[];
  /** Primary action label — defaults to "Export" */
  actionLabel?: string;
  /** Called with the chosen ids when the primary action is pressed */
  onExport?: (selectedIds: string[]) => void;
  /** Override the centered header icon (default: arrow-out-of-box) */
  icon?: ReactNode;
}

// ── Default icon ─────────────────────────────────────────────────────

function DefaultExportIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4v11M12 4l-4 4M12 4l4 4M5 14v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Circle checkbox ──────────────────────────────────────────────────

function CheckCircle({ checked }: { checked: boolean }) {
  return (
    <span className="relative flex size-6 shrink-0 items-center justify-center">
      <span
        aria-hidden
        className={cn(
          "size-5 rounded-full border transition-colors",
          checked
            ? "border-page-text bg-page-text"
            : cn(
                "border-foreground/10 bg-card-bg",
                "shadow-[0_-1px_3px_rgba(0,0,0,0.06),0_1px_1px_rgba(255,255,255,0.6),inset_0_0.5px_2px_rgba(0,0,0,0.12)]",
                "dark:border-white/10 dark:shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06),inset_0_-1px_2px_rgba(0,0,0,0.4)]",
              ),
        )}
      />
      {checked && (
        <svg
          className="absolute"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 6.25 5 8.5l4.5-5"
            stroke="var(--card-bg, #fff)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}

// ── ExportModal ──────────────────────────────────────────────────────

export function ExportModal({
  open,
  onClose,
  title = "Export analytics",
  description = "Choose which columns to include in your export. The CSV file will download via your browser.",
  groups,
  initialSelected,
  actionLabel = "Export",
  onExport,
  icon,
}: ExportModalProps) {
  const allIds = groups.flatMap((g) => g.columns.map((c) => c.id));
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialSelected ?? allIds),
  );

  // Reset selection each time the modal re-opens
  useEffect(() => {
    if (open) {
      setSelected(new Set(initialSelected ?? allIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleAction = () => {
    onExport?.(Array.from(selected));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="md" showClose={false}>
      <div className="relative flex flex-col gap-4 p-5">
        {/* Top: icon + title + description */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <div
            className="flex size-14 items-center justify-center rounded-full bg-card-bg text-page-text"
            style={{ boxShadow: "0 0 0 2px var(--card-bg, #fff)" }}
          >
            {icon ?? <DefaultExportIcon />}
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-inter text-[18px] font-medium leading-[120%] tracking-[-0.02em] text-page-text">
              {title}
            </h2>
            <p className="font-inter text-sm leading-[150%] tracking-[-0.02em] text-page-text-muted">
              {description}
            </p>
          </div>
        </div>

        {/* Card with options */}
        <div className="flex flex-col gap-5 rounded-2xl border border-foreground/[0.06] bg-card-bg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          {groups.map((group, gi) => (
            <div key={group.title ?? gi} className="flex flex-col gap-2">
              {group.title && (
                <h3 className="font-inter text-sm font-medium leading-[120%] tracking-[-0.02em] text-page-text">
                  {group.title}
                </h3>
              )}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {group.columns.map((col) => {
                  const checked = selected.has(col.id);
                  return (
                    <button
                      type="button"
                      key={col.id}
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => toggle(col.id)}
                      className={cn(
                        "flex h-10 cursor-pointer items-center gap-2 rounded-[14px] border border-foreground/[0.06] bg-card-bg pl-2 pr-3 text-left transition-colors hover:bg-foreground/[0.04]",
                        "shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
                      )}
                    >
                      <CheckCircle checked={checked} />
                      <span className="min-w-0 truncate font-inter text-sm font-medium tracking-[-0.02em] text-page-text">
                        {col.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Close button — top right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-6 cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.10]"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 1.5 8.5 8.5M8.5 1.5 1.5 8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center px-5 pb-5">
        <button
          type="button"
          onClick={handleAction}
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-foreground/[0.06] px-4 font-inter text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10]"
        >
          {actionLabel}
        </button>
      </div>
    </Modal>
  );
}
