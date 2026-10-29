import { describe, expect, it } from "vitest";
import { getBusinessAccountActions } from "../../src/features/account/my-account/businessAccountActions";
import {
  formatOptionalNumber,
  mapLeaderboard,
  buildAgencyIndicators,
} from "../../src/features/dashboard/ranking/agencyRankingHelpers";

describe("ranking back navigation & helpers", () => {
  it("attaches ?from=account to ranking actions across all account roles", () => {
    const managerActions = getBusinessAccountActions("REAL_ESTATE_MANAGER", null, null);
    const managerRanking = managerActions.find((a) => a.icon === "ranking");
    expect(managerRanking?.to).toBe("/account/dashboard/ranking?from=account");

    const consultantActions = getBusinessAccountActions("REAL_ESTATE_CONSULTANT", null, null);
    const consultantRanking = consultantActions.find((a) => a.icon === "ranking");
    expect(consultantRanking?.to).toBe("/account/dashboard/ranking?from=account");

    const independentActions = getBusinessAccountActions("INDEPENDENT_CONSULTANT", null, null);
    const independentRanking = independentActions.find((a) => a.icon === "ranking");
    expect(independentRanking?.to).toBe("/account/dashboard/ranking?from=account");
  });

  it("determines back target dynamically based on origin query param", () => {
    const resolveBackTo = (fromParam: string | null) =>
      fromParam === "dashboard" ? "/account/dashboard" : "/account";

    expect(resolveBackTo("dashboard")).toBe("/account/dashboard");
    expect(resolveBackTo("account")).toBe("/account");
    expect(resolveBackTo(null)).toBe("/account");
  });

  it("formats optional numbers to Persian locale", () => {
    expect(formatOptionalNumber(null)).toBe("—");
    expect(formatOptionalNumber(undefined)).toBe("—");
    expect(formatOptionalNumber(125)).toBe("۱۲۵");
  });

  it("maps leaderboard items accurately", () => {
    const raw = [
      {
        agency_id: "ag-1",
        agency_name: "آژانس تست",
        score: 95,
        rank: 1,
        level_slug: "gold",
        level_title: "طلایی",
      },
    ];
    const mapped = mapLeaderboard(raw as any);
    expect(mapped[0]).toEqual({
      entityId: "ag-1",
      name: "آژانس تست",
      totalScore: 95,
      rank: 1,
      levelSlug: "gold",
      levelTitle: "طلایی",
    });
  });

  it("builds agency indicators correctly from metrics", () => {
    const indicators = buildAgencyIndicators(
      { published_ads: 10, active_consultants: 5, updated_ads: 8, special_ads: 2 },
      undefined,
    );
    expect(indicators).toHaveLength(4);
    expect(indicators[0].value).toBe("۱۰");
    expect(indicators[1].value).toBe("۵");
    expect(indicators[2].value).toBe("۸");
    expect(indicators[3].value).toBe("۲");
  });
});
