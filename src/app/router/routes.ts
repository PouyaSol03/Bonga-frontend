import { matchPath } from "react-router";
import { type AppRoute } from "./types";
import { publicRoutes } from "./publicRoutes";
import { authRoutes } from "./authRoutes";
import { newAdRoutes } from "./newAdRoutes";
import { accountRoutes } from "./accountRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { crmRoutes } from "./crmRoutes";

export * from "./types";
export { publicRoutes } from "./publicRoutes";
export { authRoutes } from "./authRoutes";
export { newAdRoutes } from "./newAdRoutes";
export { accountRoutes } from "./accountRoutes";
export { dashboardRoutes } from "./dashboardRoutes";
export { crmRoutes } from "./crmRoutes";
export { getDefaultCrmPath } from "./crmRoutes";

export const routes: AppRoute[] = [
  ...publicRoutes,
  ...authRoutes,
  ...newAdRoutes,
  ...accountRoutes,
  ...dashboardRoutes,
  ...crmRoutes,
];

export function preloadRoute(pathname: string) {
  const normalized = pathname.split("?")[0].split("#")[0];
  for (const route of routes) {
    if (matchPath(route.path, normalized)) {
      const preload = (route.Component as any)?.preload;
      if (typeof preload === "function") {
        preload();
      }
      break;
    }
  }
}
