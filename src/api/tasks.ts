import { getTasks, getTask, addTask, deleteTask, editTask, type Task } from "@/data/tasks";

export const fetchTasks = async (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getTasks()), 500);
  });
};

export const fetchTaskById = async (id: number): Promise<Task | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getTask(id)), 500);
  });
};

export const createTask = async (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(addTask(newTask)), 500);
  });
};

export const updateTask = async (id: number, updatedFields: Partial<Omit<Task, "id" | "createdAt">>): Promise<Task | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(editTask(id, updatedFields)), 500);
  });
};

export const removeTask = async (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      deleteTask(id);
      resolve();
    }, 500);
  });
};
