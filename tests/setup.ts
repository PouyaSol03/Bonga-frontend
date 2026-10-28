import { afterEach, beforeEach, expect, vi } from "vitest";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState(null, "", "/");
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.reject(new Error("Unexpected network request"))),
  );
});

afterEach(() => {
  vi.useRealTimers();
  expect(fetch).not.toHaveBeenCalled();
});
