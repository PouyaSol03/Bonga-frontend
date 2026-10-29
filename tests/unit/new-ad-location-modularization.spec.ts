import { describe, expect, it } from "vitest";
import {
  findMatchingSubNeighborhood,
  getNeighborhoodId,
  getSubNeighborhoodId,
  normalizeLocationName,
} from "../../src/features/advertisements/create/location/newAdLocationStorage";
import {
  getPolygonCenter,
  isPointInsidePolygon,
} from "../../src/features/advertisements/create/location/newAdLocationGeometry";

describe("NewAdLocation Modularization", () => {
  it("normalizes location name correctly", () => {
    expect(normalizeLocationName(" نیاوران ")).toBe("نیاوران");
    expect(normalizeLocationName("SAADAT ABAD")).toBe("saadat abad");
  });

  it("extracts neighborhood and sub-neighborhood IDs", () => {
    expect(getNeighborhoodId({ id: 123, name: "ونک" })).toBe("123");
    expect(getNeighborhoodId({ _id: "abc", name: "تجریش" })).toBe("abc");
    expect(getNeighborhoodId(null)).toBe("");

    expect(getSubNeighborhoodId({ id: "sub-1", name: "محله ۱" })).toBe("sub-1");
    expect(getSubNeighborhoodId(null)).toBe("");
  });

  it("calculates polygon center and point containment", () => {
    const polygon: Array<[number, number]> = [
      [0, 0],
      [0, 4],
      [4, 4],
      [4, 0],
    ];

    const center = getPolygonCenter(polygon);
    expect(center).not.toBeNull();
    if (center) {
      expect(Math.round(center.lat)).toBe(2);
      expect(Math.round(center.lng)).toBe(2);
    }

    expect(isPointInsidePolygon(2, 2, polygon)).toBe(true);
    expect(isPointInsidePolygon(10, 10, polygon)).toBe(false);
  });

  it("finds matching sub-neighborhood by id or name", () => {
    const neighborhood = {
      id: "neigh-1",
      name: "منطقه ۱",
      sub_neighborhoods: [
        { id: "sub-10", name: "قیطریه" },
        { id: "sub-20", name: "الهیه" },
      ],
    };

    const matchById = findMatchingSubNeighborhood(neighborhood, {
      id: "sub-10",
      name: "دیگر",
    });
    expect(matchById?.name).toBe("قیطریه");

    const matchByName = findMatchingSubNeighborhood(neighborhood, {
      id: "unknown",
      name: "الهیه",
    });
    expect(matchByName?.id).toBe("sub-20");
  });
});
