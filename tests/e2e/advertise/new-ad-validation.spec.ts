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

  test("sale apartment details show required validation messages without requiring meterage", async ({ page }) => {
    await openSaleApartmentDetails(page);

    await page.getByRole("button", { name: "مرحله بعد", exact: true }).click();

    // Meterage and building area validation MUST NOT exist
    await expect(page.getByText("لطفا متراژ آپارتمان را وارد کنید.", { exact: true })).toHaveCount(0);
    await expect(page.getByText("لطفا زیربنا را وارد کنید.", { exact: true })).toHaveCount(0);

    // Other required fields MUST display validation errors
    await expect(page.getByText("لطفا طبقه را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا تعداد اتاق را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا سن ساخت را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا قیمت آگهی را وارد کنید.", { exact: true })).toBeVisible();
  });

  test("meterage and building area are completely optional and do not block submission", async ({ page }) => {
    const newAd = await openSaleApartmentDetails(page);

    // Fill all required fields
    await newAd.fillRequiredDetails(saleApartment);

    // Clear meterage input explicitly (meterage is optional)
    const meterageSection = page.locator('[data-field-key="meterage"]').first();
    const clearButton = meterageSection.getByRole("button", { name: "پاک کردن" });
    if (await clearButton.isVisible()) {
      await clearButton.click();
    }

    // Submit step - should pass to media step without meterage error
    await page.getByRole("button", { name: "مرحله بعد", exact: true }).click();
    await expect(page.getByText("لطفا متراژ آپارتمان را وارد کنید.", { exact: true })).toHaveCount(0);
    await expect(page.getByText("عکس آگهی", { exact: true })).toBeVisible();
  });

  test("auto-scrolls to the first invalid field when validation fails", async ({ page }) => {
    await openSaleApartmentDetails(page);

    // Scroll down to the bottom button
    const nextButton = page.getByRole("button", { name: "مرحله بعد", exact: true });
    await nextButton.scrollIntoViewIfNeeded();

    // Click next step without filling required fields
    await nextButton.click();

    // Validation handler automatically scrolls back to the first invalid field
    await expect(page.getByText("لطفا طبقه را وارد کنید.", { exact: true })).toBeInViewport();
  });

  test("auto-expands collapsed accordion sections when inner fields have validation errors", async ({ page }) => {
    const newAd = await openSaleApartmentDetails(page);
    await newAd.fillRequiredDetails(saleApartment);

    // Enable loan option with switch
    const loanSwitch = page
      .getByText("وام دارد", { exact: true })
      .locator("xpath=ancestor::*[.//button[@role='switch']][1]")
      .getByRole("switch");
    await loanSwitch.click();

    // Click next step to trigger validation on empty loan fields
    await page.getByRole("button", { name: "مرحله بعد", exact: true }).click();

    // Inner accordion fields must be expanded and their errors visible
    await expect(page.getByText("لطفا مبلغ وام را وارد کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا قسط وام را وارد کنید.", { exact: true })).toBeVisible();
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

    // Personal starts with chat and phone enabled. Turn off both so no contact method remains.
    await page.getByRole("button", { name: "چت با کاربران", exact: true }).click();
    await page.getByRole("button", { name: /شماره تماس/, exact: true }).click();

    // Verify submit button is disabled when no contact method is selected
    const submitButton = page.getByRole("button", { name: "ثبت اطلاعات", exact: true });
    await expect(submitButton).toBeDisabled();

    // Re-enable chat contact method so submit button enables
    await page.getByRole("button", { name: "چت با کاربران", exact: true }).click();
    await expect(submitButton).toBeEnabled();

    const mediaSection = page
      .getByText("عکس آگهی", { exact: true })
      .locator("xpath=ancestor::section[1]");

    const videoSwitch = mediaSection
      .getByText("فیلم", { exact: true })
      .locator("xpath=ancestor::*[.//button[@role='switch']][1]")
      .getByRole("switch");
    await videoSwitch.click();

    const tourSwitch = mediaSection
      .getByText("تور مجازی", { exact: true })
      .locator("xpath=ancestor::*[.//button[@role='switch']][1]")
      .getByRole("switch");
    await tourSwitch.click();

    await submitButton.click();

    await expect(page.getByText("لطفا ویدیوی آگهی را انتخاب کنید.", { exact: true })).toBeVisible();
    await expect(page.getByText("لطفا لینک تور مجازی را وارد کنید.", { exact: true })).toBeVisible();
  });

  test("agency publisher allows proceeding to agency selection with optional owner details", async ({ page }) => {
    const newAd = await openSaleApartmentDetails(page);
    await newAd.fillRequiredDetails(saleApartment);
    await newAd.continueToMedia();
    await newAd.uploadPhotosAndExerciseRemove();
    await newAd.selectAgencyRegistrant();
    await newAd.fillAdInformation("آپارتمان");

    await page.getByRole("button", { name: "انتخاب آژانس", exact: true }).click();

    // Owner details are optional so user proceeds directly to agency selection
    await expect(page.getByText("ثبت آگهی / انتخاب آژانس", { exact: true })).toBeVisible();
  });
});
