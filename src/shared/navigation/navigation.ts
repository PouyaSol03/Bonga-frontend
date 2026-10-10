const BONGA_ROUTE_CHANGE_EVENT = "bonga:route-change";

// Set on every history entry the app pushes. An entry carrying it was pushed
// from another in-app entry, so history.back() stays inside the app. The first
// entry of a session (typed URL, external link, new tab) never has it.
const BONGA_IN_APP_ENTRY_KEY = "__bongaInAppEntry";

let isHistoryNavigationPatched = false;

function withInAppEntryMarker(data: unknown, isInAppEntry: boolean) {
  if (data != null && !isRecord(data)) return data;

  const { [BONGA_IN_APP_ENTRY_KEY]: _marker, ...state } = data ?? {};

  return isInAppEntry ? { ...state, [BONGA_IN_APP_ENTRY_KEY]: true } : state;
}

function dispatchRouteChange() {
  window.dispatchEvent(new Event(BONGA_ROUTE_CHANGE_EVENT));
}

/**
 * Keep the SPA router in sync even when legacy screens call history.pushState /
 * history.replaceState directly instead of using pushRoute / replaceRoute.
 *
 * pushState/replaceState do not emit popstate by themselves, so without this a
 * URL can change while React keeps rendering the previous route until refresh.
 */
export function installHistoryNavigationBridge() {
  if (isHistoryNavigationPatched) return;

  isHistoryNavigationPatched = true;

  const nativePushState = window.history.pushState.bind(window.history);
  const nativeReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (data, unused, url) => {
    nativePushState(withInAppEntryMarker(data, true), unused, url);
    dispatchRouteChange();
  };

  window.history.replaceState = (data, unused, url) => {
    // Replacing keeps the entries before this one, so keep this entry's marker.
    nativeReplaceState(withInAppEntryMarker(data, canGoBackInApp()), unused, url);
    dispatchRouteChange();
  };
}

export const historyRouteChangeEvent = BONGA_ROUTE_CHANGE_EVENT;

const BONGA_BACK_TO_KEY = "__bongaBackTo";
const BONGA_BACK_STATE_KEY = "__bongaBackState";

type NavigationState = Record<string, unknown>;

function isRecord(value: unknown): value is NavigationState {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getCurrentFullPath() {
  return `${window.location.pathname || "/"}${window.location.search || ""}`;
}

function stripNavigationMeta(state: unknown) {
  if (!isRecord(state)) return undefined;

  const {
    [BONGA_BACK_TO_KEY]: _backTo,
    [BONGA_BACK_STATE_KEY]: _backState,
    [BONGA_IN_APP_ENTRY_KEY]: _inAppEntry,
    ...cleanState
  } = state;

  return cleanState;
}

/**
 * Whether the previous history entry belongs to this app, so history.back()
 * returns to an app page. history.length cannot answer this: it also counts
 * forward entries and pages from other sites.
 */
export function canGoBackInApp() {
  const state = window.history.state;

  return isRecord(state) && state[BONGA_IN_APP_ENTRY_KEY] === true;
}

export function isSafeAppPath(path: unknown): path is string {
  if (typeof path !== "string") return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.startsWith("/login")) return false;

  return true;
}

export function getStoredBackTarget() {
  const state = window.history.state;

  if (!isRecord(state)) {
    return null;
  }

  const backTo = state[BONGA_BACK_TO_KEY];

  if (!isSafeAppPath(backTo) || backTo === getCurrentFullPath()) {
    return null;
  }

  return {
    backState: stripNavigationMeta(state[BONGA_BACK_STATE_KEY]),
    backTo,
  };
}

export function createNavigationState(
  state?: unknown,
  options: { rememberCurrent?: boolean } = {},
) {
  const rememberCurrent = options.rememberCurrent ?? true;
  const nextState = isRecord(state) ? { ...stripNavigationMeta(state) } : {};

  if (!rememberCurrent) {
    return nextState;
  }

  const currentState = stripNavigationMeta(window.history.state);
  const currentPath = getCurrentFullPath();

  return {
    ...nextState,
    [BONGA_BACK_TO_KEY]: currentPath,
    [BONGA_BACK_STATE_KEY]: currentState,
  };
}

type RoutePrefetcher = (path: string) => void;
let activeRoutePrefetcher: RoutePrefetcher | null = null;

export function setRoutePrefetcher(prefetcher: RoutePrefetcher) {
  activeRoutePrefetcher = prefetcher;
}

export function prefetchRoute(path: string) {
  activeRoutePrefetcher?.(path);
}

export function pushRoute(
  path: string,
  state?: unknown,
  options?: { rememberCurrent?: boolean },
) {
  const currentPath = getCurrentFullPath();

  // Prevent accidental duplicate history entries when the same navigation is
  // triggered twice from nested click handlers (for example card + link).
  if (currentPath === path) {
    return;
  }

  prefetchRoute(path);
  window.history.pushState(createNavigationState(state, options), "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function replaceRoute(
  path: string,
  state?: unknown,
  options?: { rememberCurrent?: boolean },
) {
  window.history.replaceState(createNavigationState(state, options), "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/**
 * Return to the previous SPA history entry when the current screen was opened
 * through pushRoute. If the page was opened directly, replace it with the
 * fallback route instead of pushing another entry that would require an extra
 * Back click later.
 */
export function backRoute(fallbackPath: string, fallbackState?: unknown) {
  const storedBackTarget = getStoredBackTarget();

  if (storedBackTarget) {
    window.history.go(-1);
    return;
  }

  replaceRoute(fallbackPath, fallbackState, { rememberCurrent: false });
}

/**
 * Navigate back if the previous entry is an app page, otherwise navigate to
 * fallback path.
 */
export function goBackOrNavigate(fallbackPath: string) {
  if (typeof window !== "undefined" && canGoBackInApp()) {
    window.history.back();
    return;
  }
  replaceRoute(fallbackPath, undefined, { rememberCurrent: false });
}
