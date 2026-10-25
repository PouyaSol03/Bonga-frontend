import { expect, test } from "@playwright/test";
import {
  editRouteParamsByFormCode,
  resolveEditRouteParams,
} from "../../../src/features/advertisements/create/edit-mapping/editRouteParams";
import { getAdEditPath } from "../../../src/features/account/adManagement/adManagementData";

test.describe("Ad Edit Form Code Mapping", () => {
  test("all 23 backend form codes map to correct transaction and category", () => {
    const expectedForms: Record<string, { category: string; transaction: string }> = {
      // Sale
      "sale-apartment": { category: "apartment", transaction: "sale" },
      "sale-villa-house": { category: "villa-house", transaction: "sale" },
      "sale-garden-villa": { category: "garden-villa", transaction: "sale" },
      "sale-land": { category: "land", transaction: "sale" },
      "sale-office": { category: "office", transaction: "sale" },
      "sale-commercial": { category: "commercial-unit", transaction: "sale" },
      "sale-factory": { category: "factory-workshop", transaction: "sale" },
      "sale-warehouse": { category: "warehouse", transaction: "sale" },
      "sale-hotel": { category: "hotel-apartment", transaction: "sale" },

      // Rent
      "rent-apartment": { category: "apartment", transaction: "rent" },
      "rent-villa-house": { category: "villa-house", transaction: "rent" },
      "rent-garden-villa": { category: "garden-villa", transaction: "rent" },
      "rent-office": { category: "office", transaction: "rent" },
      "rent-commercial": { category: "commercial-unit", transaction: "rent" },
      "rent-factory-workshop": { category: "factory-workshop", transaction: "rent" },
      "rent-warehouse": { category: "warehouse", transaction: "rent" },
      "rent-hotel": { category: "hotel-apartment", transaction: "rent" },

      // Daily Rent
      "daily-apartment-suite": { category: "daily-apartment-suite", transaction: "rent" },
      "daily-garden-villa": { category: "daily-garden-villa", transaction: "rent" },
      "daily-hotel": { category: "daily-hotel-apartment", transaction: "rent" },
      "daily-office-booth": { category: "daily-workspace", transaction: "rent" },

      // Project
      "presale-special": { category: "project-presale", transaction: "project" },
      partnership: { category: "project-partnership", transaction: "project" },
    };

    expect(Object.keys(expectedForms).length).toBe(23);

    for (const [formCode, expected] of Object.entries(expectedForms)) {
      const resolved = resolveEditRouteParams(formCode);
      expect(resolved, `formCode ${formCode} should resolve`).not.toBeNull();
      expect(resolved?.transaction).toBe(expected.transaction);
      expect(resolved?.category).toBe(expected.category);
    }
  });

  test("resolves ad payload matching user's exact issue (rent-villa-house)", () => {
    const userPayload = {
      id: 296,
      form_code: "rent-villa-house",
      category: "اجاره خانه ویلایی",
      features: [
        { key: "form_code", value: "rent-villa-house" },
        { key: "land_area", value: 150 },
        { key: "building_area", value: 155 },
      ],
    };

    const resolved = resolveEditRouteParams(userPayload as never);
    expect(resolved).not.toBeNull();
    expect(resolved?.category).toBe("villa-house");
    expect(resolved?.transaction).toBe("rent");
    expect(resolved?.label).toBe("خانه، ویلا");

    const editPath = getAdEditPath(296, "/account/my-ads", userPayload as never);
    const url = new URL(editPath, "http://localhost");
    expect(url.searchParams.get("adId")).toBe("296");
    expect(url.searchParams.get("category")).toBe("villa-house");
    expect(url.searchParams.get("transaction")).toBe("rent");
    expect(url.searchParams.get("label")).toBe("خانه، ویلا");
    expect(url.searchParams.get("edit")).toBe("true");
  });

  test("resolves fallback from category text when form_code is absent", () => {
    const testCases = [
      { text: "فروش زمین و کلنگی", expectedCat: "land", expectedTx: "sale" },
      { text: "اجاره کارخانه", expectedCat: "factory-workshop", expectedTx: "rent" },
      { text: "فروش کارخانه صنعتی", expectedCat: "factory-workshop", expectedTx: "sale" },
      { text: "اجاره خانه ویلایی", expectedCat: "villa-house", expectedTx: "rent" },
      { text: "فروش خانه و ویلا", expectedCat: "villa-house", expectedTx: "sale" },
      { text: "اجاره انبار و سوله", expectedCat: "warehouse", expectedTx: "rent" },
      { text: "اجاره مغازه تجاری", expectedCat: "commercial-unit", expectedTx: "rent" },
      { text: "فروش واحد اداری", expectedCat: "office", expectedTx: "sale" },
    ];

    for (const { text, expectedCat, expectedTx } of testCases) {
      const resolved = resolveEditRouteParams({ id: 101, category: text } as never);
      expect(resolved?.category, `failed on ${text}`).toBe(expectedCat);
      expect(resolved?.transaction, `failed on ${text}`).toBe(expectedTx);
    }
  });
});
