import { describe, expect, it } from "vitest";
import {
  fullName,
  hasMeaningfulValue,
  nestedRecord,
  reportCode,
  reportStatus,
  text,
} from "../../src/features/crm/reports/reportHelpers";

describe("CRM Reports Modularization", () => {
  describe("reportHelpers", () => {
    it("extracts text with fallback", () => {
      expect(text({ title: "  تست  " }, ["title"])).toBe("تست");
      expect(text({ count: 42 }, ["count"])).toBe("42");
      expect(text({}, ["missing"], "پیش‌فرض")).toBe("پیش‌فرض");
    });

    it("extracts nested record", () => {
      expect(nestedRecord({ user: { id: "123" } }, ["user"])).toEqual({ id: "123" });
      expect(nestedRecord({ user: [1, 2] }, ["user"])).toEqual({});
      expect(nestedRecord({}, ["user"])).toEqual({});
    });

    it("extracts full name properly", () => {
      expect(fullName({ display_name: "مدیر سیستم" })).toBe("مدیر سیستم");
      expect(fullName({ first_name: "رضا", last_name: "کاظمی" })).toBe("رضا کاظمی");
      expect(fullName({})).toBe("-");
    });

    it("determines report status tone and label", () => {
      expect(reportStatus({ status: "open" })).toEqual({ label: "جدید", tone: "warning" });
      expect(reportStatus({ status: "reviewing" })).toEqual({ label: "در حال بررسی", tone: "info" });
      expect(reportStatus({ status: "resolved" })).toEqual({ label: "بررسی شده", tone: "success" });
      expect(reportStatus({ status: "rejected" })).toEqual({ label: "رد شده", tone: "danger" });
      expect(reportStatus({ status: "custom" })).toEqual({ label: "custom", tone: "neutral" });
    });

    it("extracts report tracking code", () => {
      expect(reportCode({ code: "REP-99" })).toBe("REP-99");
      expect(reportCode({ tracking_code: "TRK-1" })).toBe("TRK-1");
      expect(reportCode({ id: "id-88" })).toBe("id-88");
      expect(reportCode({})).toBe("-");
    });

    it("evaluates meaningful values", () => {
      expect(hasMeaningfulValue("معتبر")).toBe(true);
      expect(hasMeaningfulValue("-")).toBe(false);
      expect(hasMeaningfulValue("زمان ثبت نشده")).toBe(false);
      expect(hasMeaningfulValue("توضیحی ثبت نشده است.")).toBe(false);
      expect(hasMeaningfulValue("")).toBe(false);
    });
  });
});
