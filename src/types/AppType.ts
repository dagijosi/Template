import type { ComponentType } from "react";

/**
 * Represents the metadata for a route.
 * This interface uses an index signature to allow for flexible and custom metadata.
 * For example, you can add `protected: true` to a route's meta to indicate that it requires authentication.
 */
export interface RouteMeta {
  [key: string]: unknown;
}

/**
 * Represents a route in the application.
 */
export interface AppRoute {
  /**
   * The path for the route (e.g., "/home").
   */
  path?: string;
  /**
   * The React component to render for this route.
   */
  Component?: ComponentType;
  /**
   * If true, this route will be the default route for a parent route.
   */
  index?: boolean;
  /**
   * An array of child routes.
   */
  children?: AppRoute[];
  /**
   * An object containing metadata for the route.
   */
  meta?: RouteMeta;
}