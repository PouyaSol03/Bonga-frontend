import { describe, expect, it } from "vitest";
import {
  isValidCoordinatePair,
  normalizeCoordinatePair,
  getAdMapPosition,
} from "../../src/features/search/map/coordinateHelpers";
import {
  getActiveFilterCount,
  getSearchParamsFromSnapshot,
} from "../../src/features/search/map/searchParamsHelpers";
import { getDynamicFilterChips } from "../../src/features/search/map/chipHelpers";
import { mapAdvertisementToSearchListing } from "../../src/features/search/map/listingMapper";
import { resolveListingPricing } from "../../src/features/search/map/listingPricingHelpers";
import {
  buildListQueryParams,
  buildMapQueryParams,
  hasSearchCriteria,
} from "../../src/features/search/map/queryParams";

describe("Search Map Coordinate Helpers", () => {
  it("validates coordinate boundaries", () => {
    expect(isValidCoordinatePair(35.6892, 51.389)).toBe(true);
    expect(isValidCoordinatePair(95, 51)).toBe(false);
    expect(isValidCoordinatePair(35, 185)).toBe(false);
  });

  it("normalizes swapped coordinates for Iran latitudes and longitudes", () => {
    const direct = normalizeCoordinatePair(35.6892, 51.389);
    expect(direct).toEqual({ latitude: 35.6892, longitude: 51.389 });

    const swapped = normalizeCoordinatePair(51.389, 35.6892);
    expect(swapped).toEqual({ latitude: 35.6892, longitude: 51.389 });
  });

  it("extracts coordinates from various position formats", () => {
    expect(getAdMapPosition({ lat: 35.7, lng: 51.4 })).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
    expect(getAdMapPosition({ coordinates: [51.4, 35.7] })).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
    expect(getAdMapPosition({ location: { lat: 35.7, lng: 51.4 } })).toEqual({
      latitude: 35.7,
      longitude: 51.4,
    });
  });
});

describe("Search Map Filter & Chip Helpers", () => {
  it("counts active filter params correctly", () => {
    const params = getSearchParamsFromSnapshot("?rooms=2_3&price_min=1000&area_max=120");
    expect(getActiveFilterCount(params)).toBe(3);
  });

  it("creates dynamic filter chips from search string", () => {
    const chips = getDynamicFilterChips("?form_code=rent-apartment&rooms=2");
    expect(chips.length).toBeGreaterThanOrEqual(2);
    expect(chips[0].id).toBe("filters");
    expect(chips[0].isActive).toBe(true);
    const categoryChip = chips.find((c) => c.id === "category");
    expect(categoryChip?.isActive).toBe(true);
    expect(categoryChip?.label).toBe("اجاره آپارتمان");
  });

  it("evaluates active search criteria correctly", () => {
    expect(hasSearchCriteria("")).toBe(false);
    expect(hasSearchCriteria("?query=ونک")).toBe(true);
    expect(hasSearchCriteria("?rooms=2")).toBe(true);
  });
});

describe("Search Map Listing Mapper & Pricing", () => {
  it("resolves presale special pricing and builder share", () => {
    const pricing = resolveListingPricing(
      {
        price: 50_000_000,
        min_meter_price: 45_000_000,
        max_meter_price: 60_000_000,
        builder_share: "60",
      },
      "presale-special",
      "پیش فروش",
    );
    expect(pricing.priceLabel).toBe("قیمت متری:");
    expect(pricing.builderShare).toBe("۶۰٪");
  });

  it("maps advertisement item into valid search map listing", () => {
    const item = {
      id: "ad-123",
      title: "آپارتمان ۱۰۰ متری",
      lat: 35.75,
      lng: 51.42,
      price: 8_500_000_000,
      form_code: "sale-apartment",
      rooms: 2,
      features: [{ key: "building_age", value: "5" }],
    };
    const listing = mapAdvertisementToSearchListing(item, 0);
    expect(listing).not.toBeNull();
    expect(listing?.id).toBe("ad-123");
    expect(listing?.latitude).toBe(35.75);
    expect(listing?.longitude).toBe(51.42);
    expect(listing?.priceLabel).toBe("قیمت");
  });
});

describe("Search Map Query Params Builder", () => {
  it("builds map query params with bounded rounded coordinates", () => {
    const bounds = {
      north: 35.7891234,
      south: 35.6123456,
      east: 51.4987654,
      west: 51.3123456,
    };
    const params = buildMapQueryParams(bounds, "?city_id=1");
    expect(params).not.toBeNull();
    expect(params?.north).toBe(35.789123);
    expect(params?.south).toBe(35.612346);
    expect(params?.east).toBe(51.498765);
    expect(params?.west).toBe(51.312346);
    expect(params?.limit).toBe(100);
  });

  it("builds list query params with default pagination", () => {
    const listParams = buildListQueryParams("?city_id=2&rooms=3");
    expect(listParams.cityId).toBe("2");
    expect(listParams.page).toBe(1);
    expect(listParams.perPage).toBe(20);
  });
});
