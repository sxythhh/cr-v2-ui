export interface BoardTask {
  id: string;
  title: string;
  status: string;
  area: string;
  owner: string;
  dueDate: string | null;
  notes: string;
  source: "notion" | "trello";
}

export type DataSource = "notion" | "trello";

export interface TaskProvider {
  tasks: BoardTask[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<BoardTask, "id" | "source">) => Promise<void>;
  updateTask: (id: string, updates: Partial<BoardTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}
