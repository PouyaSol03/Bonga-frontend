import { describe, expect, it } from "vitest";
import {
  buildFilters,
  emptyFilters,
  getInitialPropertyTypes,
  getNeighborhoodId,
  toSelectedNeighborhood,
} from "../../src/features/account/adManagement/filter/filterHelpers";

describe("Ad Filter Modularization", () => {
  it("extracts neighborhood id properly from id, _id or name", () => {
    expect(getNeighborhoodId({ id: "123", name: "محله ۱" })).toBe("123");
    expect(getNeighborhoodId({ _id: "456", name: "محله ۲" })).toBe("456");
    expect(getNeighborhoodId({ name: "سعادت آباد" })).toBe("سعادت آباد");
  });

  it("converts NeighborhoodDto to selected neighborhood", () => {
    expect(toSelectedNeighborhood({ id: "10", name: "ونک" })).toEqual({
      id: "10",
      name: "ونک",
    });
  });

  it("builds filters correctly with fallback propertyType", () => {
    const filters = buildFilters({
      neighborhoods: [{ id: "1", name: "تجریش" }],
      propertyTypes: ["apartment", "villa"],
      publisher: "املاک برتر",
      status: "فعال",
      transaction: "sale",
    });

    expect(filters.propertyType).toBe("apartment");
    expect(filters.propertyTypes).toEqual(["apartment", "villa"]);
    expect(filters.publisher).toBe("املاک برتر");
    expect(filters.status).toBe("فعال");
    expect(filters.transaction).toBe("sale");
    expect(filters.neighborhoods).toHaveLength(1);
  });

  it("extracts initial property types", () => {
    expect(getInitialPropertyTypes({ neighborhoods: [] })).toEqual([]);
    expect(getInitialPropertyTypes({ neighborhoods: [], propertyType: "villa" })).toEqual([
      "villa",
    ]);
    expect(
      getInitialPropertyTypes({
        neighborhoods: [],
        propertyType: "villa",
        propertyTypes: ["apartment"],
      }),
    ).toEqual(["apartment"]);
  });

  it("provides valid empty filters default", () => {
    expect(emptyFilters).toEqual({ neighborhoods: [] });
  });
});
