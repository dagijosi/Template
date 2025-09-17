export type Task = {
  id: number;
  name: string;
  description?: string;
  dueDate?: string; // ISO format "2025-09-17"
  priority?: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  category?: string;
  tags?: string[];
  recurrence?: "none" | "daily" | "weekly" | "monthly";
  createdAt: string;
  updatedAt: string;
};

let tasks: Task[] = [
  {
    id: 1,
    name: "Complete project proposal",
    description: "Draft and finalize the project proposal document.",
    dueDate: "2025-09-20",
    priority: "high",
    status: "in-progress",
    category: "Work",
    tags: ["documentation", "urgent"],
    recurrence: "none",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Buy groceries",
    description: "Milk, eggs, bread, and vegetables.",
    dueDate: "2025-09-18",
    priority: "medium",
    status: "pending",
    category: "Personal",
    tags: ["shopping"],
    recurrence: "weekly",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Schedule dentist appointment",
    description: "Call the dentist to schedule a check-up.",
    dueDate: "2025-09-25",
    priority: "low",
    status: "completed",
    category: "Health",
    tags: ["appointment"],
    recurrence: "none",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getTasks = (): Task[] => tasks;

export const getTask = (id: number): Task | undefined =>
  tasks.find((task) => task.id === id);

export const addTask = (newTask: Omit<Task, "id" | "createdAt" | "updatedAt">): Task => {
  const task: Task = {
    id: Math.max(0, ...tasks.map((t) => t.id)) + 1,
    ...newTask,
    status: newTask.status || "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
};

export const deleteTask = (id: number): void => {
  tasks = tasks.filter((task) => task.id !== id);
};

export const editTask = (id: number, updatedFields: Partial<Omit<Task, "id" | "createdAt">>): Task | undefined => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex > -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };
    return tasks[taskIndex];
  }
  return undefined;
};
