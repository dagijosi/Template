import { type ComponentType, type JSX } from "react";
import RequireAuth from "../utils/RequireAuth";


export const guards: Record<string, ComponentType<{ children: JSX.Element }>> = {
  protected: RequireAuth,
  // Add other guards here, e.g., admin: AdminGuard
};