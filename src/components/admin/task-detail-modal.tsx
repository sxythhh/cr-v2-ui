// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { CentralIcon } from "@central-icons-react/all";
import { useToast } from "@/components/admin/toast";
import { ProximityTabs } from "@/components/ui/proximity-tabs";
import { useConfirm } from "@/components/admin/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const ci = { join: "round" as const, fill: "outlined" as const, stroke: "2" as const, radius: "2" as const };

interface TaskDetail {
  id: string;
  title: string;
  status: string;
  statusColor: string;
  assignee?: string;
  priority?: string;
  priorityColor?: string;
  dueDate?: string;
  dueDateColor?: string;
  description?: string;
  breadcrumb?: { icon: string; iconColor: string; label: string }[];
}

const MOCK_TASKS: TaskDetail[] = [
  { id: "869b6cxpx", title: "Virality Partners Framer", status: "in progress", statusColor: "#5A43D6", priority: "Urgent", priorityColor: "#C62A2F", dueDate: "11/16/25", dueDateColor: "#C62A2F", description: "Invoices and payment integration using the web app database.", breadcrumb: [{ icon: "IconStar", iconColor: "#FFC53D", label: "DAILY" }, { icon: "IconStar", iconColor: "#F8AE00", label: "DAY/DAY" }] },
  { id: "a42f1bxyz", title: "Self Service Campaign Setup", status: "in progress", statusColor: "#ED5F00", priority: "High", priorityColor: "#ED5F00", description: "Build the self-service campaign creation flow for brands.", breadcrumb: [{ icon: "IconStar", iconColor: "#FFC53D", label: "DAILY" }, { icon: "IconStar", iconColor: "#F8AE00", label: "SPRINT" }] },
  { id: "c73d2mopq", title: "Client Dashboard Review", status: "open", statusColor: "#8D8D8D", priority: "Normal", priorityColor: "#5A43D6", description: "Review the latest client dashboard designs and provide feedback.", breadcrumb: [{ icon: "IconStar", iconColor: "#FFC53D", label: "DAILY" }, { icon: "IconStar", iconColor: "#F8AE00", label: "REVIEW" }] },
];

const STATUSES = [
  { label: "open", color: "#8D8D8D" },
  { label: "in progress", color: "#5A43D6" },
  { label: "needs review", color: "#ED5F00" },
  { label: "completed", color: "#299764" },
];

const PRIORITIES = [
  { label: "Urgent", color: "#C62A2F" },
  { label: "High", color: "#ED5F00" },
  { label: "Normal", color: "#5A43D6" },
  { label: "Low", color: "#8D8D8D" },
];

const ACTIVITY = [
  { type: "status", text: "You changed status from", from: "Open", fromColor: "#8D8D8D", to: "in progress", toColor: "#5A43D6", date: "Dec 10 2025 at 8:05" },
  { type: "created", text: "You created this task", date: "Nov 16 2025 at 16:46" },
];

const LINKS = [
  { label: "Figma — Dashboard Designs", icon: "IconChainLink1", url: "#" },
  { label: "Linear — Issue #342", icon: "IconChainLink1", url: "#" },
];

/* ── MiniDropdown using Radix ── */
function MiniDropdown({ trigger, children, align = "left" }: { trigger: React.ReactNode; children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align === "right" ? "end" : "start"}
        className="min-w-[160px] rounded-xl border-foreground/[0.06] bg-card-bg p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] backdrop-blur-[10px]"
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ── Icon Button ── */
function IconBtn({ icon, size = 16, color, onClick, tooltip, className }: { icon: string; size?: number; color?: string; onClick?: () => void; tooltip?: string; className?: string }) {
  return (
    <button onClick={onClick} title={tooltip} className="flex items-center justify-center rounded-[6px] transition-colors hover:bg-[var(--accent)] min-w-[44px] min-h-[44px] sm:min-w-[24px] sm:min-h-[24px]" style={{ width: 24, height: 24, background: "none", border: "none", cursor: "pointer" }}>
      <CentralIcon name={icon as any} size={size} color={color ?? "var(--muted-fg)"} {...ci} className={className} />
    </button>
  );
}

/* ── Field Row ── */
function FieldRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ minHeight: 36, borderBottom: "1px solid var(--border-color)" }}>
      <div className="flex items-center gap-2 shrink-0" style={{ width: 160, padding: "0 8px" }}>
        <CentralIcon name={icon as any} size={14} color="var(--muted-fg)" {...ci} />
        <span style={{ fontSize: 13.7, fontWeight: 510, color: "var(--muted-fg)" }}>{label}</span>
      </div>
      <div className="flex items-center flex-1 min-w-0" style={{ padding: "0 8px" }}>
        {children}
      </div>
    </div>
  );
}

