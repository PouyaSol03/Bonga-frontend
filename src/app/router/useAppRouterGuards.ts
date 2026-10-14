import { useEffect, useState } from "react";
import type { NavigateFunction, Location } from "react-router";
import {
  getActiveAuthRole,
  getStoredAuthSession,
  storeLoginRedirectPath,
  type AuthSession,
} from "../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";
import {
  canAccessRoute,
  CRM_PATH,
  DASHBOARD_PATH,
  getDefaultCrmPath,
  LOGIN_PATH,
  preloadRoute,
  type AppRoute,
} from "./routes";
import { hasStoredCity, getLoginRequiredPath, isLoginFlowPath } from "./routerGuards";

export function useAppRouterGuards(
  canonicalPath: string,
  currentPath: string,
  route: AppRoute,
  isAccessDenied: boolean,
  authSession: AuthSession | null,
  location: Location,
  navigate: NavigateFunction,
) {
  const [isOffline, setIsOffline] = useState(() => !window.navigator.onLine);

  // Redirect legacy dashboard paths
  useEffect(() => {
    if (canonicalPath !== currentPath) {
      navigate(`${canonicalPath}${location.search}${location.hash}`, { replace: true });
    }
  }, [canonicalPath, currentPath, location.search, location.hash, navigate]);

  // Handle route guards and redirections
  useEffect(() => {
    const hasCity = hasStoredCity();
    const isOnboardingCitySelection =
      canonicalPath === "/" && new URLSearchParams(location.search).get("city") === "1";

    if (!hasCity && !isLoginFlowPath(canonicalPath)) {
      if (canonicalPath !== "/" || location.search || location.hash) {
        navigate("/", { replace: true });
      }
      return;
    }

    const session = getStoredAuthSession();

    if (session && isLoginFlowPath(canonicalPath)) {
      navigate("/account", { replace: true });
      return;
    }

    if (canonicalPath === "/login") {
      navigate(LOGIN_PATH, { replace: true });
      return;
    }

    if (canonicalPath === "/" && !isOnboardingCitySelection) {
      navigate("/home", { replace: true });
      return;
    }

    const returnTo = `${canonicalPath}${location.search}`;
    if (
      route.Component &&
      route.path !== "not-found" &&
      canonicalPath.startsWith("/account") &&
      canonicalPath !== "/account" &&
      canonicalPath !== "/account/identity" &&
      !session
    ) {
      storeLoginRedirectPath(returnTo);
      navigate(getLoginRequiredPath(returnTo), { replace: true });
      return;
    }

    if (!canAccessRoute(route, session)) {
      if (!session) {
        storeLoginRedirectPath(returnTo);
        navigate(getLoginRequiredPath(returnTo), { replace: true });
        return;
      }

      if (canonicalPath === CRM_PATH || canonicalPath.startsWith(`${CRM_PATH}/`)) {
        navigate("/403", { replace: true });
        return;
      }
    }

    if (canonicalPath === CRM_PATH && session) {
      const defaultCrmPath = getDefaultCrmPath(session);
      if (defaultCrmPath !== CRM_PATH) {
        navigate(defaultCrmPath, { replace: true });
        return;
      }
    }
  }, [canonicalPath, location.search, location.hash, route, navigate]);

  // Set document title
  useEffect(() => {
    document.title = `بنگاه | ${route.title}`;
  }, [route.title]);

  // Handle access denied dashboard fallback
  useEffect(() => {
    if (!isAccessDenied || !canonicalPath.startsWith(`${DASHBOARD_PATH}/`)) {
      return;
    }

    const activeRole = getActiveAuthRole(authSession);
    const fallbackPath =
      activeRole === REAL_ESTATE_MANAGER
        ? `${DASHBOARD_PATH}/agency`
        : activeRole === REAL_ESTATE_CONSULTANT || activeRole === INDEPENDENT_CONSULTANT
          ? `${DASHBOARD_PATH}/agent`
          : "/account";

    if (fallbackPath !== canonicalPath) {
      navigate(fallbackPath, { replace: true });
    }
  }, [authSession, isAccessDenied, canonicalPath, navigate]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Preload and scroll to top on route change
  useEffect(() => {
    preloadRoute(canonicalPath);
    window.scrollTo({ top: 0 });
  }, [canonicalPath]);

  return { isOffline, setIsOffline };
}
