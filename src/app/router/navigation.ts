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
