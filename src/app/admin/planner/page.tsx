// @ts-nocheck
"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { CentralIcon } from "@central-icons-react/all";
import { Tabs, TabItem } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TaskDetailModal } from "@/components/admin/task-detail-modal";

import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureItem,
  GanttToday,
  type GanttFeature,
} from "@/components/admin/kibo-ui/gantt";

const ciProps = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

/* ── Gantt Data ── */

const ganttStatuses = {
  done: { id: "done", name: "Done", color: "#299764" },
  inProgress: { id: "in-progress", name: "In Progress", color: "#5A43D6" },
  planned: { id: "planned", name: "Planned", color: "#ED5F00" },
};

const initialGanttFeatures: GanttFeature[] = (() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return [
    { id: "g1", name: "Research & Discovery", startAt: new Date(y, m - 1, 5), endAt: new Date(y, m - 1, 20), status: ganttStatuses.done },
    { id: "g2", name: "Wireframe Design", startAt: new Date(y, m - 1, 15), endAt: new Date(y, m, 2), status: ganttStatuses.done },
    { id: "g3", name: "API Architecture", startAt: new Date(y, m, 1), endAt: new Date(y, m, 15), status: ganttStatuses.inProgress },
    { id: "g4", name: "Frontend Build", startAt: new Date(y, m, 5), endAt: new Date(y, m, 25), status: ganttStatuses.inProgress },
    { id: "g5", name: "Backend Services", startAt: new Date(y, m, 8), endAt: new Date(y, m + 1, 5), status: ganttStatuses.inProgress },
    { id: "g6", name: "Integration Testing", startAt: new Date(y, m + 1, 1), endAt: new Date(y, m + 1, 15), status: ganttStatuses.planned },
    { id: "g7", name: "Performance Audit", startAt: new Date(y, m + 1, 10), endAt: new Date(y, m + 1, 22), status: ganttStatuses.planned },
    { id: "g8", name: "Launch & Deploy", startAt: new Date(y, m + 1, 20), endAt: new Date(y, m + 1, 28), status: ganttStatuses.planned },
  ];
})();

/* ── Types ── */

interface PlannerTask {
  id: string;
  title: string;
  status: "open" | "in-progress" | "completed";
  statusColor?: string;
  section: "priorities" | "meetWith" | "assignedToMe" | "todayOverdue" | "backlog";
  duration: number;
  scheduledDate?: Date;
  scheduledHour?: number;
  spanDays?: number; // multi-day: how many days it spans
  automationLabel?: string;
  description?: string;
}

type ViewMode = "day" | "3day" | "week";

