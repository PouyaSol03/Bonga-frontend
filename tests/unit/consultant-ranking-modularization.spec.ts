import { describe, expect, it } from "vitest";
import {
  formatOptionalNumber,
  slugToConsultantPath,
} from "../../src/features/account/ranking/rankingHelpers";

describe("ConsultantRanking Modularization", () => {
  it("formats optional numbers properly into Persian format or fallback dash", () => {
    expect(formatOptionalNumber(null)).toBe("—");
    expect(formatOptionalNumber(undefined)).toBe("—");
    expect(formatOptionalNumber(100)).toMatch(/۱۰۰|100/);
    expect(formatOptionalNumber(0)).toMatch(/۰|0/);
  });

  it("maps badge slugs to consultant paths correctly", () => {
    expect(slugToConsultantPath.file_maker).toBe("/account/ranking/badges/file");
    expect(slugToConsultantPath.market_magnet).toBe("/account/ranking/badges/magnet");
    expect(slugToConsultantPath.always_active).toBe("/account/ranking/badges/time");
    expect(slugToConsultantPath.response).toBe("/account/ranking/badges/response");
  });
});
