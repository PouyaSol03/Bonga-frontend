import { describe, expect, it } from "vitest";
import {
  businessInfoCards,
  getNeighborhoodId,
  getBusinessTypePath,
  normalizePhoneDigits,
} from "../../src/features/account/businessCreationShared";

describe("Business Creation Modularization", () => {
  it("normalizes phone digits from Persian and Arabic numerals", () => {
    expect(normalizePhoneDigits("۰۹۱۲۳۴۵۶۷۸۹")).toBe("09123456789");
    expect(normalizePhoneDigits("٠٩١٢٣٤٥٦٧٨٩")).toBe("09123456789");
    expect(normalizePhoneDigits(" 0912 345 6789 ")).toBe("09123456789");
  });

  it("extracts neighborhood id properly", () => {
    expect(getNeighborhoodId({ id: "n-1", name: "محله تست" })).toBe("n-1");
    expect(getNeighborhoodId({ _id: "n-2", name: "محله دو" })).toBe("n-2");
    expect(getNeighborhoodId({ name: "سعادت آباد" })).toBe("سعادت آباد");
  });

  it("resolves business type creation paths", () => {
    expect(getBusinessTypePath("agency")).toBe("/account/business/create/agency");
    expect(getBusinessTypePath("independent-consultant")).toBe(
      "/account/business/create/consultant",
    );
  });

  it("provides comprehensive business info cards for both types", () => {
    expect(businessInfoCards.agency.length).toBeGreaterThan(0);
    expect(businessInfoCards["independent-consultant"].length).toBeGreaterThan(0);
    expect(businessInfoCards.agency[0].title).toBe("مدیریت سیستم");
    expect(businessInfoCards["independent-consultant"][0].title).toBe("مدیریت سیستم");
  });
});
