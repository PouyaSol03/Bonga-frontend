import { expect, test, type Page } from "@playwright/test";
import { mockNewAdApis, seedAuthenticatedUser, seedLocation } from "./new-ad.fixtures";
import { NewAdPage } from "./new-ad.page";
import { newAdScenarios } from "./new-ad.scenarios";

const saleApartment = newAdScenarios.find(
  (scenario) => scenario.transaction === "sale" && scenario.category === "apartment",
)!;

async function openSaleApartmentDetails(page: Page, withLocation = true) {
  const newAd = new NewAdPage(page);
  await newAd.gotoCategory();
  await newAd.chooseScenario(saleApartment);
  await newAd.continueFromCategory();
  await expect(page).toHaveURL(/\/new-ad\/details\?.*transaction=sale.*category=apartment/);

  if (withLocation) {
    await seedLocation(page);
    await page.reload();
    await expect(page.getByRole("button", { name: /مشهد، محله سجاد/ })).toBeVisible();
  }

  return newAd;
}

test.describe("new ad shared interactions", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthenticatedUser(page);
    await mockNewAdApis(page);
  });

  test("location search, clear, select and confirm works", async ({ page }) => {
    await openSaleApartmentDetails(page, false);

    await page.getByRole("button", { name: "تعیین مکان", exact: true }).click();
    await expect(page).toHaveURL(/\/new-ad\/location/);
    await expect(page.getByRole("heading", { name: "موقعیت ملک", exact: true })).toBeVisible();

    const search = page.getByPlaceholder("جستجوی محله، خیابان...", { exact: true });
    await search.fill("سجاد");
    await expect(page.getByRole("button", { name: "پاک کردن", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "پاک کردن", exact: true }).click();
    await expect(search).toHaveValue("");

    await search.fill("سجاد");
    const resultTitle = page.getByText("سجاد", { exact: true }).last();
    await expect(resultTitle).toBeVisible();
    await resultTitle.locator("xpath=ancestor::button[1]").click();

    const confirm = page.getByRole("button", { name: "تایید موقعیت", exact: true });
    await expect(confirm).toBeEnabled();
    await confirm.click();

    // Confirming the location must persist the selected neighborhood.
    // Do not couple this interaction test to the router transition itself.
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("bonga-new-ad-location")))
      .toBe("سجاد");
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("bonga-new-ad-neighborhood-id")))
      .toBe("1001");
  });

  test("media supports photo removal, video preview/removal, virtual tour and back", async ({ page }) => {
    const newAd = await openSaleApartmentDetails(page);
    await newAd.fillRequiredDetails(saleApartment);
    await newAd.continueToMedia();

    await newAd.uploadPhotosAndExerciseRemove();
    await newAd.enableAndUploadVideo();

    const preview = page.getByRole("button", { name: "نمایش فیلم", exact: true });
    await expect(preview).toBeVisible({ timeout: 5_000 });
    const popupPromise = page.waitForEvent("popup");
    await preview.click();
    const popup = await popupPromise;
    await popup.close();

    await page.getByRole("button", { name: "حذف فیلم", exact: true }).click();
    await expect(page.getByRole("button", { name: "انتخاب فیلم", exact: true })).toHaveCount(0);
    await expect(page.getByText("فیلم", { exact: true }).locator("xpath=ancestor::*[.//button[@role='switch']][1]").getByRole("switch")).toHaveAttribute("aria-checked", "false");

    const virtualTour = await newAd.enableVirtualTour();
    await expect(virtualTour).toHaveValue("https://example.com/virtual-tour");

    // Use the form-step navigation, not the header's browser-history back.
    // "مرحله قبل" deterministically returns media -> details.
    await page.getByRole("button", { name: "مرحله قبل", exact: true }).click();
    await expect(page.getByText("موقعیت ملک", { exact: true })).toBeVisible();
  });

  test("agency publisher supports search, sort, neighborhood filter, map/list and submit", async ({ page }) => {
    let createBody = "";
    await page.unroute("**/me/advertise/create**");
    await mockNewAdApis(page, {
      onCreate: (body) => {
        createBody = body;
      },
    });

    const newAd = await openSaleApartmentDetails(page);
    await newAd.fillRequiredDetails(saleApartment);
    await newAd.continueToMedia();
    await newAd.uploadPhotosAndExerciseRemove();
    await newAd.selectAgencyRegistrant();
    await newAd.fillAgencyOwnerFields();
    await newAd.fillSocials();
    await newAd.fillAdInformation("آپارتمان آژانسی");

    await page.getByRole("button", { name: "انتخاب آژانس", exact: true }).click();
    await expect(page.getByText("ثبت آگهی / انتخاب آژانس", { exact: true })).toBeVisible();

    const searchRequest = page.waitForRequest((request) => {
      const url = new URL(request.url());
      return url.pathname.endsWith("/public/agencies") && url.searchParams.get("search") === "سجاد";
    });
    await page.getByPlaceholder("جستجوی آژانس", { exact: true }).fill("سجاد");
    await searchRequest;

    const sortRequest = page.waitForRequest((request) => {
      const url = new URL(request.url());
      return url.pathname.endsWith("/public/agencies") && url.searchParams.get("sort") === "rank";
    });
    await page.getByRole("button", { name: "مرتب سازی", exact: true }).click();
    const sortDialog = page.getByRole("dialog", { name: "مرتب سازی", exact: true });
    await expect(sortDialog).toBeVisible();
    await sortDialog.getByRole("button", { name: "رتبه", exact: true }).click();
    await sortRequest;

    await page.getByRole("button", { name: "محله", exact: true }).click();
    const neighborhoodSearch = page.getByPlaceholder("جستجو محله", { exact: true });
    await neighborhoodSearch.fill("سجاد");
    const neighborhood = page.getByText("سجاد", { exact: true }).last();
    await neighborhood.locator("xpath=ancestor::button[1]").click();

    const neighborhoodRequest = page.waitForRequest((request) => {
      const url = new URL(request.url());
      return url.pathname.endsWith("/public/agencies") && url.searchParams.get("neighborhood_id") === "1001";
    });
    await page.getByRole("button", { name: "تایید", exact: true }).click();
    await neighborhoodRequest;

    // Select an agency in list view.
    const agencyCard = page.getByText("آژانس املاک سجاد", { exact: true }).locator("xpath=ancestor::article[1]");
    await expect(agencyCard).toBeVisible();
    await agencyCard.getByRole("button", { name: "انتخاب", exact: true }).click();

    // Exercise map view and return to list without losing selection.
    await page.getByRole("button", { name: "نقشه", exact: true }).click();
    await expect(page.getByRole("button", { name: "لیست", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "ارسال به آژانس", exact: true })).toBeEnabled();
    await page.getByRole("button", { name: "لیست", exact: true }).click();

    await page.getByRole("button", { name: "ارسال به آژانس", exact: true }).click();
    await expect.poll(() => createBody.length, { timeout: 10_000 }).toBeGreaterThan(0);
    expect(createBody).toContain('name="agency_id"');
    expect(createBody).toContain("agency-1");
    expect(createBody).toContain('name="owner_type"');
    expect(createBody).toContain("agency");
  });
});
