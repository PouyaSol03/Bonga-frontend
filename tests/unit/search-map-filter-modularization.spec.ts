import { describe, expect, it } from "vitest";
import {
  formatAreaValue,
  formatGroupedNumber,
  getSheetTitle,
  normalizeChoiceValue,
  normalizeNumber,
  splitParam,
} from "../../src/features/search/components/quick-filter/quickFilterHelpers";
import { applyQuickFilterToParams } from "../../src/features/search/components/quick-filter/quickFilterParams";

describe("Search Map Quick Filter Modularization", () => {
  it("normalizes numbers and formats values correctly", () => {
    expect(normalizeNumber("۱۲۳.۴۵")).toBe("123.45");
    expect(formatAreaValue("۱۵۰")).toBe("۱۵۰");
    expect(formatGroupedNumber("1000000")).toBe("۱٬۰۰۰٬۰۰۰");
  });

  it("normalizes choice values accurately", () => {
    expect(normalizeChoiceValue("همکف")).toBe("0");
    expect(normalizeChoiceValue("بدون اتاق")).toBe("0");
    expect(normalizeChoiceValue("۲ اتاق")).toBe("2");
    expect(normalizeChoiceValue("۵+ سال")).toBe("5");
  });

  it("splits search params cleanly", () => {
    expect(splitParam("n1_n2،n3,n4")).toEqual(["n1", "n2", "n3", "n4"]);
    expect(splitParam(null)).toEqual([]);
  });

  it("resolves sheet titles by filter id", () => {
    expect(getSheetTitle("category")).toBe("دسته‌بندی");
    expect(getSheetTitle("neighborhood")).toBe("محله");
    expect(getSheetTitle("area")).toBe("متراژ");
    expect(getSheetTitle("price")).toBe("قیمت");
    expect(getSheetTitle("rooms")).toBe("تعداد اتاق");
    expect(getSheetTitle(null)).toBe("فیلتر");
  });

  it("applies filter state mutations to URLSearchParams", () => {
    const params = new URLSearchParams("focus=true&other=1");
    applyQuickFilterToParams(params, "price", {
      areaMaximum: "",
      areaMinimum: "",
      category: undefined,
      priceMaximum: "5000",
      priceMinimum: "1000",
      selectedChoices: [],
      selectedNeighborhoodIds: [],
      transaction: "sale",
    });

    expect(params.get("focus")).toBeNull();
    expect(params.get("price_min")).toBe("1000");
    expect(params.get("price_max")).toBe("5000");
    expect(params.get("other")).toBe("1");
  });
});
