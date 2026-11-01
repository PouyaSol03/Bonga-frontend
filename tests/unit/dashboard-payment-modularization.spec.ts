import { describe, expect, it } from "vitest";
import {
  getCreditItems,
  getGiftBenefits,
  mapBundlePlan,
  mapMobilePackagePlan,
  mapMobilePanelPlan,
  mapPanelPlan,
  toFaNumber,
} from "../../src/features/dashboard/payment/paymentPlanHelpers";
import type { PackageItem } from "../../src/features/packages/api/package.service";

describe("Dashboard Payment Modularization", () => {
  const dummyPlan: PackageItem = {
    ad_credit: 5,
    created_at: "2024-01-01",
    discount_percent: 15,
    duration_days: 30,
    final_price: 85000,
    id: "pkg-1",
    is_active: true,
    kind: "panel_subscription",
    real_price: 100000,
    renew_credit: 2,
    slug: "pkg-1",
    sort_order: 1,
    special_credit: 1,
    title: "پلن پایه",
    updated_at: "2024-01-01",
  };

  it("extracts non-zero credit items and gift benefits", () => {
    const items = getCreditItems(dummyPlan);
    expect(items).toEqual([
      { label: "آگهی", value: 5 },
      { label: "ویژه", value: 1 },
      { label: "بروزرسانی", value: 2 },
    ]);

    const gifts = getGiftBenefits(dummyPlan);
    expect(gifts).toHaveLength(3);
  });

  it("maps desktop panel and bundle plans correctly", () => {
    const panel = mapPanelPlan(dummyPlan);
    expect(panel.id).toBe("pkg-1");
    expect(panel.priceAfterDiscount).toBe(85000);
    expect(panel.discount).toBe(15);

    const bundle = mapBundlePlan(dummyPlan);
    expect(bundle.items).toHaveLength(3);
  });

  it("maps mobile plans accurately", () => {
    const mobilePanel = mapMobilePanelPlan(dummyPlan, 0, true);
    expect(mobilePanel.selected).toBe(true);
    expect(mobilePanel.giftBenefits).toHaveLength(3);

    const mobilePkg = mapMobilePackagePlan(dummyPlan, 1);
    expect(mobilePkg.selected).toBe(false);
    expect(mobilePkg.benefits).toHaveLength(3);
  });

  it("formats persian numbers correctly", () => {
    expect(toFaNumber(50000)).toBe("۵۰٬۰۰۰");
    expect(toFaNumber("100")).toBe("100");
  });
});
