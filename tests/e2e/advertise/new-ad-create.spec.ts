import { expect, test, type Page } from "@playwright/test";
import { mockNewAdApis, seedAuthenticatedUser, seedLocation } from "./new-ad.fixtures";
import { NewAdPage } from "./new-ad.page";
import {
  expectedMoreFeatureFields,
  newAdScenarios,
  type NewAdScenario,
} from "./new-ad.scenarios";

const criticalPayloadKeysByFormCode: Record<string, string[]> = {
  "sale-apartment": ["area", "floor", "rooms", "building_age"],
  "sale-land": ["land_area", "document_type", "build_permit"],
  "sale-villa-house": ["land_area", "building_area", "building_type", "villa_type"],
  "sale-office": ["area", "office_position", "management_room"],
  "sale-commercial": ["commercial_position", "ownership_status", "opening_count"],
  "sale-factory": ["land_area", "industrial_property_type", "access_type"],
  "sale-hotel": ["accommodation_type", "hotel_stars", "single_room_count"],
  "rent-apartment": ["mortgage_price", "rent_price", "pet_policy", "ready_delivery_date"],
  "rent-villa-house": ["mortgage_price", "rent_price", "building_type", "pet_policy"],
  "rent-office": ["mortgage_price", "rent_price", "has_document", "office_position"],
  "rent-commercial": ["mortgage_price", "rent_price", "opening_count", "ready_delivery_date"],
  "rent-factory-workshop": ["mortgage_price", "rent_price", "industrial_property_type", "access_type"],
  "rent-hotel": ["mortgage_price", "rent_price", "accommodation_type", "single_room_count"],
  "daily-apartment-suite": ["min_price", "max_price", "check_in_time", "check_out_time", "normal_daily_price"],
  "daily-garden-villa": ["min_price", "max_price", "check_in_time", "check_out_time", "view_type"],
  "daily-hotel": ["min_price", "max_price", "rental_period", "check_in_time", "check_out_time", "daily_hotel_rooms"],
  "daily-office-booth": ["min_price", "max_price", "check_in_time", "check_out_time", "space_type"],
  "presale-special": ["builder_company_name", "project_total_floors", "project_status", "project_details", "min_meter_price", "max_meter_price"],
  partnership: ["partnership_type", "current_status", "build_permit", "document_type", "builder_share"],
};

async function openScenarioDetails(page: Page, scenario: NewAdScenario) {
  const newAd = new NewAdPage(page);
  await newAd.gotoCategory();
  await newAd.chooseScenario(scenario);

  const formRequest = page.waitForRequest((request) =>
    request.url().includes(`/public/advertise-form/${scenario.formCode}`),
  );

  await newAd.continueFromCategory();
  await formRequest;

  await expect(page).toHaveURL(
    new RegExp(
      `/new-ad/details\\?[^#]*transaction=${scenario.transaction}[^#]*category=${scenario.category}`,
    ),
  );

  await seedLocation(page);
  await page.reload();
  await expect(page.getByRole("button", { name: /مشهد، محله سجاد/ })).toBeVisible();

  return newAd;
}

test.describe("complete new ad flow - every supported form", () => {
  test.setTimeout(60_000);
  for (const scenario of newAdScenarios) {
    test(`${scenario.transaction}:${scenario.category} completes details, optional features, media and submit`, async ({ page }) => {
      let createBody = "";

      await seedAuthenticatedUser(page);
      await mockNewAdApis(page, {
        onCreate: (body) => {
          createBody = body;
        },
      });

      const newAd = await openScenarioDetails(page, scenario);

      // Step 2: required category-specific fields.
      for (const field of scenario.expectedFields) {
        await newAd.expectField(field);
      }
      await newAd.fillRequiredDetails(scenario);

      // Category-specific secondary editors and optional controls.
      if (scenario.formCode === "presale-special") {
        await newAd.exerciseProjectDetails();
        await newAd.exerciseProjectSaleTerms();
        await newAd.exerciseProjectExchange();
      }

      if (scenario.formCode === "daily-hotel") {
        await newAd.exerciseDailyHotelAdDetails();
        await newAd.exerciseDailyHotelRoomEditor();
      }

      await newAd.exerciseMoreFeatures(expectedMoreFeatureFields(scenario));
      await newAd.exerciseHeatingAndFacilities();

      if (scenario.transaction === "sale") {
        await newAd.exerciseSalePriceOptions();
      }

      // Step 3: media + publisher + communication + ad copy.
      await newAd.continueToMedia();
      await newAd.exerciseAllMediaForPersonal(scenario.categoryLabel);

      // Step 4: submit and verify the multipart contract.
      await newAd.submitInformation();

      await expect.poll(() => createBody.length, { timeout: 10_000 }).toBeGreaterThan(0);
      expect(createBody).toContain('name="form_code"');
      expect(createBody).toContain(scenario.formCode);
      expect(createBody).toContain('name="images"; filename="playwright-property-2.png"');
      expect(createBody).toContain('name="video"; filename="playwright-property.mp4"');
      expect(createBody).toContain('name="virtual_tour_link"');
      expect(createBody).toContain("https://example.com/virtual-tour");
      expect(createBody).toContain('name="telegram"');
      expect(createBody).toContain("bonga_playwright");
      expect(createBody).toContain('name="whatsapp"');
      expect(createBody).toContain("9120000000");
      expect(createBody).toContain('name="title"');
      expect(createBody).toContain(`${scenario.categoryLabel} تست Playwright`);

      for (const key of criticalPayloadKeysByFormCode[scenario.formCode] ?? []) {
        expect(createBody, `${scenario.formCode} should serialize ${key}`).toContain(`name="${key}"`);
      }

      await expect(page).toHaveURL(/\/account\/ad-management\/payment\/901$/);
    });
  }
});