/* ── Markdown renderer ── */
function MarkdownBody({ content }: { content: string }) {
  return (
    <div style={{ fontSize: 14, color: "var(--fg)", lineHeight: "24px", whiteSpace: "pre-wrap" }}>
      {content}
    </div>
  );
}

/* ── useIsMobile hook ── */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

/* ═══════════════════════════════════════════════════════════════════ */

export function TaskDetailModal({ open, onClose, task: taskProp }: { open: boolean; onClose: () => void; task?: Partial<TaskDetail> }) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "subtasks" | "action-items">("details");
  const [rightPanel, setRightPanel] = useState<"activity" | "links" | "more">("activity");
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isResizing, setIsResizing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"content" | "activity">("content");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const currentTask = { ...MOCK_TASKS[taskIndex], ...taskProp };
  const [localTask, setLocalTask] = useState(currentTask);

  const taskPropJson = JSON.stringify(taskProp);
  useEffect(() => {
    setLocalTask({ ...MOCK_TASKS[taskIndex], ...taskProp });
  }, [taskIndex, taskPropJson]);

  // Sidebar resize
  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      const modal = document.getElementById("task-modal-body");
      if (!modal) return;
      const rect = modal.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      setSidebarWidth(Math.max(300, Math.min(600, newWidth)));
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [isResizing]);

  // Navigation
  const canPrev = taskIndex > 0;
  const canNext = taskIndex < MOCK_TASKS.length - 1;
  const goPrev = () => { if (canPrev) setTaskIndex((i) => i - 1); };
  const goNext = () => { if (canNext) setTaskIndex((i) => i + 1); };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative flex flex-col overflow-hidden max-sm:!w-full max-sm:!h-full max-sm:!max-w-none max-sm:!rounded-none" style={{ width: 1232, maxWidth: "95vw", height: "90vh", background: "var(--bg)", borderRadius: 12, border: "1px solid var(--border-color)" }}>


        {/* ═══ MOBILE PANEL SWITCHER ═══ */}
        {isMobile && (
          <div className="flex shrink-0 sm:hidden" style={{ borderBottom: "1px solid var(--border-color)" }}>
            {([
              { id: "content" as const, label: "Task" },
              { id: "activity" as const, label: "Activity" },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMobilePanel(tab.id)}
                className="relative flex-1 flex items-center justify-center"
                style={{
                  height: 40,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 510,
                  color: mobilePanel === tab.id ? "var(--fg)" : "var(--muted-fg)",
                  fontFamily: "inherit",
                }}
              >
                {tab.label}
                {mobilePanel === tab.id && (
                  <div className="absolute bottom-0 left-4 right-4" style={{ height: 2, background: "var(--fg)", borderRadius: 1 }} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ═══ BODY ═══ */}
        <div id="task-modal-body" className="flex flex-1 overflow-hidden">

          {/* ── LEFT: Task content ── */}
          <div className={`flex-1 overflow-y-auto ${isMobile && mobilePanel !== "content" ? "hidden" : ""}`} style={{ scrollbarWidth: "none" }}>
            <div style={{ maxWidth: 692, margin: "16px auto 0", padding: "0 16px 32px" }}>

              {/* Title */}
              <input
                defaultValue={localTask.title}
                key={localTask.id}
                onBlur={(e) => setLocalTask((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full bg-transparent outline-none border-none focus:ring-0"
                style={{ fontSize: 28, fontWeight: 590, color: "var(--fg)", lineHeight: "35px", margin: "0 0 8px 9px", padding: 0, fontFamily: "inherit" }}
              />

              {/* ── Fields ── */}
              <div style={{ marginBottom: 16 }}>
                <FieldRow icon="IconCircleCheck" label="Status">
                  <MiniDropdown trigger={
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span className="flex items-center rounded-[6px] px-2" style={{ height: 24, fontSize: 12, fontWeight: 510, color: "#FFFFFF", background: localTask.statusColor }}>{localTask.status}</span>
                      <CentralIcon name="IconChevronRight" size={12} color="var(--muted-fg)" {...ci} />
                    </div>
                  }>
                    {STATUSES.map((s) => (
                      <DropdownMenuItem key={s.label} onClick={() => setLocalTask((prev) => ({ ...prev, status: s.label, statusColor: s.color }))} className="cursor-pointer gap-2 rounded-lg px-3 py-1.5 text-sm font-medium">
                        <span className="rounded" style={{ width: 8, height: 8, background: s.color }} />
                        {s.label}
                      </DropdownMenuItem>
                    ))}
                  </MiniDropdown>
                </FieldRow>

                <FieldRow icon="IconUser" label="Assignees">
                  <button onClick={() => toast("Coming soon")} className="cursor-pointer transition-colors hover:text-[var(--fg)]" style={{ background: "none", border: "none", fontSize: 13.8, color: "var(--muted-fg)", fontFamily: "inherit" }}>+ Add</button>
                </FieldRow>

                <FieldRow icon="IconCalendar1" label="Dates">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80">
                    <CentralIcon name="IconCalendar1" size={14} color="var(--muted-fg)" {...ci} />
                    <span style={{ fontSize: 13.7, color: "var(--muted-fg)" }}>Start</span>
                    <CentralIcon name="IconChevronRight" size={10} color="var(--muted-fg)" {...ci} />
                    <CentralIcon name="IconCalendar1" size={14} color={localTask.dueDateColor ?? "var(--muted-fg)"} {...ci} />
                    <span style={{ fontSize: 13.7, color: localTask.dueDateColor ?? "var(--muted-fg)" }}>{localTask.dueDate ?? "Due"}</span>
                  </div>
                </FieldRow>

                <FieldRow icon="IconFlag1" label="Priority">
                  <MiniDropdown trigger={
                    <div className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80">
                      <CentralIcon name="IconFlag1" size={16} color={localTask.priorityColor ?? "var(--muted-fg)"} {...ci} fill="filled" />
                      <span style={{ fontSize: 13.7, color: "var(--fg)" }}>{localTask.priority ?? "None"}</span>
                    </div>
                  }>
                    {PRIORITIES.map((p) => (
                      <DropdownMenuItem key={p.label} onClick={() => setLocalTask((prev) => ({ ...prev, priority: p.label, priorityColor: p.color }))} className="cursor-pointer gap-2 rounded-lg px-3 py-1.5 text-sm font-medium">
                        <CentralIcon name="IconFlag1" size={14} color={p.color} {...ci} fill="filled" />
                        {p.label}
                      </DropdownMenuItem>
                    ))}
                  </MiniDropdown>
                </FieldRow>

                <FieldRow icon="IconTag" label="Tags"><span onClick={() => toast("Coming soon")} className="cursor-pointer transition-colors hover:text-[var(--fg)]" style={{ fontSize: 13.8, color: "var(--muted-fg)" }}>+ Add</span></FieldRow>
              </div>

              {/* Description */}
              <div className="rounded-lg transition-colors hover:border-[var(--muted-fg)]" style={{ border: "1px solid var(--border-color)", padding: "12px 16px", minHeight: 60, marginBottom: 16 }}>
                {localTask.description ? (
                  <MarkdownBody content={localTask.description} />
                ) : (
                  <p style={{ fontSize: 14, color: "var(--muted-fg)", margin: 0, lineHeight: "24px", cursor: "text" }}>Add a description...</p>
                )}
              </div>

              {/* Tabs */}
              {(() => {
                const tabs = ["details", "subtasks", "action-items"] as const;
                const labels = [{ label: "Details" }, { label: "Subtasks" }, { label: "Action Items" }];
                return (
                  <ProximityTabs
                    tabs={labels}
                    selectedIndex={tabs.indexOf(activeTab)}
                    onSelect={(i) => setActiveTab(tabs[i])}
                    className="border-b border-[var(--border-color)]"
                  />
                );
              })()}

              <div style={{ paddingTop: 16, paddingBottom: 16 }}>
                {activeTab === "subtasks" && (
                  <div className="flex flex-col items-center justify-center py-8" style={{ color: "var(--muted-fg)" }}>
                    <CentralIcon name="IconChecklist" size={24} color="var(--muted-fg)" {...ci} />
                    <p style={{ fontSize: 13, marginTop: 8 }}>No subtasks yet</p>
                    <button className="flex items-center gap-1 mt-2 cursor-pointer transition-colors hover:bg-[var(--accent)]" style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid var(--border-color)", background: "transparent", fontSize: 12, fontWeight: 500, color: "var(--fg)", fontFamily: "inherit" }}>
                      <CentralIcon name="IconPlusMedium" size={12} color="var(--muted-fg)" {...ci} /> Add subtask
                    </button>
                  </div>
                )}
                {activeTab === "action-items" && (
                  <div className="flex flex-col items-center justify-center py-8" style={{ color: "var(--muted-fg)" }}>
                    <CentralIcon name="IconCircleCheck" size={24} color="var(--muted-fg)" {...ci} />
                    <p style={{ fontSize: 13, marginTop: 8 }}>No action items</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Resize handle ── */}
          <div onMouseDown={() => setIsResizing(true)} className="shrink-0 cursor-col-resize group max-sm:hidden" style={{ width: 4, position: "relative" }}>
            <div className="absolute inset-y-0 left-[1px] w-[2px] transition-colors group-hover:bg-[var(--border-color)] group-active:bg-[#f6850f]" />
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className={`flex shrink-0 max-sm:flex-1 ${isMobile && mobilePanel !== "activity" ? "max-sm:hidden" : ""}`} style={{ width: isMobile ? "100%" : sidebarWidth, borderLeft: "1px solid var(--border-color)" }}>
            <div className="flex flex-col flex-1" style={{ background: "var(--accent)" }}>
              {/* Sidebar header */}
              <div className="flex items-center justify-between shrink-0" style={{ height: 49, padding: "0 16px", background: "var(--bg)", borderBottom: "1px solid var(--border-color)" }}>
                <h2 style={{ fontSize: 18, fontWeight: 510, color: "var(--fg)", margin: 0 }}>
                  {rightPanel === "activity" ? "Activity" : rightPanel === "links" ? "Links" : "Integrations"}
                </h2>
              </div>

              {/* Sidebar content */}
              <div className="flex-1 overflow-y-auto" style={{ padding: "12px", scrollbarWidth: "none" }}>
                {rightPanel === "activity" && (
                  <>
                    {ACTIVITY.map((item, i) => (
                      <div key={i} className="rounded-lg transition-colors hover:bg-[var(--accent)]" style={{ padding: "8px 12px", marginBottom: 4, fontSize: 12, color: "var(--muted-fg)" }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <span style={{ fontWeight: 700, marginRight: 6 }}>•</span>
                            {item.text}
                            {item.type === "status" && (
                              <>
                                {" "}<span className="inline-block rounded" style={{ width: 8, height: 8, background: item.fromColor, verticalAlign: "middle", margin: "0 2px" }} />
                                {" "}{item.from} to{" "}
                                <span className="inline-block rounded" style={{ width: 8, height: 8, background: item.toColor, verticalAlign: "middle", margin: "0 2px" }} />
                                <br />{item.to}
                              </>
                            )}
                          </div>
                          <span style={{ fontSize: 12, whiteSpace: "nowrap", marginLeft: 8 }}>{item.date}</span>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {rightPanel === "links" && (
                  <>
                    {LINKS.map((link, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--accent)]" style={{ padding: "8px 12px", marginBottom: 4 }}>
                        <CentralIcon name={link.icon as any} size={14} color="var(--muted-fg)" {...ci} />
                        <span style={{ fontSize: 13, color: "var(--fg)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.label}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Comment input */}
              {rightPanel === "activity" && (
                <div style={{ padding: "12px", borderTop: "1px solid var(--border-color)" }}>
                  <div className="rounded-[10px] overflow-hidden" style={{ border: "1px solid var(--border-color)", background: "var(--bg)" }}>
                    <div style={{ padding: "6px 10px", minHeight: 40 }}>
                      <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." rows={1}
                        style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "none", fontSize: 13.7, color: "var(--fg)", fontFamily: "inherit", lineHeight: "21px" }}
                      />
                    </div>
                    <div className="flex items-center justify-end" style={{ padding: "4px 8px" }}>
                      <button onClick={() => { if (commentText.trim()) { toast("Comment posted"); setCommentText(""); } }} className="flex items-center justify-center rounded-[7px]" style={{ height: 26, padding: "0 12px", background: "#0091FF", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 510, color: "#fff", fontFamily: "inherit" }}>
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right icon strip */}
            <div className="flex flex-col items-center gap-2 shrink-0 max-sm:hidden" style={{ width: 56, padding: "12px 6px", borderLeft: "1px solid var(--border-color)", background: "var(--bg)" }}>
              {[
                { id: "activity" as const, icon: "IconBubbleWide", label: "Activity", activeColor: "#0B68CB" },
                { id: "links" as const, icon: "IconChainLink1", label: "Links" },
              ].map((item, i) => {
                const active = rightPanel === item.id;
                return (
                  <div key={item.id}>
                    {i === 1 && <div style={{ width: 32, height: 1, background: "var(--border-color)", margin: "2px auto 4px" }} />}
                    <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setRightPanel(item.id)}>
                      <button className="flex items-center justify-center rounded-lg transition-colors" style={{ width: 32, height: 32, background: active ? "var(--accent)" : "none", border: "none", cursor: "pointer" }}>
                        <CentralIcon name={item.icon as any} size={16} color={active && item.activeColor ? item.activeColor : "var(--muted-fg)"} {...ci} />
                      </button>
                      <span style={{ fontSize: 10, fontWeight: 590, color: active && item.activeColor ? item.activeColor : "var(--muted-fg)" }}>{item.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
