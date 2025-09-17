import type { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { AppRoute } from "../types/AppType";
import { guards } from "./guards";
import routes from "./routes";

const renderRoute = ({ path, Component, children, index, meta }: AppRoute, idx: number): JSX.Element => {
  const key = path || `index-${idx}`;

  let element: JSX.Element | undefined = undefined;
  if (Component) {
    element = <Component />;
    if (meta) {
      for (const key in meta) {
        if (guards[key]) {
          const Guard = guards[key];
          element = <Guard>{element}</Guard>;
        }
      }
    }
  }

  if (index) {
    return <Route key={key} index element={element} />;
  }

  return (
    <Route key={key} path={path} element={element}>
      {children && children.map(renderRoute)}
    </Route>
  );
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>{routes.map(renderRoute)}</Routes>
    </BrowserRouter>
  );
};
