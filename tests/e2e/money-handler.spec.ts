import { test, expect } from "@playwright/test";
import {
  formatCardPrice,
  formatDetailPrice,
  formatBigNumber,
} from "../../src/shared/lib/MoneyHandler";

test.describe("MoneyHandler price formatting", () => {
  test.describe("formatCardPrice (summarize with 2 decimals max and slash separator)", () => {
    test("summarizes billions to 2 decimal places with rounding", () => {
      expect(formatCardPrice(1_560_000_000)).toBe("۱/۵۶ میلیارد");
      expect(formatCardPrice(1_569_000_000)).toBe("۱/۵۷ میلیارد");
      expect(formatCardPrice(2_000_000_000)).toBe("۲ میلیارد");
      expect(formatCardPrice(500_000_000)).toBe("۵۰۰ میلیون");
    });

    test("summarizes millions to 2 decimal places with rounding", () => {
      expect(formatCardPrice(1_560_000)).toBe("۱/۵۶ میلیون");
      expect(formatCardPrice(50_000_000)).toBe("۵۰ میلیون");
      expect(formatCardPrice(35_556_546)).toBe("۳۵/۵۶ میلیون");
    });

    test("summarizes hemmat to 2 decimal places with rounding", () => {
      expect(formatCardPrice(1_560_000_000_000)).toBe("۱/۵۶ همت");
      expect(formatCardPrice(2_000_000_000_000)).toBe("۲ همت");
    });

    test("handles sub-million and edge cases", () => {
      expect(formatCardPrice(0)).toBe("۰");
      expect(formatCardPrice(undefined)).toBe("توافقی");
      expect(formatCardPrice("")).toBe("توافقی");
      expect(formatCardPrice("توافقی")).toBe("توافقی");
    });
  });

  test.describe("formatDetailPrice (exact real value when card is opened)", () => {
    test("shows full detailed breakdown for billions", () => {
      expect(formatDetailPrice(1_560_000_000)).toBe("۱ میلیارد و ۵۶۰ میلیون");
      expect(formatDetailPrice(1_569_000_000)).toBe("۱ میلیارد و ۵۶۹ میلیون");
      expect(formatDetailPrice(2_000_000_000)).toBe("۲ میلیارد");
    });

    test("shows full detailed breakdown for arbitrary rents", () => {
      expect(formatDetailPrice(5_646_546)).toBe("۵ میلیون و ۶۴۶ هزار و ۵۴۶");
    });

    test("handles zero and fallback", () => {
      expect(formatDetailPrice(0)).toBe("۰");
      expect(formatDetailPrice(undefined)).toBe("توافقی");
    });
  });
});
