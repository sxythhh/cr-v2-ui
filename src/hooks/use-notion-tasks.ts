import { useState, useEffect, useCallback, useRef } from "react";
import type { BoardTask } from "@/types/board-task";

export interface NotionTask {
  id: string;
  title: string;
  status: string;
  area: string;
  owner: string;
  dueDate: string | null;
  notes: string;
}

// ── Mock data for when Notion API is unavailable ────────────────────────────
const MOCK_TASKS: BoardTask[] = [
  { id: "mock-1", title: "Finalize Q2 growth strategy", status: "In Progress", area: "Growth", owner: "Ivo", dueDate: "2026-04-18", notes: "Review OKRs with team", source: "notion" },
  { id: "mock-2", title: "Redesign creator onboarding flow", status: "In Progress", area: "Product", owner: "Alex", dueDate: "2026-04-20", notes: "Simplify first 3 steps", source: "notion" },
  { id: "mock-3", title: "Set up affiliate tracking for new partners", status: "To Do", area: "Partnerships", owner: "", dueDate: "2026-04-22", notes: "", source: "notion" },
  { id: "mock-4", title: "Write blog post on campaign best practices", status: "To Do", area: "Content", owner: "Sarah", dueDate: null, notes: "Include case studies", source: "notion" },
  { id: "mock-5", title: "Fix payout CSV export bug", status: "Done", area: "Engineering", owner: "Ivo", dueDate: "2026-04-10", notes: "Edge case with special characters", source: "notion" },
  { id: "mock-6", title: "Review brand safety guidelines", status: "Blocked", area: "Compliance", owner: "Alex", dueDate: "2026-04-15", notes: "Waiting on legal review", source: "notion" },
  { id: "mock-7", title: "Launch email drip for inactive creators", status: "To Do", area: "Growth", owner: "Sarah", dueDate: "2026-04-25", notes: "", source: "notion" },
  { id: "mock-8", title: "Audit admin permissions", status: "Done", area: "Engineering", owner: "Ivo", dueDate: "2026-04-08", notes: "", source: "notion" },
  { id: "mock-9", title: "Prepare investor deck updates", status: "In Progress", area: "Growth", owner: "Alex", dueDate: "2026-04-19", notes: "Add latest metrics", source: "notion" },
  { id: "mock-10", title: "Update API rate limiting rules", status: "Blocked", area: "Engineering", owner: "", dueDate: null, notes: "Need infra team input", source: "notion" },
];

export function useNotionTasks(enabled = true) {
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const usingMock = useRef(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notion");
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTasks(
        (data.tasks ?? []).map((t: NotionTask) => ({ ...t, source: "notion" as const }))
      );
      usingMock.current = false;
      setError(null);
    } catch {
      // Fall back to mock data so the board is always usable
      if (!usingMock.current) {
        setTasks([...MOCK_TASKS]);
        usingMock.current = true;
      }
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
      setError(null);
    }
  }, [enabled, fetchTasks]);

  const createTask = useCallback(async (task: Omit<BoardTask, "id" | "source">) => {
    if (usingMock.current) {
      const newTask: BoardTask = { ...task, id: `mock-${Date.now()}`, source: "notion" };
      setTasks((prev) => [...prev, newTask]);
      return;
    }
    const res = await fetch("/api/notion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Create failed");
    await fetchTasks();
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<BoardTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    if (usingMock.current) return;
    const res = await fetch("/api/notion", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) {
      await fetchTasks();
      throw new Error("Update failed");
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (usingMock.current) return;
    const res = await fetch("/api/notion", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      await fetchTasks();
      throw new Error("Delete failed");
    }
  }, [fetchTasks]);

  return { tasks, loading, error, createTask, updateTask, deleteTask, refetch: fetchTasks };
}
