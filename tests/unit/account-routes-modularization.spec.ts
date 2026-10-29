import { describe, expect, it } from "vitest";
import { accountRoutes } from "../../src/app/router/accountRoutes";
import { accountCoreRoutes } from "../../src/app/router/account/accountCoreRoutes";
import { accountSupportAndChatRoutes } from "../../src/app/router/account/accountSupportAndChatRoutes";
import { accountBusinessRoutes } from "../../src/app/router/account/accountBusinessRoutes";
import { accountManageAdsRoutes } from "../../src/app/router/account/accountManageAdsRoutes";
import { accountAdWorkspaceRoutes } from "../../src/app/router/account/accountAdWorkspaceRoutes";
import { accountCreditAndRankingRoutes } from "../../src/app/router/account/accountCreditAndRankingRoutes";

describe("AccountRoutes Modularization", () => {
  it("aggregates all sub-routes into accountRoutes properly", () => {
    const totalSubRoutes =
      accountCoreRoutes.length +
      accountSupportAndChatRoutes.length +
      accountBusinessRoutes.length +
      accountManageAdsRoutes.length +
      accountAdWorkspaceRoutes.length +
      accountCreditAndRankingRoutes.length;

    expect(accountRoutes.length).toBe(totalSubRoutes);
    expect(accountRoutes.length).toBeGreaterThan(50);
  });

  it("contains essential route paths", () => {
    const paths = accountRoutes.map((r) => r.path);
    expect(paths).toContain("/account");
    expect(paths).toContain("/account/profile");
    expect(paths).toContain("/account/manage-ads");
    expect(paths).toContain("/account/ranking");
    expect(paths).toContain("/account/wallet");
  });
});
