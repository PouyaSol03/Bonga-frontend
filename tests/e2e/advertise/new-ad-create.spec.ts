import { expect, test, type Page } from "@playwright/test";
import { mockNewAdApis, seedAuthenticatedUser, seedLocation } from "./new-ad.fixtures";
import { NewAdPage } from "./new-ad.page";
import {
  expectedMoreFeatureFields,
  newAdScenarios,
  type NewAdScenario,
} from "./new-ad.scenarios";

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
      }

      if (scenario.formCode === "daily-hotel") {
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

      await expect(page).toHaveURL(/\/account\/ad-management\/payment\/901$/);
    });
  }
});
