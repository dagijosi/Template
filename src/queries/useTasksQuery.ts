import { useQuery } from "@tanstack/react-query";
import { fetchTasks, fetchTaskById } from "@/api/tasks";

export const useTasksQuery = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
};

export const useTaskQuery = (id: number) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTaskById(id),
    enabled: !!id,
  });
};
