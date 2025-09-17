import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask, removeTask } from "@/api/tasks";
import { type Task } from "@/data/tasks";

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, Omit<Task, "id" | "createdAt" | "updatedAt">, unknown>({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<Task | undefined, Error, { id: number; updatedFields: Partial<Omit<Task, "id" | "createdAt">> }, unknown>({
    mutationFn: ({ id, updatedFields }) => updateTask(id, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number, unknown>({
    mutationFn: removeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