/* ── Helpers ── */

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function addDays(d: Date, n: number): Date { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function getISOWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function formatHour(h: number): string {
  const hour = Math.floor(h);
  const min = Math.round((h - hour) * 60);
  const ampm = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 || 12;
  return min > 0 ? `${h12}:${min.toString().padStart(2, "0")} ${ampm}` : `${h12} ${ampm}`;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_LABELS_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const ROW_H = 56;
const HOUR_START = 6;
const HOUR_COUNT = 15;

/* ── Initial Tasks ── */

const INITIAL_TASKS: PlannerTask[] = [
  { id: "1", title: "Invoices with Web App Database + Framer", status: "in-progress", statusColor: "#5A43D6", section: "priorities", duration: 1.5, description: "Integrate invoice generation using the web app database and Framer components" },
  { id: "2", title: "Virality TOS and Privacy Policy", status: "in-progress", statusColor: "#5A43D6", section: "priorities", duration: 1, description: "Draft and review terms of service and privacy policy documents" },
  { id: "3", title: "Self Service Campaign Setup", status: "in-progress", statusColor: "#ED5F00", section: "priorities", duration: 2, description: "Build the self-service campaign creation flow for brands" },
  { id: "4", title: "Call Emberly", status: "open", section: "meetWith", duration: 0.5 },
  { id: "5", title: "Sync with David", status: "open", section: "meetWith", duration: 0.5 },
  { id: "6", title: "Client Dashboard Review", status: "in-progress", statusColor: "#5A43D6", section: "assignedToMe", duration: 1, description: "Review the latest client dashboard designs and provide feedback" },
  { id: "7", title: "Landing Page Copy Review", status: "open", section: "assignedToMe", duration: 1 },
  { id: "8", title: "Order Twister", status: "open", section: "todayOverdue", duration: 0.5, automationLabel: "1h" },
  { id: "9", title: "Fix payment webhook", status: "open", section: "todayOverdue", duration: 1, description: "Debug and fix the Stripe webhook handler for failed payments" },
  { id: "10", title: "Design system audit", status: "open", section: "backlog", duration: 2, description: "Audit all components against the design system for consistency" },
  { id: "11", title: "Implement dark mode for emails", status: "open", section: "backlog", duration: 1.5 },
  { id: "12", title: "Write API documentation", status: "open", section: "backlog", duration: 2 },
  { id: "13", title: "Refactor auth middleware", status: "open", section: "backlog", duration: 1 },
  { id: "14", title: "Add analytics tracking", status: "open", section: "backlog", duration: 1 },
  { id: "15", title: "Update onboarding flow", status: "open", section: "backlog", duration: 1.5 },
  // Pre-scheduled events (relative to current week)
  ...(() => {
    const mon = getMonday(new Date());
    return [
      { id: "s1", title: "Team standup", status: "in-progress" as const, statusColor: "#5A43D6", section: "priorities" as const, duration: 0.5, scheduledDate: addDays(mon, 0), scheduledHour: 9 },
      { id: "s2", title: "Sprint planning", status: "in-progress" as const, statusColor: "#ED5F00", section: "priorities" as const, duration: 1.5, scheduledDate: addDays(mon, 0), scheduledHour: 14 },
      { id: "s3", title: "Design review", status: "open" as const, section: "assignedToMe" as const, duration: 1, scheduledDate: addDays(mon, 2), scheduledHour: 11 },
      { id: "s4", title: "Q2 Roadmap Discussion", status: "in-progress" as const, statusColor: "#5A43D6", section: "priorities" as const, duration: 2, scheduledDate: addDays(mon, 3), scheduledHour: 10, spanDays: 1 },
      { id: "s5", title: "1:1 with Manager", status: "open" as const, section: "meetWith" as const, duration: 0.5, scheduledDate: addDays(mon, 4), scheduledHour: 15 },
    ];
  })(),
];

/* ── Status Dots ── */

function StatusDotOpen() {
  return <svg width={14} height={14} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="var(--muted-fg)" strokeWidth="1.2" strokeDasharray="3 3" /></svg>;
}
function StatusDotInProgress({ color = "#5A43D6" }: { color?: string }) {
  return <svg width={14} height={14} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" fill={color} /><circle cx="8" cy="8" r="2.5" fill="white" /></svg>;
}

/* ── Section Header ── */

function SectionHeader({ label, count, collapsed, onToggle, icon }: { label: string; count: number; collapsed: boolean; onToggle: () => void; icon?: React.ReactNode }) {
  return (
    <button onClick={onToggle} className="flex w-full items-center gap-2 cursor-pointer" style={{ padding: "5px 8px", background: "none", border: "none", fontFamily: "inherit" }}>
      <CentralIcon name="IconChevronRight" size={10} color="var(--muted-fg)" {...ciProps} className={`transition-transform ${collapsed ? "" : "rotate-90"}`} />
      {icon}
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", flex: 1, textAlign: "left" }}>{label}</span>
      <span className="flex items-center justify-center rounded-full" style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-fg)", background: "var(--accent)", width: 18, height: 18 }}>{count}</span>
    </button>
  );
}

/* ── Task Item ── */

function TaskItem({ task, onDragStart, onClick }: { task: PlannerTask; onDragStart: (e: React.MouseEvent, task: PlannerTask) => void; onClick: (task: PlannerTask) => void }) {
  const isInProgress = task.status === "in-progress";
  const color = task.statusColor ?? "#8D8D8D";
  return (
    <div
      onMouseDown={(e) => onDragStart(e, task)}
      onClick={() => onClick(task)}
      className="flex items-center gap-2 rounded-md transition-colors cursor-grab"
      style={{ padding: "5px 8px", fontSize: 13, color: "var(--fg)", minHeight: 32 }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {task.status === "open" ? <StatusDotOpen /> : <StatusDotInProgress color={task.statusColor} />}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12.5 }}>{task.title}</span>
      {task.scheduledDate !== undefined && <CentralIcon name="IconCalendar1" size={10} color="var(--muted-fg)" {...ciProps} />}
      {task.automationLabel && <span className="flex items-center gap-0.5" style={{ fontSize: 10, fontWeight: 500, color: "#9C2BAD" }}><CentralIcon name="IconLightning" size={9} color="#9C2BAD" {...ciProps} fill="filled" />{task.automationLabel}</span>}
      <span style={{ fontSize: 10, fontWeight: 500, color: "var(--muted-fg)", opacity: 0.6, flexShrink: 0 }}>{task.duration}h</span>
    </div>
  );
}

/* ── Calendar Event Block ── */

