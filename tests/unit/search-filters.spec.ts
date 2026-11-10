import { expect, test } from "vitest";
import { readSearchFilters } from "../../src/features/search/searchFilters";
import {
  categoryGroupsByTransaction,
  categoryLabels,
  getAdvertiseFormCode,
  getListingFromFormCode,
  transactionTabs,
} from "../../src/features/search/filters/categories";

test("parses standard API filters without leaking navigation parameters", () => {
  const filters = readSearchFilters(
    new URLSearchParams({
      area_min: "50",
      area_max: "120",
      building_age: "5",
      category_id: "3",
      floor: "2",
      form_code: "rent-apartment",
      has_image: "true",
      has_video: "false",
      is_special: "1",
      neighborhood_id: "7_8",
      price_min: "100",
      price_max: "500",
      published_at: "today",
      rooms: "3",
      query: "  تهران  ",
      city_id: "2",
      page: "4",
      per_page: "20",
      view: "list",
      focus: "price",
      returnTo: "/account",
    }),
  );
  expect(filters).toEqual({
    areaMin: "50",
    areaMax: "120",
    buildingAge: "5",
    categoryId: "3",
    floor: "2",
    formCode: "rent-apartment",
    hasImage: "true",
    hasVideo: "false",
    isSpecial: "1",
    neighborhoodId: "7_8",
    priceMin: "100",
    priceMax: "500",
    publishedAt: "today",
    rooms: "3",
    query: "تهران",
    featureFilters: {},
  });
});

test("preserves legacy aliases and arbitrary feature filters", () => {
  const filters = readSearchFilters(
    new URLSearchParams(
      "from_code=sale-land&neighborhoods=9&qsearch=زمین&land_area_min=20&facilities=elevator_parking&custom=0&empty=&city_id=3",
    ),
  );
  expect(filters.formCode).toBe("sale-land");
  expect(filters.neighborhoodId).toBe("9");
  expect(filters.query).toBe("زمین");
  expect(filters.featureFilters).toEqual({
    land_area_min: "20",
    facilities: "elevator_parking",
    custom: "0",
  });
});

test("preserves query precedence and empty query handling", () => {
  expect(readSearchFilters(new URLSearchParams("query=first&qsearch=second&q=third")).query).toBe(
    "first",
  );
  expect(readSearchFilters(new URLSearchParams("q=one")).query).toBe("one");
  expect(readSearchFilters(new URLSearchParams("query=++&q=fallback")).query).toBeUndefined();
  expect(readSearchFilters(new URLSearchParams()).featureFilters).toEqual({});
});

test("round-trips every visible category and preserves transaction order", () => {
  expect(transactionTabs.map((tab) => tab.value)).toEqual(["sale", "rent", "project"]);
  for (const transaction of transactionTabs.map((tab) => tab.value)) {
    for (const group of categoryGroupsByTransaction[transaction]) {
      for (const category of group.items) {
        expect(categoryLabels[category]).toBeTruthy();
        expect(getListingFromFormCode(getAdvertiseFormCode(transaction, category))).toEqual({
          transaction,
          category,
        });
      }
    }
  }
  expect(getAdvertiseFormCode("project", "project-partnership")).toBe("partnership");
  expect(getAdvertiseFormCode("rent", "daily-workspace")).toBe("daily-office-booth");
});

test.each(["", "unknown", "sale-unknown", "invalid-apartment"])(
  "rejects unknown form code %s",
  (code) => {
    expect(getListingFromFormCode(code)).toBeNull();
  },
);
