import { describe, expect, it } from "vitest";
import type { LatLngTuple } from "leaflet";
import {
  getEdgeMidpoint,
  isBoundaryInsidePolygon,
  isPointInsideOrOnPolygon,
  pointsToGeoJson,
  polygonCenter,
  samePoint,
  segmentsProperlyIntersect,
} from "../../src/features/crm/location-map/geometry";
import {
  getSubNeighborhoodColor,
  MAIN_BOUNDARY_COLOR,
  SUB_BOUNDARY_COLOR,
} from "../../src/features/crm/location-map/constants";
import {
  buildBoundaryItems,
  parseMaybeJson,
  parseSubNeighborhoods,
  targetBoundaryId,
} from "../../src/features/crm/location-map/urlAndRecordHelpers";

describe("CRM Location Map geometry utilities", () => {
  it("calculates center of polygon points accurately", () => {
    const points: LatLngTuple[] = [
      [35.0, 51.0],
      [35.0, 52.0],
      [36.0, 52.0],
      [36.0, 51.0],
    ];
    const center = polygonCenter(points, [0, 0]);
    expect(center).toEqual([35.5, 51.5]);
  });

  it("converts points to GeoJSON Polygon format", () => {
    const points: LatLngTuple[] = [
      [35.0, 51.0],
      [35.0, 52.0],
      [36.0, 52.0],
    ];
    const geoJson = pointsToGeoJson(points);
    expect(geoJson).toEqual({
      type: "Polygon",
      coordinates: [
        [
          [51.0, 35.0],
          [52.0, 35.0],
          [52.0, 36.0],
          [51.0, 35.0],
        ],
      ],
    });
  });

  it("returns null when points are fewer than 3", () => {
    const points: LatLngTuple[] = [
      [35.0, 51.0],
      [35.0, 52.0],
    ];
    expect(pointsToGeoJson(points)).toBeNull();
  });

  it("compares points within epsilon", () => {
    expect(samePoint([35.1234567, 51.1234567], [35.1234567, 51.1234567])).toBe(true);
    expect(samePoint([35.1, 51.1], [35.2, 51.1])).toBe(false);
  });

  it("computes edge midpoint correctly", () => {
    const midpoint = getEdgeMidpoint([10, 20], [20, 40]);
    expect(midpoint).toEqual([15, 30]);
  });

  it("identifies points inside a polygon", () => {
    const polygon: LatLngTuple[] = [
      [0, 0],
      [0, 10],
      [10, 10],
      [10, 0],
    ];
    expect(isPointInsideOrOnPolygon([5, 5], polygon)).toBe(true);
    expect(isPointInsideOrOnPolygon([0, 5], polygon)).toBe(true);
    expect(isPointInsideOrOnPolygon([15, 15], polygon)).toBe(false);
  });

  it("validates segments proper intersection", () => {
    expect(
      segmentsProperlyIntersect([0, 0], [10, 10], [0, 10], [10, 0]),
    ).toBe(true);
    expect(
      segmentsProperlyIntersect([0, 0], [5, 5], [6, 6], [10, 10]),
    ).toBe(false);
  });

  it("validates boundary inside parent polygon", () => {
    const parent: LatLngTuple[] = [
      [0, 0],
      [0, 10],
      [10, 10],
      [10, 0],
    ];
    const subInside: LatLngTuple[] = [
      [2, 2],
      [2, 4],
      [4, 4],
      [4, 2],
    ];
    const subOutside: LatLngTuple[] = [
      [2, 2],
      [2, 12],
      [12, 12],
      [12, 2],
    ];
    expect(isBoundaryInsidePolygon(subInside, parent)).toBe(true);
    expect(isBoundaryInsidePolygon(subOutside, parent)).toBe(false);
  });
});

describe("CRM Location Map color & record helpers", () => {
  it("generates deterministic colors for sub-neighborhood keys", () => {
    const color1 = getSubNeighborhoodColor("sub-123");
    const color2 = getSubNeighborhoodColor("sub-123");
    expect(color1).toBe(color2);
    expect(getSubNeighborhoodColor("")).toBe(SUB_BOUNDARY_COLOR);
  });

  it("parses maybe JSON and sub-neighborhoods", () => {
    expect(parseMaybeJson('{"foo": 1}')).toEqual({ foo: 1 });
    expect(parseMaybeJson("invalid json")).toBe("invalid json");

    const parsed = parseSubNeighborhoods([
      { id: "1", name: "محله الف" },
      { id: "2", title: "محله ب" },
    ]);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("محله الف");
    expect(parsed[1].name).toBe("محله ب");
  });

  it("resolves targetBoundaryId correctly", () => {
    expect(targetBoundaryId(null)).toBe("");
    expect(targetBoundaryId({ kind: "neighborhood", neighborhoodId: "42" })).toBe("n:42");
    expect(
      targetBoundaryId({ isNew: false, kind: "sub-neighborhood", neighborhoodId: "42", subId: "7" }),
    ).toBe("s:42:7");
    expect(
      targetBoundaryId({ isNew: true, kind: "sub-neighborhood", neighborhoodId: "42", subId: "7" }),
    ).toBe("");
  });
});
