import type { DataSource, TaskProvider } from "@/types/board-task";
import { useNotionTasks } from "@/hooks/use-notion-tasks";
import { useTrelloTasks } from "@/hooks/use-trello-tasks";

export function useBoardTasks(source: DataSource): TaskProvider {
  const notion = useNotionTasks(source === "notion");
  const trello = useTrelloTasks(source === "trello");
  return source === "trello" ? trello : notion;
}
