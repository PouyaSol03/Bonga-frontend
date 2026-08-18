import { expect, test, type Page } from "@playwright/test";
import { mockNewAdApis, seedAuthenticatedUser, seedLocation } from "./new-ad.fixtures";
import { NewAdPage } from "./new-ad.page";
import { newAdScenarios } from "./new-ad.scenarios";

const saleApartment = newAdScenarios.find(
  (scenario) => scenario.transaction === "sale" && scenario.category === "apartment",
)!;

async function openSaleApartmentDetails(page: Page) {
  const newAd = new NewAdPage(page);
  await newAd.gotoCategory();
  await newAd.selectCategory("مسکونی", "آپارتمان");
  await newAd.continueFromCategory();
  await seedLocation(page);
  await page.reload();
  await expect(page.getByRole("button", { name: /مشهد، محله سجاد/ })).toBeVisible();
  return newAd;
}

test.describe("new ad validation", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthenticatedUser(page);
    await mockNewAdApis(page);
  });

  test("continue is disabled until a category is selected", async ({ page }) => {
    const newAd = new NewAdPage(page);
    await newAd.gotoCategory();

    await expect(page.getByRole("button", { name: "ادامه", exact: true })).toBeDisabled();

    await newAd.selectCategory("مسکونی", "آپارتمان");
    await expect(page.getByRole("button", { name: "ادامه", exact: true })).toBeEnabled();
  });

  test("sale apartment details show required validation messages", async ({ page }) => {
    await openSaleApartmentDetails(page);

    await page.getByRole("button", { name: "مرحله بعد", exact: true }).click();

    await expect(page.getByText("لطفا متراژ آپارتمان را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا طبقه را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا تعداد اتاق ها را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا سن ساخت را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا قیمت آگهی را وارد کنید.", { exact: true })).toBeVisible();
  });

  test("loan and exchange options validate their dependent fields", async ({ page }) => {
    const newAd = await openSaleApartmentDetails(page);
    await newAd.fillRequiredDetails(saleApartment);

    const loanSwitch = page
      .getByText("وام دارد", { exact: true })
      .locator("xpath=ancestor::*[.//button[@role='switch']][1]")
      .getByRole("switch");
    await loanSwitch.click();

    const exchangeSwitch = page
      .getByText("معاوضه می‌شود", { exact: true })
      .locator("xpath=ancestor::*[.//button[@role='switch']][1]")
      .getByRole("switch");
    await exchangeSwitch.click();

    await page.getByRole("button", { name: "مرحله بعد", exact: true }).click();

    await expect(page.getByText("لطفا مبلغ وام را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا قسط وام را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا مورد معاوضه را انتخاب کنید.", { exact: true })).toBeVisible();
  });

  test("media step requires a photo, registrant, title and description", async ({ page }) => {
    const newAd = await openSaleApartmentDetails(page);
    await newAd.fillRequiredDetails(saleApartment);
    await newAd.continueToMedia();

    await page.getByRole("button", { name: "ثبت اطلاعات", exact: true }).click();

    await expect(page.getByText("لطفا حداقل یک عکس برای آگهی انتخاب کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا نوع ثبت کننده آگهی را انتخاب کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا عنوان آگهی را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا توضیحات آگهی را وارد کنید.", { exact: true })).toBeVisible();
  });

  test("enabled video, virtual tour and personal contact choices are validated", async ({ page }) => {
    const newAd = await openSaleApartmentDetails(page);
    await newAd.fillRequiredDetails(saleApartment);
    await newAd.continueToMedia();
    await newAd.uploadPhotosAndExerciseRemove();
    await newAd.selectPersonalRegistrant();
    await newAd.fillAdInformation("آپارتمان");

    // Personal starts with chat enabled. Turn it off so no contact method remains.
    await page.getByRole("button", { name: "چت با کاربران", exact: true }).click();

    const mediaSection = page
      .getByText("عکس آگهی", { exact: true })
      .locator("xpath=ancestor::section[1]");
    await mediaSection.getByRole("switch").nth(0).click(); // video on, no file
    await mediaSection.getByRole("switch").nth(1).click(); // virtual tour on, no URL

    await page.getByRole("button", { name: "ثبت اطلاعات", exact: true }).click();

    await expect(page.getByText("لطفا ویدیوی آگهی را انتخاب کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا لینک تور مجازی را وارد کنید.", { exact: true })).toBeVisible();
    await expect(
      page.getByText("لطفا حداقل یکی از روش‌های ارتباطی چت با کاربران یا شماره تماس را انتخاب کنید.", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test("agency publisher requires the owner exact address before agency selection", async ({ page }) => {
    const newAd = await openSaleApartmentDetails(page);
    await newAd.fillRequiredDetails(saleApartment);
    await newAd.continueToMedia();
    await newAd.uploadPhotosAndExerciseRemove();
    await newAd.selectAgencyRegistrant();
    await newAd.fillAdInformation("آپارتمان");

    await page.getByRole("button", { name: "انتخاب آژانس", exact: true }).click();

    await expect(page.getByText("لطفا آدرس دقیق منزل را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("ثبت آگهی / انتخاب آژانس", { exact: true })).toHaveCount(0);
  });
});
