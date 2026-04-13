import { useState, useEffect, useCallback } from "react";
import type { BoardTask } from "@/types/board-task";

export function useTrelloTasks(enabled = true) {
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/trello");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed: ${res.status}`);
      setTasks(data.tasks ?? []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
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
    const res = await fetch("/api/trello", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Create failed");
    await fetchTasks();
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<BoardTask>) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    const res = await fetch("/api/trello", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) {
      await fetchTasks(); // Revert on failure
      throw new Error("Update failed");
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    const res = await fetch("/api/trello", {
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
