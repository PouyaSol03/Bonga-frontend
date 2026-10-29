import { describe, expect, it } from "vitest";
import {
  normalizeBalances,
  normalizeDelta,
  normalizeRankingEntity,
  normalizeUsage,
  toNullableNumber,
  toNumber,
  toStringValue,
  toV2OverviewPeriod,
} from "../../src/features/dashboard/api/dashboard.service";

describe("Dashboard Service Modularization", () => {
  it("converts dashboard overview period correctly", () => {
    expect(toV2OverviewPeriod("7d")).toBe("week");
    expect(toV2OverviewPeriod("week")).toBe("week");
    expect(toV2OverviewPeriod("year")).toBe("year");
    expect(toV2OverviewPeriod("month")).toBe("month");
    expect(toV2OverviewPeriod("30d")).toBe("month");
  });

  it("handles numbers and text safely", () => {
    expect(toNumber("45", 0)).toBe(45);
    expect(toNumber(undefined, 10)).toBe(10);
    expect(toNullableNumber("10")).toBe(10);
    expect(toNullableNumber("")).toBeNull();
    expect(toStringValue("  test  ")).toBe("test");
    expect(toStringValue(null, "default")).toBe("default");
  });

  it("normalizes delta and usage", () => {
    const delta = normalizeDelta({ change: 5, current: 20, percent: "25", previous: 15 });
    expect(delta).toEqual({ change: 5, current: 20, percent: 25, previous: 15 });

    const usage = normalizeUsage({ current: 2, previous: 1, total_available: 10 });
    expect(usage).toEqual({ current: 2, previous: 1, totalAvailable: 10 });
  });

  it("normalizes ranking entity", () => {
    const entity = normalizeRankingEntity(
      { agency_name: "املاک کاخ", id: "agency-1", level_slug: "gold", score: 850 },
      1,
    );
    expect(entity.entityId).toBe("agency-1");
    expect(entity.name).toBe("املاک کاخ");
    expect(entity.levelSlug).toBe("gold");
    expect(entity.totalScore).toBe(850);
    expect(entity.rank).toBe(1);
  });

  it("normalizes balances with unassigned fallbacks", () => {
    const balances = normalizeBalances({
      ad_credit_balance: 10,
      panel_days_remaining: 30,
      renew_credit_balance: 5,
      special_credit_balance: 2,
    });
    expect(balances.adCreditBalance).toBe(10);
    expect(balances.unassignedAdCreditBalance).toBe(10);
    expect(balances.renewCreditBalance).toBe(5);
    expect(balances.panelDaysRemaining).toBe(30);
  });
});
