"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ── Helpers ── */

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function ChevronLeftIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ChevronRightIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CalendarIcon() {
  return <svg width="12" height="13" viewBox="0 0 12 13" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M3.33333 0C3.70152 0 4 0.298477 4 0.666667V1.33333H8V0.666667C8 0.298477 8.29848 0 8.66667 0C9.03486 0 9.33333 0.298477 9.33333 0.666667V1.33333H10C11.1046 1.33333 12 2.22876 12 3.33333V10.6667C12 11.7712 11.1046 12.6667 10 12.6667H2C0.895431 12.6667 0 11.7712 0 10.6667V3.33333C0 2.22876 0.895431 1.33333 2 1.33333H2.66667V0.666667C2.66667 0.298477 2.96514 0 3.33333 0ZM1.33333 6V10.6667C1.33333 11.0349 1.63181 11.3333 2 11.3333H10C10.3682 11.3333 10.6667 11.0349 10.6667 10.6667V6H1.33333Z" fill="currentColor" fillOpacity="0.5" /></svg>;
}

interface DayCell {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  dateStr: string;
}

function getMonthGrid(year: number, month: number): DayCell[][] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: DayCell[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    const dow = cells.length % 7;
    cells.push({
      day: d, month: m, year: y, isCurrentMonth: false,
      isWeekend: dow >= 5, isToday: false,
      dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dow = cells.length % 7;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      day: d, month, year, isCurrentMonth: true,
      isWeekend: dow >= 5, isToday: dateStr === todayStr, dateStr,
    });
  }

  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      const dow = cells.length % 7;
      cells.push({
        day: d, month: nm, year: ny, isCurrentMonth: false,
        isWeekend: dow >= 5, isToday: false,
        dateStr: `${ny}-${String(nm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }
  }

  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function formatDisplay(value: string): string {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  return `${d} ${MONTH_SHORT[m - 1]}, ${y}`;
}

/* ── CalendarGrid (internal) ── */

interface CalendarGridProps {
  startDate: string;
  endDate: string;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
  onClose: () => void;
}

function CalendarGrid({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  onClose,
}: CalendarGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selecting, setSelecting] = useState<"start" | "end">(
    startDate ? "end" : "start",
  );
  const [hovered, setHovered] = useState<string | null>(null);

  const initial = useMemo(() => {
    const d = startDate || endDate;
    if (d) {
      const [y, m] = d.split("-").map(Number);
      return { year: y, month: m - 1 };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [startDate, endDate]);

  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);

  useEffect(() => {
    setSelecting(startDate ? "end" : "start");
  }, [startDate]);

  const weeks = useMemo(
    () => getMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const goBack = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const goForward = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const handleDayClick = useCallback(
    (dateStr: string) => {
      if (selecting === "start") {
        onChangeStart(dateStr);
        if (endDate && dateStr > endDate) onChangeEnd("");
        setSelecting("end");
      } else {
        if (startDate && dateStr < startDate) {
          onChangeStart(dateStr);
          onChangeEnd("");
          setSelecting("end");
        } else {
          onChangeEnd(dateStr);
          onClose();
        }
      }
    },
    [selecting, startDate, endDate, onChangeStart, onChangeEnd, onClose],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const effectiveEnd =
    selecting === "end" && hovered && startDate && hovered >= startDate
      ? hovered
      : endDate;

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full mt-1 z-50 flex min-w-[336px] w-[336px] flex-col rounded-2xl overflow-hidden border border-border bg-card-bg shadow-lg shadow-black/10 dark:shadow-black/40"
    >
      {/* Month nav header */}
      <div className="flex h-10 items-center justify-center gap-8 px-2.5 bg-foreground/[0.04]">
        <button
          type="button"
          onClick={goBack}
          className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.10]"
        >
          <ChevronLeftIcon />
        </button>
        <span className="flex-1 text-center font-inter text-sm font-medium tracking-[-0.02em] text-page-text whitespace-nowrap">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={goForward}
          className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text-muted transition-colors hover:bg-foreground/[0.10]"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Calendar body */}
      <div className="flex flex-col gap-3 px-4 py-5">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2">
          {DAY_LABELS.map((label, i) => (
            <div
              key={i}
              className="flex items-center justify-center font-inter text-[10px] font-medium tracking-[-0.02em] text-page-text-muted"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="flex flex-col gap-2">
          {weeks.map((week, wi) => {
            const hasRange =
              startDate && effectiveEnd &&
              week.some((c) => c.dateStr >= startDate && c.dateStr <= effectiveEnd);
            let rangeStartIdx = -1;
            let rangeEndIdx = -1;
            if (hasRange) {
              for (let i = 0; i < week.length; i++) {
                if (week[i].dateStr >= startDate && week[i].dateStr <= effectiveEnd!) {
                  if (rangeStartIdx === -1) rangeStartIdx = i;
                  rangeEndIdx = i;
                }
              }
            }

            return (
              <div key={wi} className="grid grid-cols-7 gap-2">
                {hasRange && rangeStartIdx !== -1 && (
                  <div
                    className="rounded-full self-center bg-foreground/[0.06]"
                    style={{
                      height: 32,
                      gridRow: 1,
                      gridColumn: `${rangeStartIdx + 1} / ${rangeEndIdx + 2}`,
                    }}
                  />
                )}

                {week.map((cell, i) => {
                  const isStart = cell.dateStr === startDate;
                  const isEnd = cell.dateStr === effectiveEnd;
                  const isSelected = isStart || (isEnd && !!startDate);
                  const isInRange =
                    startDate && effectiveEnd &&
                    cell.dateStr > startDate && cell.dateStr < effectiveEnd;
                  const isHovered = cell.dateStr === hovered;

                  return (
                    <button
                      key={cell.dateStr}
                      type="button"
                      onClick={() => handleDayClick(cell.dateStr)}
                      onMouseEnter={() => setHovered(cell.dateStr)}
                      onMouseLeave={() => setHovered(null)}
                      className={cn(
                        "z-[1] flex size-8 items-center justify-center rounded-full font-inter text-sm font-medium tracking-[-0.02em] transition-colors place-self-center",
                        isSelected
                          ? "bg-[#252525] text-white dark:bg-white dark:text-[#151515]"
                          : cell.isToday
                            ? "ring-1 ring-foreground/20"
                            : "",
                        !isSelected && isHovered && !isInRange && "bg-foreground/[0.06]",
                        !isSelected && !cell.isCurrentMonth
                          ? "text-page-text-subtle/40"
                          : !isSelected && cell.isWeekend
                            ? "text-page-text-muted"
                            : !isSelected
                              ? "text-page-text"
                              : "",
                      )}
                      style={{
                        gridRow: 1,
                        gridColumn: i + 1,
                      }}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── DateRangeInputs ── */

interface DateRangeInputsProps {
  startDate: string;
  endDate: string;
  onChangeStart: (value: string) => void;
  onChangeEnd: (value: string) => void;
  disabled?: boolean;
  endDisabled?: boolean;
}

function DateRangeInputs({
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  endDisabled,
}: DateRangeInputsProps) {
  const [open, setOpen] = useState(false);

  const openPicker = (field: "start" | "end") => {
    if (field === "end" && endDisabled) return;
    setOpen(true);
  };

  return (
    <div className="relative">
      <div className="flex gap-3">
        {/* Start date */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Start date</span>
          <button
            type="button"
            onClick={() => openPicker("start")}
            className="flex h-10 w-full items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5 transition-colors hover:bg-foreground/[0.06] text-page-text-muted"
          >
            <CalendarIcon />
            <span
              className={cn(
                "flex-1 text-left font-inter text-sm tracking-[-0.02em]",
                startDate ? "text-page-text" : "text-page-text-muted",
              )}
            >
              {startDate ? formatDisplay(startDate) : "Select date"}
            </span>
          </button>
        </div>

        {/* End date */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">End date</span>
          <button
            type="button"
            onClick={() => openPicker("end")}
            disabled={endDisabled}
            className={cn(
              "flex h-10 w-full items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5 transition-colors text-page-text-muted",
              endDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-foreground/[0.06]",
            )}
          >
            <CalendarIcon />
            <span
              className={cn(
                "flex-1 text-left font-inter text-sm tracking-[-0.02em]",
                endDate && !endDisabled ? "text-page-text" : "text-page-text-muted",
              )}
            >
              {endDate && !endDisabled ? formatDisplay(endDate) : "Select date"}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <CalendarGrid
          startDate={startDate}
          endDate={endDate}
          onChangeStart={onChangeStart}
          onChangeEnd={onChangeEnd}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

/* ── DatePicker (single date, popover-triggered) ── */

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-full items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5 transition-colors hover:bg-foreground/[0.06] text-page-text-muted"
      >
        <CalendarIcon />
        <span
          className={cn(
            "flex-1 text-left font-inter text-sm tracking-[-0.02em]",
            value ? "text-page-text" : "text-page-text-muted",
          )}
        >
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <CalendarGrid
          startDate={value}
          endDate=""
          onChangeStart={onChange}
          onChangeEnd={() => {}}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export { DateRangeInputs, DatePicker };
