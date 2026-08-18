import { expect, test } from "@playwright/test";
import { mockNewAdApis, seedAuthenticatedUser } from "./new-ad.fixtures";
import { NewAdPage } from "./new-ad.page";
import { newAdScenarios } from "./new-ad.scenarios";

test.describe("new ad category -> correct form", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthenticatedUser(page);
    await mockNewAdApis(page);
  });

  for (const scenario of newAdScenarios) {
    test(`${scenario.transaction}:${scenario.category} -> ${scenario.formCode}`, async ({ page }) => {
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

      for (const field of scenario.expectedFields) {
        await newAd.expectField(field);
      }
    });
  }
});
