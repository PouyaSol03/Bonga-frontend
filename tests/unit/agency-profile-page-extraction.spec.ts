import { describe, expect, it, vi } from "vitest";
import {
  findNearestNeighborhood,
  getNeighborhoodId,
  normalizeOptionalText,
  normalizeProfileCoordinate,
  normalizeProfileText,
  resolveNeighborhoodById,
  resolveProfileNeighborhoodIds,
  toSelectedNeighborhood,
} from "../../src/features/dashboard/agency-profile/agencyProfileHelpers";
import { executeSaveAgencyProfile } from "../../src/features/dashboard/agency-profile/agencyProfileSaveAction";
import type { NeighborhoodDto } from "../../src/features/locations/api/neighborhood.service";

describe("agencyProfileHelpers", () => {
  const sampleNeighborhoods: NeighborhoodDto[] = [
    { id: "101", lat: 35.75, lng: 51.4, name: "ونک" },
    { id: "102", lat: 35.8, lng: 51.42, name: "تجریش" },
  ];

  it("resolves neighborhood id correctly", () => {
    expect(getNeighborhoodId({ id: "1", name: "محله ۱" })).toBe("1");
    expect(getNeighborhoodId({ name: "بدون شناسه" })).toBe("بدون شناسه");
  });

  it("converts NeighborhoodDto to SelectedNeighborhood", () => {
    const selected = toSelectedNeighborhood({
      id: "101",
      lat: 35.75,
      lng: 51.4,
      name: "ونک",
    });
    expect(selected).toEqual({
      id: "101",
      lat: 35.75,
      lng: 51.4,
      name: "ونک",
    });
  });

  it("normalizes optional text and profile coordinates", () => {
    expect(normalizeOptionalText("   ")).toBeNull();
    expect(normalizeOptionalText("  آدرس  ")).toBe("آدرس");
    expect(normalizeProfileText(undefined)).toBe("");
    expect(normalizeProfileText("متن")).toBe("متن");

    expect(normalizeProfileCoordinate("35.7")).toBe(35.7);
    expect(normalizeProfileCoordinate(null)).toBeNull();
    expect(normalizeProfileCoordinate(undefined)).toBeNull();
  });

  it("finds nearest neighborhood based on coordinates", () => {
    const nearest = findNearestNeighborhood(35.76, 51.405, sampleNeighborhoods);
    expect(nearest?.id).toBe("101");
    expect(nearest?.name).toBe("ونک");
  });

  it("resolves neighborhood by ID", () => {
    const resolved = resolveNeighborhoodById("102", sampleNeighborhoods);
    expect(resolved?.name).toBe("تجریش");
    expect(resolveNeighborhoodById(null, sampleNeighborhoods)).toBeNull();
  });

  it("resolves and splits profile neighborhood IDs", () => {
    const ids = resolveProfileNeighborhoodIds({
      neighborhood_ids: ["101, 102", "103"],
    } as any);
    expect(ids).toEqual(["101", "102", "103"]);
  });
});

describe("executeSaveAgencyProfile", () => {
  it("rejects saving if user is not real estate manager", async () => {
    const showToast = vi.fn();
    const updateMutation = { mutateAsync: vi.fn() } as any;

    const result = await executeSaveAgencyProfile({
      aboutUs: "",
      address: "",
      agencyName: "املاک برتر",
      agencyType: 1,
      instagram: "",
      isRealEstateManager: false,
      logoFile: null,
      mapCenter: { lat: 35.7, lng: 51.4, zoom: 14 },
      neighborhoods: [],
      phone1: "",
      phone2: "",
      phone3: "",
      selectedActivityAreas: [{ id: "101", name: "ونک" }],
      selectedNeighborhood: null,
      showToast,
      telegram: "",
      updateMutation,
      whatsapp: "",
      workingHours: "",
    });

    expect(result).toBe(false);
    expect(showToast).toHaveBeenCalledWith(
      "ویرایش مشخصات آژانس فقط برای نقش مدیر آژانس فعال است.",
      "خطا",
      "error",
    );
    expect(updateMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("validates required fields before calling mutation", async () => {
    const showToast = vi.fn();
    const updateMutation = { mutateAsync: vi.fn() } as any;

    const result = await executeSaveAgencyProfile({
      aboutUs: "",
      address: "",
      agencyName: "",
      agencyType: 1,
      instagram: "",
      isRealEstateManager: true,
      logoFile: null,
      mapCenter: { lat: 35.7, lng: 51.4, zoom: 14 },
      neighborhoods: [],
      phone1: "",
      phone2: "",
      phone3: "",
      selectedActivityAreas: [],
      selectedNeighborhood: null,
      showToast,
      telegram: "",
      updateMutation,
      whatsapp: "",
      workingHours: "",
    });

    expect(result).toBe(false);
    expect(showToast).toHaveBeenCalledWith("نام آژانس الزامی است.", "خطا", "error");
    expect(updateMutation.mutateAsync).not.toHaveBeenCalled();
  });
});
