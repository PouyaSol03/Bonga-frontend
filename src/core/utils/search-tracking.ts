const SEARCH_TRACKING_TOKEN_KEY = "__bongaSearchTrackingToken";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createSearchTrackingToken(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function withSearchTrackingIntent(state?: unknown): Record<string, unknown> {
  return {
    ...(isRecord(state) ? state : {}),
    [SEARCH_TRACKING_TOKEN_KEY]: createSearchTrackingToken(),
  };
}

export function consumeSearchTrackingIntent(): string | undefined {
  const state = window.history.state;
  if (!isRecord(state)) return undefined;

  const token = state[SEARCH_TRACKING_TOKEN_KEY];
  if (typeof token !== "string" || !token) return undefined;

  const nextState = { ...state };
  delete nextState[SEARCH_TRACKING_TOKEN_KEY];
  window.history.replaceState(nextState, "", window.location.href);

  return token;
}
