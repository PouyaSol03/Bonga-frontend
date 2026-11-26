import { beforeEach, describe, expect, it } from "vitest";
import {
  consumeInitialDeepLinkPath,
  getStoredInitialDeepLinkPath,
  initialDeepLinkStorageKey,
  isInternalAppPath,
  storeInitialDeepLinkPath,
} from "../../src/shared/lib/selectedCityStorage";

describe("Deep link preservation during initial city selection", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  describe("isInternalAppPath", () => {
    it("accepts valid internal paths", () => {
      expect(isInternalAppPath("/ads/361")).toBe(true);
      expect(isInternalAppPath("/agencies/10?tab=ads")).toBe(true);
      expect(isInternalAppPath("/search?city_id=1#map")).toBe(true);
      expect(isInternalAppPath("/")).toBe(true);
    });

    it("rejects non-string and external URLs", () => {
      expect(isInternalAppPath(null)).toBe(false);
      expect(isInternalAppPath(undefined)).toBe(false);
      expect(isInternalAppPath("https://google.com")).toBe(false);
      expect(isInternalAppPath("http://evil.com/ads")).toBe(false);
      expect(isInternalAppPath("//evil.com/ads")).toBe(false);
      expect(isInternalAppPath("/\\evil.com")).toBe(false);
      expect(isInternalAppPath("\\evil.com")).toBe(false);
      expect(isInternalAppPath("ads/361")).toBe(false);
    });
  });

  describe("store and consume deep link path", () => {
    it("stores valid deep link paths in sessionStorage", () => {
      storeInitialDeepLinkPath("/ads/361");
      expect(getStoredInitialDeepLinkPath()).toBe("/ads/361");
      expect(window.sessionStorage.getItem(initialDeepLinkStorageKey)).toBe("/ads/361");
    });

    it("does not store root, home, or onboarding as deep link", () => {
      storeInitialDeepLinkPath("/");
      expect(getStoredInitialDeepLinkPath()).toBe("");

      storeInitialDeepLinkPath("/home");
      expect(getStoredInitialDeepLinkPath()).toBe("");

      storeInitialDeepLinkPath("/onboarding");
      expect(getStoredInitialDeepLinkPath()).toBe("");
    });

    it("does not store external URLs", () => {
      storeInitialDeepLinkPath("https://attacker.com/exploit");
      expect(getStoredInitialDeepLinkPath()).toBe("");
    });

    it("consumes and clears the stored deep link", () => {
      storeInitialDeepLinkPath("/ads/105?source=shared#details");
      expect(consumeInitialDeepLinkPath()).toBe("/ads/105?source=shared#details");
      expect(consumeInitialDeepLinkPath()).toBe("");
      expect(getStoredInitialDeepLinkPath()).toBe("");
    });
  });

  describe("Deep link routing resolution logic", () => {
    it("resolves redirect target from query returnTo or consumed path", () => {
      const resolveRedirect = (queryReturnTo?: string | null) => {
        const queryTarget =
          queryReturnTo && isInternalAppPath(queryReturnTo) ? queryReturnTo : "";
        return queryTarget || consumeInitialDeepLinkPath() || "/home";
      };

      // 1. With returnTo in query
      expect(resolveRedirect("/ads/361")).toBe("/ads/361");

      // 2. With fallback to stored deep link when query is absent
      storeInitialDeepLinkPath("/agencies/42");
      expect(resolveRedirect(null)).toBe("/agencies/42");

      // 3. Defaults to /home when nothing is stored
      expect(resolveRedirect(null)).toBe("/home");

      // 4. Ignores unsafe open redirect in returnTo
      storeInitialDeepLinkPath("/ads/99");
      expect(resolveRedirect("https://malicious.com")).toBe("/ads/99");
    });
  });
});