function CalendarEvent({ task, dayWidth, onDragStart, onResizeStart, onSpanResizeStart, onClick, isDragging }: {
  task: PlannerTask; dayWidth: number;
  onDragStart: (e: React.MouseEvent, task: PlannerTask) => void;
  onResizeStart: (e: React.MouseEvent, task: PlannerTask) => void;
  onSpanResizeStart: (e: React.MouseEvent, task: PlannerTask) => void;
  onClick: (task: PlannerTask) => void;
  isDragging: boolean;
}) {
  const top = (task.scheduledHour! - HOUR_START) * ROW_H;
  const height = task.duration * ROW_H;
  const color = task.statusColor ?? (task.status === "in-progress" ? "#5A43D6" : "#8D8D8D");
  const width = task.spanDays ? dayWidth * (task.spanDays + 1) - 4 : dayWidth - 4;

  if (isDragging) return null;

  return (
    <div
      onMouseDown={(e) => { e.stopPropagation(); onDragStart(e, task); }}
      className="absolute cursor-pointer overflow-hidden group"
      style={{ top, left: 64 + task.scheduledDay! * dayWidth + 2, width, height: height - 2, background: color, zIndex: 2, transition: "opacity 0.15s", borderRadius: 8 }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      <div style={{ padding: "3px 8px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>{task.title}</div>
        {height > 36 && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>{formatHour(task.scheduledHour!)} · {task.duration}h</div>}
      </div>
      {/* Vertical resize handle (duration) */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onResizeStart(e, task); }}
        className="absolute bottom-0 left-0 right-0 cursor-s-resize opacity-30 group-hover:opacity-100 transition-opacity"
        style={{ height: 8, background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.15))", borderRadius: "0 0 8px 8px" }}
      />
      {/* Horizontal resize handle (span days) */}
      <div
        onMouseDown={(e) => { e.stopPropagation(); onSpanResizeStart(e, task); }}
        className="absolute top-0 right-0 bottom-0 cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ width: 8, background: "linear-gradient(to right, transparent, rgba(0,0,0,0.15))", borderRadius: "0 8px 8px 0" }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  Page Component                                               */
/* ══════════════════════════════════════════════════════════════ */

export default function PlannerPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>(INITIAL_TASKS);
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  // Ensure we're on the correct week after hydration
  useEffect(() => { setWeekStart(getMonday(new Date())); }, []);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [ganttFeatures, setGanttFeatures] = useState<GanttFeature[]>(initialGanttFeatures);
  const handleGanttMove = (id: string, startAt: Date, endAt: Date | null) => {
    setGanttFeatures((prev) => prev.map((f) => f.id === id ? { ...f, startAt, endAt: endAt ?? f.endAt } : f));
  };
  const [viewDayOffset, setViewDayOffset] = useState(0); // for day/3day view relative to weekStart
  const [showCompleted, setShowCompleted] = useState(true);
  const [showWeekends, setShowWeekends] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-switch to day view on mobile
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    if (mq.matches) setViewMode("day");
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setViewMode("day"); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ priorities: false, meetWith: false, assignedToMe: false, todayOverdue: true, backlog: false });
  const toggle = (k: string) => setCollapsed((p) => ({ ...p, [k]: !p[k] }));

  // Notion pages as calendar events
  const [notionPages, setNotionPages] = useState<{ id: string; title: string; url: string; icon: string | null; lastEdited: string }[]>([]);
  useEffect(() => {
    fetch("/api/notion/recent").then((r) => r.json()).then((data) => {
      if (data.results) setNotionPages(data.results.slice(0, 5));
    }).catch(() => {});
  }, []);

  // Notion page → open in task detail modal
  const [notionTaskOverride, setNotionTaskOverride] = useState<{ id: string; title: string; status: string; statusColor: string; description: string; url: string } | null>(null);

  const openNotionPage = async (pageId: string, pageTitle: string, pageUrl: string) => {
    // Set basic info immediately so modal opens fast
    setNotionTaskOverride({ id: pageId, title: pageTitle, status: "open", statusColor: "#0091FF", description: "Loading...", url: pageUrl });
    try {
      const res = await fetch(`/api/notion/page/${pageId}`);
      const data = await res.json();
      setNotionTaskOverride((prev) => prev ? { ...prev, title: data.title ?? pageTitle, description: data.content ?? "No content" } : null);
    } catch {
      setNotionTaskOverride((prev) => prev ? { ...prev, description: "Failed to load content" } : null);
    }
  };

  // Event detail sheet
  const [selectedTask, setSelectedTask] = useState<PlannerTask | null>(null);

  // Drag state
  const [dragTask, setDragTask] = useState<PlannerTask | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dropTarget, setDropTarget] = useState<{ day: number; hour: number } | null>(null);
  const dropTargetRef = useRef<{ day: number; hour: number } | null>(null);
  const didDrag = useRef(false);
  const [activeDrag, setActiveDrag] = useState(false);

  // Resize state (vertical — duration)
  const [resizeTask, setResizeTask] = useState<PlannerTask | null>(null);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [resizeOrigDuration, setResizeOrigDuration] = useState(0);

  // Span resize state (horizontal — multi-day)
  const [spanResizeTask, setSpanResizeTask] = useState<PlannerTask | null>(null);
  const [spanResizeStartX, setSpanResizeStartX] = useState(0);
  const [spanResizeOrigSpan, setSpanResizeOrigSpan] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);
  const [dayWidth, setDayWidth] = useState(100);
  const [now, setNow] = useState(new Date());

  // View config
  const visibleDays = viewMode === "day" ? 1 : viewMode === "3day" ? 3 : (showWeekends ? 7 : 5);
  const viewStart = viewMode === "week" ? weekStart : addDays(weekStart, viewDayOffset);
  const weekDays = Array.from({ length: visibleDays }, (_, i) => addDays(viewStart, i));

  // Convert Notion pages to planner events
  const notionEvents = notionPages.map((page, i) => {
    const editDate = new Date(page.lastEdited);
    const dayIdx = weekDays.findIndex((d) => isSameDay(d, editDate));
    return { ...page, dayIdx: dayIdx >= 0 ? dayIdx : 0, hour: 8 + i * 0.5 };
  });

  useEffect(() => { const i = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(i); }, []);

  useEffect(() => {
    const update = () => { if (gridRef.current) setDayWidth((gridRef.current.offsetWidth - 64) / visibleDays); };
    update();
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    if (gridRef.current) ro.observe(gridRef.current);
    return () => { window.removeEventListener("resize", update); ro.disconnect(); };
  }, [visibleDays, sidebarCollapsed]);

  const today = new Date();
  const monthLabel = MONTHS[weekDays[Math.floor(visibleDays / 2)]?.getMonth() ?? 0] + " " + (weekDays[Math.floor(visibleDays / 2)]?.getFullYear() ?? 2026);
  const weekNum = getISOWeek(weekDays[Math.floor(visibleDays / 2)] ?? today);

  // Navigation
  const step = viewMode === "day" ? 1 : viewMode === "3day" ? 3 : 7;
  const navigate = (dir: number) => {
    if (viewMode === "week") setWeekStart(addDays(weekStart, dir * 7));
    else setViewDayOffset((o) => o + dir * step);
  };
  const goToday = () => { setWeekStart(getMonday(new Date())); setViewDayOffset(0); setNow(new Date()); };

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent, task: PlannerTask) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragTask(task);
    setDragPos({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    didDrag.current = false;
    document.body.classList.add("is-dragging");
  }, []);

  // Resize handler
  const handleResizeStart = useCallback((e: React.MouseEvent, task: PlannerTask) => {
    e.preventDefault();
    setResizeTask(task);
    setResizeStartY(e.clientY);
    setResizeOrigDuration(task.duration);
    document.body.classList.add("is-dragging");
  }, []);

  const handleSpanResizeStart = useCallback((e: React.MouseEvent, task: PlannerTask) => {
    e.preventDefault();
    setSpanResizeTask(task);
    setSpanResizeStartX(e.clientX);
    setSpanResizeOrigSpan(task.spanDays ?? 0);
    document.body.classList.add("is-dragging");
  }, []);

  // Drag effect
  useEffect(() => {
    if (!dragTask) return;
    const startPos = dragPos;

    const handleMove = (e: MouseEvent) => {
      if (startPos) { const dx = Math.abs(e.clientX - startPos.x), dy = Math.abs(e.clientY - startPos.y); if (dx > 4 || dy > 4) { didDrag.current = true; setActiveDrag(true); } }
      setDragPos({ x: e.clientX, y: e.clientY });

      if (gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect();
        const relX = e.clientX - gridRect.left - 64;
        const relY = e.clientY - gridRect.top + gridRef.current.scrollTop;

        if (relX >= 0 && relX < gridRect.width - 64 && e.clientY >= gridRect.top && e.clientY <= gridRect.bottom) {
          const dayIdx = Math.min(Math.floor(relX / dayWidth), visibleDays - 1);
          const rawHour = HOUR_START + relY / ROW_H;
          const snapped = Math.round(rawHour * 2) / 2;
          const clamped = Math.max(HOUR_START, Math.min(snapped, HOUR_START + HOUR_COUNT - dragTask.duration));
          dropTargetRef.current = { day: dayIdx, hour: clamped };
          setDropTarget({ day: dayIdx, hour: clamped });
        } else { dropTargetRef.current = null; setDropTarget(null); }
      }
    };

    const handleUp = () => {
      if (!didDrag.current && dragTask) {
        // Click without drag → open task detail
        setSelectedTask(dragTask);
      } else if (didDrag.current && dragTask && dropTargetRef.current) {
        const dt = dropTargetRef.current;
        setTasks((prev) => prev.map((t) => t.id === dragTask.id ? { ...t, scheduledDate: weekDays[dt.day], scheduledHour: dt.hour, spanDays: undefined } : t));
      } else if (didDrag.current && dragTask && !dropTargetRef.current && dragTask.scheduledDate !== undefined) {
        setTasks((prev) => prev.map((t) => t.id === dragTask.id ? { ...t, scheduledDate: undefined, scheduledHour: undefined } : t));
      }
      setDragTask(null); setDragPos(null); setDropTarget(null); dropTargetRef.current = null; setActiveDrag(false);
      document.body.classList.remove("is-dragging");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [dragTask, dayWidth, visibleDays]);

  // Resize effect
  useEffect(() => {
    if (!resizeTask) return;

    const handleMove = (e: MouseEvent) => {
      const deltaY = e.clientY - resizeStartY;
      const deltaDuration = Math.round((deltaY / ROW_H) * 2) / 2;
      const newDuration = Math.max(0.5, resizeOrigDuration + deltaDuration);
      setTasks((prev) => prev.map((t) => t.id === resizeTask.id ? { ...t, duration: newDuration } : t));
    };

    const handleUp = () => {
      setResizeTask(null);
      document.body.classList.remove("is-dragging");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [resizeTask, resizeStartY, resizeOrigDuration]);

  // Span resize effect (horizontal)
  useEffect(() => {
    if (!spanResizeTask) return;

    const handleMove = (e: MouseEvent) => {
      const deltaX = e.clientX - spanResizeStartX;
      const deltaDays = Math.round(deltaX / dayWidth);
      const newSpan = Math.max(0, spanResizeOrigSpan + deltaDays);
      setTasks((prev) => prev.map((t) => t.id === spanResizeTask.id ? { ...t, spanDays: newSpan > 0 ? newSpan : undefined } : t));
    };

    const handleUp = () => {
      setSpanResizeTask(null);
      document.body.classList.remove("is-dragging");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [spanResizeTask, spanResizeStartX, spanResizeOrigSpan, dayWidth]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered tasks (search + completed filter)
  const displayTasks = useMemo(() => {
    let result = tasks;
    if (!showCompleted) result = result.filter((t) => t.status !== "completed");
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    return result;
  }, [tasks, showCompleted, searchQuery]);

  const tasksFor = (section: string) => displayTasks.filter((t) => t.section === section);
  const scheduledTasks = displayTasks
    .filter((t) => t.scheduledDate !== undefined && t.scheduledHour !== undefined)
    .map((t) => {
      const dayIdx = weekDays.findIndex((d) => isSameDay(d, t.scheduledDate!));
      return { ...t, scheduledDay: dayIdx };
    })
    .filter((t) => t.scheduledDay >= 0 && t.scheduledDay < visibleDays);

  const nowHour = now.getHours() + now.getMinutes() / 60;
  const nowPx = (nowHour - HOUR_START) * ROW_H;
  const nowVisible = nowHour >= HOUR_START && nowHour < HOUR_START + HOUR_COUNT;
  const todayDayIdx = weekDays.findIndex((d) => isSameDay(d, today));

  const handleCellClick = (dayIdx: number, hour: number) => {
    const newTask: PlannerTask = { id: `new-${Date.now()}`, title: "New task", status: "open", section: "backlog", duration: 1, scheduledDate: weekDays[dayIdx], scheduledHour: hour };
    setTasks((prev) => [...prev, newTask]);
    setSelectedTask(newTask);
  };

  // Filter / settings state (showCompleted and showWeekends moved earlier)
  const [filterOpen, setFilterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen && !settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (filterOpen && filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
      if (settingsOpen && settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen, settingsOpen]);

  const navBtnStyle: React.CSSProperties = { width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", borderRadius: 6, cursor: "pointer", transition: "background 0.1s" };

  const sections = [
    { key: "priorities", label: "Priorities", icon: <CentralIcon name="IconFlag1" size={12} color="#ED5F00" {...ciProps} /> },
    { key: "meetWith", label: "Meet with", icon: <CentralIcon name="IconPeople" size={12} color="var(--muted-fg)" {...ciProps} /> },
    { key: "assignedToMe", label: "Assigned to me", icon: <CentralIcon name="IconUser" size={12} color="var(--muted-fg)" {...ciProps} /> },
    { key: "todayOverdue", label: "Today & overdue", icon: <CentralIcon name="IconClock" size={12} color="#EB4B62" {...ciProps} /> },
    { key: "backlog", label: "Backlog", icon: <CentralIcon name="IconArrowInbox" size={12} color="var(--muted-fg)" {...ciProps} /> },
  ];

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", fontFamily: "var(--font-inter), 'Inter', sans-serif", background: "var(--bg)" }}>
      {/* ════════════ CALENDAR ════════════ */}
      <div style={{ flex: 1, height: "100%", background: "var(--card)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", borderBottom: "1px solid var(--border-color)", flexShrink: 0, background: "var(--bg)", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flexShrink: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
              <button onClick={() => navigate(-1)} style={navBtnStyle}><CentralIcon name="IconChevronLeft" size={14} color="var(--muted-fg)" {...ciProps} /></button>
              <button onClick={() => navigate(1)} style={navBtnStyle}><CentralIcon name="IconChevronRight" size={14} color="var(--muted-fg)" {...ciProps} /></button>
            </div>
            <span className="truncate" style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)" }}>{monthLabel}</span>
            {viewMode === "week" && <span className="hidden sm:inline" style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-fg)" }}>W{weekNum}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            {/* View mode toggle */}
            {(() => {
              const modes: ViewMode[] = ["day", "3day", "week"];
              const idx = modes.indexOf(viewMode);
              return (
                <Tabs selectedIndex={idx >= 0 ? idx : 0} onSelect={(i) => { setViewMode(modes[i]); setViewDayOffset(0); }}>
                  <TabItem label="Day" index={0} />
                  <TabItem label="3 Day" index={1} className="hidden sm:flex" />
                  <TabItem label="Week" index={2} className="hidden sm:flex" />
                </Tabs>
              );
            })()}
            <button onClick={goToday} style={{ padding: "4px 10px", background: "var(--card)", border: "1px solid var(--border-color)", borderRadius: 7, fontSize: 12, fontWeight: 500, color: "var(--fg)", cursor: "pointer", fontFamily: "inherit" }}>Today</button>

            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={{ ...navBtnStyle, border: "1px solid var(--border-color)", borderRadius: 7 }} className="cursor-pointer">
                  <CentralIcon name="IconFilter1" size={14} color="var(--muted-fg)" {...ciProps} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-[10px]">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-page-text-muted">Filter</div>
                <DropdownMenuItem onClick={() => setShowCompleted((c) => !c)} className="cursor-pointer justify-between rounded-lg px-3 py-1.5 text-sm">
                  Show completed
                  <div style={{ width: 32, height: 18, borderRadius: 9, background: showCompleted ? "#f6850f" : "var(--accent)", border: "1px solid var(--border-color)", position: "relative", transition: "background 0.15s" }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "white", position: "absolute", top: 1, left: showCompleted ? 15 : 1, transition: "left 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }} />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowWeekends((c) => !c)} className="cursor-pointer justify-between rounded-lg px-3 py-1.5 text-sm">
                  Show weekends
                  <div style={{ width: 32, height: 18, borderRadius: 9, background: showWeekends ? "#f6850f" : "var(--accent)", border: "1px solid var(--border-color)", position: "relative", transition: "background 0.15s" }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", background: "white", position: "absolute", top: 1, left: showWeekends ? 15 : 1, transition: "left 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }} />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={{ ...navBtnStyle, border: "1px solid var(--border-color)", borderRadius: 7 }} className="cursor-pointer">
                  <CentralIcon name="IconSettingsGear1" size={14} color="var(--muted-fg)" {...ciProps} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-[10px]">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-page-text-muted">Settings</div>
                {["Start week on Monday", "24-hour format", "Show task duration", "Compact view"].map((label) => (
                  <DropdownMenuItem key={label} className="cursor-pointer gap-2 rounded-lg px-3 py-1.5 text-sm">
                    <CentralIcon name="IconCircleCheck" size={14} color="var(--muted-fg)" {...ciProps} />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {(<>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: `64px repeat(${visibleDays}, 1fr)`, flexShrink: 0, background: "var(--bg)", borderBottom: "1px solid var(--border-color)", zIndex: 4 }}>
          <div />
          {weekDays.map((day, i) => {
            const isToday_ = isSameDay(day, today);
            return (
              <div key={i} style={{ height: viewMode === "day" ? 40 : 52, display: "flex", flexDirection: viewMode === "day" ? "row" : "column", alignItems: "center", justifyContent: "center", gap: viewMode === "day" ? 6 : 2, borderLeft: "1px solid var(--border-color)", background: isToday_ ? "rgba(246,133,15,0.02)" : "transparent" }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: isToday_ ? "#f6850f" : "var(--muted-fg)", letterSpacing: "0.02em" }}>
                  {viewMode === "day" ? DAY_LABELS_FULL[weekDays[0].getDay() === 0 ? 6 : weekDays[0].getDay() - 1] : DAY_LABELS[i]}
                </span>
                {isToday_ ? (
                  <span style={{ fontSize: viewMode === "day" ? 14 : 16, fontWeight: 600, color: "#fff", background: "#f6850f", borderRadius: "50%", width: viewMode === "day" ? 24 : 28, height: viewMode === "day" ? 24 : 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{day.getDate()}</span>
                ) : (
                  <span style={{ fontSize: viewMode === "day" ? 15 : 18, fontWeight: 600, color: "var(--fg)" }}>{day.getDate()}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Multi-day events + Gantt bars */}
        {(scheduledTasks.some((t) => t.spanDays) || ganttFeatures.length > 0) && (
          <div style={{ flexShrink: 0, background: "var(--bg)", borderBottom: "1px solid var(--border-color)" }}>
            {/* Multi-day task events */}
            {scheduledTasks.some((t) => t.spanDays) && (
              <div style={{ display: "grid", gridTemplateColumns: `64px repeat(${visibleDays}, 1fr)`, minHeight: 28, position: "relative" }}>
                <div />
                {scheduledTasks.filter((t) => t.spanDays).map((task) => {
                  const color = task.statusColor ?? (task.status === "in-progress" ? "#5A43D6" : "#8D8D8D");
                  if (task.scheduledDay! >= visibleDays) return null;
                  const span = Math.min((task.spanDays ?? 0) + 1, visibleDays - task.scheduledDay!);
                  return (
                    <div
                      key={task.id}
                      onMouseDown={(e) => { e.stopPropagation(); handleDragStart(e, task); }}
                      onClick={() => { if (!didDrag.current) setSelectedTask(task); }}
                      className="cursor-grab"
                      style={{ gridColumn: `${task.scheduledDay! + 2} / span ${span}`, padding: "3px 8px", background: color, borderRadius: 8, fontSize: 11, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "2px 2px" }}
                    >
                      {task.title}
                    </div>
                  );
                })}
              </div>
            )}
            {/* Gantt timeline */}
            <div style={{ maxHeight: 96, overflow: "auto", scrollbarWidth: "none" }} className="scrollbar-hide">
              <GanttProvider range="monthly" zoom={100}>
                <GanttTimeline>
                  <GanttFeatureList>
                    <GanttFeatureListGroup>
                      {ganttFeatures.map((feature) => (
                        <GanttFeatureItem key={feature.id} {...feature} onMove={handleGanttMove} />
                      ))}
                    </GanttFeatureListGroup>
                  </GanttFeatureList>
                  <GanttToday />
                </GanttTimeline>
              </GanttProvider>
            </div>
          </div>
        )}

        {/* Time grid */}
        <div ref={gridRef} style={{ flex: 1, overflowY: "auto", position: "relative", scrollbarWidth: "none" }}>
          {Array.from({ length: HOUR_COUNT }, (_, i) => {
            const hour = HOUR_START + i;
            const ampm = hour < 12 ? "AM" : "PM";
            const h = hour % 12 || 12;
            return (
              <div key={hour} style={{ height: ROW_H, display: "grid", gridTemplateColumns: `64px repeat(${visibleDays}, 1fr)`, borderBottom: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", paddingRight: 10, paddingTop: 2, fontSize: 11, color: "var(--muted-fg)", fontWeight: 400 }}>
                  {h} {ampm}
                </div>
                {Array.from({ length: visibleDays }, (_, j) => (
                  <div key={j} className="cursor-pointer" style={{ borderLeft: "1px solid var(--border-color)", position: "relative" }}
                    onClick={() => handleCellClick(j, hour)}
                  >
                  </div>
                ))}
              </div>
            );
          })}

          {/* Scheduled events */}
          {scheduledTasks.filter((t) => !t.spanDays).map((task) => (
            <CalendarEvent key={task.id} task={task} dayWidth={dayWidth} onDragStart={handleDragStart} onResizeStart={handleResizeStart} onSpanResizeStart={handleSpanResizeStart} onClick={setSelectedTask} isDragging={activeDrag && dragTask?.id === task.id} />
          ))}

          {/* Notion page events */}
          {notionEvents.filter((e) => e.dayIdx >= 0 && e.dayIdx < visibleDays).map((page) => (
            <div
              key={page.id}
              onClick={() => openNotionPage(page.id, page.title, page.url)}
              className="absolute cursor-pointer overflow-hidden group"
              style={{
                top: (page.hour - HOUR_START) * ROW_H,
                left: 64 + page.dayIdx * dayWidth + 2,
                width: dayWidth - 4,
                height: ROW_H * 0.5 - 2,
                background: "#0091FF",
                borderRadius: 8,
                zIndex: 2,
                transition: "box-shadow 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ padding: "2px 6px 0" }}>
                <div className="flex items-center gap-1" style={{ fontSize: 10, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <span>{page.icon ?? "📄"}</span>
                  {page.title}
                </div>
              </div>
            </div>
          ))}

          {/* Drop target */}
          {dropTarget && dragTask && (() => {
            const c = dragTask.statusColor ?? (dragTask.status === "in-progress" ? "#5A43D6" : "#8D8D8D");
            return <div className="absolute pointer-events-none" style={{ top: (dropTarget.hour - HOUR_START) * ROW_H, left: 64 + dropTarget.day * dayWidth + 2, width: dayWidth - 4, height: dragTask.duration * ROW_H - 2, background: `${c}20`, borderRadius: 8, zIndex: 5 }} />;
          })()}

          {/* Current time */}
          {todayDayIdx >= 0 && nowVisible && (
            <div style={{ position: "absolute", top: nowPx, left: 64 + todayDayIdx * dayWidth - 3, width: dayWidth + 3, height: 2, background: "#EB4B62", zIndex: 3, pointerEvents: "none" }}>
              <div style={{ position: "absolute", left: -3, top: -2.5, width: 7, height: 7, borderRadius: "50%", background: "#EB4B62" }} />
            </div>
          )}
        </div>

        </>)}
      </div>

      {/* ════════════ MOBILE TASK FAB ════════════ */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden fixed bottom-5 right-5 z-50 flex items-center justify-center rounded-full cursor-pointer"
        style={{ width: 48, height: 48, background: "#f6850f", border: "none", boxShadow: "0 4px 12px rgba(246,133,15,0.4)" }}
      >
        <CentralIcon name="IconBulletList" size={20} color="#fff" {...ciProps} />
      </button>

      {/* ════════════ MOBILE SIDEBAR OVERLAY ════════════ */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setMobileSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute right-0 top-0 bottom-0 flex flex-col"
            style={{ width: "min(300px, 85vw)", background: "var(--sidebar-bg)", borderLeft: "1px solid var(--border-color)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", borderBottom: "1px solid var(--border-color)", flexShrink: 0, background: "var(--bg)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Tasks</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="cursor-pointer" style={{ ...navBtnStyle }}><CentralIcon name="IconPlusMedium" size={14} color="var(--muted-fg)" {...ciProps} className="rotate-45" /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px", scrollbarWidth: "none" }}>
              {sections.map(({ key, label, icon }) => {
                const sectionTasks = tasksFor(key);
                return (
                  <div key={key} style={{ marginBottom: 2 }}>
                    <SectionHeader label={label} count={sectionTasks.length} collapsed={collapsed[key]} onToggle={() => toggle(key)} icon={icon} />
                    {!collapsed[key] && (
                      sectionTasks.length === 0 ? (
                        <div style={{ fontSize: 12, color: "var(--muted-fg)", padding: "8px 8px", textAlign: "center" }}>No tasks</div>
                      ) : (
                        sectionTasks.map((task) => (
                          <TaskItem key={task.id} task={task} onDragStart={handleDragStart} onClick={(t) => { if (!didDrag.current) { setSelectedTask(t); setMobileSidebarOpen(false); } }} />
                        ))
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════ TASK SIDEBAR (DESKTOP) ════════════ */}
      <div className="hidden md:flex transition-[width,min-width] duration-200 ease-out" style={{ width: sidebarCollapsed ? 28 : 256, minWidth: sidebarCollapsed ? 28 : 256, height: "100%", background: sidebarCollapsed ? "var(--bg)" : "var(--sidebar-bg)", borderLeft: "1px solid var(--border-color)", flexDirection: "column", fontFamily: "var(--font-inter), 'Inter', sans-serif", overflow: "hidden" }}>
        {sidebarCollapsed ? (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="flex h-full w-full cursor-pointer items-center justify-center transition-colors hover:bg-[var(--accent)]"
            style={{ background: "none", border: "none" }}
            title="Show tasks"
          >
            <CentralIcon name="IconChevronLeft" size={12} color="var(--muted-fg)" {...ciProps} />
          </button>
        ) : (
        <>
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", borderBottom: "1px solid var(--border-color)", flexShrink: 0, background: "var(--bg)" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Tasks</span>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => { const newTask: PlannerTask = { id: `new-${Date.now()}`, title: "New task", status: "open", section: "backlog", duration: 1 }; setTasks((prev) => [...prev, newTask]); setSelectedTask(newTask); }} style={navBtnStyle} className="cursor-pointer"><CentralIcon name="IconPlusMedium" size={14} color="var(--muted-fg)" {...ciProps} /></button>
            <button onClick={() => setSidebarCollapsed(true)} style={navBtnStyle} className="cursor-pointer" title="Collapse"><CentralIcon name="IconChevronRight" size={14} color="var(--muted-fg)" {...ciProps} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px", scrollbarWidth: "none" }}>
          {sections.map(({ key, label, icon }) => {
            const sectionTasks = tasksFor(key);
            return (
              <div key={key} style={{ marginBottom: 2 }}>
                <SectionHeader label={label} count={sectionTasks.length} collapsed={collapsed[key]} onToggle={() => toggle(key)} icon={icon} />
                {!collapsed[key] && (
                  sectionTasks.length === 0 ? (
                    <div style={{ fontSize: 12, color: "var(--muted-fg)", padding: "8px 8px", textAlign: "center" }}>No tasks</div>
                  ) : (
                    sectionTasks.map((task) => (
                      <TaskItem key={task.id} task={task} onDragStart={handleDragStart} onClick={(t) => { if (!didDrag.current) setSelectedTask(t); }} />
                    ))
                  )
                )}
              </div>
            );
          })}
        </div>
      </>
      )}
      </div>

      {/* ════════════ DRAG GHOST — portaled to body ════════════ */}
      {dragTask && dragPos && activeDrag && typeof document !== "undefined" && (() => {
        const ghostColor = dragTask.statusColor ?? (dragTask.status === "in-progress" ? "#5A43D6" : "#8D8D8D");
        const ghostHeight = Math.min(dragTask.duration * ROW_H, ROW_H * 2);
        const cappedOffsetY = Math.min(dragOffset.y, ghostHeight - 8);
        return createPortal(
          <div className="pointer-events-none fixed z-[100] select-none overflow-hidden" style={{ left: dragPos.x - dragOffset.x, top: dragPos.y - cappedOffsetY, width: dayWidth > 0 ? dayWidth - 4 : 180, height: ghostHeight - 2, background: ghostColor, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.25)", opacity: 0.9 }}>
            <div style={{ padding: "3px 8px 0" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>{dragTask.title}</div>
              {ghostHeight > 36 && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>{formatHour(dragTask.scheduledHour ?? 0)} · {dragTask.duration}h</div>}
            </div>
          </div>,
          document.body,
        );
      })()}

      {/* ════════════ TASK DETAIL MODAL ════════════ */}
      <TaskDetailModal
        open={!!selectedTask || !!notionTaskOverride}
        onClose={() => { setSelectedTask(null); setNotionTaskOverride(null); }}
        task={notionTaskOverride ? {
          id: notionTaskOverride.id,
          title: notionTaskOverride.title,
          status: notionTaskOverride.status,
          statusColor: notionTaskOverride.statusColor,
          description: notionTaskOverride.description,
        } : selectedTask ? {
          id: selectedTask.id,
          title: selectedTask.title,
          status: selectedTask.status === "in-progress" ? "in progress" : selectedTask.status,
          statusColor: selectedTask.statusColor ?? "#8D8D8D",
          priority: "Urgent",
          priorityColor: "#C62A2F",
          description: selectedTask.description,
        } : undefined}
      />

    </div>
  );
}
