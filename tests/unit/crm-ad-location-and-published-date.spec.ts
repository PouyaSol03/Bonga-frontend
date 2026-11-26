import { describe, expect, it } from "vitest";
import {
  advertiseLocationLabel,
  mapCrmAdvertiseToCard,
} from "../../src/features/crm/layout/advertiseFormatters";
import { formatDate } from "../../src/features/crm/advertise-detail/formatters";
import { readHumanText } from "../../src/features/crm/advertise-detail/helpers";

const sampleAdvertise = {
  id: 592,
  title: "فول آلاچیق استخر نهال آماده",
  price: 40000000000,
  features: [
    { label: "form_code", value: "sale-villa-house" },
    { label: "land_area", value: 450 },
    { label: "building_area", value: 250 },
    { label: "rooms", value: "2" },
    { label: "building_age", value: "3" },
  ],
  neighborhood_id: 85,
  user_address: "رضا شهر",
  location: "رضا شهر",
  location_label: "رضا شهر",
  neighborhood_name: null,
  neighborhood: { id: 85, name: null },
  published_hours_ago: 2,
  created_at: "2026-11-26T11:38:49.234Z",
  confirm_date: "2026-11-26T12:07:17.879Z",
  status: "accepted",
  track_code: 961994,
};

describe("CRM Ad Location, Address, and Published Date", () => {
  it("resolves location_label / user_address / location when neighborhood_name is null", () => {
    expect(advertiseLocationLabel(sampleAdvertise)).toBe("رضا شهر");

    const directNeighborhood = readHumanText(sampleAdvertise, [
      "form_neighborhood_title",
      "neighborhood_name",
      "district_name",
      "location_label",
      "location",
      "user_address",
    ]);
    expect(directNeighborhood).toBe("رضا شهر");
  });

  it("preserves published time alongside resolved location in CRM card timeAndLocation", () => {
    const card = mapCrmAdvertiseToCard(sampleAdvertise, 0);
    expect(card.timeAndLocation).toContain("رضا شهر");
    expect(card.timeAndLocation).not.toBe("موقعیت ثبت نشده");
  });

  it("formats confirm_date / created_at into readable Persian date and time", () => {
    const formatted = formatDate(sampleAdvertise.confirm_date ?? sampleAdvertise.created_at);
    expect(formatted).not.toBe("-");
    expect(formatted).toContain("۱۴۰۵");
  });
});
