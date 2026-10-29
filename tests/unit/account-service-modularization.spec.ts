import { describe, expect, it } from "vitest";
import {
  isUserIdentityVerified,
  normalizeMyAgencyProfile,
  readFiniteNumber,
  readPaymentUrl,
  unwrapMyAgencyProfile,
} from "../../src/features/account/api/account.service";

describe("Account Service Modularization", () => {
  it("verifies user identity status accurately", () => {
    expect(isUserIdentityVerified({ authorized: 1 })).toBe(true);
    expect(isUserIdentityVerified({ authorized: "1" as unknown as number })).toBe(true);
    expect(isUserIdentityVerified({ authorized: "true" as unknown as number })).toBe(true);
    expect(isUserIdentityVerified({ authorized: 0 })).toBe(false);
    expect(isUserIdentityVerified(null)).toBe(false);
    expect(isUserIdentityVerified(undefined)).toBe(false);
  });

  it("normalizes and unwraps agency profile", () => {
    const rawProfile = {
      name: "املاک پارس",
      neighborhood_ids: ["n-1", "n-2", "n-1"],
    };

    const normalized = normalizeMyAgencyProfile(rawProfile);
    expect(normalized.neighborhood_ids).toEqual(["n-1", "n-2"]);

    const unwrapped = unwrapMyAgencyProfile({ data: rawProfile, status: true });
    expect(unwrapped.name).toBe("املاک پارس");
    expect(unwrapped.neighborhood_ids).toEqual(["n-1", "n-2"]);
  });

  it("validates payment URLs and finite numbers", () => {
    expect(readPaymentUrl({ payment_url: "https://zarinpal.com/pg/StartPay/123" })).toBe(
      "https://zarinpal.com/pg/StartPay/123",
    );
    expect(readPaymentUrl({ payment_url: "invalid-url" })).toBeNull();
    expect(readPaymentUrl({})).toBeNull();

    expect(readFiniteNumber(42)).toBe(42);
    expect(readFiniteNumber("100")).toBe(100);
    expect(readFiniteNumber("abc")).toBeUndefined();
    expect(readFiniteNumber(null)).toBeUndefined();
  });
});
