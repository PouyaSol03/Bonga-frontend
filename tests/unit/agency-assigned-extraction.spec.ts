import { describe, expect, it } from "vitest";
import {
  formatExpireDuration,
  formatPersianDateNumber,
  formatHistoryDate,
} from "../../src/features/account/agency-assigned/dateHelpers";
import {
  resolvePublishedDateText,
  resolveExpirationDateText,
} from "../../src/features/account/agency-assigned/adDateResolvers";
import {
  resolveAgencyName,
  resolveCategoryBreadcrumb,
} from "../../src/features/account/agency-assigned/adEntityResolvers";
import { AgencyAssignedUserAdView } from "../../src/features/account/components/AgencyAssignedUserAdView";

describe("AgencyAssignedUserAdView modular extraction", () => {
  it("exports AgencyAssignedUserAdView component and formatExpireDuration helper", () => {
    expect(typeof AgencyAssignedUserAdView).toBe("function");
    expect(typeof formatExpireDuration).toBe("function");
  });

  describe("dateHelpers", () => {
    it("converts Date to Persian calendar date format", () => {
      const d = new Date("2024-05-10T12:00:00Z");
      const formatted = formatPersianDateNumber(d);
      expect(formatted).toMatch(/[۰-۹]{4}\/[۰-۹]{2}\/[۰-۹]{2}/);
    });

    it("formats history date fallback to empty string when empty", () => {
      expect(formatHistoryDate(undefined)).toBe("");
      expect(formatHistoryDate("")).toBe("");
    });

    it("formats expire duration text correctly", () => {
      expect(formatExpireDuration({ hours: 3, minutes: 20 })).toBe("تا ۳ ساعت و ۲۰ دقیقه دیگر مهلت دارید.");
      expect(formatExpireDuration(undefined, undefined, "مهلت تمام شد")).toBe("مهلت تمام شد");
      expect(formatExpireDuration(undefined, undefined)).toBe("امکان انجام عملیات تا پایان مهلت فراهم است.");
    });
  });

  describe("adDateResolvers", () => {
    it("resolves published date text with fallback", () => {
      expect(resolvePublishedDateText(undefined)).toBe("—");
      expect(resolvePublishedDateText({ published_date_text: "دیروز" })).toBe("دیروز");
      expect(
        resolvePublishedDateText({
          confirm_date: "2024-01-15T10:00:00Z",
        }),
      ).toMatch(/[۰-۹]/);
    });

    it("resolves expiration date text with fallback", () => {
      expect(resolveExpirationDateText(undefined)).toBe("—");
      expect(resolveExpirationDateText({ expire_date_text: "منقضی شده" })).toBe("منقضی شده");
      expect(
        resolveExpirationDateText({
          expire_date: "2020-01-01T00:00:00Z",
        }),
      ).toContain("منقضی شده");
    });
  });

  describe("adEntityResolvers", () => {
    it("resolves agency name with hierarchical fallbacks", () => {
      expect(resolveAgencyName(undefined, undefined)).toBe("آژانس املاک");
      expect(
        resolveAgencyName({
          agency_name: "املاک برتر",
        }),
      ).toBe("املاک برتر");
      expect(
        resolveAgencyName(
          {},
          {
            agency: "املاک کاردان",
          } as any,
        ),
      ).toBe("املاک کاردان");
    });

    it("resolves category breadcrumb with fallback", () => {
      expect(resolveCategoryBreadcrumb(undefined)).toBe("—");
      expect(
        resolveCategoryBreadcrumb({
          category_title: "آپارتمان",
        }),
      ).toBe("آپارتمان");
    });
  });
});
