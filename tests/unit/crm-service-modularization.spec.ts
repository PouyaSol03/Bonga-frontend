import { describe, expect, it } from "vitest";
import {
  compactSearchParams,
  getCrmRecordId,
  normalizeRows,
  unwrapRecord,
} from "../../src/features/crm/api/crm.service";

describe("CrmService Modularization", () => {
  it("compacts search params by omitting undefined and null", () => {
    const params = {
      page: 1,
      search: "test",
      status: undefined,
      extra: null,
    };
    expect(compactSearchParams(params)).toEqual({
      page: 1,
      search: "test",
    });
  });

  it("extracts record IDs from id or _id correctly", () => {
    expect(getCrmRecordId({ id: 123 })).toBe("123");
    expect(getCrmRecordId({ _id: "abc" })).toBe("abc");
    expect(getCrmRecordId({})).toBe("");
  });

  it("normalizes rows from array and container wrappers", () => {
    expect(normalizeRows([1, 2, 3])).toEqual([1, 2, 3]);
    expect(normalizeRows({ data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(normalizeRows({ advertises: [{ id: 2 }] })).toEqual([{ id: 2 }]);
    expect(normalizeRows(null)).toEqual([]);
  });

  it("unwraps nested records safely", () => {
    const nested = { data: { advertise: { id: "10" } } };
    expect(unwrapRecord(nested, ["data", "advertise"])).toEqual({ id: "10" });
  });
});
