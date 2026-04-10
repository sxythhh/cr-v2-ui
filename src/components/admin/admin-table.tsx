// @ts-nocheck
"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CentralIcon } from "@central-icons-react/all";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

const ciProps = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

// ── Types ────────────────────────────────────────────────────────────

export type AdminColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  /** CSS width — use px or flex shorthand. Columns with no width get flex-1. */
  width?: string;
  /** Hide on mobile (< md breakpoint) */
  hideMobile?: boolean;
};

export type AdminTableProps<T> = {
  columns: AdminColumn[];
  data: T[];
  renderCell: (row: T, colKey: string, index: number) => ReactNode;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyTitle?: string;
  emptyAction?: { label: string; onClick: () => void };
};

// ── Helpers ──────────────────────────────────────────────────────────

function SortArrows({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  return (
    <span className="flex flex-col items-center" style={{ width: 12, height: 16 }}>
      <CentralIcon
        name="IconChevronTop"
        size={10}
        color={active && dir === "asc" ? "var(--fg)" : "var(--muted-fg)"}
        {...ciProps}
        style={{ opacity: active && dir === "asc" ? 1 : 0.4 }}
      />
      <CentralIcon
        name="IconChevronBottom"
        size={10}
        color={active && dir === "desc" ? "var(--fg)" : "var(--muted-fg)"}
        {...ciProps}
        style={{ opacity: active && dir === "desc" ? 1 : 0.4, marginTop: -3 }}
      />
    </span>
  );
}

/** Converts a column width string to inline style for a flex child */
function colStyle(width?: string): React.CSSProperties {
  if (!width) return { flex: 1, minWidth: 0 };
  // Pure pixel widths like "120px" or "60px"
  if (/^\d+px$/.test(width)) return { width, flexShrink: 0 };
  // minmax() patterns — extract the min as width, let it grow
  const minmax = width.match(/minmax\((\d+px),/);
  if (minmax) return { flex: 1, minWidth: minmax[1] };
  // Fallback
  return { flex: 1, minWidth: 0 };
}

// ── Row with proximity hover registration ────────────────────────────

function AdminTableRow<T>({
  row, index, columns, renderCell, page, pageSize, onRowClick, registerHover,
}: {
  row: T; index: number; columns: AdminColumn[]; renderCell: (row: T, colKey: string, index: number) => ReactNode;
  page: number; pageSize: number; onRowClick?: (row: T) => void;
  registerHover: (index: number, element: HTMLElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerHover(index, ref.current);
    return () => registerHover(index, null);
  }, [index, registerHover]);

  return (
    <div
      ref={ref}
      data-proximity-index={index}
      onClick={() => onRowClick?.(row)}
      className={`relative z-[1] flex items-center px-4 ${onRowClick ? "cursor-pointer" : ""}`}
      style={{
        minHeight: 56,
        boxShadow: "inset 0px -1px 0px var(--border-color)",
      }}
    >
      {columns.map((col) => (
        <div
          key={col.key}
          className={col.hideMobile ? "hidden md:block" : ""}
          style={colStyle(col.width)}
        >
          {renderCell(row, col.key, page * pageSize + index)}
        </div>
      ))}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────

export function AdminTable<T>({
  columns,
  data,
  renderCell,
  rowKey,
  onRowClick,
  pageSize = 15,
  emptyTitle = "No results",
  emptyAction,
}: AdminTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const av = (a as any)[sortKey] ?? "";
    const bv = (b as any)[sortKey] ?? "";
    const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const pagedData = sortedData.slice(page * pageSize, (page + 1) * pageSize);

  const tableRef = useRef<HTMLDivElement>(null);
  const { activeIndex: hoverIdx, itemRects: hoverRects, sessionRef: hoverSession, handlers: hoverHandlers, registerItem } = useProximityHover(tableRef);
  const hoverRect = hoverIdx !== null ? hoverRects[hoverIdx] : null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Scrollable table area */}
      <div className="flex-1 overflow-auto" style={{ scrollbarWidth: "none" }}>
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center px-4"
          style={{
            height: 40,
            background: "var(--bg)",
            boxShadow: "inset 0px -1px 0px var(--border-color)",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          {columns.map((col) => {
            const isSorted = sortKey === col.key;
            return (
              <div
                key={col.key}
                className={`flex items-center gap-1 select-none ${col.sortable ? "cursor-pointer" : ""} ${col.hideMobile ? "hidden md:flex" : ""}`}
                style={{ ...colStyle(col.width), fontSize: 13, fontWeight: 500, color: "var(--muted-fg)" }}
                onClick={() => col.sortable && toggleSort(col.key)}
              >
                {col.label}
                {col.sortable && <SortArrows active={isSorted} dir={sortDir} />}
              </div>
            );
          })}
        </div>

        {/* Rows with proximity hover */}
        {sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span style={{ fontSize: 14, color: "var(--muted-fg)" }}>{emptyTitle}</span>
            {emptyAction && (
              <button
                onClick={emptyAction.onClick}
                className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--accent)]"
                style={{ color: "#f6850f", background: "none", border: "none", fontFamily: "inherit" }}
              >
                {emptyAction.label}
              </button>
            )}
          </div>
        ) : (
          <div
            ref={tableRef}
            className="relative"
            onMouseEnter={hoverHandlers.onMouseEnter}
            onMouseMove={hoverHandlers.onMouseMove}
            onMouseLeave={hoverHandlers.onMouseLeave}
          >
            <AnimatePresence>
              {hoverRect && (
                <motion.div
                  key={hoverSession.current}
                  className="pointer-events-none absolute inset-x-0 z-0 bg-foreground/[0.03]"
                  initial={{ opacity: 0, ...hoverRect }}
                  animate={{ opacity: 1, ...hoverRect }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {pagedData.map((row, i) => (
              <AdminTableRow
                key={rowKey(row)}
                row={row}
                index={i}
                columns={columns}
                renderCell={renderCell}
                page={page}
                pageSize={pageSize}
                onRowClick={onRowClick}
                registerHover={registerItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between shrink-0 px-4 gap-2 sm:gap-0 py-2 sm:py-0"
          style={{ minHeight: 48, background: "var(--bg)", borderTop: "1px solid var(--border-color)" }}
        >
          <span style={{ fontSize: 13, color: "var(--muted-fg)" }}>
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex items-center gap-1">
            {[
              { icon: "IconChevronDoubleLeft", disabled: page === 0, onClick: () => setPage(0) },
              { icon: "IconChevronLeft", disabled: page === 0, onClick: () => setPage((p) => Math.max(0, p - 1)) },
              { icon: "IconChevronRight", disabled: page >= totalPages - 1, onClick: () => setPage((p) => Math.min(totalPages - 1, p + 1)) },
              { icon: "IconChevronDoubleRight", disabled: page >= totalPages - 1, onClick: () => setPage(totalPages - 1) },
            ].map((btn, idx) => (
              <button
                key={idx}
                disabled={btn.disabled}
                onClick={btn.onClick}
                className="flex items-center justify-center rounded-md cursor-pointer disabled:cursor-default"
                style={{ width: 28, height: 28, background: "none", border: "1px solid var(--border-color)", opacity: btn.disabled ? 0.3 : 1 }}
              >
                <CentralIcon name={btn.icon as any} size={12} color="var(--muted-fg)" {...ciProps} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
