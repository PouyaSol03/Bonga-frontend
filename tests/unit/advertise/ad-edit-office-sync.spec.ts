import { describe, expect, test } from "vitest";
import { mapAdvertisementToEditValues } from "../../../src/features/advertisements/create/edit-mapping/mapAdvertisementToEditValues";
import { blankValues } from "../../../src/features/advertisements/create/constants/initialValues";

describe("Ad Edit Office Sync", () => {
  test("hydrates office specs and toggles from features array for sale-office", () => {
    const editAdResponse = {
      id: 265,
      form_code: "sale-office",
      category: "فروش واحد اداری",
      title: "دفتر اداری ونک",
      features: [
        { key: "form_code", value: "sale-office" },
        { key: "area", value: 120 },
        { key: "office_position", value: "مجتمع اداری" },
        { key: "office_document_type", value: "تک برگ" },
        { key: "management_room", value: true },
        { key: "conference_room", value: true },
        { key: "reception_hall", value: false },
        { key: "signboard", value: true },
        { key: "kitchen", value: true },
        { key: "separate_entrance", value: false },
        { key: "heating_cooling", value: ["کولر آبی"] },
        { key: "facilities", value: ["آسانسور", "کمد دیواری"] },
      ],
    };

    const mapped = mapAdvertisementToEditValues(editAdResponse as never, blankValues);

    expect(mapped.meterage).toBe("120");
    expect(mapped.officePosition).toBe("مجتمع اداری");
    expect(mapped.officeDocumentType).toBe("تک برگ");
    expect(mapped.hasDocument).toBe(true);
    expect(mapped.managementRoom).toBe(true);
    expect(mapped.conferenceRoom).toBe(true);
    expect(mapped.receptionHall).toBe(false);
    expect(mapped.signboard).toBe(true);
    expect(mapped.kitchen).toBe(true);
    expect(mapped.separateEntrance).toBe(false);
    expect(mapped.heatingCooling).toContain("water-cooler");
    expect(mapped.facilities).toContain("elevator");
  });

  test("hydrates office specs when backend returns dynamic_fields or dynamicFields", () => {
    const editAdResponse = {
      id: 266,
      form_code: "sale-office",
      dynamic_fields: [
        { key: "office_position", value: "ساختمان پزشکان" },
        { key: "office_document_type", value: "سایر" },
        { key: "management_room", value: "1" },
        { key: "conference_room", value: "دارد" },
        { key: "reception_hall", value: "ندارد" },
      ],
    };

    const mapped = mapAdvertisementToEditValues(editAdResponse as never, blankValues);

    expect(mapped.officePosition).toBe("ساختمان پزشکان");
    expect(mapped.officeDocumentType).toBe("سایر");
    expect(mapped.hasDocument).toBe(true);
    expect(mapped.managementRoom).toBe(true);
    expect(mapped.conferenceRoom).toBe(true);
    expect(mapped.receptionHall).toBe(false);
  });
});
