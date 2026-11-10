import { describe, expect, it } from "vitest";
import {
  buildConsultantEditorState,
  filterConsultants,
} from "../../src/features/crm/consultants/consultantHelpers";
import {
  getNeighborhoodId,
  toSelectedNeighborhood,
} from "../../src/features/dashboard/components/neighborhood/neighborhoodHelpers";

describe("CrmConsultants Modularization", () => {
  const dummyConsultants = [
    {
      id: "agent-1",
      name: "علی",
      family: "رضایی",
      mobile: "09123456789",
      status: "accept",
      agency_id: "agency-1",
      type: "dependent",
    },
    {
      id: "agent-2",
      name: "رضا",
      family: "احمدی",
      mobile: "09351112233",
      status: "pending",
      agency_id: null,
      type: "independent",
    },
  ];

  const agencyNames = new Map([["agency-1", "املاک نوین"]]);

  it("filters consultants by search term matching name or mobile", () => {
    const result = filterConsultants(
      dummyConsultants,
      { agencyId: "", agencyOnly: false, search: "رضایی", status: "" },
      agencyNames,
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("agent-1");
  });

  it("filters consultants by status", () => {
    const result = filterConsultants(
      dummyConsultants,
      { agencyId: "", agencyOnly: false, search: "", status: "pending" },
      agencyNames,
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("agent-2");
  });

  it("filters agency-only consultants", () => {
    const result = filterConsultants(
      dummyConsultants,
      { agencyId: "", agencyOnly: true, search: "", status: "" },
      agencyNames,
    );
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("agent-1");
  });

  it("builds editor state with status field for existing consultant and without for new", () => {
    const onSave = async () => {};
    const newEditor = buildConsultantEditorState({}, [], onSave);
    expect(newEditor.fields.some((f) => f.name === "status")).toBe(false);

    const editEditor = buildConsultantEditorState(dummyConsultants[0], [], onSave);
    expect(editEditor.fields.some((f) => f.name === "status")).toBe(true);
  });
});

describe("Neighborhood Helpers Modularization", () => {
  it("resolves id from id, _id or name", () => {
    expect(getNeighborhoodId({ id: "1", name: "ونک" })).toBe("1");
    expect(getNeighborhoodId({ _id: "2", name: "تجریش" })).toBe("2");
    expect(getNeighborhoodId({ name: "نیاوران" })).toBe("نیاوران");
  });

  it("normalizes to SelectedNeighborhood structure", () => {
    const selected = toSelectedNeighborhood({ id: "10", name: "پاسداران" });
    expect(selected).toEqual({ id: "10", name: "پاسداران" });
  });
});
