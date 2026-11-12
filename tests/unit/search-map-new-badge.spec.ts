import { expect, test } from "vitest";
import { createSearchPricePillIcon } from "../../src/features/search/components/SearchMapMarker";
import { isListingNewWithin24Hours } from "../../src/features/search/map/listingMapper";

test("isListingNewWithin24Hours detects ads newer than 24 hours", () => {
  const now = Date.parse("2026-11-12T12:00:00Z");

  expect(isListingNewWithin24Hours({ created_at: "2026-11-12T00:00:00Z" }, now)).toBe(true);
  expect(isListingNewWithin24Hours({ created_at: "2026-11-12T15:30:00Z" }, now)).toBe(true);
  expect(isListingNewWithin24Hours({ created_at: "2026-11-11T12:00:00Z" }, now)).toBe(true);
  expect(isListingNewWithin24Hours({ created_at: "2026-11-11T11:59:59Z" }, now)).toBe(false);

  expect(isListingNewWithin24Hours({ published_hours_ago: 0 }, now)).toBe(true);
  expect(isListingNewWithin24Hours({ published_hours_ago: 23 }, now)).toBe(true);
  expect(isListingNewWithin24Hours({ published_hours_ago: 24 }, now)).toBe(false);

  expect(isListingNewWithin24Hours({ published_days: 0 }, now)).toBe(true);
  expect(isListingNewWithin24Hours({ published_days: 2 }, now)).toBe(false);

  expect(isListingNewWithin24Hours({ published_time_ago: "۳ ساعت پیش" }, now)).toBe(true);
  expect(isListingNewWithin24Hours({ published_time_ago: "دقایقی پیش" }, now)).toBe(true);
  expect(isListingNewWithin24Hours({ published_time_ago: "۲ روز پیش" }, now)).toBe(false);
});

test("createSearchPricePillIcon renders جدید badge only when isNew is true", () => {
  const newIcon = createSearchPricePillIcon("۳.۵ میلیارد", false, false, true);
  expect(String(newIcon.options.html)).toContain("search-map-marker__new-badge");
  expect(String(newIcon.options.html)).toContain("جدید");

  const regularIcon = createSearchPricePillIcon("۳.۵ میلیارد", false, false, false);
  expect(String(regularIcon.options.html)).not.toContain("search-map-marker__new-badge");
});
