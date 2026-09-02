const BONGA_ROUTE_CHANGE_EVENT = "bonga:route-change";

let isHistoryNavigationPatched = false;

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
    nativePushState(data, unused, url);
    dispatchRouteChange();
  };

  window.history.replaceState = (data, unused, url) => {
    nativeReplaceState(data, unused, url);
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
    ...cleanState
  } = state;

  return cleanState;
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
