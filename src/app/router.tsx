import type { ComponentType } from "react";
import type { RouteObject } from "react-router";
import { shortId } from "../features/items/format";
import App, { type RouteHandle } from "./App";
import RouteError from "./RouteError";

// Each page is its own chunk, loaded on first visit.
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <RouteError />,
    handle: { crumb: "Início" } satisfies RouteHandle,
    children: [
      { index: true, lazy: page(() => import("../pages/HomePage")) },
      {
        path: "itens",
        handle: { crumb: "Itens" } satisfies RouteHandle,
        children: [
          { index: true, lazy: page(() => import("../pages/ItemsPage")) },
          {
            path: "novo",
            handle: { crumb: "Novo item" } satisfies RouteHandle,
            lazy: page(() => import("../pages/CreateItemPage")),
          },
          {
            path: ":itemId",
            handle: { crumb: (params) => shortId(params.itemId ?? "") } satisfies RouteHandle,
            lazy: page(() => import("../pages/ItemDetailPage")),
          },
        ],
      },
      { path: "*", lazy: page(() => import("../pages/NotFoundPage")) },
    ],
  },
];
