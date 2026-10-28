import { expect, test } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NeighborhoodResults } from "../../src/features/search/filters/NeighborhoodResults";
import { useFilterValues } from "../../src/features/search/filters/useFilterValues";
import { initialFilters } from "../../src/features/search/filters/filterState";
import type { FilterState } from "../../src/features/search/filters/filterTypes";
import { createRangeBlock } from "../../src/features/search/filters/fieldBlocks";
import { groupFilterBlocks, getFilterSectionAnchor } from "../../src/features/search/filters/blockGrouping";
import { buildFilterBlocksFromSchema } from "../../src/features/search/filters/schemaBlocks";
import { saleApartmentFacilityItems } from "../../src/features/advertisements/create/data";

const renderResults = (overrides: Partial<Parameters<typeof NeighborhoodResults>[0]> = {}) =>
  renderToStaticMarkup(createElement(NeighborhoodResults, {
    cityId: "1",
    isLoading: false,
    isError: false,
    onRetry: () => {},
    neighborhoods: [],
    selectedIds: new Set<string>(),
    toggleNeighborhood: () => {},
    query: "",
    ...overrides,
  }));

test("keeps neighborhood city, loading, error and empty state precedence", () => {
  const noCity = renderResults({ cityId: "", isLoading: true, isError: true });
  expect(noCity).toContain("برای انتخاب محله، ابتدا شهر را انتخاب کنید.");
  expect(noCity).not.toContain("animate-pulse");
  const loading = renderResults({ isLoading: true, isError: true });
  expect(loading.match(/animate-pulse/g)).toHaveLength(7);
  expect(loading).not.toContain("تلاش دوباره");
  const error = renderResults({ isError: true });
  expect(error).toContain("دریافت محله‌ها با خطا مواجه شد.");
  expect(error).toContain("تلاش دوباره");
  expect(renderResults()).toContain("محله‌ای برای این شهر ثبت نشده است.");
  expect(renderResults({ query: "مرکز" })).not.toContain("محله‌ای برای این شهر ثبت نشده است.");
});

test("preserves equivalent selection toggling and independent range endpoints", () => {
  let state: FilterState = { ...initialFilters, ranges: {}, singles: {}, multis: {}, toggles: {} };
  const actions = useFilterValues((update) => {
    state = typeof update === "function" ? update(state) : update;
  });
  actions.setRangeValue("price", "minimum", "100");
  actions.setRangeValue("price", "maximum", "200");
  expect(state.ranges.price).toEqual({ minimum: "100", maximum: "200" });
  actions.setSingleValue("floor", "همکف");
  actions.setSingleValue("floor", "0");
  expect(state.singles.floor).toBeUndefined();
  actions.toggleMultiValue("rooms", "۳ اتاق");
  actions.toggleMultiValue("rooms", "3");
  expect(state.multis.rooms).toEqual([]);
  actions.toggleMultiValue("rooms", "۴ اتاق");
  expect(state.multis.rooms).toEqual(["۴ اتاق"]);
  actions.setToggleValue("hasLoan", true);
  expect(state.toggles.hasLoan).toBe(true);
  expect(initialFilters.ranges).toEqual({});
});

test("groups only adjacent dimension or rent-price topics and retains leaf identity", () => {
  const area = createRangeBlock("meterage", "متراژ", "area");
  const width = createRangeBlock("landWidth", "عرض", "number");
  const price = createRangeBlock("price", "قیمت", "money");
  const mortgage = createRangeBlock("mortgagePrice", "رهن", "money");
  const rent = createRangeBlock("rentPrice", "اجاره", "money");
  const blocks = groupFilterBlocks([area, width, price, mortgage, rent]);
  expect(blocks.map((block) => block.kind)).toEqual(["range-group", "range", "range-group"]);
  expect(blocks[1]).toBe(price);
  expect(getFilterSectionAnchor(blocks[0])).toBe("area");
  expect(getFilterSectionAnchor(blocks[2])).toBe("price");
  expect(blocks[0]).toMatchObject({ id: "meterage-landWidth", blocks: [area, width] });
});

test("schema adaptation keeps age multi choices and empty amenities fallback order", () => {
  const blocks = buildFilterBlocksFromSchema([
    { kind: "single", id: "age", title: "سن", options: ["نوساز", "۱ سال"] },
    { kind: "multi", id: "facilities", title: "امکانات", options: [] },
  ], "sale", "apartment");
  expect(blocks[0]).toMatchObject({ kind: "multi", options: [
    { id: "نوساز", label: "نوساز" }, { id: "۱ سال", label: "۱ سال" },
  ] });
  expect(blocks[1]).toMatchObject({ kind: "multi", options: saleApartmentFacilityItems });
});
