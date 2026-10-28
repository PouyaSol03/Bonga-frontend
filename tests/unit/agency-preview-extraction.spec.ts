import { describe, expect, it } from "vitest";
import {
  getProfileNeighborhoodIds,
  toPersianDigits,
  toOptionalCoordinate,
  getAgencyConsultantRoleLabel,
  readAgencyProfileSocialValue,
  resolvePreviewContactInfo,
} from "../../src/features/dashboard/agency-preview/profileHelpers";
import {
  getAbsoluteAgencyPreviewUrl,
  getPreviewSearchParam,
} from "../../src/features/dashboard/agency-preview/urlHelpers";
import { resolvePreviewEntity } from "../../src/features/dashboard/agency-preview/resolvePreviewEntity";

describe("Agency Preview Profile Helpers", () => {
  it("extracts unique neighborhood IDs from profile", () => {
    const profile = {
      neighborhood_ids: ["1, 2", "2, 3", "4"],
    } as any;
    expect(getProfileNeighborhoodIds(profile)).toEqual(["1", "2", "3", "4"]);
  });

  it("formats digits to Persian with fallback", () => {
    expect(toPersianDigits(null)).toBe("—");
    expect(toPersianDigits("")).toBe("—");
    expect(toPersianDigits(123)).toBe("۱۲۳");
  });

  it("parses optional coordinates safely", () => {
    expect(toOptionalCoordinate(35.7)).toBe(35.7);
    expect(toOptionalCoordinate("51.4")).toBe(51.4);
    expect(toOptionalCoordinate("invalid")).toBeUndefined();
    expect(toOptionalCoordinate(null)).toBeUndefined();
  });

  it("resolves consultant role labels in Persian", () => {
    expect(getAgencyConsultantRoleLabel("owner")).toBe("مدیر آژانس");
    expect(getAgencyConsultantRoleLabel("manager")).toBe("مدیر");
    expect(getAgencyConsultantRoleLabel("consultant")).toBe("مشاور املاک");
    expect(getAgencyConsultantRoleLabel("custom_role")).toBe("custom_role");
  });

  it("reads nested social links from profile", () => {
    const profile = {
      social: { instagram: "bonga_realty" },
    } as any;
    expect(readAgencyProfileSocialValue(profile, "instagram")).toBe("bonga_realty");
  });

  it("resolves contact info with default fallback", () => {
    const contact = resolvePreviewContactInfo(null, true);
    expect(contact.phone).toBe("");
    expect(contact.whatsapp).toBe("");
  });
});

describe("Agency Preview URL & Entity Resolution", () => {
  it("builds absolute agency preview URL with query parameters", () => {
    const url = getAbsoluteAgencyPreviewUrl("agency-42", {
      name: "املاک پارس",
      cityId: "1",
      cityName: "تهران",
    });
    expect(url).toContain("/agencies/agency-42");
  });

  it("resolves entity info for public consultant profile", () => {
    const resolved = resolvePreviewEntity({
      isAgentPreview: true,
      isPublicPreview: true,
      publicAgent: {
        id: "agent-10",
        name: "علی احمدی",
        about_us: "مشاور تخصصی منطقه ۱",
        neighborhood_ids: ["n-1", "n-2"],
      } as any,
      selectedCity: null,
    });
    expect(resolved.entityId).toBe("agent-10");
    expect(resolved.entityName).toBe("علی احمدی");
    expect(resolved.entityAbout).toBe("مشاور تخصصی منطقه ۱");
    expect(resolved.activityAreaIds).toEqual(["n-1", "n-2"]);
  });
});
