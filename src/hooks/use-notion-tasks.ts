import { useState, useEffect, useCallback } from "react";

export interface NotionTask {
  id: string;
  title: string;
  status: string;
  area: string;
  owner: string;
  dueDate: string | null;
  notes: string;
}

export function useNotionTasks() {
  const [tasks, setTasks] = useState<NotionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/notion");
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setTasks(data.tasks ?? []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = useCallback(async (task: Omit<NotionTask, "id">) => {
    const res = await fetch("/api/notion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Create failed");
    await fetchTasks();
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<NotionTask>) => {
    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    const res = await fetch("/api/notion", {
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
