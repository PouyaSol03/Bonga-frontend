import { expect, test } from "vitest";
import { createHash } from "node:crypto";
import {
  normalizeExactFilterValue,
  normalizeRangeNumber,
  formatPersianGroupedNumberInput,
} from "../../src/features/search/filters/numberValues";
import { readInitialFiltersFromUrl } from "../../src/features/search/filters/readInitialFilters";
import { buildSearchUrl } from "../../src/features/search/filters/buildSearchUrl";
import { getBackToSearchPath } from "../../src/features/search/filters/filterNavigation";
import { getFilterBlocks } from "../../src/features/search/filters/filterBlocks";
import { groupFilterBlocks } from "../../src/features/search/filters/blockGrouping";
import {
  categoryGroupsByTransaction,
  transactionTabs,
} from "../../src/features/search/filters/categories";

const visit = (search = "") => window.history.replaceState({}, "", `/search/filters${search}`);

test("preserves every category's ordered block configuration and options", () => {
  const matrix = transactionTabs.flatMap(({ value }) =>
    categoryGroupsByTransaction[value].flatMap(({ items }) =>
      items.map((category) => ({
        transaction: value,
        category,
        blocks: getFilterBlocks(value, category),
        grouped: groupFilterBlocks(getFilterBlocks(value, category)),
      })),
    ),
  );
  expect(createHash("sha256").update(JSON.stringify(matrix)).digest("hex")).toMatchInlineSnapshot(
    `"3f6fbbb0dc83693bc6e09ea298cdf3c36b413a32be2408a0b44f2e3c07da01d8"`,
  );
  expect(getFilterBlocks("sale")).toEqual([]);
});

test.each([
  ["همکف", "0"],
  ["بدون", "0"],
  [" ۳ اتاق ", "3"],
  ["۴۰ و بیشتر", "40"],
  ["۵۰+ نفر", "50"],
  ["نوساز", "نوساز"],
  [undefined, ""],
])("normalizes exact selection %s", (input, expected) => {
  expect(normalizeExactFilterValue(input)).toBe(expected);
});

test("preserves numeric input grouping and decimal handling", () => {
  expect(normalizeRangeNumber("۱،۲۳۴.۵ تومان")).toBe("1234.5");
  expect(formatPersianGroupedNumberInput("1234567.5")).toBe("۱،۲۳۴،۵۶۷.۵");
  expect(formatPersianGroupedNumberInput("")).toBe("");
});

test("reads aliases, flags, multi selections, ranges and shared range identity", () => {
  visit(
    "?from_code=sale-land&area_min=20&price_min=1200&floor=1_2&rooms=3،4&building_age=5,6&neighborhoods=7_8&land_use=مسکونی_اداری&has_image=1&has_video=false&is_special=true&has_loan=1&loan_amount=9&land_area_max=70&custom=x",
  );
  const state = readInitialFiltersFromUrl();
  expect(state.transaction).toBe("sale");
  expect(state.category).toBe("land");
  expect(state.ranges.meterage).toBe(state.ranges.buildingArea);
  expect(state.ranges.price).toBe(state.ranges.projectPrice);
  expect(state.ranges.landArea).toEqual({ minimum: "", maximum: "70" });
  expect(state.ranges.price?.minimum).toBe("۱،۲۰۰");
  expect(state.multis).toMatchObject({
    floor: ["1", "2"],
    rooms: ["3", "4"],
    age: ["5", "6"],
    usageType: ["مسکونی", "اداری"],
  });
  expect(state.neighborhoods).toEqual([
    { id: "7", name: "7" },
    { id: "8", name: "8" },
  ]);
  expect([state.featured, state.hasPhoto, state.hasVideo, state.toggles.hasLoan]).toEqual([
    true,
    true,
    false,
    true,
  ]);
  expect(state.loanAmount).toBe("9");
  expect(state.singles.custom).toBeUndefined();
});

test("keeps daily price aliases and category focus precedence", () => {
  visit(
    "?form_code=daily-apartment-suite&price_min=100&normal_daily_price_min=200&daily_price_max=300&focus=category",
  );
  const state = readInitialFiltersFromUrl();
  expect(state.category).toBeUndefined();
  expect(state.ranges.dailyPrice).toEqual({ minimum: "", maximum: "300" });
});

test("serializes defaults, aliases and unknown params without navigation keys", () => {
  visit(
    "?form_code=sale-apartment&category_id=3&categoryId=4&focus=price&custom=keep&loan_amount=99&loan_installment=88",
  );
  const state = readInitialFiltersFromUrl();
  state.ranges.meterage = { minimum: "۵۰", maximum: "۱۲۰" };
  state.multis.rooms = ["۳ اتاق", "۴ اتاق"];
  state.singles.rooms = "1";
  state.multis.facilities = ["parking", "elevator"];
  const url = new URL(buildSearchUrl(state), window.location.origin);
  expect(url.pathname).toBe("/search");
  expect(Object.fromEntries(url.searchParams)).toEqual({
    form_code: "sale-apartment",
    from_code: "sale-apartment",
    custom: "keep",
    view: "map",
    area_min: "50",
    area_max: "120",
    rooms: "3_4",
    facilities: "parking_elevator",
  });
});

test("restricts return paths and preserves safe destination query precedence", () => {
  visit("?returnTo=%2Fdashboard%3Fview%3Dlist%26custom%3Dtarget&custom=source&focus=price");
  expect(getBackToSearchPath()).toBe("/dashboard?view=list&custom=target");
  const url = new URL(buildSearchUrl(readInitialFiltersFromUrl()), window.location.origin);
  expect(url.pathname).toBe("/dashboard");
  expect(url.searchParams.get("custom")).toBe("target");
  expect(url.searchParams.get("view")).toBe("list");
  for (const unsafe of ["https://evil.test", "//evil.test", "relative"]) {
    visit(`?returnTo=${encodeURIComponent(unsafe)}&focus=price&custom=keep`);
    expect(getBackToSearchPath("/fallback")).toBe("/fallback?custom=keep");
    expect(buildSearchUrl(readInitialFiltersFromUrl(), "/fallback")).toBe(
      "/fallback?custom=keep&view=map",
    );
  }
});
