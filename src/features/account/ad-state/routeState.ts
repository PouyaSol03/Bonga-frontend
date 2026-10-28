import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { USER } from "../../../shared/constants/roles.constants";
import "../../advertisements/components/AdCard.css";
import type { MyAdRouteState } from "./types";

export function getStateAdBackPath(routeState: MyAdRouteState, isAssigned = false) {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  if (currentPath.includes("/manage-ads") || currentPath.includes("/ad-management")) {
    return "/account/manage-ads";
  }

  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const returnTo = normalizeLocalPath(routeState.returnTo);

  const isValidReturnTo =
    returnTo && !returnTo.includes("/state-ad") && !returnTo.includes("/state-ads");

  if (isAssigned) {
    if (
      isValidReturnTo &&
      !returnTo.startsWith("/account/manage-ads") &&
      !returnTo.startsWith("/account/ad-management")
    ) {
      return returnTo;
    }
    return "/account/manage-ads";
  }

  if (isValidReturnTo) return returnTo;
  if (activeRole === USER || !activeRole) return "/account/manage-ads";

  return "/account/manage-ads";
}

export function normalizeLocalPath(path?: string) {
  if (!path || !path.startsWith("/")) return undefined;
  if (path.startsWith("//")) return undefined;

  return path;
}

export function readRouteState(): MyAdRouteState {
  const state = window.history.state;

  if (!state || typeof state !== "object") return {};

  const usr = (state as Record<string, unknown>).usr;
  if (usr && typeof usr === "object") {
    return { ...(state as MyAdRouteState), ...(usr as MyAdRouteState) };
  }

  return state as MyAdRouteState;
}

export function readAdIdFromPath() {
  const match = window.location.pathname.match(
    /^\/(?:account\/my-ads|account\/manage-ads|manage-ads)\/([^/]+)\/state-ads?\/?$/,
  );

  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}
