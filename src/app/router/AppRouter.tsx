import { type ReactNode, Suspense, useLayoutEffect, useMemo  } from "react";

import { BrowserRouter, matchPath, useLocation, useNavigate } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getStoredAuthSession } from "../../shared/auth/auth-storage";
import { MobileAppShell } from "../layout/MobileAppShell";
import {
  AccessDeniedState,
  NoConnectionState,
  NotFoundErrorState,
} from "../../shared/components/ErrorState";
import { canAccessRoute, lazyNamed, preloadRoute, routes, type AppRoute } from "./routes";
import type { CrmRoutePageProps } from "../../features/crm/CrmLayout";
import {
  installHistoryNavigationBridge,
  setRoutePrefetcher,
  setRouterNavigate,
} from "../../shared/navigation/navigation";
import { getAppChromeConfig } from "./routeChrome";
import { IdentityGate } from "../../features/account/components/IdentityGate";
import {
  normalizePathname,
  getCanonicalDashboardPath,
  shouldRequireIdentityForPath,
} from "./routerGuards";
import { useAppRouterGuards } from "./useAppRouterGuards";
import { renderWithChrome } from "./renderWithChrome";
import { NotificationTopBarIcon } from "./NotificationTopBarIcon";

installHistoryNavigationBridge();
setRoutePrefetcher(preloadRoute);

function RouteNotFoundPage() {
  return <NotFoundErrorState />;
}

const CrmLayout = lazyNamed(() => import("../../features/crm/CrmLayout"), "CrmLayout");

function AppRouterInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    setRouterNavigate((to, opts) => {
      if (typeof to === "number") {
        navigate(to);
      } else {
        navigate(to, opts);
      }
    });
    return () => setRouterNavigate(null);
  }, [navigate]);

  const currentPath = normalizePathname(location.pathname);
  const canonicalPath = getCanonicalDashboardPath(currentPath);

  const matchedRoute = useMemo((): AppRoute | null => {
    for (const r of routes) {
      if (matchPath(r.path, canonicalPath) || matchPath(r.path, currentPath)) {
        return r;
      }
    }
    return null;
  }, [canonicalPath, currentPath]);

  const route: AppRoute = matchedRoute ?? {
    path: "not-found",
    title: "صفحه پیدا نشد",
    Component: RouteNotFoundPage,
  };

  const authSession = getStoredAuthSession();
  const isAccessDenied = Boolean(authSession && !canAccessRoute(route, authSession));
  const requiresIdentity = Boolean(
    authSession &&
    !isAccessDenied &&
    route.Component !== RouteNotFoundPage &&
    shouldRequireIdentityForPath(canonicalPath),
  );

  const { isOffline, setIsOffline } = useAppRouterGuards(
    canonicalPath,
    currentPath,
    route,
    isAccessDenied,
    authSession,
    location,
    navigate,
  );

  if (isOffline) {
    return (
      <MobileAppShell>
        <NoConnectionState onRetry={() => setIsOffline(!window.navigator.onLine)} />
      </MobileAppShell>
    );
  }

  if (isAccessDenied) {
    return (
      <MobileAppShell>
        <AccessDeniedState onBack={() => navigate("/account")} />
      </MobileAppShell>
    );
  }

  const ActivePage = route.Component;
  const activePage = (
    <Suspense fallback={<div className="bg-surface-container min-h-0 flex-1" />}>
      <ActivePage />
    </Suspense>
  );

  const page = requiresIdentity ? (
    <IdentityGate title={route.title}>{activePage}</IdentityGate>
  ) : (
    activePage
  );

  if (route.layout === "crm") {
    return (
      <Suspense fallback={<div className="bg-surface-container h-screen w-full" />}>
        <CrmLayout
          contentKey={canonicalPath}
          renderContent={(viewProps: CrmRoutePageProps) => (
            <Suspense
              fallback={<div className="bg-surface-container-lowest h-full min-h-80 rounded-xl" />}
            >
              <ActivePage {...viewProps} />
            </Suspense>
          )}
          section={route.crmSection ?? "overview"}
        />
      </Suspense>
    );
  }

  const isCrmAdvertiseFlowRoute =
    canonicalPath.startsWith("/new-ad") &&
    new URLSearchParams(location.search).get("editSource") === "crm";

  if (isCrmAdvertiseFlowRoute) {
    return (
      <Suspense fallback={<div className="bg-surface-container h-screen w-full" />}>
        <CrmLayout embeddedContent={page} section="advertises" />
      </Suspense>
    );
  }

  const chromeConfig = getAppChromeConfig(canonicalPath, route.title, <NotificationTopBarIcon />);

  const content: ReactNode = renderWithChrome(
    page,
    chromeConfig,
    canonicalPath,
    `${location.pathname}${location.search}`,
  );

  return (
    <MobileAppShell>
      <div className="bg-surface-container-lowest relative grid h-full w-full grid-cols-1 grid-rows-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={canonicalPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" as const }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.2, ease: "easeInOut" }}
            className="col-start-1 row-start-1 flex h-full min-h-0 w-full flex-col overflow-hidden"
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </MobileAppShell>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRouterInner />
    </BrowserRouter>
  );
}
