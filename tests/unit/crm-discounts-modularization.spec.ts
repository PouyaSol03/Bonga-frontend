import { describe, expect, it } from "vitest";
import {
  formatDatePersian,
  formatPersianNumber,
} from "../../src/features/crm/discounts/discountFormatters";
import {
  emptyDraft,
  serviceBadgeColors,
  serviceLabels,
} from "../../src/features/crm/discounts/types";

describe("CrmDiscounts Modularization", () => {
  it("formats persian numbers correctly", () => {
    expect(formatPersianNumber(100)).toMatch(/۱۰۰|100/);
    expect(formatPersianNumber(0)).toMatch(/۰|0/);
    expect(formatPersianNumber("abc")).toBe("abc");
  });

  it("formats persian dates properly with fallback", () => {
    expect(formatDatePersian(null)).toBe("بدون محدودیت");
    expect(formatDatePersian(undefined)).toBe("بدون محدودیت");
    expect(formatDatePersian("2026-05-15")).toBeTruthy();
  });

  it("provides valid defaults and service mappings", () => {
    expect(emptyDraft.services).toEqual(["advertise", "package", "panel"]);
    expect(serviceLabels.advertise).toBe("ثبت و ارتقای آگهی");
    expect(serviceBadgeColors.package).toContain("amber");
  });
});
