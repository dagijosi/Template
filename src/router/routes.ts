import Home from "../pages/Home";
import Protected from "../pages/Protected";
import ErrorPage from "../utils/ErrorPage";
import MainLayout from "./Layout";

import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ItemAdd from "../pages/items/ItemAdd";
import Items from "../pages/items/Items";
import ItemView from "../pages/items/ItemView";
import ItemEdit from "../pages/items/ItemEdit";
import AIDemo from "../pages/AIDemo";
import Tasks from "../pages/tasks/Tasks";
import TaskAdd from "../pages/tasks/TaskAdd";
import TaskEdit from "../pages/tasks/TaskEdit";
import TaskView from "../pages/tasks/TaskView";
import type { AppRoute } from "../types/AppType";

export const ROUTES = {
  PROTECTED: "/protected",
  SIGNUP: "/signup",
  LOGIN: "/login",
  ERROR: "*",
  ITEMS: "items",
  ITEM_ADD: "add",
  ITEM_VIEW: ":id",
  ITEM_EDIT: ":id/edit",
  TASKS: "tasks",
  TASK_ADD: "add",
  TASK_VIEW: ":id",
  TASK_EDIT: ":id/edit",
} as const;

const routes: AppRoute[] = [
  { path: ROUTES.ERROR, Component: ErrorPage },
  {
    Component: MainLayout,
    path: "/",
    meta: { layout: true },
    children: [
      { index: true, Component: Home },
      { path: ROUTES.PROTECTED, Component: Protected, meta: { protected: true } },
      {
        path: ROUTES.ITEMS,
        children: [
          { index: true, Component: Items },
          { path: ROUTES.ITEM_ADD, Component: ItemAdd },
          { path: ROUTES.ITEM_VIEW, Component: ItemView },
          { path: ROUTES.ITEM_EDIT, Component: ItemEdit },
        ],
      },
      {
        path: ROUTES.TASKS,
        children: [
          { index: true, Component: Tasks },
          { path: ROUTES.TASK_ADD, Component: TaskAdd },
          { path: ROUTES.TASK_VIEW, Component: TaskView },
          { path: ROUTES.TASK_EDIT, Component: TaskEdit },
        ],
      },
      { path: "/ai-demo", Component: AIDemo },
    ],
  },
  { path: ROUTES.SIGNUP, Component: Signup },
  { path: ROUTES.LOGIN, Component: Login },
];


export default routes;
