import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import type { AdvertisementItem } from "../../../src/features/advertisements/api/advertisement.service";
import {
  getAdvertiserPreview,
  getMapPosition,
} from "../../../src/features/advertisements/view/details/advertiserAndPricing";
import { PreSaleViewContent } from "../../../src/features/advertisements/view/PreSaleViewContent";
import type { ViewAdDetails } from "../../../src/features/advertisements/view/viewAdTypes";

describe("getMapPosition - Coordinate Resolution for Agency, Consultant & Other Roles", () => {
  it("resolves direct lat / lng numbers and strings", () => {
    expect(getMapPosition({ lat: 35.7, lng: 51.4 })).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
    expect(getMapPosition({ lat: " 35.7 ", lng: " 51.4 " })).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
  });

  it("resolves Persian digits and Persian decimal separators (٫ and /)", () => {
    expect(getMapPosition({ lat: "۳۵٫۷", lng: "۵۱٫۴" })).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
    expect(getMapPosition({ lat: "۳۵.۷", lng: "۵۱.۴" })).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
    expect(getMapPosition({ lat: "۳۵/۷", lng: "۵۱/۴" })).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
  });

  it("resolves latitude and longitude / long property names", () => {
    expect(getMapPosition({ latitude: 35.6892, longitude: 51.389 })).toEqual({
      latitude: 35.6892,
      longitude: 51.389,
    });
    expect(getMapPosition({ latitude: 35.6892, long: 51.389 })).toEqual({
      latitude: 35.6892,
      longitude: 51.389,
    });
  });

  it("resolves GeoJSON coordinates [longitude, latitude]", () => {
    expect(
      getMapPosition({
        location: { coordinates: [51.4, 35.7] },
      }),
    ).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
  });

  it("normalizes swapped coordinates for Iran locations", () => {
    expect(getMapPosition({ lat: 51.4, lng: 35.7 })).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
  });

  it("resolves nested point, geo, coordinate, map and address objects", () => {
    expect(getMapPosition({ point: { lat: 35.75, lng: 51.41 } })).toEqual({
      latitude: 35.75,
      longitude: 51.41,
    });
    expect(getMapPosition({ geo: { latitude: 35.75, longitude: 51.41 } })).toEqual({
      latitude: 35.75,
      longitude: 51.41,
    });
    expect(
      getMapPosition({
        location: { lat: 35.75, lng: 51.41 } as unknown as AdvertisementItem["location"],
      }),
    ).toEqual({
      latitude: 35.75,
      longitude: 51.41,
    });
  });

  it("falls back to agency coordinates for agency advertisements without ad-specific coordinates", () => {
    const agencyAd = {
      id: "ad-1",
      publisher_type: "agency",
      agency: {
        id: "agency-9",
        name: "املاک نمونه",
        lat: 35.72,
        lng: 51.43,
      },
    };
    expect(getMapPosition(agencyAd)).toEqual({
      latitude: 35.72,
      longitude: 51.43,
    });
  });

  it("falls back to consultant coordinates for consultant advertisements", () => {
    const consultantAd = {
      id: "ad-2",
      publisher_type: "agency-consultant",
      consultant: {
        id: "consultant-5",
        name: "مشاور تست",
        latitude: 35.73,
        longitude: 51.44,
      },
    };
    expect(getMapPosition(consultantAd)).toEqual({
      latitude: 35.73,
      longitude: 51.44,
    });
  });

  it("returns null for invalid coordinates or missing data", () => {
    expect(getMapPosition({})).toBeNull();
    expect(getMapPosition({ lat: 195, lng: 51.4 })).toBeNull();
    expect(getMapPosition({ lat: "invalid", lng: "invalid" })).toBeNull();
  });
});

describe("getAdvertiserPreview - Role Matching", () => {
  const dummyDetails = {
    agency: "آژانس تست",
    agencyLocation: "تهران، ونک",
    locationTitle: "تهران",
  } as ViewAdDetails;

  it("handles agency publisher", () => {
    const ad: AdvertisementItem = {
      publisher_type: "agency",
      agency: { id: 10, name: "آژانس البرز", location: "ونک" },
    };
    const preview = getAdvertiserPreview(ad, dummyDetails);
    expect(preview).not.toBeNull();
    expect(preview?.kind).toBe("agency");
    expect(preview?.name).toBe("آژانس البرز");
  });

  it("handles agency-consultant publisher", () => {
    const ad: AdvertisementItem = {
      publisher_type: "agency-consultant",
      agent: { id: 15, name: "علی محمدی", agency_name: "املاک مهر" },
    };
    const preview = getAdvertiserPreview(ad, dummyDetails);
    expect(preview).not.toBeNull();
    expect(preview?.kind).toBe("agent");
    expect(preview?.name).toBe("علی محمدی");
    expect(preview?.subtitle).toBe("مشاور آژانس");
  });

  it("handles consultant with consultant property object", () => {
    const ad: AdvertisementItem = {
      owner_type: "consultant",
      consultant: { id: 20, name: "رضا رضایی" },
    };
    const preview = getAdvertiserPreview(ad, dummyDetails);
    expect(preview).not.toBeNull();
    expect(preview?.kind).toBe("agent");
    expect(preview?.name).toBe("رضا رضایی");
    expect(preview?.subtitle).toBe("مشاور مستقل");
  });
});

describe("PreSaleViewContent - Map Rendering", () => {
  const dummyDetails = {
    formCode: "presale-special",
    title: "پروژه برج نگین",
    description: "توضیحات کامل پروژه پیش‌فروش",
    features: [],
    propertyInfoPreview: [],
    projectDetails: [],
  } as unknown as ViewAdDetails;

  it("renders map section when mapPosition is provided", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <PreSaleViewContent
          adId="100"
          details={dummyDetails}
          mapPosition={{ latitude: 35.7, longitude: 51.4 }}
        />
      </MemoryRouter>,
    );
    expect(html).toContain("توضیحات");
    expect(html).toContain("موقعیت آگهی روی نقشه");
  });

  it("omits map when mapPosition is null", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <PreSaleViewContent adId="100" details={dummyDetails} mapPosition={null} />
      </MemoryRouter>,
    );
    expect(html).toContain("توضیحات");
    expect(html).not.toContain("موقعیت آگهی روی نقشه");
  });
});
