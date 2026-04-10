// @ts-nocheck
"use client";

/* ───────────────────────────────────────────────────────────────────────────
   Project Management Board — /board
   Themed with CSS variables, renders inside AppShell.
   Mouse-based drag-and-drop kanban with live reorder.
   ─────────────────────────────────────────────────────────────────────────── */

import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CentralIcon } from "@central-icons-react/all";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/admin/ui/sheet";
import { CheckCircleIcon, ClockCircleIcon, XCircleIcon } from "@/components/admin/status-icons";
import { useToast } from "@/components/admin/toast";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const CI = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

// ─── Glassmorphic Dropdown ─────────────────────────────────────────────────
function BoardDropdown({ trigger, children, align = "left" }: { trigger: ReactNode; children: ReactNode; align?: "left" | "right" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align === "right" ? "end" : "start"} className="min-w-[180px] rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-[10px]">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DropdownItem({ icon, label, active, onClick }: { icon?: ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className="cursor-pointer gap-2 rounded-lg px-3 py-1.5 text-sm font-medium"
    >
      {icon && <span className="flex items-center justify-center" style={{ width: 15, height: 15 }}>{icon}</span>}
      <span className="flex-1">{label}</span>
      {active && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
          <path d="M3 7L5.5 9.5L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </DropdownMenuItem>
  );
}

// ─── Icon helpers removed — all icons use CentralIcon ──────────────────────

function SpaceAvatar({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <div
      className="rounded-[5px] flex items-center justify-center text-white"
      style={{ width: size, height: size, backgroundColor: color, fontSize: 10, fontWeight: 600 }}
    >
      <svg width={10} height={10} viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// ─── Status circle icons ────────────────────────────────────────────────────

function StatusCircle({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="4" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function StatusInProgress({ color = "#5A43D6", size = 10 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M5 1a4 4 0 010 8" fill={color} />
    </svg>
  );
}

function StatusNeedsReview({ color = "#ED5F00", size = 10 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="4" stroke={color} strokeWidth="1.5" />
      <path d="M5 1a4 4 0 010 8 4 4 0 000-8z" fill={color} fillOpacity="0.75" />
    </svg>
  );
}

function StatusCompleted({ color = "#299764", size = 10 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <circle cx="5" cy="5" r="4" fill={color} />
      <path d="M3 5l1.5 1.5L7 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AssigneeAvatar({ src, size = 20 }: { src?: string; size?: number }) {
  if (src) {
    return (
      <img src={src} alt="" className="rounded-full object-cover" style={{ width: size, height: size }} />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{ width: size, height: size, background: "var(--muted)" }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="4.5" r="2.5" stroke="var(--muted-fg)" strokeWidth="1.2" />
        <path d="M2 11c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" stroke="var(--muted-fg)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─── Task card types and data ───────────────────────────────────────────────

interface Task {
  id: string;
  title: string;
  hasAssignee?: boolean;
  assigneeImg?: string;
  date?: string;
  dateColor?: string;
  hasLink?: boolean;
  hasPriority?: boolean;
  hasDescription?: boolean;
  linkText?: string;
}

interface Column {
  id: string;
  label: string;
  color: string;
  bgOverlay: string;
  tasks: Task[];
}

const INITIAL_COLUMNS: Column[] = [
  {
    id: "open",
    label: "Open",
    color: "#8D8D8D",
    bgOverlay: "rgba(141,141,141,0.1)",
    tasks: [
      { id: "1", title: "Google Docs + Notion Integration for Blueprints" },
      { id: "2", title: "Blueprint Templates" },
      { id: "3", title: "Onboarding Webhooks sent to Discord/n8n" },
      { id: "4", title: "Admin Dashboard" },
      { id: "5", title: "Light Mode" },
      { id: "6", title: "Whitelabel" },
    ],
  },
  {
    id: "in-progress",
    label: "In Progress",
    color: "#5A43D6",
    bgOverlay: "rgba(90,67,214,0.05)",
    tasks: [
      { id: "7", title: "Invoices with Web App Database + Framer", hasAssignee: true, assigneeImg: "https://i.pravatar.cc/20?img=3" },
      { id: "8", title: "Self Service Campaign Setup" },
      { id: "9", title: "Improve Demographics Review Process" },
      { id: "10", title: "virality.gg Landing Page", hasLink: true },
      { id: "11", title: "Affiliate Program with Dub (for Virality)" },
    ],
  },
  {
    id: "needs-review",
    label: "Needs Review",
    color: "#ED5F00",
    bgOverlay: "rgba(237,95,0,0.05)",
    tasks: [
      { id: "12", title: "Client Dashboard with Shortimize API", hasAssignee: true, assigneeImg: "https://i.pravatar.cc/20?img=5", date: "11/14/25", dateColor: "#C62A2F", hasPriority: true },
    ],
  },
  {
    id: "completed",
    label: "Completed",
    color: "#299764",
    bgOverlay: "rgba(41,151,100,0.05)",
    tasks: [],
  },
];

// ─── Board Task Card Component ──────────────────────────────────────────────

function TaskCard({ task, onOpen }: { task: Task; onOpen?: () => void }) {
  return (
    <div
      className="rounded-[10px] p-3 transition-all duration-150 hover:shadow-lg hover:-translate-y-0.5 cursor-grab"
      style={{
        background: "var(--card)",
        boxShadow: "0px 0px 1px var(--border-color), 0px 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-start gap-2">
        <span
          onClick={(e) => { if (onOpen) { e.stopPropagation(); onOpen(); } }}
          className={onOpen ? "cursor-pointer hover:underline" : undefined}
          style={{ fontSize: "13.7px", fontWeight: 500, color: "var(--fg)", lineHeight: "1.4" }}
        >
          {task.title}
          {task.hasLink && (
            <span className="inline-flex ml-1 align-middle">
              <CentralIcon name="IconChainLink1" size={12} color="#f6850f" {...CI} />
            </span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {task.hasAssignee && (
          <div
            className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <AssigneeAvatar src={task.assigneeImg} size={18} />
          </div>
        )}
        {task.date && (
          <div
            className="h-[24px] rounded-[6px] flex items-center gap-1 px-1.5"
            style={{ fontSize: "11px", color: task.dateColor || "var(--muted-fg)", border: "1px solid var(--border-color)" }}
          >
            <CentralIcon name="IconCalendar1" size={11} color={task.dateColor || "var(--muted-fg)"} {...CI} />
            {task.date}
          </div>
        )}
        {task.hasPriority && (
          <div
            className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <CentralIcon name="IconFlag1" size={12} color="#ED5F00" {...CI} />
          </div>
        )}
        {!task.hasAssignee && !task.date && !task.hasPriority && (
          <>
            <div
              className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center opacity-40"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <AssigneeAvatar size={16} />
            </div>
            <div
              className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center opacity-40"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <CentralIcon name="IconCalendar1" size={11} color="var(--muted-fg)" {...CI} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Assignee dropdown select ─────────────────────────────────────────────

interface Member {
  value: string;
  label: string;
  initials: string;
  avatar: string;
}

function AssigneeSelect({ members, selected }: { members: Member[]; selected: string | null }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(selected);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const currentMember = members.find((m) => m.value === current);

  return (
    <div ref={ref} className="relative">
      <label className="text-xs font-medium mb-2 block" style={{ color: "var(--muted-fg)" }}>Assignee</label>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg px-3 w-full transition-colors hover:bg-[var(--accent)]"
        style={{
          height: 36,
          border: "1px solid var(--border-color)",
          background: "transparent",
        }}
      >
        {currentMember ? (
          <>
            <img src={currentMember.avatar} alt={currentMember.label} className="w-5 h-5 rounded-full object-cover" />
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>{currentMember.label}</span>
          </>
        ) : (
          <span style={{ fontSize: 13, color: "var(--muted-fg)" }}>Select assignee...</span>
        )}
        <CentralIcon
          name="IconChevronBottom"
          size={12}
          color="var(--muted-fg)"
          {...CI}
          className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+4px)] z-50 w-full overflow-hidden"
          style={{
            borderRadius: 10,
            background: "var(--dropdown-bg)",
            border: "1px solid var(--dropdown-border)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "var(--dropdown-shadow)",
          }}
        >
          <div className="px-3.5 py-1.5" style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-fg)", letterSpacing: "0.02em" }}>
            Assign to
          </div>
          <div className="pb-1">
            {members.map((m) => (
              <button
                key={m.value}
                onClick={() => { setCurrent(m.value); setOpen(false); }}
                className="flex w-full items-center gap-2.5 px-3.5 py-1.5 transition-colors hover:bg-[var(--dropdown-item-hover)]"
              >
                <img src={m.avatar} alt={m.label} className="w-6 h-6 rounded-full object-cover" />
                <span style={{ fontSize: 14, fontWeight: 500, color: "var(--dropdown-text)" }}>{m.label}</span>
                {current === m.value && (
                  <CentralIcon name="IconCircleCheck" size={14} color="#f6850f" {...CI} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────

export default function BoardPage() {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<"board" | "list">("board");

  // ── Search state ──
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Sheet state ──
  const [sheetTask, setSheetTask] = useState<Task | null>(null);
  const [sheetColId, setSheetColId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createColId, setCreateColId] = useState("open");
  const didDrag = useRef(false);
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  // ── Drag-and-drop state ──
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);

  // ── Filtered columns (search) ──
  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) return columns;
    const q = searchQuery.toLowerCase();
    return columns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((t) => t.title.toLowerCase().includes(q)),
    }));
  }, [columns, searchQuery]);
  const [dragTask, setDragTask] = useState<{ id: string; colId: string } | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragSize, setDragSize] = useState({ w: 0, h: 0 });
  const [dropTarget, setDropTarget] = useState<{ colId: string; index: number } | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const colRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Find a task by id across all columns
  const findTask = useCallback(
    (id: string): Task | undefined => {
      for (const col of columns) {
        const t = col.tasks.find((t) => t.id === id);
        if (t) return t;
      }
      return undefined;
    },
    [columns],
  );

  // ── Mouse down handler ──
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, taskId: string, colId: string) => {
      e.preventDefault();
      const cardEl = cardRefs.current[taskId];
      if (!cardEl) return;
      const rect = cardEl.getBoundingClientRect();
      mouseDownPos.current = { x: e.clientX, y: e.clientY };
      didDrag.current = false;
      setDragTask({ id: taskId, colId });
      setDragPos({ x: e.clientX, y: e.clientY });
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setDragSize({ w: rect.width, h: rect.height });
      document.body.classList.add("is-dragging");
    },
    [],
  );

  // ── Drag effect: mousemove + mouseup listeners ──
  useEffect(() => {
    if (!dragTask) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      if (mouseDownPos.current) {
        const dx = Math.abs(e.clientX - mouseDownPos.current.x);
        const dy = Math.abs(e.clientY - mouseDownPos.current.y);
        if (dx > 4 || dy > 4) didDrag.current = true;
      }
      setDragPos(newPos);

      // Detect which column the mouse is over
      let targetColId: string | null = null;
      for (const colId of Object.keys(colRefs.current)) {
        const el = colRefs.current[colId];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          targetColId = colId;
          break;
        }
      }

      if (!targetColId) {
        setDropTarget(null);
        return;
      }

      // Find insert index within that column
      setColumns((prev) => {
        const targetCol = prev.find((c) => c.id === targetColId);
        if (!targetCol) return prev;

        // Determine insertion index based on card positions
        let insertIdx = targetCol.tasks.length;
        for (let i = 0; i < targetCol.tasks.length; i++) {
          const task = targetCol.tasks[i];
          // Skip the dragged card itself
          if (task.id === dragTask.id) continue;
          const cardEl = cardRefs.current[task.id];
          if (!cardEl) continue;
          const cardRect = cardEl.getBoundingClientRect();
          const cardMid = cardRect.top + cardRect.height / 2;
          if (e.clientY < cardMid) {
            // Insert before this card
            // But we need the actual index in the array
            insertIdx = i;
            break;
          }
        }

        // Find source column and index
        let sourceColId: string | null = null;
        let sourceIdx = -1;
        for (const col of prev) {
          const idx = col.tasks.findIndex((t) => t.id === dragTask.id);
          if (idx !== -1) {
            sourceColId = col.id;
            sourceIdx = idx;
            break;
          }
        }

        if (sourceColId === null || sourceIdx === -1) return prev;

        // If same column and same position, no change needed
        if (sourceColId === targetColId) {
          // Adjust insertIdx: if dragging down within same column, account for removal
          const adjustedIdx = insertIdx > sourceIdx ? insertIdx : insertIdx;
          if (adjustedIdx === sourceIdx) {
            setDropTarget({ colId: targetColId, index: insertIdx });
            return prev;
          }
        }

        // Perform the move
        const newCols = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));
        const srcCol = newCols.find((c) => c.id === sourceColId)!;
        const [movedTask] = srcCol.tasks.splice(sourceIdx, 1);
        const destCol = newCols.find((c) => c.id === targetColId)!;

        // If same column, adjust index after removal
        let finalIdx = insertIdx;
        if (sourceColId === targetColId && insertIdx > sourceIdx) {
          finalIdx = insertIdx - 1;
        }
        destCol.tasks.splice(finalIdx, 0, movedTask);

        setDropTarget({ colId: targetColId, index: finalIdx });
        return newCols;
      });
    };

    const handleMouseUp = () => {
      setDragTask(null);
      setDragPos(null);
      setDropTarget(null);
      mouseDownPos.current = null;
      document.body.classList.remove("is-dragging");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragTask]);

  const draggedTask = dragTask ? findTask(dragTask.id) : undefined;

  return (
    <div className="flex flex-col h-full" style={{ color: "var(--fg)" }}>


      {/* Settings Bar */}
      <div
        className="h-[41px] flex items-center gap-2 px-3 flex-shrink-0 relative z-20"
        style={{ borderBottom: "1px solid var(--border-color)", background: "var(--bg)" }}
      >
        <BoardDropdown trigger={
          <div className="h-[24px] flex items-center gap-1 px-2.5 rounded-[12px]" style={{ fontSize: "12px", fontWeight: 500, color: "#f6850f", backgroundColor: "rgba(246,133,15,0.12)" }}>
            Group: Status
          </div>
        }>
          <DropdownItem icon={<CentralIcon name="IconChecklist" size={15} color="var(--fg)" {...CI} />} label="Status" active />
          <DropdownItem icon={<CentralIcon name="IconFlag1" size={15} color="var(--fg)" {...CI} />} label="Priority" />
          <DropdownItem icon={<CentralIcon name="IconUser" size={15} color="var(--fg)" {...CI} />} label="Assignee" />
          <DropdownItem icon={<CentralIcon name="IconCalendar1" size={15} color="var(--fg)" {...CI} />} label="Due date" />
          <DropdownItem icon={<CentralIcon name="IconMinusSmall" size={15} color="var(--fg)" {...CI} />} label="None" />
        </BoardDropdown>

        <BoardDropdown trigger={
          <div className="h-[24px] flex items-center gap-1 px-2.5 rounded-[12px]" style={{ fontSize: "12px", color: "var(--muted-fg)", background: "var(--card)" }}>
            Subtasks
          </div>
        }>
          <DropdownItem icon={<CentralIcon name="IconEyeOpen" size={15} color="var(--fg)" {...CI} />} label="Show subtasks" active />
          <DropdownItem icon={<CentralIcon name="IconEyeClosed" size={15} color="var(--fg)" {...CI} />} label="Hide subtasks" />
          <DropdownItem icon={<CentralIcon name="IconChevronBottom" size={15} color="var(--fg)" {...CI} />} label="Expand all" />
          <DropdownItem icon={<CentralIcon name="IconChevronTop" size={15} color="var(--fg)" {...CI} />} label="Collapse all" />
        </BoardDropdown>

        <div className="w-[1px] h-[16px] mx-0.5" style={{ background: "var(--border-color)" }} />

        <BoardDropdown trigger={
          <div className="h-[24px] flex items-center gap-1 px-2 rounded-[12px]" style={{ fontSize: "12px", color: "var(--muted-fg)", background: "var(--card)" }}>
            <CentralIcon name="IconSortArrowUpDown" size={12} color="var(--muted-fg)" {...CI} />Sort
          </div>
        }>
          <DropdownItem icon={<CentralIcon name="IconPointer" size={15} color="var(--fg)" {...CI} />} label="Manual" active />
          <DropdownItem icon={<CentralIcon name="IconCalendar1" size={15} color="var(--fg)" {...CI} />} label="Due date" />
          <DropdownItem icon={<CentralIcon name="IconFlag1" size={15} color="var(--fg)" {...CI} />} label="Priority" />
          <DropdownItem icon={<CentralIcon name="IconFileText" size={15} color="var(--fg)" {...CI} />} label="Name" />
          <DropdownItem icon={<CentralIcon name="IconCalendarCheck" size={15} color="var(--fg)" {...CI} />} label="Date created" />
          <DropdownItem icon={<CentralIcon name="IconCalendarEdit" size={15} color="var(--fg)" {...CI} />} label="Date updated" />
        </BoardDropdown>

        <BoardDropdown trigger={
          <div className="h-[24px] flex items-center gap-1 px-2 rounded-[12px]" style={{ fontSize: "12px", color: "var(--muted-fg)", background: "var(--card)" }}>
            <CentralIcon name="IconFilter1" size={12} color="var(--muted-fg)" {...CI} />Filter
          </div>
        }>
          <DropdownItem icon={<CentralIcon name="IconChecklist" size={15} color="var(--fg)" {...CI} />} label="Status" />
          <DropdownItem icon={<CentralIcon name="IconUser" size={15} color="var(--fg)" {...CI} />} label="Assignee" />
          <DropdownItem icon={<CentralIcon name="IconFlag1" size={15} color="var(--fg)" {...CI} />} label="Priority" />
          <DropdownItem icon={<CentralIcon name="IconCalendar1" size={15} color="var(--fg)" {...CI} />} label="Due date" />
          <DropdownItem icon={<CentralIcon name="IconTag" size={15} color="var(--fg)" {...CI} />} label="Tags" />
          <DropdownItem icon={<CentralIcon name="IconUser" size={15} color="var(--fg)" {...CI} />} label="Created by" />
        </BoardDropdown>

        <BoardDropdown trigger={
          <div className="h-[24px] flex items-center gap-1 px-2 rounded-[12px]" style={{ fontSize: "12px", color: "var(--muted-fg)", border: "1px solid var(--border-color)", background: "var(--card)" }}>
            Closed
          </div>
        }>
          <DropdownItem icon={<CentralIcon name="IconEyeOpen" size={15} color="var(--fg)" {...CI} />} label="Show closed" />
          <DropdownItem icon={<CentralIcon name="IconEyeClosed" size={15} color="var(--fg)" {...CI} />} label="Hide closed" active />
        </BoardDropdown>

        <BoardDropdown trigger={
          <div className="h-[24px] flex items-center gap-1 px-2 rounded-[12px]" style={{ fontSize: "12px", color: "var(--muted-fg)", border: "1px solid var(--border-color)", background: "var(--card)" }}>
            Assignee
          </div>
        }>
          <DropdownItem icon={<CentralIcon name="IconPeople" size={15} color="var(--fg)" {...CI} />} label="Anyone" active />
          <DropdownItem icon={<CentralIcon name="IconUser" size={15} color="var(--fg)" {...CI} />} label="Me" />
          <DropdownItem icon={<CentralIcon name="IconUserRemove" size={15} color="var(--fg)" {...CI} />} label="Unassigned" />
        </BoardDropdown>

        {/* Me mode avatar */}
        <div
          className="w-[20px] h-[20px] rounded-full cursor-pointer"
          style={{ border: "2px solid var(--card)", background: "#f6850f", boxShadow: "0 0 0 1px var(--border-color)" }}
        />

        <div className="ml-auto flex items-center gap-2">
          {searchOpen && (
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="h-[24px] rounded-[6px] outline-none"
              style={{ width: 160, padding: "0 8px", fontSize: 12, color: "var(--fg)", background: "var(--card)", border: "1px solid var(--border-color)", fontFamily: "inherit" }}
              onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); } }}
            />
          )}
          <button
            onClick={() => { setSearchOpen((o) => !o); if (searchOpen) setSearchQuery(""); }}
            className="w-[28px] h-[24px] rounded-[6px] flex items-center justify-center"
            style={{ border: "1px solid var(--border-color)", background: searchOpen ? "var(--accent)" : "var(--card)" }}
          >
            <CentralIcon name="IconMagnifyingGlass" size={13} color="var(--muted-fg)" {...CI} />
          </button>
          <button
            className="w-[28px] h-[24px] rounded-[6px] flex items-center justify-center"
            style={{ border: "1px solid var(--border-color)", background: "var(--card)" }}
          >
            <CentralIcon name="IconSettingsGear1" size={13} color="var(--muted-fg)" {...CI} />
          </button>

          {/* Add Task split button — primary orange */}
          <div className="flex items-center">
            <button
              onClick={() => { setCreateColId("open"); setCreateOpen(true); }}
              className="h-[28px] flex items-center gap-1 px-3 rounded-l-[6px] text-white cursor-pointer"
              style={{ fontSize: "13px", fontWeight: 500, backgroundColor: "#f6850f" }}
            >
              <CentralIcon name="IconPlusMedium" size={12} color="white" {...CI} />
              Add Task
            </button>
            <button
              className="h-[28px] w-[24px] flex items-center justify-center rounded-r-[6px] text-white border-l border-white/20"
              style={{ backgroundColor: "#f6850f" }}
            >
              <CentralIcon name="IconChevronBottom" size={10} color="white" {...CI} />
            </button>
          </div>
        </div>
      </div>

      {(<>
      {/* ══ BOARD VIEW ══ */}
      <div
        className="flex-1 overflow-x-auto overflow-y-auto"
        style={{ background: "var(--card)", scrollbarWidth: "none" }}
      >
        <div className="flex gap-2 p-3 min-h-full" style={{ minWidth: "fit-content" }}>
          {filteredColumns.map((col) => (
            <div
              key={col.id}
              ref={(el) => { colRefs.current[col.id] = el; }}
              className="w-[220px] sm:w-[264px] flex-shrink-0 rounded-[8px] flex flex-col transition-all duration-150"
              style={{
                backgroundColor: col.bgOverlay,
                ...(dragTask && dropTarget?.colId === col.id ? {
                  backgroundColor: `${col.color}15`,
                } : {}),
              }}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span style={{ fontSize: "13px", fontWeight: 600, color: col.color }}>
                  {col.label}
                </span>
                <span style={{ fontSize: "12px", color: "var(--muted-fg)", fontWeight: 400 }}>
                  {col.tasks.length}
                </span>
              </div>

              {/* Cards */}
              <div
                className="flex flex-col gap-2 px-1.5 pb-2 overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {col.tasks.length === 0 && (
                  <div className="flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-[var(--border-color)] py-6 mx-1.5">
                    <CentralIcon name="IconPlusMedium" size={16} color="var(--muted-fg)" {...CI} />
                    <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>No tasks yet</span>
                  </div>
                )}
                {col.tasks.map((task, taskIndex) => (
                  <div key={task.id}>
                    {/* Drop indicator before this card */}
                    {dropTarget?.colId === col.id && dropTarget.index === taskIndex && dragTask?.id !== task.id && (
                      <div style={{ height: 3, background: "#f6850f", borderRadius: 2, margin: "2px 6px 4px 6px", boxShadow: "0 0 6px rgba(246,133,15,0.3)" }} />
                    )}
                    <div
                      ref={(el) => { cardRefs.current[task.id] = el; }}
                      onMouseDown={(e) => handleMouseDown(e, task.id, col.id)}
                      style={{
                        cursor: dragTask ? undefined : "grab",
                        opacity: dragTask?.id === task.id ? 0 : 1,
                      }}
                    >
                      <TaskCard task={task} onOpen={() => { setSheetTask(task); setSheetColId(col.id); }} />
                    </div>
                  </div>
                ))}

                {/* Drop indicator at end of column */}
                {dropTarget?.colId === col.id && dropTarget.index === col.tasks.length && (
                  <div style={{ height: 3, background: "#f6850f", borderRadius: 2, margin: "2px 6px 4px 6px", boxShadow: "0 0 6px rgba(246,133,15,0.3)" }} />
                )}

                {/* Add Task button */}
                <button onClick={() => { setCreateColId(col.id); setCreateOpen(true); }} className="flex items-center gap-1.5 h-[32px] px-3 rounded-[8px] hover:bg-[var(--muted)] transition-colors cursor-pointer">
                  <CentralIcon name="IconPlusMedium" size={12} color={col.color} {...CI} />
                  <span style={{ fontSize: "13px", color: col.color }}>Add Task</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add group button */}
          <button onClick={() => toast("Coming soon")} className="flex items-center gap-1.5 h-[32px] px-3 flex-shrink-0 self-start mt-2 cursor-pointer hover:bg-[var(--muted)] rounded-[8px] transition-colors">
            <CentralIcon name="IconPlusMedium" size={12} color="var(--muted-fg)" {...CI} />
            <span style={{ fontSize: "13px", color: "var(--muted-fg)" }}>Add group</span>
          </button>
        </div>
      </div>

      {/* Bottom Tray */}
      <div
        className="h-[37px] flex items-center px-3 flex-shrink-0"
        style={{ borderTop: "1px solid var(--border-color)", background: "var(--bg)" }}
      >
        <button
          className="h-[24px] flex items-center gap-1.5 px-2.5 rounded-[6px]"
          style={{
            background: "var(--card)",
            boxShadow: "0px 0px 1px var(--border-color), 0px 1px 2px rgba(0,0,0,0.04)",
            fontSize: "12px",
            color: "var(--muted-fg)",
          }}
        >
          <CentralIcon name="IconFlag1" size={12} color="var(--muted-fg)" {...CI} />
          1 Priority
        </button>
      </div>
      </>)
}

      {/* ── Floating ghost card — portaled to body to escape will-change container ── */}
      {dragTask && dragPos && draggedTask && typeof document !== "undefined" && createPortal(
        <div
          className="pointer-events-none fixed z-[100] select-none"
          style={{
            left: dragPos.x - dragOffset.x,
            top: dragPos.y - dragOffset.y,
            width: dragSize.w,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            borderRadius: 10,
            overflow: "hidden",
            background: "var(--ghost-bg, #1a1a1a)",
          }}
        >
          <TaskCard task={draggedTask} />
        </div>,
        document.body,
      )}

      {/* ── Task detail sheet ── */}
      <Sheet open={!!sheetTask} onOpenChange={(open: boolean) => { if (!open) { setSheetTask(null); setSheetColId(null); } }}>
        <SheetContent side="right" className="max-w-full sm:max-w-[480px] w-full">
          {sheetTask && (() => {
            const col = columns.find((c) => c.id === sheetColId);
            const statusColor = col?.color ?? "#8D8D8D";
            const members = [
              { value: "sarah", label: "Sarah Chen", initials: "SC", avatar: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80" },
              { value: "alex", label: "Alex Kim", initials: "AK", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80" },
              { value: "maria", label: "Maria Garcia", initials: "MG", avatar: "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80" },
              { value: "james", label: "James Wilson", initials: "JW", avatar: "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80" },
            ];

            return (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-[6px] px-2"
                      style={{ height: 20, background: `${statusColor}22`, fontSize: 12, fontWeight: 500, color: statusColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                      {col?.label ?? "Open"}
                    </span>
                  </div>
                  <SheetTitle>{sheetTask.title}</SheetTitle>
                  <SheetDescription>
                    Task #{sheetTask.id} on the {col?.label ?? "board"}
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ scrollbarWidth: "none" }}>
                  {/* Assignee */}
                  <AssigneeSelect
                    members={members}
                    selected={sheetTask.hasAssignee ? "sarah" : null}
                  />

                  {/* Status */}
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: "var(--muted-fg)" }}>Status</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {columns.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            if (sheetTask && sheetColId !== c.id) {
                              // Move task to new column
                              setColumns((prev) => {
                                const next = prev.map((col) => ({
                                  ...col,
                                  tasks: col.id === sheetColId
                                    ? col.tasks.filter((t) => t.id !== sheetTask.id)
                                    : col.id === c.id
                                      ? [...col.tasks, sheetTask]
                                      : col.tasks,
                                }));
                                return next;
                              });
                              setSheetColId(c.id);
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                          style={{
                            border: c.id === sheetColId ? `1px solid ${c.color}` : "1px solid var(--border-color)",
                            background: c.id === sheetColId ? `${c.color}18` : "transparent",
                            fontSize: 13,
                            fontWeight: 500,
                            color: c.id === sheetColId ? c.color : "var(--muted-fg)",
                          }}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: "var(--muted-fg)" }}>Priority</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {[
                        { label: "Urgent", color: "#E5484D" },
                        { label: "High", color: "#ED5F00" },
                        { label: "Medium", color: "#FFCA16" },
                        { label: "Low", color: "#6E6E6E" },
                      ].map((p) => {
                        const isActive = sheetTask.hasPriority && p.label === "Urgent";
                        return (
                          <button
                            key={p.label}
                            onClick={() => {
                              if (sheetTask) {
                                const updated = { ...sheetTask, hasPriority: true };
                                setSheetTask(updated);
                                setColumns((prev) => prev.map((col) => ({
                                  ...col,
                                  tasks: col.tasks.map((t) => t.id === sheetTask.id ? updated : t),
                                })));
                              }
                            }}
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer hover:bg-[var(--accent)]"
                            style={{
                              border: isActive ? `1px solid ${p.color}` : "1px solid var(--border-color)",
                              background: isActive ? `${p.color}18` : "transparent",
                              fontSize: 13,
                              fontWeight: 500,
                              color: "var(--fg)",
                            }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Due date */}
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: "var(--muted-fg)" }}>Due date</label>
                    <div
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                      style={{ border: "1px solid var(--border-color)", fontSize: 13, fontWeight: 500, color: sheetTask.dateColor || "var(--fg)" }}
                    >
                      <CentralIcon name="IconCalendar1" size={14} color={sheetTask.dateColor || "var(--muted-fg)"} {...CI} />
                      {sheetTask.date || "No due date"}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: "var(--muted-fg)" }}>Description</label>
                    <textarea
                      placeholder="Add a description..."
                      defaultValue={sheetTask.hasDescription ? "Task description goes here..." : ""}
                      rows={3}
                      className="w-full rounded-lg p-3 outline-none transition-all focus:ring-1 focus:ring-[#f6850f]/30"
                      style={{ border: "1px solid var(--border-color)", fontSize: 13, color: "var(--fg)", background: "transparent", resize: "none", fontFamily: "inherit", lineHeight: 1.5 }}
                    />
                  </div>

                  {/* Activity */}
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: "var(--muted-fg)" }}>Activity</label>
                    <div className="space-y-3">
                      {[
                        { label: "Task created", icon: <ClockCircleIcon size={14} color="#FB923C" />, time: "2 days ago" },
                        { label: `Moved to ${col?.label ?? "column"}`, icon: <CheckCircleIcon size={14} color="#34D399" />, time: "1 day ago" },
                      ].map((evt, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          {evt.icon}
                          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>{evt.label}</span>
                          <span className="ml-auto" style={{ fontSize: 12, color: "var(--muted-fg)" }}>{evt.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <SheetFooter>
                  <button
                    onClick={() => { setSheetTask(null); setSheetColId(null); }}
                    className="flex items-center justify-center rounded-lg px-4 cursor-pointer"
                    style={{
                      height: 32,
                      background: "#f6850f",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#FFFFFF",
                    }}
                  >
                    Save changes
                  </button>
                  <button
                    onClick={() => { setSheetTask(null); setSheetColId(null); }}
                    className="flex items-center justify-center rounded-lg px-4"
                    style={{
                      height: 32,
                      background: "var(--accent)",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--fg)",
                    }}
                  >
                    Cancel
                  </button>
                </SheetFooter>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* ── Create Task Popup ── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} size="sm">
        <form onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const title = (form.elements.namedItem("title") as HTMLInputElement).value.trim();
          if (!title) return;
          const newTask: Task = {
            id: `t${Date.now()}`,
            title,
            hasAssignee: false,
            hasDescription: (form.elements.namedItem("desc") as HTMLTextAreaElement).value.trim().length > 0,
          };
          setColumns((prev) => prev.map((col) =>
            col.id === createColId ? { ...col, tasks: [...col.tasks, newTask] } : col
          ));
          setCreateOpen(false);
        }}>
          <ModalHeader>
            <span className="font-[family-name:var(--font-inter)] text-base font-semibold text-page-text">Create Task</span>
          </ModalHeader>

          <ModalBody className="space-y-5">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-page-text-muted">Title</label>
              <input
                name="title"
                autoFocus
                placeholder="What needs to be done?"
                className="h-10 w-full rounded-xl border border-border bg-foreground/[0.03] px-3.5 font-[family-name:var(--font-inter)] text-sm text-page-text outline-none transition-colors placeholder:text-foreground/30 focus:border-[#f6850f]/40 focus:ring-1 focus:ring-[#f6850f]/20"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-page-text-muted">Status</label>
              <div className="flex flex-wrap items-center gap-2">
                {columns.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCreateColId(c.id)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      border: "none",
                      background: createColId === c.id ? `${c.color}20` : "rgba(255,255,255,0.04)",
                      color: createColId === c.id ? c.color : "var(--page-text-muted)",
                    }}
                  >
                    <span className="size-2 rounded-full" style={{ background: c.color }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-page-text-muted">Description</label>
              <textarea
                name="desc"
                placeholder="Add details..."
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-foreground/[0.03] px-3.5 py-2.5 font-[family-name:var(--font-inter)] text-sm leading-relaxed text-page-text outline-none transition-colors placeholder:text-foreground/30 focus:border-[#f6850f]/40 focus:ring-1 focus:ring-[#f6850f]/20"
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-[#f6850f] px-4 py-2 font-[family-name:var(--font-inter)] text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Create Task
            </button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
