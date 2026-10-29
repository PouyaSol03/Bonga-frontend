import { describe, expect, it } from "vitest";
import {
  extractAdvertiserPhone,
  getAllocationRejectPathForCurrentAd,
  getAllocationReviewPathForCurrentAd,
} from "../../src/features/account/adManagement/allocation/allocationHelpers";
import { publisherOptions } from "../../src/features/account/adManagement/allocation/types";

describe("AdAllocationReview Modularization", () => {
  it("resolves paths for review and reject actions", () => {
    expect(getAllocationReviewPathForCurrentAd("123")).toContain("/123");
    expect(getAllocationRejectPathForCurrentAd("123")).toContain("/123/reject");
  });

  it("extracts phone correctly from advertisement or assignment records", () => {
    const adWithPhone = {
      id: "ad-1",
      phone: "09121111111",
      title: "آپارتمان",
      status: "active",
      tags: [],
    } as any;
    expect(extractAdvertiserPhone(adWithPhone, undefined)).toBe("09121111111");

    const adWithoutPhone = { id: "ad-2" } as any;
    const assignmentWithPhone = {
      advertise: { contacts: { phone: "09352222222" } },
    } as any;
    expect(extractAdvertiserPhone(adWithoutPhone, assignmentWithPhone)).toBe("09352222222");

    expect(extractAdvertiserPhone(undefined, undefined)).toBe("");
  });

  it("defines publisher options properly", () => {
    expect(publisherOptions).toHaveLength(2);
    expect(publisherOptions[0].value).toBe("agency");
    expect(publisherOptions[1].value).toBe("consultant");
  });
});
