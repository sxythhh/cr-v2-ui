"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CentralIcon } from "@central-icons-react/all";

const ciProps = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ─── Theme hook — watches <html> class for dark/light ────── */
function useTheme(): "dark" | "light" {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setMode(html.classList.contains("dark") ? "dark" : "light");
    update();

    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return mode;
}

/* ─── Color Tokens ──────────────────────────────────────────── */
type Theme = "dark" | "light";

const themes = {
  dark: {
    bg: "#111111",
    text: "#EEEEEE",
    textSecondary: "rgba(255,255,255,0.685)",
    textMuted: "rgba(255,255,255,0.445)",
    border: "rgba(255,255,255,0.105)",
    cardBg: "rgba(255,255,255,0.027)",
    cardBorder: "rgba(255,255,255,0.027)",
    controlBg: "#191919",
    controlBorder: "transparent",
    blue: "#f6850f",
    blueLight: "#f6850f",
    blueBadgeBg: "rgba(246,133,15,0.15)",
    greenText: "#3DD68C",
    greenBg: "rgba(0,255,159,0.114)",
    yellowText: "#FFC916",
    yellowBg: "rgba(255,147,0,0.118)",
    gridLine: "rgba(255,255,255,0.105)",
    lineOld: "#3A3A3A",
    lineNew: "#f6850f",
    axisLabel: "#6E6E6E",
    tooltipBg: "#252525",
    tooltipText: "#ccc",
    chartTooltipBg: "rgba(20,20,20,0.72)",
    chartTooltipBorder: "rgba(255,255,255,0.08)",
    dropdownBg: "rgba(20,20,20,0.75)",
    dropdownBorder: "rgba(255,255,255,0.08)",
    hoverBg: "rgba(255,255,255,0.04)",
    xBtnBg: "#1a1a1a",
    topChartGrid: "#2A2A2A",
    topChartGridFade0: "0",
    topChartGridFade1: "0.5",
    doneBtnBg: "#f6850f",
    ghostBg: "#181818",
    barTrack: "rgba(255,255,255,0.04)",
    heatmapColor: "rgba(246,133,15,",
  },
  light: {
    bg: "#FFFFFF",
    text: "#1a1a1a",
    textSecondary: "#6e6e6e",
    textMuted: "#999999",
    border: "rgba(0,0,0,0.1)",
    cardBg: "#FFFFFF",
    cardBorder: "rgba(0,0,0,0.08)",
    controlBg: "#FFFFFF",
    controlBorder: "rgba(0,0,0,0.12)",
    blue: "#f6850f",
    blueLight: "#f6850f",
    blueBadgeBg: "rgba(246,133,15,0.12)",
    greenText: "#16a34a",
    greenBg: "rgba(22,163,74,0.1)",
    yellowText: "#ca8a04",
    yellowBg: "rgba(202,138,4,0.1)",
    gridLine: "rgba(0,0,0,0.08)",
    lineOld: "#c0c0c0",
    lineNew: "#f6850f",
    axisLabel: "#999999",
    tooltipBg: "#333",
    tooltipText: "#eee",
    chartTooltipBg: "rgba(255,255,255,0.92)",
    chartTooltipBorder: "rgba(0,0,0,0.08)",
    dropdownBg: "rgba(255,255,255,0.92)",
    dropdownBorder: "rgba(0,0,0,0.08)",
    hoverBg: "rgba(0,0,0,0.03)",
    xBtnBg: "#ffffff",
    topChartGrid: "#e5e7eb",
    topChartGridFade0: "0",
    topChartGridFade1: "0.6",
    doneBtnBg: "#f6850f",
    ghostBg: "#f5f5f5",
    barTrack: "rgba(0,0,0,0.04)",
    heatmapColor: "rgba(246,133,15,",
  },
};

// Default - will be overridden by state
let C = themes.dark;

/* ─── Icons ─────────────────────────────────────────────────── */

/* ─── (Sidebar removed — nav is in layout.tsx) ─── */

/* ─── Controls ──────────────────────────────────────────────── */
function ControlButton({
  children,
  className = "",
  roundedLeft,
  roundedRight,
}: {
  children: React.ReactNode;
  className?: string;
  roundedLeft?: boolean;
  roundedRight?: boolean;
}) {
  const radius = roundedLeft && roundedRight ? "8px" : roundedLeft ? "8px 0 0 8px" : roundedRight ? "0 8px 8px 0" : "8px";
  return (
    <button
      className={`flex items-center gap-1.5 px-3 h-8 text-xs font-medium cursor-pointer ${className}`}
      style={{
        background: C.controlBg,
        color: C.textSecondary,
        borderRadius: radius,
        boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
        border: `1px solid ${C.controlBorder}`,
      }}
    >
      {children}
    </button>
  );
}

