import { expect, test } from "@playwright/test";
import {
  floorOptions,
  projectFloorOptions,
  projectRoomOptions,
  roomOptions,
  saleVillaHouseTypeOptions,
  totalFloorsOptions,
  unitsPerFloorOptions,
  villaTotalFloorsOptions,
} from "../../../src/features/advertisements/create/data";
import { moreFeatureFieldsByListingType } from "../../../src/features/advertisements/create/constants/moreFeatureFields";
import { basicPropertyFieldsByListingType } from "../../../src/features/advertisements/create/constants/basicPropertyFields";
import { getFormSchemaByListing } from "../../../src/features/advertisements/forms";
import { validateNewAdDetails } from "../../../src/features/advertisements/create/validation";
import type { NewAdFormValues } from "../../../src/features/advertisements/create/types";

test.describe("Ad options expansion (floors, units, rooms, villa type, villa max floors)", () => {
  test("floorOptions goes up to 40 floors", () => {
    expect(floorOptions[0]).toBe("همکف");
    expect(floorOptions).toContain("۱");
    expect(floorOptions).toContain("۳۹");
    expect(floorOptions[floorOptions.length - 1]).toBe("۴۰ و بیشتر");
    expect(floorOptions).toHaveLength(41); // همکف + 1..39 + 40 و بیشتر

    expect(projectFloorOptions[0]).toBe("همکف");
    expect(projectFloorOptions[projectFloorOptions.length - 1]).toBe("۴۰ و بیشتر");
  });

  test("totalFloorsOptions goes up to 40 floors for apartments and general properties", () => {
    expect(totalFloorsOptions[0]).toBe("۱ طبقه");
    expect(totalFloorsOptions).toContain("۳۹ طبقه");
    expect(totalFloorsOptions[totalFloorsOptions.length - 1]).toBe("۴۰ طبقه و بیشتر");
    expect(totalFloorsOptions).toHaveLength(40);
  });

  test("unitsPerFloorOptions goes up to 60 units", () => {
    expect(unitsPerFloorOptions[0]).toBe("۱ واحد");
    expect(unitsPerFloorOptions).toContain("۳۰ واحد");
    expect(unitsPerFloorOptions).toContain("۶۰ واحد");
    expect(unitsPerFloorOptions).toHaveLength(60);
  });

  test("roomOptions goes up to 8 rooms", () => {
    expect(roomOptions).toEqual([
      "بدون اتاق",
      "۱",
      "۲",
      "۳",
      "۴",
      "۵",
      "۶",
      "۷",
      "۸+",
    ]);
    expect(projectRoomOptions).toEqual(roomOptions);
  });

  test("villaType has چند طبقه مجزا as second option under فلت", () => {
    expect(saleVillaHouseTypeOptions[0]).toBe("فلت");
    expect(saleVillaHouseTypeOptions[1]).toBe("چند طبقه مجزا");
    expect(saleVillaHouseTypeOptions).toEqual([
      "فلت",
      "چند طبقه مجزا",
      "تک طبقه",
      "دوبلکس",
      "تریبلکس",
      "خونه باغ",
    ]);
  });

  test("villa-house moreFeatures has max 8 floors for totalFloors and has چند طبقه مجزا in villaType", () => {
    const saleVillaFields = moreFeatureFieldsByListingType["sale:villa-house"];
    expect(saleVillaFields).toBeDefined();

    const totalFloorsField = saleVillaFields.find((f) => f.key === "totalFloors");
    expect(totalFloorsField?.options).toEqual(villaTotalFloorsOptions);
    expect(totalFloorsField?.options).toHaveLength(8);
    expect(totalFloorsField?.options?.[totalFloorsField.options.length - 1]).toBe("۸ طبقه و بیشتر");

    const villaTypeField = saleVillaFields.find((f) => f.key === "villaType");
    expect(villaTypeField?.options?.[0]).toBe("فلت");
    expect(villaTypeField?.options?.[1]).toBe("چند طبقه مجزا");

    // Rent villa house check
    const rentVillaFields = moreFeatureFieldsByListingType["rent:villa-house"];
    expect(rentVillaFields).toBeDefined();
    const rentTotalFloorsField = rentVillaFields.find((f) => f.key === "totalFloors");
    expect(rentTotalFloorsField?.options).toEqual(villaTotalFloorsOptions);
  });

  test("apartment features has 40 floors, 60 units per floor, and 8 rooms", () => {
    const saleAptBasic = basicPropertyFieldsByListingType["sale:apartment"];
    expect(saleAptBasic).toBeDefined();
    const roomsField = saleAptBasic.find((f) => f.key === "rooms");
    expect(roomsField?.options).toEqual(roomOptions);

    const floorField = saleAptBasic.find((f) => f.key === "floor");
    expect(floorField?.options).toEqual(floorOptions);

    const saleAptMore = moreFeatureFieldsByListingType["sale:apartment"];
    expect(saleAptMore).toBeDefined();
    const totalFloorsField = saleAptMore.find((f) => f.key === "totalFloors");
    expect(totalFloorsField?.options).toEqual(totalFloorsOptions);
    expect(totalFloorsField?.options).toHaveLength(40);
  });

  test("schema normalization dynamically injects options based on category", () => {
    const villaSchema = getFormSchemaByListing("sale", "villa-house");
    expect(villaSchema).toBeDefined();
    const villaMoreFields = villaSchema?.create.moreFeatures?.fields ?? [];
    const villaTotalFloors = villaMoreFields.find((f) => f.key === "totalFloors");
    expect(villaTotalFloors?.options).toHaveLength(8);

    const villaTypeField = villaMoreFields.find((f) => f.key === "villaType");
    expect(villaTypeField?.options?.[1]).toBe("چند طبقه مجزا");

    const aptSchema = getFormSchemaByListing("sale", "apartment");
    expect(aptSchema).toBeDefined();
    const aptMoreFields = aptSchema?.create.moreFeatures?.fields ?? [];
    const aptTotalFloors = aptMoreFields.find((f) => f.key === "totalFloors");
    expect(aptTotalFloors?.options).toHaveLength(40);
  });

  test("validation bounds: max 60 units per floor, max 8 floors for villa-house", () => {
    (globalThis as unknown as { window: unknown }).window = {
      location: new URL("http://localhost/new-ad/details?transaction=sale&category=villa-house"),
    };

    const validValues = {
      location: "Tehran",
      unitsPerFloor: "60",
      totalFloors: "8",
    } as unknown as NewAdFormValues;
    expect(validateNewAdDetails(validValues)?.errors?.unitsPerFloor).toBeUndefined();
    expect(validateNewAdDetails(validValues)?.errors?.totalFloors).toBeUndefined();

    const invalidUnits = {
      location: "Tehran",
      unitsPerFloor: "61",
      totalFloors: "9",
    } as unknown as NewAdFormValues;
    const errors = validateNewAdDetails(invalidUnits)?.errors;
    expect(errors?.unitsPerFloor).toBe("تعداد واحد در هر طبقه نمی‌تواند بیشتر از ۶۰ واحد باشد.");
    expect(errors?.totalFloors).toBe("تعداد کل طبقات برای خانه، ویلا نمی‌تواند بیشتر از ۸ طبقه باشد.");
  });
});
