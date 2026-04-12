// @ts-nocheck
"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useNotionWorkspace, type NotionPageDetail, type NotionPageSummary } from "@/hooks/use-notion-workspace";
import { NotionMarkdown } from "@/components/admin/notion/NotionMarkdown";
import { NotionBreadcrumb } from "@/components/admin/notion/NotionBreadcrumb";

/* ═══════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════ */
function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const show = useCallback((message: string, type: "error" | "success" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);
  const Toast = toast ? (
    <div className={cn(
      "fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-lg border px-4 py-2.5 text-[13px] font-medium shadow-xl",
      toast.type === "error"
        ? "border-red-500/20 bg-red-500/10 text-red-400"
        : "border-green-500/20 bg-green-500/10 text-green-400"
    )}>
      {toast.message}
    </div>
  ) : null;
  return { show, Toast };
}

/* ═══════════════════════════════════════════════════
   PAGE TREE (Left Panel) — nested with expand/collapse
   ═══════════════════════════════════════════════════ */

function buildTree(pages: NotionPageSummary[]): (NotionPageSummary & { children: NotionPageSummary[] })[] {
  const byId = new Map(pages.map((p) => [p.id, { ...p, children: [] as NotionPageSummary[] }]));
  const roots: (NotionPageSummary & { children: NotionPageSummary[] })[] = [];
  for (const page of pages) {
    const node = byId.get(page.id)!;
    if (page.parentId && byId.has(page.parentId)) {
      byId.get(page.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function TreeItem({
  page,
  depth,
  activeId,
  expanded,
  onToggle,
  onSelect,
  children: childNodes,
}: {
  page: NotionPageSummary & { children: NotionPageSummary[] };
  depth: number;
  activeId: string | null;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  children?: React.ReactNode;
}) {
  const hasChildren = page.children.length > 0;
  const isExpanded = expanded.has(page.id);

  return (
    <div>
      <button
        onClick={() => onSelect(page.id)}
        className={cn(
          "group flex w-full items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left transition-colors",
          activeId === page.id
            ? "bg-[#f6850f]/10 text-white"
            : "text-white/60 hover:bg-white/[0.04] hover:text-white/80"
        )}
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        {/* Expand chevron */}
        <button
          onClick={(e) => { e.stopPropagation(); if (hasChildren) onToggle(page.id); }}
          className={cn("flex size-4 shrink-0 items-center justify-center rounded transition-colors", hasChildren ? "text-white/30 hover:text-white/50" : "text-transparent")}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={cn("transition-transform", isExpanded && "rotate-90")}>
            <path d="M3.5 1.5L7 5l-3.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="w-4 shrink-0 text-center text-[13px]">
          {page.icon ?? (page.type === "database" ? "📊" : "📄")}
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{page.title}</span>
        {page.type === "database" && (
          <span className="shrink-0 rounded bg-[#f6850f]/15 px-1 py-0.5 text-[9px] font-medium text-[#f6850f]">DB</span>
        )}
      </button>
      {isExpanded && hasChildren && (
        <div>
          {page.children.map((child) => (
            <TreeItem
              key={child.id}
              page={child as any}
              depth={depth + 1}
              activeId={activeId}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PageTree({
  pages,
  loading,
  searchQuery,
  setSearchQuery,
  activeId,
  onSelect,
  onCreatePage,
  onRefresh,
}: {
  pages: NotionPageSummary[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreatePage: () => void;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const tree = useMemo(() => buildTree(pages), [pages]);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="flex h-full flex-col border-r border-white/[0.06]">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] px-3">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white/50">
            <path d="M3 3h4v4H3V3ZM9 3h4v4H9V3ZM3 9h4v4H3V9ZM9 9h4v4H9V9Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[13px] font-semibold text-white/80">Notion</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onRefresh} className="flex size-7 items-center justify-center rounded-md text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/50" title="Refresh">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.75 7A5.25 5.25 0 0 1 11.5 4M12.25 7A5.25 5.25 0 0 1 2.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M9.5 4h2.25V1.75M4.5 10H2.25v2.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button onClick={onCreatePage} className="flex size-7 items-center justify-center rounded-md text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/50" title="New page">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 border-b border-white/[0.06] p-2">
        <div className="flex h-7 items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-white/25">
            <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/20"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-white/25 hover:text-white/40">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: "none" }}>
        {loading && pages.length === 0 ? (
          <div className="flex flex-col gap-1.5 p-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-7 animate-pulse rounded-md bg-white/[0.03]" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="p-6 text-center text-[12px] text-white/25">No pages found</div>
        ) : searchQuery ? (
          // Flat list when searching
          <div className="flex flex-col gap-0.5 px-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => onSelect(page.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
                  activeId === page.id ? "bg-[#f6850f]/10 text-white" : "text-white/60 hover:bg-white/[0.04]"
                )}
              >
                <span className="w-4 shrink-0 text-center text-[13px]">{page.icon ?? "📄"}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{page.title}</span>
              </button>
            ))}
          </div>
        ) : (
          // Nested tree
          <div className="px-1">
            {tree.map((page) => (
              <TreeItem
                key={page.id}
                page={page}
                depth={0}
                activeId={activeId}
                expanded={expanded}
                onToggle={toggleExpand}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.06] px-3 py-2">
        <span className="text-[10px] text-white/20">{pages.length} pages {loading && " syncing..."}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CREATE PAGE MODAL
   ═══════════════════════════════════════════════════ */

function CreatePageModal({ onClose, onCreate }: { onClose: () => void; onCreate: (title: string) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      await onCreate(title.trim());
      onClose();
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/[0.08] bg-[#1a1a1a] p-5 shadow-2xl">
        <h3 className="mb-4 text-[14px] font-semibold text-white">New Page</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Page title..."
          autoFocus
          className="mb-4 h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-[13px] text-white outline-none placeholder:text-white/25 focus:border-[#f6850f]/40"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="h-8 rounded-lg px-3 text-[12px] font-medium text-white/40 hover:bg-white/[0.04]">Cancel</button>
          <button onClick={handleSubmit} disabled={creating || !title.trim()} className="h-8 rounded-lg bg-[#f6850f] px-4 text-[12px] font-semibold text-white disabled:opacity-50">
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   DELETE CONFIRM
   ═══════════════════════════════════════════════════ */

function DeleteConfirm({ title, onClose, onConfirm }: { title: string; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/[0.08] bg-[#1a1a1a] p-5 shadow-2xl">
        <h3 className="mb-2 text-[14px] font-semibold text-white">Archive page?</h3>
        <p className="mb-4 text-[13px] text-white/50">"{title}" will be moved to Notion's trash.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="h-8 rounded-lg px-3 text-[12px] font-medium text-white/40 hover:bg-white/[0.04]">Cancel</button>
          <button
            onClick={async () => { setDeleting(true); await onConfirm(); }}
            disabled={deleting}
            className="h-8 rounded-lg bg-red-500/80 px-4 text-[12px] font-semibold text-white disabled:opacity-50"
          >
            {deleting ? "Archiving..." : "Archive"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE VIEWER (Right Panel)
   ═══════════════════════════════════════════════════ */

function PageViewer({
  detail,
  loading,
  breadcrumb,
  onNavigate,
  onSave,
  onDelete,
  onEditStateChange,
}: {
  detail: NotionPageDetail | null;
  loading: boolean;
  breadcrumb: NotionPageSummary[];
  onNavigate: (id: string) => void;
  onSave: (id: string, updates: { title?: string; markdown?: string }) => Promise<void>;
  onDelete: (id: string) => void;
  onEditStateChange?: (editing: boolean) => void;
}) {
  const [editing, setEditingLocal] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  const setEditing = useCallback((v: boolean) => {
    setEditingLocal(v);
    onEditStateChange?.(v);
  }, [onEditStateChange]);

  // Reset edit state when page changes
  useEffect(() => { setEditing(false); }, [detail?.id, setEditing]);

  const startEdit = () => {
    if (!detail) return;
    setEditContent(detail.markdown);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!detail) return;
    setSaving(true);
    try {
      await onSave(detail.id, { markdown: editContent });
      setEditing(false);
    } catch {
      // keep editing on failure
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-white/10 border-t-[#f6850f]" />
          <span className="text-[13px] text-white/30">Loading page...</span>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-white/10">
            <rect x="6" y="6" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
            <path d="M14 16h12M14 20h8M14 24h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[14px] font-medium text-white/25">Select a page to view</span>
          <span className="text-[12px] text-white/15">Browse your Notion workspace</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <NotionBreadcrumb trail={breadcrumb} onNavigate={onNavigate} />
          <div className="flex items-center gap-2">
            {detail.icon && <span className="text-[16px]">{detail.icon}</span>}
            <h1 className="truncate text-[15px] font-semibold text-white">{detail.title}</h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="h-7 rounded-md px-2.5 text-[12px] font-medium text-white/40 hover:bg-white/[0.04]">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="h-7 rounded-md bg-[#f6850f] px-3 text-[12px] font-semibold text-white disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <>
              <button onClick={startEdit} className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.06] px-2 text-[11px] font-medium text-white/40 hover:bg-white/[0.04] hover:text-white/60">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M7.5 1.5C7.83 1.17 8.28.98 8.75.98c.47 0 .92.19 1.25.52.69.69.69 1.81 0 2.5L3.75 10.25h-2.5v-2.5l6.25-6.25z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Edit
              </button>
              <button onClick={() => onDelete(detail.id)} className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.06] px-2 text-[11px] font-medium text-white/40 hover:bg-red-500/10 hover:text-red-400">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M4.5 3V2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M9.5 3v7a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Archive
              </button>
              {detail.url && (
                <a href={detail.url} target="_blank" rel="noopener noreferrer" className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.06] px-2 text-[11px] font-medium text-white/40 hover:bg-white/[0.04] hover:text-white/60">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M9 6.5v3a1 1 0 0 1-1 1H2.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3M7.5 1.5h3m0 0v3m0-3L5.75 6.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Notion
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="mx-auto max-w-[720px] px-8 py-6">
          {editing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[500px] w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.03] p-4 font-mono text-[13px] leading-relaxed text-white/80 outline-none focus:border-[#f6850f]/30"
              style={{ scrollbarWidth: "none" }}
            />
          ) : detail.markdown ? (
            <NotionMarkdown content={detail.markdown} />
          ) : (
            <p className="text-[13px] text-white/25">This page has no content.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.06] px-5 py-2">
        <span className="text-[10px] text-white/15">
          Last edited {new Date(detail.lastEdited).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */

export default function NotionWorkspacePage() {
  const { pages, loading, error: fetchError, searchQuery, setSearchQuery, fetchPages, fetchPageDetail, updatePage, getBreadcrumb } = useNotionWorkspace();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detail, setDetail] = useState<NotionPageDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const { show: showToast, Toast } = useToast();

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(() => fetchPages(searchQuery), 60000);
    return () => clearInterval(interval);
  }, [fetchPages, searchQuery]);

  // Show fetch errors
  useEffect(() => {
    if (fetchError) showToast(`Failed to load pages: ${fetchError}`);
  }, [fetchError, showToast]);

  const handleSelect = useCallback(async (id: string) => {
    // Warn about unsaved edits
    if (editing) {
      if (!window.confirm("You have unsaved changes. Discard them?")) return;
      setEditing(false);
    }
    setActiveId(id);
    setDetailLoading(true);
    try {
      const d = await fetchPageDetail(id);
      setDetail(d);
    } catch (err: any) {
      setDetail(null);
      showToast(`Failed to load page: ${err.message}`);
    } finally {
      setDetailLoading(false);
    }
  }, [fetchPageDetail, editing, showToast]);

  const handleSave = useCallback(async (id: string, updates: { title?: string; markdown?: string }) => {
    try {
      await updatePage(id, updates);
      const d = await fetchPageDetail(id);
      setDetail(d);
      setEditing(false);
      showToast("Saved to Notion", "success");
    } catch (err: any) {
      showToast(`Save failed: ${err.message}`);
      throw err; // let viewer keep edit mode
    }
  }, [updatePage, fetchPageDetail, showToast]);

  const handleCreate = useCallback(async (title: string) => {
    try {
      const res = await fetch("/api/notion/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Create failed");
      const { id } = await res.json();
      await fetchPages(searchQuery);
      showToast("Page created", "success");
      if (id) handleSelect(id);
    } catch (err: any) {
      showToast(`Failed to create page: ${err.message}`);
    }
  }, [fetchPages, searchQuery, handleSelect, showToast]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/notion/workspace/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Archive failed");
      if (activeId === deleteTarget.id) {
        setActiveId(null);
        setDetail(null);
      }
      setDeleteTarget(null);
      await fetchPages(searchQuery);
      showToast("Page archived", "success");
    } catch (err: any) {
      showToast(`Failed to archive: ${err.message}`);
      setDeleteTarget(null);
    }
  }, [deleteTarget, activeId, fetchPages, searchQuery, showToast]);

  return (
    <div className="flex h-full bg-[#111] font-inter tracking-[-0.02em]">
      <div className="w-[280px] shrink-0">
        <PageTree
          pages={pages}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeId={activeId}
          onSelect={handleSelect}
          onCreatePage={() => setShowCreate(true)}
          onRefresh={() => fetchPages(searchQuery)}
        />
      </div>

      <PageViewer
        detail={detail}
        loading={detailLoading}
        breadcrumb={activeId ? getBreadcrumb(activeId) : []}
        onNavigate={handleSelect}
        onSave={handleSave}
        onDelete={(id) => setDeleteTarget({ id, title: detail?.title ?? "this page" })}
        onEditStateChange={setEditing}
      />

      {showCreate && <CreatePageModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {deleteTarget && <DeleteConfirm title={deleteTarget.title} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />}
      {Toast}
    </div>
  );
}
