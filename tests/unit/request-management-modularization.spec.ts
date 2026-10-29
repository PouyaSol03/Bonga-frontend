import { describe, expect, it } from "vitest";
import {
  formatReceivedRequestDate,
  getInitialRequestTab,
  getReceivedRequestDetailPriority,
  getReceivedRequestDetails,
  getRequestCreatedAt,
  getTabs,
  isReceivedRequestNew,
} from "../../src/features/property-requests/request-management/requestHelpers";

describe("Request Management Modularization", () => {
  const dummyRequest = {
    cityId: 1,
    cityName: "تهران",
    createdAt: new Date().toISOString(),
    filters: {
      form_code: "sale",
      category_id: "apartment",
      rooms: 2,
    },
    id: "req-1",
    isNew: false,
    neighborhoods: ["ونک"],
    propertyType: "آپارتمان",
    title: "درخواست آپارتمان در ونک",
    transactionType: "خرید",
  } as any;

  describe("requestHelpers", () => {
    it("parses request createdAt date", () => {
      const now = new Date();
      expect(getRequestCreatedAt({ ...dummyRequest, createdAt: now.toISOString() })?.getTime()).toBe(
        now.getTime(),
      );
      expect(getRequestCreatedAt({ ...dummyRequest, createdAt: "invalid-date" })).toBeNull();
    });

    it("checks if received request is new", () => {
      expect(isReceivedRequestNew({ ...dummyRequest, isNew: true })).toBe(true);

      const recentDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      expect(isReceivedRequestNew({ ...dummyRequest, createdAt: recentDate, isNew: false })).toBe(
        true,
      );

      const oldDate = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      expect(isReceivedRequestNew({ ...dummyRequest, createdAt: oldDate, isNew: false })).toBe(
        false,
      );
    });

    it("formats received request date", () => {
      const todayDate = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      expect(formatReceivedRequestDate({ ...dummyRequest, createdAt: todayDate })).toBe("امروز");

      const hoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
      expect(formatReceivedRequestDate({ ...dummyRequest, createdAt: hoursAgo })).toBe("۳ ساعت پیش");
    });

    it("prioritizes details correctly", () => {
      expect(getReceivedRequestDetailPriority("۲ خوابه")).toBe(0);
      expect(getReceivedRequestDetailPriority("سال ساخت ۱۴۰۰")).toBe(1);
      expect(getReceivedRequestDetailPriority("قیمت: ۱۰ میلیارد")).toBe(2);
      expect(getReceivedRequestDetailPriority("متراژ ۱۲۰")).toBe(3);
      expect(getReceivedRequestDetailPriority("محله پونک")).toBe(4);
      expect(getReceivedRequestDetailPriority("پارکینگ دارد")).toBe(5);
    });

    it("returns correct visible and hidden details", () => {
      const res = getReceivedRequestDetails(dummyRequest, 2);
      expect(res.visibleDetails.length).toBeLessThanOrEqual(2);
      expect(typeof res.hiddenCount).toBe("number");
    });

    it("returns tabs based on showReceivedTab flag", () => {
      expect(getTabs(true)).toEqual([
        { id: "results", label: "نتایج" },
        { id: "requests", label: "درخواست‌ها" },
        { id: "received", label: "دریافتی‌ها" },
      ]);

      expect(getTabs(false)).toEqual([
        { id: "results", label: "نتایج" },
        { id: "requests", label: "درخواست‌ها" },
      ]);
    });

    it("resolves initial request tab", () => {
      expect(getInitialRequestTab(true)).toBe("results");
      expect(getInitialRequestTab(false)).toBe("requests");
    });
  });
});