/* ─── Dropdown ─────────────────────────────────────────────── */
function Dropdown({
  value, options, onChange, roundedLeft, roundedRight,
}: {
  value: string; options: string[]; onChange: (v: string) => void;
  roundedLeft?: boolean; roundedRight?: boolean;
}) {
  const radius = roundedLeft && roundedRight ? "8px" : roundedLeft ? "8px 0 0 8px" : roundedRight ? "0 8px 8px 0" : "8px";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium cursor-pointer"
          style={{ background: C.controlBg, color: C.text, borderRadius: radius, boxShadow: "0px 1px 2px rgba(0,0,0,0.05)", border: `1px solid ${C.controlBorder}` }}
        >
          {value} <CentralIcon name="IconChevronBottom" size={12} color="currentColor" {...ciProps} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px] rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-[10px]">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange(opt)}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-sm"
          >
            <span className="flex-1">{opt}</span>
            {opt === value && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0"><path d="M3 7L5.5 9.5L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─── Date Range Picker ────────────────────────────────────── */
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function DateRangePicker({
  startDate, endDate, onChange, roundedLeft, roundedRight,
}: {
  startDate: Date; endDate: Date;
  onChange: (start: Date, end: Date) => void;
  roundedLeft?: boolean; roundedRight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(startDate.getMonth());
  const [viewYear, setViewYear] = useState(startDate.getFullYear());
  const [selecting, setSelecting] = useState<"start" | "end" | null>(null);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const radius = roundedLeft && roundedRight ? "8px" : roundedLeft ? "8px 0 0 8px" : roundedRight ? "0 8px 8px 0" : "8px";
  const label = `${SHORT_MONTHS[startDate.getMonth()]} ${startDate.getDate()} - ${SHORT_MONTHS[endDate.getMonth()]} ${endDate.getDate()}, ${endDate.getFullYear()}`;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const handleDayClick = (day: number) => {
    const clicked = new Date(viewYear, viewMonth, day);
    if (!selecting || selecting === "start") {
      setTempStart(clicked);
      setTempEnd(clicked);
      setSelecting("end");
    } else {
      if (clicked < tempStart) {
        setTempStart(clicked);
        setTempEnd(tempStart);
      } else {
        setTempEnd(clicked);
      }
      setSelecting(null);
      onChange(tempStart < clicked ? tempStart : clicked, tempStart < clicked ? clicked : tempStart);
      setOpen(false);
    }
  };

  const isInRange = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d >= tempStart && d <= tempEnd;
  };
  const isStart = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d.getTime() === tempStart.getTime();
  };
  const isEnd = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d.getTime() === tempEnd.getTime();
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setSelecting("start"); setTempStart(startDate); setTempEnd(endDate); }}
        className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium cursor-pointer"
        style={{ background: C.controlBg, color: C.textSecondary, borderRadius: radius, boxShadow: "0px 1px 2px rgba(0,0,0,0.05)", border: `1px solid ${C.controlBorder}` }}
      >
        <CentralIcon name="IconCalendar1" size={14} color="currentColor" {...ciProps} /> {label}
      </button>
      {open && (
        <div
          className="absolute left-0 top-full mt-1 z-50 p-3"
          style={{
            background: "var(--dropdown-bg)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid var(--dropdown-border)",
            borderRadius: 10,
            boxShadow: "var(--dropdown-shadow)",
            width: 280,
            maxWidth: "calc(100vw - 2rem)",
          }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="flex items-center justify-center w-6 h-6 rounded-md border-none cursor-pointer" style={{ background: C.controlBg, color: C.text, boxShadow: "0px 1px 2px rgba(0,0,0,0.05)", border: `1px solid ${C.controlBorder}` }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span className="text-xs font-medium" style={{ color: C.text }}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="flex items-center justify-center w-6 h-6 rounded-md border-none cursor-pointer" style={{ background: C.controlBg, color: C.text, boxShadow: "0px 1px 2px rgba(0,0,0,0.05)", border: `1px solid ${C.controlBorder}` }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0 mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="flex items-center justify-center h-7 text-sm font-bold" style={{ color: C.textMuted }}>{d[0]}</div>
            ))}
          </div>
          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0">
            {Array.from({ length: firstDayOfWeek }, (_, i) => <div key={`e${i}`} className="h-7" />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const inRange = isInRange(day);
              const start = isStart(day);
              const end = isEnd(day);
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className="flex items-center justify-center h-9 text-sm border-none cursor-pointer transition-colors"
                  style={{
                    borderRadius: start ? "6px 0 0 6px" : end ? "0 6px 6px 0" : 0,
                    background: start || end ? "#f6850f" : inRange ? "rgba(246,133,15,0.2)" : "transparent",
                    color: start || end ? "#fff" : C.text,
                    fontWeight: 400,
                    letterSpacing: "-0.079px",
                  }}
                  onMouseEnter={(e) => { if (!inRange && !start && !end) (e.target as HTMLElement).style.background = "var(--dropdown-item-hover)"; }}
                  onMouseLeave={(e) => { if (!inRange && !start && !end) (e.target as HTMLElement).style.background = "transparent"; }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mini chart for top section (bar grid) ─────────────────── */
function TopChart({ onHover }: { onHover: (slot: number | null) => void }) {
  const [hoverX, setHoverX] = useState<number | null>(null);
  const gridX = [0,32,65,97,129,162,194,226,259,291,323,356,388,420,453,485,517,550,582,614,647,679,711,744,776];
  const w = 776;
  const h = 153;
  const gridBot = 128.25;
  // 24 time slots (hours), spike at slot 10 (10 AM = index 10)
  const spikeSlot = 10;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const x = pct * w;
    setHoverX(x);
    // Map to slot index (0-24)
    const slot = Math.round(pct * 24);
    onHover(Math.min(24, Math.max(0, slot)));
  };

  const handleMouseLeave = () => {
    setHoverX(null);
    onHover(null);
  };

  // Get Y position on the blue line at a given x
  const getBlueY = (x: number) => {
    const spikeX1 = gridX[spikeSlot]; // 323
    const spikeX2 = gridX[spikeSlot + 1]; // 356
    if (x <= gridX[spikeSlot - 1]) return gridBot; // flat before spike
    if (x >= spikeX2) return gridBot; // flat after spike
    if (x <= spikeX1) {
      const t = (x - gridX[spikeSlot - 1]) / (spikeX1 - gridX[spikeSlot - 1]);
      return gridBot - t * (gridBot - 0.25);
    }
    const t = (x - spikeX1) / (spikeX2 - spikeX1);
    return 0.25 + t * (gridBot - 0.25);
  };

  return (
    <div className="relative mt-4" style={{ height: 170, paddingTop: 10 }}>
      <svg
        width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
        onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
        className="cursor-crosshair"
      >
        <defs>
          <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2={gridBot} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.topChartGrid} stopOpacity="0" />
            <stop offset="20" stopColor={C.topChartGrid} stopOpacity="0.5" />
            <stop offset="40" stopColor={C.topChartGrid} stopOpacity="1" />
            <stop offset={String(gridBot)} stopColor={C.topChartGrid} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Vertical grid lines */}
        {gridX.map((x) => (
          <line key={x} x1={x} y1={0.25} x2={x} y2={gridBot} stroke="url(#grid-fade)" strokeWidth="1" />
        ))}
        {/* Bottom axis line */}
        <line x1="0" y1={gridBot} x2={w} y2={gridBot} stroke={C.topChartGrid} strokeWidth="1" />
        {/* Previous period line (flat grey) */}
        <path d={`M0 ${gridBot}H${w}`} stroke="#3A3A3A" strokeWidth="2" />
        {/* Current period line (blue) */}
        <path d={`M0 ${gridBot}H${gridX[9]}L${gridX[10]} 0.25L${gridX[11]} ${gridBot}H${w}`} fill="none" stroke="#f6850f" strokeWidth="2" />
        {/* Hover cursor line only — dots rendered as HTML */}
        {hoverX !== null && (
          <line x1={hoverX} y1={0} x2={hoverX} y2={gridBot} stroke="#6E6E6E" strokeWidth="1" strokeDasharray="4 3" />
        )}
      </svg>
      {/* Static end dot (HTML to avoid SVG distortion) */}
      <div className="pointer-events-none absolute inset-0" style={{ padding: "10px 0 0 0" }}>
        <div className="relative w-full h-full">
          <div style={{ position: "absolute", left: `${(gridX[11] / w) * 100}%`, top: `${(gridBot / h) * 100}%`, transform: "translate(-50%, -50%)" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "white", border: "2px solid #3A3A3A" }} />
          </div>
          {hoverX !== null && (
            <div style={{ position: "absolute", left: `${(hoverX / w) * 100}%`, top: `${(getBlueY(hoverX) / h) * 100}%`, transform: "translate(-50%, -50%)" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f6850f" }} />
            </div>
          )}
        </div>
      </div>
      {/* X-axis labels */}
      <div className="absolute left-0" style={{ bottom: -4, color: "#6E6E6E", fontSize: 12, lineHeight: "15px" }}>12:00 AM</div>
      <div className="absolute right-0" style={{ bottom: -4, color: "#6E6E6E", fontSize: 12, lineHeight: "15px", textAlign: "right" }}>12:00 AM</div>
    </div>
  );
}

/* ─── Metric Line Chart ─────────────────────────────────────── */
/* ─── Metric Chart Tooltip ──────────────────────────────────── */
function MetricChartTooltip({ active, payload, cardTitle }: { active?: boolean; payload?: any[]; cardTitle?: string }) {
  if (!active || !payload?.length) return null;
  const current = payload.find((p: any) => p.dataKey === "current");
  const previous = payload.find((p: any) => p.dataKey === "previous");
  const diff = (current?.value ?? 0) - (previous?.value ?? 0);
  const sign = diff >= 0 ? "+" : "-";
  const formatted = `${sign}$${Math.abs(diff).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Derive date labels from the data point
  const dataPoint = payload[0]?.payload;
  const currentLabel = dataPoint?.date || "";
  // Previous period label: shift back 7 days approximately
  const prevParts = currentLabel.match(/^(\w+)\s(\d+)$/);
  const prevLabel = prevParts ? `${prevParts[1]} ${Math.max(1, Number(prevParts[2]) - 7)}` : "";

  return (
    <div style={{ background: C.chartTooltipBg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: `1px solid ${C.chartTooltipBorder}`, borderRadius: 8, minWidth: 190, overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
      {/* Header: metric name + change */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ color: C.text, fontSize: 12, fontWeight: 500, letterSpacing: "-0.3px" }}>{cardTitle || "Revenue"}</span>
        <span style={{ color: diff >= 0 ? C.greenText : "#E5484D", fontSize: 12, fontWeight: 500, letterSpacing: "-0.3px" }}>{formatted}</span>
      </div>
      {/* Rows */}
      <div style={{ padding: "6px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: C.lineOld, flexShrink: 0 }} />
            <span style={{ color: C.textSecondary, fontSize: 12, letterSpacing: "-0.3px" }}>{prevLabel}</span>
          </div>
          <span style={{ color: C.text, fontSize: 12, fontWeight: 500, letterSpacing: "-0.3px" }}>
            ${(previous?.value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: C.lineNew, flexShrink: 0 }} />
            <span style={{ color: C.textSecondary, fontSize: 12, letterSpacing: "-0.3px" }}>{currentLabel}</span>
          </div>
          <span style={{ color: C.text, fontSize: 12, fontWeight: 500, letterSpacing: "-0.3px" }}>
            ${(current?.value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Recharts Metric Chart ────────────────────────────────── */
function MetricChart({ data, title }: { data: { date: string; current: number; previous: number }[]; title?: string }) {
  return (
    <div className="mt-auto flex-1" style={{ minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-current" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.lineNew} stopOpacity={0.15} />
              <stop offset="100%" stopColor={C.lineNew} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={C.gridLine} strokeOpacity={0.5} horizontal vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.axisLabel }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis hide tickCount={6} />
          <Tooltip
            content={<MetricChartTooltip cardTitle={title} />}
            cursor={{ stroke: C.border, strokeWidth: 1, strokeDasharray: "4 4" }}
            animationDuration={150}
            animationEasing="ease-out"
            wrapperStyle={{ transition: "transform 120ms ease-out, opacity 120ms ease-out", zIndex: 50 }}
          />
          <Area type="linear" dataKey="previous" name="Previous" stroke={C.lineOld} strokeWidth={2} fill="none" dot={false}
            activeDot={{ r: 3, fill: C.lineOld, strokeWidth: 0 }} isAnimationActive={false} />
          <Area type="linear" dataKey="current" name="Current" stroke={C.lineNew} strokeWidth={2} fill="url(#grad-current)" dot={false}
            activeDot={{ r: 3, fill: C.lineNew, strokeWidth: 0 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Metric Card ───────────────────────────────────────────── */
const METRIC_DESCRIPTIONS: Record<string, string> = {
  "Gross revenue": "Total revenue before any deductions, refunds, or fees",
  "Net revenue": "Revenue after refunds, disputes, and processing fees",
  "New users": "Number of new user accounts created in this period",
  "MRR": "Monthly Recurring Revenue — predictable monthly income from subscriptions",
  "ARR": "Annual Recurring Revenue — MRR projected over 12 months",
};

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changePositive: boolean;
  data: { date: string; current: number; previous: number }[];
}

function CardTitle({ title, desc }: { title: string; desc?: string }) {
  const inner = (
    <div className="relative flex flex-col self-start" style={{ cursor: desc ? "help" : "default", gap: 2 }}>
      <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px" }}>
        {title}
      </span>
      <div className="h-px w-full" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${C.border} 0px, ${C.border} 2px, transparent 2px, transparent 4px)` }} />
    </div>
  );
  if (!desc) return inner;
  return (
    <div className="group relative self-start">
      {inner}
      <div className="pointer-events-none absolute left-1/2 bottom-full z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "#252525", color: "#ccc", padding: "4px 10px", borderRadius: 6, fontSize: 11 }}>
        {desc}
        <div className="absolute left-1/2 top-full -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #252525" }} />
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, changePositive, data }: MetricCardProps) {
  const desc = METRIC_DESCRIPTIONS[title];
  return (
    <div
      className="flex flex-col p-4 h-[220px] sm:h-[272px]"
      style={{
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 16,
      }}
    >
      <CardTitle title={title} desc={desc} />

      {/* Value + change */}
      <div className="flex items-center gap-2 mt-3 mb-2">
        <span className="text-xl font-semibold" style={{ color: C.text }}>
          {value}
        </span>
        <span
          className="px-1.5 py-0.5 text-xs font-medium rounded-md"
          style={{
            color: changePositive ? C.greenText : C.yellowText,
            background: changePositive ? C.greenBg : C.yellowBg,
          }}
        >
          {change}
        </span>
      </div>

      {/* Chart */}
      <MetricChart data={data} title={title} />
    </div>
  );
}

