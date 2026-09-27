import { expect, test } from "@playwright/test";
import { buildAssignedAdStateModel } from "../../../src/features/account/adState/model";

const card = {
  id: "ad-130",
  title: "۱۳۰متر - دونبش جنوبی - معاوضه با...",
  status: "منتشر شده",
};

test("maps every assigned advertisement reference state", () => {
  const cases = [
    ["published", undefined, "published", "stop-publish"],
    ["wait_for_agency", undefined, "waiting-agency", "cancel-assignment"],
    ["wait_for_repost", undefined, "waiting-repost", "repost"],
    ["archived", undefined, "archived", "restore"],
    ["wait_for_deal_confirmation", "deal_confirmation", "deal-confirmation", "submit-result"],
    ["deleted", "recovery_expired", "recovery-expired", "none"],
    ["deleted", "user_stopped", "user-stopped", "none"],
  ] as const;

  for (const [statusKey, deletedVariant, variant, primaryAction] of cases) {
    const model = buildAssignedAdStateModel({
      ad: { assigned_agency_name: "آژانس جلیلیان" },
      card: card as never,
      deletedVariant,
      statusKey,
    });
    expect(model.variant).toBe(variant);
    expect(model.primaryAction).toBe(primaryAction);
  }
});

test("normalizes shared advertisement copy", () => {
  const model = buildAssignedAdStateModel({
    ad: {
      assigned_agency_name: "آژانس آزمون",
      category_title: "فروش مسکونی / فروش آپارتمان",
      expires_time_ago: "۱۲ روز دیگر (۱۴۰۴/۱۱/۲۱)",
      published_time_ago: "۳ روز پیش (۱۴۰۴/۱۱/۰۹)",
    },
    card: card as never,
    statusKey: "published",
  });

  expect(model.agencyName).toBe("آژانس آزمون");
  expect(model.category).toBe("فروش مسکونی / فروش آپارتمان");
  expect(model.publishedAt).toContain("۳ روز پیش");
  expect(model.expiresAt).toContain("۱۲ روز دیگر");
});
