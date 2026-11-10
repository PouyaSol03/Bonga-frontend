import { describe, expect, it } from "vitest";
import {
  getNeighborhoodId,
  isDesktopDashboard,
  normalizeOptionalText,
  splitProfileName,
  toSelectedNeighborhood,
} from "../../src/features/dashboard/agent-profile/agentProfileHelpers";

describe("Agent Profile Modularization", () => {
  describe("agentProfileHelpers", () => {
    it("splits full profile name correctly", () => {
      expect(splitProfileName("علی موسوی")).toEqual({
        name: "علی",
        family: "موسوی",
      });
      expect(splitProfileName("رضا محمد حسینی")).toEqual({
        name: "رضا",
        family: "محمد حسینی",
      });
      expect(splitProfileName("سارا")).toEqual({
        name: "سارا",
        family: null,
      });
      expect(splitProfileName("   ")).toEqual({
        name: null,
        family: null,
      });
    });

    it("normalizes optional text", () => {
      expect(normalizeOptionalText("  hello  ")).toBe("hello");
      expect(normalizeOptionalText("   ")).toBeNull();
      expect(normalizeOptionalText("")).toBeNull();
    });

    it("extracts neighborhood id from dto", () => {
      expect(getNeighborhoodId({ id: 123, name: "ونک" })).toBe("123");
      expect(getNeighborhoodId({ _id: "abc-456", name: "تجریش" })).toBe("abc-456");
      expect(getNeighborhoodId({ name: "نیاوران" } as any)).toBe("نیاوران");
    });

    it("converts dto to SelectedNeighborhood", () => {
      expect(toSelectedNeighborhood({ id: 55, name: "سعادت آباد" })).toEqual({
        id: "55",
        name: "سعادت آباد",
      });
    });

    it("checks desktop dashboard default", () => {
      expect(isDesktopDashboard()).toBe(false);
    });
  });
});