/* ─── Payments Breakdown Card ───────────────────────────────── */
const paymentCategories = [
  { name: "Paid", color: "#30A46C", amount: "$12,624.39", pct: "92.2%" },
  { name: "Failed", color: "#E5484D", amount: "$530.00", pct: "3.9%" },
  { name: "Past due", color: "#f6850f", amount: "$280.00", pct: "2.0%" },
  { name: "Canceled", color: "#8E4EC6", amount: "$156.00", pct: "1.1%" },
  { name: "Refunded", color: "#FFEA00", amount: "$78.61", pct: "0.6%" },
  { name: "Pending", color: "#f6850f", amount: "$21.00", pct: "0.2%" },
];

function PaymentsBreakdownCard() {
  const barWidths = [92.2, 3.9, 2.0, 1.1, 0.6, 0.2];

  return (
    <div
      className="flex flex-col p-4 h-[220px] sm:h-[272px]"
      style={{
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 16,
      }}
    >
      {/* Header */}
      <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px", cursor: "help" }}>
        Payments breakdown
      </span>

      {/* Stacked bar */}
      <div className="flex w-full h-3 mt-4 overflow-hidden" style={{ borderRadius: 4 }}>
        {paymentCategories.map((cat, i) => (
          <div
            key={i}
            style={{
              width: `${barWidths[i]}%`,
              background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), ${cat.color}`,
              borderRadius: 1,
              minWidth: barWidths[i] > 0.5 ? 4 : 2,
              marginLeft: i > 0 ? 4 : 0,
            }}
          />
        ))}
      </div>

      {/* List */}
      <div
        className="flex flex-col gap-0 mt-4 flex-1 overflow-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          maskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
        }}
      >
        {paymentCategories.map((cat, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2"
            style={{ borderBottom: i < paymentCategories.length - 1 ? `1px solid ${C.border}` : "none" }}
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: cat.color }} />
              <span className="text-xs font-medium" style={{ color: C.textSecondary }}>
                {cat.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium" style={{ color: C.text }}>
                {cat.amount}
              </span>
              <span className="text-xs" style={{ color: C.textMuted, width: 36, textAlign: "right" }}>
                {cat.pct}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut Chart Card ──────────────────────────────────────── */
const donutData = [
  { label: "Direct", value: 4250, color: "#0ea5e9" },
  { label: "Organic", value: 3120, color: "#a855f7" },
  { label: "Referral", value: 2100, color: "#f59e0b" },
  { label: "Social", value: 1530, color: "#22c55e" },
];

function DonutChartCard() {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = donutData.reduce((s, d) => s + d.value, 0);
  const size = 176;
  const outerR = size / 2;
  const innerR = 48;
  const cx = outerR;
  const cy = outerR;

  // Build arcs
  let cumAngle = -Math.PI / 2;
  const pad = 0.03;
  const arcs = donutData.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI - pad;
    const startAngle = cumAngle + pad / 2;
    const endAngle = startAngle + angle;
    cumAngle = endAngle + pad / 2;

    const x1o = cx + outerR * Math.cos(startAngle);
    const y1o = cy + outerR * Math.sin(startAngle);
    const x2o = cx + outerR * Math.cos(endAngle);
    const y2o = cy + outerR * Math.sin(endAngle);
    const x1i = cx + innerR * Math.cos(endAngle);
    const y1i = cy + innerR * Math.sin(endAngle);
    const x2i = cx + innerR * Math.cos(startAngle);
    const y2i = cy + innerR * Math.sin(startAngle);
    const large = angle > Math.PI ? 1 : 0;

    const midAngle = (startAngle + endAngle) / 2;
    const hoverOffset = hovered === i ? 4 : 0;
    const tx = Math.cos(midAngle) * hoverOffset;
    const ty = Math.sin(midAngle) * hoverOffset;

    return {
      path: `M${x1o},${y1o} A${outerR},${outerR} 0 ${large} 1 ${x2o},${y2o} L${x1i},${y1i} A${innerR},${innerR} 0 ${large} 0 ${x2i},${y2i} Z`,
      color: d.color,
      tx, ty,
      opacity: hovered !== null && hovered !== i ? 0.35 : 1,
    };
  });

  const centerLabel = hovered !== null ? donutData[hovered].label : "Total";
  const centerValue = hovered !== null ? donutData[hovered].value : total;

  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px]" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px", cursor: "help" }}>Traffic sources</span>
      <div className="flex items-center justify-center gap-6 mt-3 flex-1">
        {/* Donut */}
        <svg width={size + 16} height={size + 16} viewBox={`${-8} ${-8} ${size + 16} ${size + 16}`} className="shrink-0" style={{ margin: -8 }}>
          {arcs.map((a, i) => (
            <path
              key={i}
              d={a.path}
              fill={a.color}
              style={{ transform: `translate(${a.tx}px, ${a.ty}px)`, opacity: a.opacity, transition: "all 200ms ease" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            />
          ))}
          <text x={cx} y={cy - 6} textAnchor="middle" fill={C.text} fontSize="18" fontWeight="600" fontFamily="var(--font-inter)">{centerValue.toLocaleString("en-US")}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill={C.textMuted} fontSize="11" fontFamily="var(--font-inter)">{centerLabel}</text>
        </svg>
        {/* Legend */}
        <div className="flex flex-col gap-2 min-w-0" style={{ width: 120 }}>
          {donutData.map((d, i) => (
            <div
              key={d.label}
              className="flex items-center gap-2 cursor-pointer"
              style={{ opacity: hovered !== null && hovered !== i ? 0.35 : 1, transition: "opacity 200ms" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="shrink-0" style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
              <span className="text-xs truncate flex-1" style={{ color: C.textSecondary, letterSpacing: "-0.3px" }}>{d.label}</span>
              <span className="text-xs font-medium" style={{ color: C.text, letterSpacing: "-0.3px" }}>{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Funnel Chart Card ────────────────────────────────────── */
const funnelData = [
  { label: "Visitors", value: 12400, displayValue: "12.4k" },
  { label: "Leads", value: 6800, displayValue: "6.8k" },
  { label: "Qualified", value: 3200, displayValue: "3.2k" },
  { label: "Proposals", value: 1500, displayValue: "1.5k" },
  { label: "Closed", value: 620, displayValue: "620" },
];

function FunnelChartCard() {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxVal = funnelData[0].value;
  const color = "#f6850f";
  const svgW = 520;
  const svgH = 180;
  const gap = 4;
  const segCount = funnelData.length;
  const segW = (svgW - gap * (segCount - 1)) / segCount;
  const cy = svgH / 2 - 12; // center y, leave room for labels

  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px] sm:col-span-2" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px", cursor: "help" }}>Conversion funnel</span>
      <div className="flex items-center justify-center mt-2 flex-1">
        <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMid meet">
          {funnelData.map((d, i) => {
            const leftH = (d.value / maxVal) * (svgH - 50);
            const nextVal = i < segCount - 1 ? funnelData[i + 1].value : d.value * 0.4;
            const rightH = (nextVal / maxVal) * (svgH - 50);
            const x = i * (segW + gap);
            const pct = Math.round((d.value / maxVal) * 100);
            const dimmed = hovered !== null && hovered !== i;

            // Curved trapezoid: left edge height → right edge height
            const lt = cy - leftH / 2;
            const lb = cy + leftH / 2;
            const rt = cy - rightH / 2;
            const rb = cy + rightH / 2;
            const cpx = x + segW * 0.6; // control point for curve

            const corePath = `M${x},${lt} C${cpx},${lt} ${cpx},${rt} ${x + segW},${rt} L${x + segW},${rb} C${cpx},${rb} ${cpx},${lb} ${x},${lb} Z`;

            return (
              <g
                key={d.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                style={{ opacity: dimmed ? 0.25 : 1, transition: "opacity 200ms" }}
              >
                {/* Halo layers */}
                {[8, 4].map((expand, li) => {
                  const hlt = lt - expand;
                  const hlb = lb + expand;
                  const hrt = rt - expand;
                  const hrb = rb + expand;
                  return (
                    <path
                      key={li}
                      d={`M${x},${hlt} C${cpx},${hlt} ${cpx},${hrt} ${x + segW},${hrt} L${x + segW},${hrb} C${cpx},${hrb} ${cpx},${hlb} ${x},${hlb} Z`}
                      fill={color}
                      opacity={0.04 + li * 0.04}
                    />
                  );
                })}
                {/* Core */}
                <path d={corePath} fill={color} />
                {/* Value */}
                <text x={x + segW / 2} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="var(--font-inter)" style={{ letterSpacing: "-0.3px" }}>
                  {d.displayValue}
                </text>
                {/* Label below */}
                <text x={x + segW / 2} y={svgH - 14} textAnchor="middle" fill={C.textSecondary} fontSize="10" fontWeight="500" fontFamily="var(--font-inter)" style={{ letterSpacing: "-0.3px" }}>
                  {d.label}
                </text>
                {/* Percentage */}
                {i > 0 && (
                  <text x={x + segW / 2} y={svgH - 2} textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="var(--font-inter)">
                    {pct}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ─── Radial Progress Card ──────────────────────────────────── */
function RadialProgressCard() {
  const [hovered, setHovered] = useState<number | null>(null);
  const metrics = [
    { label: "Goal", value: 78, color: "#22c55e" },
    { label: "Retention", value: 62, color: "#3b82f6" },
    { label: "Satisfaction", value: 91, color: "#a855f7" },
  ];
  const cx = 70, cy = 70, r = 56;

  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px]" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px", cursor: "help" }}>KPI progress</span>
      <div className="flex items-center justify-center gap-6 mt-3 flex-1">
        <svg width={140} height={140} viewBox="0 0 140 140">
          {metrics.map((m, i) => {
            const radius = r - i * 16;
            const circ = 2 * Math.PI * radius;
            const offset = circ - (m.value / 100) * circ;
            const dimmed = hovered !== null && hovered !== i;
            return (
              <g key={m.label} style={{ opacity: dimmed ? 0.25 : 1, transition: "opacity 200ms" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke={m.color} strokeWidth="8"
                  strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                  transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke-dashoffset 0.5s ease" }} />
              </g>
            );
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" fill={C.text} fontSize="20" fontWeight="600" fontFamily="var(--font-inter)">
            {hovered !== null ? `${metrics[hovered].value}%` : "78%"}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill={C.textMuted} fontSize="10" fontFamily="var(--font-inter)">
            {hovered !== null ? metrics[hovered].label : "Goal"}
          </text>
        </svg>
        <div className="flex flex-col gap-3" style={{ width: 100 }}>
          {metrics.map((m, i) => (
            <div key={m.label} className="flex items-center gap-2 cursor-pointer"
              style={{ opacity: hovered !== null && hovered !== i ? 0.25 : 1, transition: "opacity 200ms" }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
              <span className="text-xs" style={{ color: C.textSecondary, letterSpacing: "-0.3px" }}>{m.label}</span>
              <span className="ml-auto text-xs font-medium" style={{ color: C.text }}>{m.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Sparkline Row Card ───────────────────────────────────── */
function SparklineRowCard() {
  const rows = [
    { label: "Page views", value: "24.5K", change: "+12%", positive: true, data: [20,25,22,28,32,30,35,38,34,40,42,45] },
    { label: "Bounce rate", value: "32.1%", change: "-4%", positive: true, data: [40,38,42,36,34,38,35,32,34,30,33,32] },
    { label: "Avg. session", value: "4m 12s", change: "+8%", positive: true, data: [180,200,190,220,240,230,250,260,245,270,265,280] },
    { label: "Conversions", value: "1,847", change: "-2%", positive: false, data: [90,95,88,92,85,80,82,78,80,75,77,74] },
  ];

  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px]" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px", cursor: "help" }}>Site metrics</span>
      <div className="flex flex-col gap-1 mt-3 flex-1 justify-center">
        {rows.map((r) => {
          const max = Math.max(...r.data);
          const min = Math.min(...r.data);
          const range = max - min || 1;
          const w = 64, h = 20;
          const pts = r.data.map((v, i) => `${(i / (r.data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
          return (
            <div key={r.label} className="flex items-center gap-3 py-2" style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
              <span className="text-xs flex-1" style={{ color: C.textSecondary, letterSpacing: "-0.3px" }}>{r.label}</span>
              <span className="text-xs font-medium" style={{ color: C.text, letterSpacing: "-0.3px", width: 52, textAlign: "right" }}>{r.value}</span>
              <span className="text-[10px] font-medium" style={{ color: r.positive ? C.greenText : "#E5484D", width: 32, textAlign: "right" }}>{r.change}</span>
              <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
                <polyline points={pts} fill="none" stroke={r.positive ? "#22c55e" : "#E5484D"} strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Horizontal Bar Card ──────────────────────────────────── */
function HorizontalBarCard() {
  const [hovered, setHovered] = useState<number | null>(null);
  const data = [
    { label: "United States", value: 4200, color: "#3b82f6" },
    { label: "United Kingdom", value: 2800, color: "#22c55e" },
    { label: "Germany", value: 1900, color: "#a855f7" },
    { label: "France", value: 1400, color: "#f59e0b" },
    { label: "Canada", value: 1100, color: "#ec4899" },
  ];
  const max = data[0].value;

  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px]" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px", cursor: "help" }}>Top countries</span>
      <div className="flex flex-col gap-3 mt-3 flex-1 justify-center">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const dimmed = hovered !== null && hovered !== i;
          return (
            <div key={d.label} className="flex flex-col gap-1 cursor-pointer"
              style={{ opacity: dimmed ? 0.3 : 1, transition: "opacity 200ms" }}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: C.textSecondary, letterSpacing: "-0.3px" }}>{d.label}</span>
                <span className="text-xs font-medium" style={{ color: C.text, letterSpacing: "-0.3px" }}>{d.value.toLocaleString("en-US")}</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: C.hoverBg }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: d.color, transition: "width 0.3s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Activity Heatmap Card ────────────────────────────────── */
function HeatmapCard() {
  let _s = 99;
  const rng2 = () => { _s = (_s * 16807 + 0) % 2147483647; return _s / 2147483647; };
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 12 }, (_, i) => `${(i * 2)}h`);
  const grid = days.map(() => hours.map(() => rng2()));

  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px] sm:col-span-2" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px", cursor: "help" }}>Activity heatmap</span>
      <div className="flex gap-1.5 mt-3 flex-1 items-center justify-center">
        <div className="flex flex-col gap-1.5 mr-1">
          {days.map((d) => (
            <div key={d} className="flex items-center justify-end" style={{ height: 22 }}>
              <span className="text-[10px]" style={{ color: C.textMuted }}>{d}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-1 gap-1">
          {hours.map((h, hi) => (
            <div key={h} className="flex flex-1 flex-col gap-1">
              {days.map((d, di) => {
                const v = grid[di][hi];
                const alpha = 0.05 + v * 0.6;
                return (
                  <div key={d} className="cursor-pointer transition-transform hover:scale-110"
                    style={{ height: 22, background: `rgba(246,133,15,${alpha})`, borderRadius: 3 }}
                    title={`${d} ${hi * 2}:00 — ${Math.round(v * 100)}%`} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Hour labels */}
      <div className="flex mt-1" style={{ paddingLeft: 28 }}>
        {hours.map((h, hi) => (
          <div key={h} className="flex-1 text-center">
            <span className="text-[9px]" style={{ color: C.textMuted }}>{hi % 3 === 0 ? `${hi * 2}:00` : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Chart Data (recharts format) ──────────────────────────── */
const days = ["Mar 29", "Mar 30", "Mar 31", "Apr 1", "Apr 2", "Apr 3", "Apr 4"];

/* ─── Gauge / Radar Score Card ─────────────────────────────── */

function GaugeScoreCard() {
  const C = themes[useTheme()];
  const score = 87;
  const max = 100;
  const pct = score / max;

  // Arc params: 270° sweep, starting from 135° (bottom-left)
  const r = 62;
  const cx = 80;
  const cy = 80;
  const startAngle = 135;
  const sweepAngle = 270;
  const endAngle = startAngle + sweepAngle;
  const filledAngle = startAngle + sweepAngle * pct;

  const polarToCart = (angle: number) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  });

  const arcPath = (from: number, to: number) => {
    const s = polarToCart(from);
    const e = polarToCart(to);
    const large = to - from > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  // Tick marks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px]" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <div className="flex items-center justify-between mb-2">
        <CardTitle title="Health Score" desc="Overall system health score" />
        <span
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5"
          style={{ fontSize: 12, fontWeight: 600, background: "rgba(34, 255, 153, 0.118)", color: "rgba(70, 254, 165, 0.83)" }}
        >
          Excellent
        </span>
      </div>

      <div className="flex justify-center" style={{ marginTop: -4 }}>
        <svg width="160" height="120" viewBox="0 0 160 120">
          {/* Background track */}
          <path d={arcPath(startAngle, endAngle)} fill="none" stroke={C.border} strokeWidth="10" strokeLinecap="round" />

          {/* Gradient filled arc */}
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f6850f" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <path d={arcPath(startAngle, filledAngle)} fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round" />

          {/* Glow on needle tip */}
          {(() => {
            const tip = polarToCart(filledAngle);
            return <circle cx={tip.x} cy={tip.y} r="6" fill="#06B6D4" opacity="0.3" />;
          })()}

          {/* Tick labels */}
          {ticks.map((t) => {
            const angle = startAngle + (sweepAngle * t) / 100;
            const p = polarToCart(angle);
            const labelR = r + 14;
            const lp = {
              x: cx + labelR * Math.cos((angle * Math.PI) / 180),
              y: cy + labelR * Math.sin((angle * Math.PI) / 180),
            };
            return (
              <text key={t} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
                fontSize="9" fill={C.textMuted} fontFamily="var(--font-inter)">
                {t}
              </text>
            );
          })}

          {/* Center score */}
          <text x={cx} y={cy - 8} textAnchor="middle" fontSize="32" fontWeight="700" fill={C.text} fontFamily="var(--font-inter)">
            {score}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill={C.textMuted} fontFamily="var(--font-inter)">
            out of {max}
          </text>
        </svg>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        {[
          { label: "Uptime", value: "99.9%", color: "#06B6D4" },
          { label: "Speed", value: "92ms", color: "#34D399" },
          { label: "Errors", value: "0.02%", color: "#f6850f" },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <div style={{ fontSize: 16, fontWeight: 600, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Top Articles / Referrers Bar List Card ──────────────── */

function TopListCard() {
  const C = themes[useTheme()];

  const articles = [
    { label: "How We Scaled to 1M Users Without Breaking a Sweat", value: 4821 },
    { label: "The Pragmatic Guide to Design Systems in 2026", value: 4102 },
    { label: "Stop Using useEffect for Everything", value: 3874 },
    { label: "Building a SaaS from Zero: Month 6 Update", value: 3201 },
    { label: "CSS Grid vs Flexbox: When to Use Which", value: 2988 },
  ];

  const referrers = [
    { label: "newsletter.tldrnewsletter.com", value: 5812 },
    { label: "twitter.com", value: 4920 },
    { label: "hackernews.ycombinator.com", value: 3804 },
    { label: "linkedin.com", value: 2711 },
    { label: "reddit.com/r/webdev", value: 1840 },
  ];

  const maxArticle = Math.max(...articles.map((a) => a.value));
  const maxReferrer = Math.max(...referrers.map((r) => r.value));

  const BarRow = ({ label, value, max, idx }: { label: string; value: number; max: number; idx: number }) => {
    const pct = (value / max) * 100;
    const opacity = 1 - idx * 0.15;
    return (
      <div
        className="group flex items-center gap-3 rounded-lg px-1 -mx-1 transition-colors cursor-pointer"
        style={{ marginBottom: 4, padding: "2px 4px" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.hoverBg; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div className="flex-1 min-w-0 relative" style={{ height: 32 }}>
          <div
            className="absolute inset-y-0 left-0 rounded-r-md transition-all duration-200 group-hover:brightness-110"
            style={{ width: `${pct}%`, background: `rgba(20, 184, 166, ${opacity})` }}
          />
          <span
            className="relative z-10 flex items-center h-full px-3 truncate"
            style={{ fontSize: 13, fontWeight: 500, color: C.text }}
          >
            {label}
          </span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.text, minWidth: 40, textAlign: "right" }}>
          {value.toLocaleString("en-US")}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Top articles */}
      <div className="flex flex-col p-4" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
        <div className="flex items-center justify-between mb-4">
          <CardTitle title="Top articles" desc="Most viewed articles this period" />
          <span style={{ fontSize: 12, fontWeight: 500, color: C.textMuted }}>Subscribers</span>
        </div>
        {articles.map((a, i) => (
          <BarRow key={a.label} label={a.label} value={a.value} max={maxArticle} idx={i} />
        ))}
      </div>

      {/* Top referrers */}
      <div className="flex flex-col p-4" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
        <div className="flex items-center justify-between mb-4">
          <CardTitle title="Top referrers" desc="Top traffic referral sources" />
          <span style={{ fontSize: 12, fontWeight: 500, color: C.textMuted }}>Subscribers</span>
        </div>
        {referrers.map((r, i) => (
          <BarRow key={r.label} label={r.label} value={r.value} max={maxReferrer} idx={i} />
        ))}
      </div>
    </div>
  );
}

/* ─── Top Campaigns Card ───────────────────────────────────── */

const TOP_CAMPAIGNS_DATA = [
  { rank: 1, name: "Post Higgsfield AI Seatdance 2.0 Clips", count: 5393 },
  { rank: 2, name: "GYMSHARK Clipping", count: 4560 },
  { rank: 3, name: "The Diary of a CEO [Official Clipping]", count: 3261 },
  { rank: 4, name: "Call of Duty BO7 Gameplay Clipping", count: 2922 },
  { rank: 5, name: "Polymarket Clipping Campaign", count: 2520 },
];

const TOP_CREATORS_DATA = [
  { rank: 1, name: "SKY", count: 310 },
  { rank: 2, name: "Ileana Navarro", count: 248 },
  { rank: 3, name: "Escanor", count: 202 },
  { rank: 4, name: "Salman Ansari", count: 189 },
  { rank: 5, name: "ZEDD ENTERTAINMENTS", count: 185 },
];

function TopCampaignsCard() {
  const C = themes[useTheme()];
  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px]" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <div className="mb-3"><CardTitle title="💎 Top Campaigns" desc="Campaigns ranked by submission count" /></div>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {TOP_CAMPAIGNS_DATA.map((c) => (
          <div key={c.rank} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.background = C.hoverBg; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            <span className="flex size-5 items-center justify-center rounded-full text-[10px] font-semibold" style={{ background: c.rank <= 3 ? (c.rank === 1 ? "#f6850f" : c.rank === 2 ? "#9CA3AF" : "#B45309") : "transparent", color: c.rank <= 3 ? "#fff" : C.textMuted }}>{c.rank}</span>
            <span className="flex-1 min-w-0 truncate text-[13px] font-medium" style={{ color: C.text }}>{c.name}</span>
            <span className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold" style={{ background: "rgba(246,133,15,0.15)", color: "#f6850f" }}>{c.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopCreatorsCard() {
  const C = themes[useTheme()];
  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px]" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <div className="mb-3"><CardTitle title="👥 Top Creators" desc="Creators ranked by submission count" /></div>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {TOP_CREATORS_DATA.map((c) => (
          <div key={c.rank} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.background = C.hoverBg; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            <span className="flex size-5 items-center justify-center rounded-full text-[10px] font-semibold" style={{ background: c.rank <= 3 ? (c.rank === 1 ? "#f6850f" : c.rank === 2 ? "#9CA3AF" : "#B45309") : "transparent", color: c.rank <= 3 ? "#fff" : C.textMuted }}>{c.rank}</span>
            <span className="flex-1 min-w-0 truncate text-[13px] font-medium" style={{ color: C.text }}>{c.name}</span>
            <span className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold" style={{ background: "rgba(246,133,15,0.15)", color: "#f6850f" }}>{c.count.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── World Map Card (placeholder — no external deps) ──────── */

function WorldMapCard() {
  const C = themes[useTheme()];
  const regions = [
    { name: "United States", visitors: "125K", pct: 100 },
    { name: "India", visitors: "67K", pct: 54 },
    { name: "United Kingdom", visitors: "45K", pct: 36 },
    { name: "China", visitors: "42K", pct: 34 },
    { name: "Brazil", visitors: "34K", pct: 27 },
    { name: "Germany", visitors: "32K", pct: 26 },
    { name: "Japan", visitors: "31K", pct: 25 },
  ];
  return (
    <div className="flex flex-col p-4" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <div className="flex items-center justify-between mb-3">
        <div className="relative flex flex-col gap-1 self-start">
          <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px" }}>Visitors by region</span>
          <div className="h-px w-full" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${C.border} 0px, ${C.border} 2px, transparent 2px, transparent 4px)` }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: C.textMuted }}>Last 30 days</span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {regions.map((r) => (
          <div key={r.name} className="flex items-center gap-3">
            <span style={{ fontSize: 12, color: C.textSecondary, width: 100 }}>{r.name}</span>
            <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: C.barTrack }}>
              <div className="h-full rounded-md" style={{ width: `${r.pct}%`, background: `linear-gradient(90deg, #0D9488, #2DD4BF)`, transition: "width 0.5s ease" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.text, width: 40, textAlign: "right" }}>{r.visitors}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Market Share Bar Chart Card ──────────────────────────── */

const barChartData = [
  { month: "Jan", desktop: 120, mobile: 80 },
  { month: "Feb", desktop: 250, mobile: 200 },
  { month: "Mar", desktop: 230, mobile: 120 },
  { month: "Apr", desktop: 70, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 210, mobile: 140 },
];

function MarketShareBarChart() {
  const C = themes[useTheme()];

  return (
    <div className="flex flex-col p-4 h-[220px] sm:h-[272px]" style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: 16 }}>
      <div className="flex items-center gap-2 mb-1">
        <CardTitle title="Market Share" desc="Desktop vs mobile traffic breakdown" />
        <span
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5"
          style={{ fontSize: 12, fontWeight: 600, background: "rgba(34, 255, 153, 0.118)", color: "rgba(70, 254, 165, 0.83)" }}
        >
          <CentralIcon name="IconArrowUp" size={10} color="rgba(70, 254, 165, 0.83)" {...ciProps} />
          +12%
        </span>
      </div>
      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 16 }}>Departmental performance comparison</div>

      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData} barCategoryGap="20%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={C.border} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: C.textSecondary }}
              tickMargin={8}
            />
            <Tooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div style={{
                    background: "var(--dropdown-bg)",
                    border: "1px solid var(--dropdown-border)",
                    borderRadius: 8,
                    padding: 0,
                    backdropFilter: "blur(10px)",
                    boxShadow: "var(--dropdown-shadow)",
                    minWidth: 160,
                    overflow: "hidden",
                  }}>
                    <div style={{ padding: "6px 10px", borderBottom: "1px solid var(--border-color)", fontSize: 12, fontWeight: 500, color: "var(--fg)" }}>
                      {label} 2024
                    </div>
                    <div style={{ padding: "6px 10px" }}>
                      {payload.map((entry: any) => (
                        <div key={entry.dataKey} className="flex items-center justify-between gap-4" style={{ padding: "2px 0" }}>
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-sm" style={{ width: 8, height: 8, background: entry.color }} />
                            <span style={{ fontSize: 13, color: "var(--muted-fg)" }}>
                              {entry.dataKey === "desktop" ? "Desktop" : "Mobile"}
                            </span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
                            {entry.value.toLocaleString("en-US")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="desktop" fill="#f6850f" radius={4} />
            <Bar dataKey="mobile" fill={C.blue} radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 justify-center">
        {[
          { label: "Desktop", color: "#f6850f" },
          { label: "Mobile", color: C.blue },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="rounded-sm" style={{ width: 8, height: 8, background: item.color }} />
            <span style={{ fontSize: 12, color: C.textSecondary }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const chartData = {
  grossRevenue: days.map((d, i) => ({ date: d, current: [1950, 2100, 3400, 4800, 5200, 6900, 13690][i], previous: [800, 1200, 3600, 7200, 7400, 3200, 3100][i] })),
  netRevenue: days.map((d, i) => ({ date: d, current: [1800, 1950, 3200, 4600, 5000, 6600, 12624][i], previous: [750, 1100, 3400, 6800, 7000, 3000, 2900][i] })),
  newUsers: days.map((d, i) => ({ date: d, current: [420, 520, 380, 350, 480, 410, 340][i], previous: [680, 620, 750, 580, 510, 700, 870][i] })),
  mrr: days.map((d, i) => ({ date: d, current: [0, 0, 0, 1200, 2400, 4100, 6150][i], previous: [0, 0, 0, 0, 0, 0, 0][i] })),
  arr: days.map((d, i) => ({ date: d, current: [0, 0, 0, 14400, 28800, 49200, 73800][i], previous: [0, 0, 0, 0, 0, 0, 0][i] })),
};

/* ─── Main Page ─────────────────────────────────────────────── */
// Hourly revenue data for the top chart hover
const hourlyRevenue = Array.from({ length: 25 }, (_, i) => {
  if (i === 10) return 7688;
  return 0;
});
const formatTime = (slot: number) => {
  const h = slot % 12 || 12;
  const ampm = slot < 12 ? "AM" : "PM";
  return `${h}:00 ${ampm}`;
};

export default function Dashboard() {
  const theme = useTheme();
  C = themes[theme];
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState("Last 7 days");
  const [compareWith, setCompareWith] = useState("Previous period");
  const [granularity, setGranularity] = useState("Daily");
  const [product, setProduct] = useState("All products");
  const [dateStart, setDateStart] = useState(new Date(2026, 2, 29));
  const [dateEnd, setDateEnd] = useState(new Date(2026, 3, 4));
  const [editMode, setEditMode] = useState(false);
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const addRef = useRef<HTMLDivElement>(null);
  const [cardOrder, setCardOrder] = useState(["gross", "net", "users", "mrr", "arr", "payments", "donut", "funnel", "heatmap", "marketshare", "gauge", "topcampaigns", "topcreators", "toplists", "worldmap"]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragSize, setDragSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!addOpen) return;
    const handler = (e: MouseEvent) => { if (addRef.current && !addRef.current.contains(e.target as Node)) setAddOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [addOpen]);

  // Mouse-based drag for full opacity ghost
  useEffect(() => {
    if (!dragId) return;
    document.body.classList.add("is-dragging");

    const handleMove = (e: MouseEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY });

      // Find which card we're hovering over
      const visible = cardOrder.filter((id) => !hiddenCards.has(id));
      for (const cid of visible) {
        if (cid === dragId) continue;
        const el = cardRefs.current[cid];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
          // Reorder live
          setCardOrder((prev) => {
            const next = [...prev];
            const fromIdx = next.indexOf(dragId);
            const toIdx = next.indexOf(cid);
            if (fromIdx === toIdx) return prev;
            next.splice(fromIdx, 1);
            next.splice(toIdx, 0, dragId);
            return next;
          });
          break;
        }
      }
    };

    const handleUp = () => {
      setDragId(null);
      setDragPos(null);
      document.body.classList.remove("is-dragging");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      document.body.classList.remove("is-dragging");
    };
  }, [dragId, cardOrder, hiddenCards]);
  const displayRevenue = hoverSlot !== null ? hourlyRevenue[hoverSlot] : 7688;
  const displayTime = hoverSlot !== null ? formatTime(hoverSlot) : "11:54 AM";
  const displayChange = hoverSlot !== null ? (hourlyRevenue[hoverSlot] > 0 ? "+100%" : "") : "+100%";

  return (
    <div style={{ background: C.bg, transition: "background 0.3s ease" }}>
      <style>{`@keyframes wiggle { 0% { transform: rotate(-0.5deg); } 100% { transform: rotate(0.5deg); } }`}</style>
      {/* Main content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: C.text, letterSpacing: "-0.705px" }}>
            Today
          </h1>
          <div />
        </div>

        {/* Top Stats Row */}
        <div className="flex flex-col gap-6 mb-10 lg:flex-row">
          {/* Left: Revenue + Chart */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-4 sm:gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: C.text, letterSpacing: "-0.079px", cursor: "help" }}>
                    Gross revenue
                  </span>
                  {displayChange && (
                    <span className="px-1.5 py-0.5 text-xs font-medium rounded-md" style={{ background: C.greenBg, color: C.greenText, letterSpacing: "0.008px" }}>
                      {displayChange}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-medium mt-1" style={{ color: displayRevenue > 0 ? C.text : C.textMuted, letterSpacing: "-0.705px" }}>
                  ${displayRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs font-medium mt-2" style={{ color: C.textSecondary, letterSpacing: "0.008px" }}>
                  {displayTime}
                </div>
              </div>
              <div className="ml-auto sm:ml-[60px] lg:ml-[120px]">
                <div className="text-sm font-medium" style={{ color: C.textSecondary, letterSpacing: "-0.079px" }}>
                  Yesterday
                </div>
                <div className="text-xl font-medium mt-1" style={{ color: C.textMuted, letterSpacing: "-0.412px" }}>
                  $0.00
                </div>
              </div>
            </div>
            <TopChart onHover={setHoverSlot} />
          </div>

          {/* Right: Balance + Payouts */}
          <div className="shrink-0 w-full grid grid-cols-2 gap-4 lg:block lg:w-[260px]">
            {/* Total balance */}
            <div className="pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: C.textSecondary }}>
                  Total balance
                </span>
                <button className="text-xs font-medium border-none bg-transparent cursor-pointer" style={{ color: C.blueLight }}>
                  View
                </button>
              </div>
              <div className="text-2xl font-medium mt-1" style={{ color: C.text }}>
                $4,003.13
              </div>
              <div className="text-sm mt-0.5" style={{ color: C.textMuted }}>
                $131.62 available
              </div>
            </div>

            {/* Payouts */}
            <div className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: C.textSecondary }}>
                  Payouts
                </span>
                <button className="text-xs font-medium border-none bg-transparent cursor-pointer" style={{ color: C.blueLight }}>
                  View
                </button>
              </div>
              <div className="text-2xl font-medium mt-1" style={{ color: C.text }}>
                $12,885.92
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2 py-0.5 text-xs font-medium rounded-md"
                  style={{ background: C.blueBadgeBg, color: C.blueLight }}
                >
                  In transit
                </span>
                <span className="text-xs" style={{ color: C.textMuted }}>
                  1 day ago
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: C.text }}>
            Stats
          </h2>

          {/* Filter bar */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <div className="flex">
              <Dropdown
                value={timeRange}
                options={["Today", "Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months", "All time"]}
                onChange={setTimeRange}
                roundedLeft
              />
              <DateRangePicker
                startDate={dateStart}
                endDate={dateEnd}
                onChange={(s, e) => { setDateStart(s); setDateEnd(e); }}
                roundedRight
              />
            </div>

            <span className="text-xs" style={{ color: C.textMuted }}>
              compared to
            </span>

            <Dropdown
              value={compareWith}
              options={["Previous period", "Previous year", "Custom", "No comparison"]}
              onChange={setCompareWith}
              roundedLeft roundedRight
            />

            <Dropdown
              value={granularity}
              options={["Hourly", "Daily", "Weekly", "Monthly"]}
              onChange={setGranularity}
              roundedLeft roundedRight
            />

            <span className="text-xs" style={{ color: C.textMuted }}>
              on
            </span>

            <Dropdown
              value={product}
              options={["All products", "Subscriptions", "One-time", "Invoices"]}
              onChange={setProduct}
              roundedLeft roundedRight
            />

            <div className="flex-1" />

            <div ref={addRef} className="relative">
              <button
                onClick={() => setAddOpen(!addOpen)}
                className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium border-none cursor-pointer"
                style={{ background: C.controlBg, color: C.text, borderRadius: 8, boxShadow: "0px 1px 2px rgba(0,0,0,0.05)", border: `1px solid ${C.controlBorder}` }}
              >
                <CentralIcon name="IconPlusMedium" size={14} color="currentColor" {...ciProps} /> Add
              </button>
              {addOpen && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 w-[280px] overflow-hidden"
                  style={{
                    background: "var(--dropdown-bg)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid var(--dropdown-border)",
                    borderRadius: 10,
                    boxShadow: "var(--dropdown-shadow)",
                  }}
                >
                  <div className="px-3 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <span className="text-xs font-medium" style={{ color: C.text }}>Add widget</span>
                  </div>
                  <div className="py-1">
                    {[
                      { id: "gross", icon: "📊", name: "Gross revenue", desc: "Track gross revenue over time" },
                      { id: "net", icon: "📊", name: "Net revenue", desc: "Track net revenue over time" },
                      { id: "users", icon: "👥", name: "New users", desc: "Monitor user growth" },
                      { id: "mrr", icon: "💰", name: "MRR", desc: "Monthly recurring revenue" },
                      { id: "arr", icon: "💰", name: "ARR", desc: "Annual recurring revenue" },
                      { id: "payments", icon: "💳", name: "Payments breakdown", desc: "Payment status distribution" },
                      { id: "donut", icon: "🍩", name: "Traffic sources", desc: "Visitor source breakdown" },
                      { id: "funnel", icon: "📉", name: "Conversion funnel", desc: "Pipeline stage metrics" },
                      { id: "worldmap", icon: "🌍", name: "World map", desc: "Geographic traffic distribution" },
                      { id: "heatmap", icon: "🔥", name: "Activity heatmap", desc: "Usage patterns by time" },
                      { id: "marketshare", icon: "📊", name: "Market share", desc: "Desktop vs mobile breakdown" },
                      { id: "gauge", icon: "🎯", name: "Health score", desc: "System health gauge" },
                      { id: "topcampaigns", icon: "💎", name: "Top campaigns", desc: "Campaigns by submissions" },
                      { id: "topcreators", icon: "👥", name: "Top creators", desc: "Creators by submissions" },
                      { id: "toplists", icon: "📋", name: "Top lists", desc: "Articles & referrers" },
                    ]
                      .filter((w) => hiddenCards.has(w.id))
                      .map((w) => (
                        <button
                          key={w.id}
                          onClick={() => { setHiddenCards((prev) => { const next = new Set(prev); next.delete(w.id); return next; }); setAddOpen(false); }}
                          className="flex w-full items-center gap-3 px-3 py-2 border-none cursor-pointer transition-colors"
                          style={{ background: "transparent" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--dropdown-item-hover)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm" style={{ background: C.hoverBg }}>
                            {w.icon}
                          </span>
                          <div className="flex flex-col items-start gap-0.5">
                            <span className="text-xs font-medium" style={{ color: C.text, letterSpacing: "-0.3px" }}>{w.name}</span>
                            <span className="text-[10px]" style={{ color: C.textMuted, letterSpacing: "-0.2px" }}>{w.desc}</span>
                          </div>
                        </button>
                      ))}
                    {hiddenCards.size === 0 && (
                      <div className="px-3 py-3 text-center">
                        <span className="text-[11px]" style={{ color: C.textMuted }}>All widgets are visible</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {editMode ? (
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-1.5 px-4 text-xs font-medium cursor-pointer"
                style={{ background: "#f6850f", color: "#fff", borderRadius: 8, boxShadow: "inset 0 1px 0 rgba(255,180,80,0.4), 0px 1px 2px rgba(0,0,0,0.1)", border: "none", height: 32 }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Done
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium border-none cursor-pointer"
                style={{ background: C.controlBg, color: C.text, borderRadius: 8, boxShadow: "0px 1px 2px rgba(0,0,0,0.05)", border: `1px solid ${C.controlBorder}` }}
              >
                <CentralIcon name="IconApps" size={14} color="currentColor" {...ciProps} /> Edit
              </button>
            )}
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(() => {
              const cardMap: Record<string, React.ReactNode> = {
                gross: <MetricCard title="Gross revenue" value="$13,690.00" change="+$5,690.00" changePositive data={chartData.grossRevenue} />,
                net: <MetricCard title="Net revenue" value="$12,624.39" change="+$5,064.76" changePositive data={chartData.netRevenue} />,
                users: <MetricCard title="New users" value="3,803" change="-906" changePositive={false} data={chartData.newUsers} />,
                mrr: <MetricCard title="MRR" value="$6,150.00" change="+$6,150.00" changePositive data={chartData.mrr} />,
                arr: <MetricCard title="ARR" value="$73,800.00" change="+$73,800.00" changePositive data={chartData.arr} />,
                payments: <PaymentsBreakdownCard />,
                donut: <DonutChartCard />,
                funnel: <FunnelChartCard />,
                heatmap: <HeatmapCard />,
                marketshare: <MarketShareBarChart />,
                gauge: <GaugeScoreCard />,
                topcampaigns: <TopCampaignsCard />,
                topcreators: <TopCreatorsCard />,
                toplists: <TopListCard />,
                worldmap: <WorldMapCard />,
              };
              return cardOrder
                .filter((id) => !hiddenCards.has(id))
                .map((id) => (
                  <div
                    key={id}
                    ref={(el) => { cardRefs.current[id] = el; }}
                    className={`relative select-none ${(id === "toplists" || id === "worldmap") ? "sm:col-span-2 lg:col-span-3" : ""}`}
                    onMouseDown={(e) => {
                      if (!editMode) return;
                      if ((e.target as HTMLElement).closest("button")) return;
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                      setDragSize({ w: rect.width, h: rect.height });
                      setDragPos({ x: e.clientX, y: e.clientY });
                      setDragId(id);
                    }}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      ...(editMode && !dragId ? {
                        animation: `wiggle 0.3s ease-in-out infinite alternate`,
                        animationDelay: `${[0, 0.05, 0.1, 0.15, 0.07, 0.12][id.charCodeAt(0) % 6]}s`,
                        cursor: "grab",
                      } : {}),
                      ...(dragId === id ? { opacity: 0, pointerEvents: "none" as const } : {}),
                      transition: dragId ? "transform 0.2s cubic-bezier(0.2, 0, 0, 1)" : "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    {editMode && (
                      <button
                        onClick={() => setHiddenCards((prev) => new Set([...prev, id]))}
                        className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border-none cursor-pointer"
                        style={{ background: C.xBtnBg, boxShadow: theme === "dark" ? "0 2px 8px rgba(0,0,0,0.3)" : "none" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: C.textSecondary }}>
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {cardMap[id]}
                  </div>
                ));
            })()}
          </div>
        </div>
      </main>

      {/* Floating drag ghost — portaled to body to escape will-change container */}
      {dragId && dragPos && typeof document !== "undefined" && createPortal(
        (() => {
          const cardMap: Record<string, React.ReactNode> = {
            gross: <MetricCard title="Gross revenue" value="$13,690.00" change="+$5,690.00" changePositive data={chartData.grossRevenue} />,
            net: <MetricCard title="Net revenue" value="$12,624.39" change="+$5,064.76" changePositive data={chartData.netRevenue} />,
            users: <MetricCard title="New users" value="3,803" change="-906" changePositive={false} data={chartData.newUsers} />,
            mrr: <MetricCard title="MRR" value="$6,150.00" change="+$6,150.00" changePositive data={chartData.mrr} />,
            arr: <MetricCard title="ARR" value="$73,800.00" change="+$73,800.00" changePositive data={chartData.arr} />,
            payments: <PaymentsBreakdownCard />,
            donut: <DonutChartCard />,
            funnel: <FunnelChartCard />,
            marketshare: <MarketShareBarChart />,
            gauge: <GaugeScoreCard />,
            toplists: <TopListCard />,
            worldmap: <WorldMapCard />,
          };
          return (
            <div
              className="pointer-events-none fixed z-[100]"
              style={{
                left: dragPos.x - dragOffset.x,
                top: dragPos.y - dragOffset.y,
                width: dragSize.w,
                transform: "rotate(1.5deg) scale(1.02)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                borderRadius: 16,
                overflow: "hidden",
                background: C.ghostBg,
              }}
            >
              {cardMap[dragId]}
            </div>
          );
        })(),
        document.body,
      )}
    </div>
  );
}
