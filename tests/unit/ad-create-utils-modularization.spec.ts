import { describe, expect, it } from "vitest";
import {
  canonicalizeMediaPath,
  formatUnitsPerFloorLabel,
  getAdvertiseFormCode,
  getPriceValue,
  labels,
  mediaSource,
  normalizeNumberInput,
  normalizeUnitsPerFloorValue,
  pickFirstNumber,
  toNumber,
  toUnitsPerFloorNumber,
  buildPayload,
  buildNewAdFormData,
} from "../../src/features/advertisements/create/utils";
import { blankValues } from "../../src/features/advertisements/create/data";

describe("advertisements/create/utils modularization", () => {
  it("formats and parses numbers and units properly", () => {
    expect(toNumber("1,234,567")).toBe(1234567);
    expect(toNumber("")).toBeNull();
    expect(normalizeNumberInput("12a34ب5")).toBe("12345");
    expect(pickFirstNumber("طبقه ۴ از ۱۰")).toBe("۴");
    expect(toUnitsPerFloorNumber("تک واحدی")).toBe(1);
    expect(toUnitsPerFloorNumber("3")).toBe(3);
    expect(normalizeUnitsPerFloorValue("2")).toBe("۲");
    expect(formatUnitsPerFloorLabel("2")).toBe("۲ واحد");
  });

  it("extracts labels from chip items", () => {
    const items = [
      { id: "parking", label: "پارکینگ" },
      { id: "elevator", label: "آسانسور" },
    ];
    expect(labels(items, ["parking"])).toEqual(["پارکینگ"]);
  });

  it("normalizes and canonicalizes media sources", () => {
    expect(mediaSource("https://example.com/img.jpg")).toBe("https://example.com/img.jpg");
    expect(mediaSource({ path: "uploads/image.jpg" })).toBe("uploads/image.jpg");
    expect(mediaSource(null)).toBe("");

    expect(canonicalizeMediaPath("uploads/image/advertiseImg/photo.jpg")).toBe("photo.jpg");
    expect(canonicalizeMediaPath("https://cdn.exirfirm.com/uploads/photo.jpg?v=1")).toBe("photo.jpg");
  });

  it("resolves advertise form codes correctly", () => {
    expect(getAdvertiseFormCode("sale", "apartment")).toBe("sale-apartment");
    expect(getAdvertiseFormCode("rent", "commercial-unit")).toBe("rent-commercial");
    expect(getAdvertiseFormCode("project", "project-presale")).toBe("presale-special");
  });

  it("calculates price value based on transaction and category", () => {
    const values = {
      ...blankValues,
      price: "1000000000",
      rentPrice: "5000000",
      minPrice: "2000000",
    };
    expect(getPriceValue(values, "sale", "apartment")).toBe(1000000000);
    expect(getPriceValue(values, "rent", "apartment")).toBe(5000000);
    expect(getPriceValue(values, "rent", "daily-apartment-suite")).toBe(2000000);
  });

  it("builds payload structure adhering to specification", () => {
    const values = {
      ...blankValues,
      title: "آپارتمان نوساز",
      meterage: "120",
      price: "5000000000",
      location: "تهران، ونک",
      chatEnabled: true,
      phoneEnabled: true,
    };
    const payload = buildPayload(values);
    expect(payload.title).toBe("آپارتمان نوساز");
    expect(payload.contact_type).toContain("chat");
    expect(payload.contact_type).toContain("phone");
    expect(Array.isArray(payload.features)).toBe(true);
  });

  it("builds FormData with required fields and clean values", () => {
    const values = {
      ...blankValues,
      title: "ویلای ساحلی",
      description: "توضیحات کامل ویلا",
      meterage: "300",
      price: "12000000000",
    };
    const formData = buildNewAdFormData(values);
    expect(formData.get("title")).toBe("ویلای ساحلی");
    expect(formData.get("description")).toBe("توضیحات کامل ویلا");
  });
});
