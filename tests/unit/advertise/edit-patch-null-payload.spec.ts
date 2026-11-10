import { describe, expect, test } from "vitest";
import { buildEditPatchFormData } from "../../../src/features/advertisements/create/edit-patch";
import { blankValues } from "../../../src/features/advertisements/create/constants/initialValues";
import type { NewAdFormValues } from "../../../src/features/advertisements/create/types";

describe("Edit Patch Null Payload for Cleared More Features", () => {
  test("sends 'null' for cleared optional more-features fields", () => {
    window.history.replaceState({}, "", "/new-ad/details?transaction=sale&category=apartment");

    const baseline: NewAdFormValues = {
      ...blankValues,
      title: "آپارتمان ۱۰۰ متری",
      documentType: "تک برگ",
      renovated: true,
      furnished: true,
      totalFloors: "5",
      unitsPerFloor: "2",
      usageType: ["مسکونی"],
      suitableFor: ["خانواده"],
      commercialPermit: true,
      managementRoom: true,
    };

    const current: NewAdFormValues = {
      ...baseline,
      documentType: "",
      renovated: false,
      furnished: false,
      totalFloors: "",
      unitsPerFloor: "",
      usageType: [],
      suitableFor: [],
      commercialPermit: false,
      managementRoom: false,
    };

    const { formData, hasChanges } = buildEditPatchFormData(current, baseline, {
      formCode: "sale-apartment",
      dynamicFieldKeys: [
        "document_type",
        "renovated",
        "furnished",
        "total_floors",
        "units_per_floor",
        "land_use",
        "suitable_for",
        "commercial_permit",
        "management_room",
      ],
    });

    expect(hasChanges).toBe(true);
    expect(formData.get("document_type")).toBe("null");
    expect(formData.get("renovated")).toBe("null");
    expect(formData.get("furnished")).toBe("null");
    expect(formData.get("total_floors")).toBe("null");
    expect(formData.get("units_per_floor")).toBe("null");
    expect(formData.get("land_use")).toBe("null");
    expect(formData.get("suitable_for")).toBe("null");
    expect(formData.get("commercial_permit")).toBe("null");
    expect(formData.get("management_room")).toBe("null");
  });

  test("sends actual value when field is populated", () => {
    window.history.replaceState({}, "", "/new-ad/details?transaction=sale&category=apartment");

    const baseline: NewAdFormValues = {
      ...blankValues,
      title: "آپارتمان",
      documentType: "تک برگ",
    };

    const current: NewAdFormValues = {
      ...baseline,
      documentType: "قولنامه",
    };

    const { formData } = buildEditPatchFormData(current, baseline, {
      formCode: "sale-apartment",
      dynamicFieldKeys: ["document_type"],
    });

    expect(formData.get("document_type")).toBe("قولنامه");
  });
});
