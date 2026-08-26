import { expect, type Locator, type Page } from "@playwright/test";
import type { NewAdScenario, TransactionLabel } from "./new-ad.scenarios";

const png1x1 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

function valueForRequiredField(field: string) {
  if (field.includes("درصد مشارکت") || field.includes("سهم سازنده")) return "50";
  if (field.includes("حداقل قیمت")) return "1000000000";
  if (field.includes("حداکثر قیمت")) return "2000000000";
  if (field.includes("روزهای عادی")) return "1000000";
  if (field.includes("آخر هفته")) return "1200000";
  if (field.includes("روزهای خاص")) return "1500000";
  if (field.includes("رهن")) return "500000000";
  if (field.includes("اجاره")) return "10000000";
  if (field.includes("قیمت")) return "1500000000";
  if (field.includes("تعداد کل طبقات")) return "8";
  if (field.includes("تعداد کل واحد")) return "24";
  if (field.includes("ارتفاع")) return "4";
  return "120";
}

export class NewAdPage {
  constructor(readonly page: Page) {}

  private section(title: string) {
    return this.page
      .getByText(title, { exact: true })
      .locator("xpath=ancestor::section[1]");
  }

  async expectDetailsRoot() {
    await expect(
      this.page.getByText("موقعیت آگهی", { exact: true }).or(
        this.page.getByText("موقعیت ملک", { exact: true }),
      ).first(),
    ).toBeVisible();
  }

  async gotoCategory() {
    await this.page.goto("/new-ad/category");
    await expect(this.page.getByRole("tablist", { name: "نوع معامله" })).toBeVisible();
  }

  async selectTransaction(label: TransactionLabel) {
    const tab = this.page.getByRole("tab", { name: label, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
  }

  async selectCategory(sectionTitle: string, categoryLabel: string) {
    const section = this.section(sectionTitle);
    await expect(section).toBeVisible();

    const categoryButton = section.getByRole("button", {
      name: categoryLabel,
      exact: true,
    });

    await expect(categoryButton).toBeVisible();
    await categoryButton.click();
  }

  async chooseScenario(scenario: NewAdScenario) {
    await this.selectTransaction(scenario.transactionLabel);
    await this.selectCategory(scenario.section, scenario.categoryLabel);
  }

  async continueFromCategory() {
    const button = this.page.getByRole("button", { name: "ادامه", exact: true });
    await expect(button).toBeEnabled();
    await button.click();
  }

  async expectField(text: string) {
    const input = this.page.getByPlaceholder(text, { exact: true }).first();
    const button = this.page.getByRole("button", { name: text, exact: true }).first();

    // The form definition is loaded asynchronously. `count()` does not wait,
    // so wait for either supported control shape instead of racing the render.
    await expect(input.or(button).first()).toBeVisible();
  }

  async fillInput(placeholder: string, value: string) {
    await this.page.getByPlaceholder(placeholder, { exact: true }).fill(value);
  }

  private async pickFirstDialogOption(dialog: Locator) {
    const option = dialog
      .locator("button:not([disabled])")
      .filter({ hasNotText: /بازگشت|لغو|تایید/ })
      .first();

    await expect(option).toBeVisible();
    await option.click();
  }

  async chooseSelect(placeholder: string, sheetTitle: string, option?: string) {
    const button = this.page.getByRole("button", { name: placeholder, exact: true });
    await button.click();

    const dialog = this.page.getByRole("dialog", { name: sheetTitle, exact: true });
    await expect(dialog).toBeVisible();

    if (option) {
      await dialog.getByRole("button", { name: option, exact: true }).click();
    } else {
      await this.pickFirstDialogOption(dialog);
    }

    await expect(dialog).toBeHidden();
  }

  async chooseDateField(placeholder: string, title: string) {
    await this.page.getByRole("button", { name: placeholder, exact: true }).click();

    const dialog = this.page.getByRole("dialog", { name: title, exact: true });
    await expect(dialog).toBeVisible();

    const day = dialog
      .locator(".rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden):visible span:visible")
      .filter({ hasText: /^[۰-۹0-9]{1,2}$/ })
      .first();

    await expect(day).toBeVisible();
    await day.click();

    const confirm = dialog.getByRole("button", { name: "تایید", exact: true });
    await expect(confirm).toBeEnabled();
    await confirm.click();
    await expect(dialog).toBeHidden();
  }

  async chooseDeliveryDate() {
    await this.chooseDateField("تاریخ تحویل *", "تاریخ تحویل");
  }

  async fillRequiredDetails(scenario: NewAdScenario) {
    for (const field of scenario.expectedFields) {
      const input = this.page.getByPlaceholder(field, { exact: true }).first();
      const button = this.page.getByRole("button", { name: field, exact: true }).first();

      // Do not silently skip a required control while the async form is still
      // rendering. Waiting here makes the helper deterministic and ensures a
      // real missing field fails at the field itself.
      await expect(input.or(button).first()).toBeVisible();

      if (await input.isVisible()) {
        // InputBox intentionally removes the placeholder as soon as the field
        // has a value. A locator created with getByPlaceholder() therefore no
        // longer matches after fill(), so asserting toHaveValue() on that same
        // locator incorrectly reports "element(s) not found". fill() already
        // waits for the input and dispatches the real input/change events.
        await input.fill(valueForRequiredField(field));
        continue;
      }

      if (field.startsWith("تاریخ تحویل")) {
        await this.chooseDateField(field, "تاریخ تحویل");
        continue;
      }

      await this.chooseSelect(field, field.replace(/\s*\*$/, ""));
    }
  }

  private async toggleByLabel(label: string, checked = true) {
    const labelNode = this.page.getByText(label, { exact: true });
    await expect(labelNode).toBeVisible();

    const container = labelNode.locator(
      "xpath=ancestor::*[.//button[@role='switch']][1]",
    );
    const toggle = container.getByRole("switch").first();
    await expect(toggle).toBeVisible();

    const current = await toggle.getAttribute("aria-checked");
    if ((current === "true") !== checked) await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", String(checked));
  }

  async exerciseMoreFeatures(expectedFields: string[]) {
    const moreButton = this.page
      .getByRole("button", { name: /مشخصات دیگر|ویرایش مشخصات|ثبت مشخصات بیشتر/ })
      .first();

    if (!expectedFields.length) {
      await expect(moreButton).toHaveCount(0);
      return;
    }

    await expect(moreButton).toBeVisible();
    await moreButton.click();
    await expect(this.page.getByText("مشخصات بیشتر", { exact: true }).first()).toBeVisible();

    for (const field of expectedFields) {
      const input = this.page.getByPlaceholder(field, { exact: true });
      const select = this.page.getByRole("button", { name: field, exact: true });
      const text = this.page.getByText(field, { exact: true });
      await expect(input.or(select).or(text).first()).toBeVisible();
    }

    // Cancel remains a covered user path and must return to the details page.
    await this.page.getByRole("button", { name: "انصراف", exact: true }).click();
    await this.expectDetailsRoot();

    await this.page
      .getByRole("button", { name: /مشخصات دیگر|ویرایش مشخصات|ثبت مشخصات بیشتر/ })
      .first()
      .click();

    for (const field of expectedFields) {
      const input = this.page.getByPlaceholder(field, { exact: true });
      const select = this.page.getByRole("button", { name: field, exact: true });
      const label = this.page.getByText(field, { exact: true });

      await expect(input.or(select).or(label).first()).toBeVisible();

      if (await input.isVisible()) {
        await input.fill(field.includes("تضمین") ? "5000000" : "12");
        continue;
      }

      if (await select.isVisible()) {
        if (field === "تاریخ آماده تحویل" || field === "تاریخ تحویل") {
          await this.chooseDateField(field, field);
          continue;
        }

        await select.click();
        const dialog = this.page.getByRole("dialog", { name: field, exact: true });
        await expect(dialog).toBeVisible();
        await this.pickFirstDialogOption(dialog);
        await expect(dialog).toBeHidden();
        continue;
      }

      await this.toggleByLabel(field, true);
    }

    await this.page.getByRole("button", { name: "تایید", exact: true }).click();
    await this.expectDetailsRoot();
  }

  async exerciseHeatingAndFacilities() {
    const heating = this.section("گرمایش و سرمایش");
    if (await heating.count()) {
      const chip = heating.locator('button[aria-pressed]').first();
      if (await chip.count()) {
        await chip.click();
        await expect(chip).toHaveAttribute("aria-pressed", "true");
      }

      const more = heating.getByRole("button", { name: /نمایش .* مورد بیشتر/ });
      if (await more.count()) {
        await more.click();
        const less = heating.getByRole("button", { name: "نمایش کمتر", exact: true });
        await expect(less).toBeVisible();
        await less.click();
      }
    }

    const facilities = this.section("امکانات");
    if (await facilities.count()) {
      const chip = facilities.locator('button[aria-pressed]').first();
      if (await chip.count()) {
        await chip.click();
        await expect(chip).toHaveAttribute("aria-pressed", "true");
      }

      const more = facilities.getByRole("button", { name: /نمایش .* مورد بیشتر/ });
      if (await more.count()) {
        await more.click();
        const less = facilities.getByRole("button", { name: "نمایش کمتر", exact: true });
        await expect(less).toBeVisible();
        await less.click();
      }
    }
  }

  async exerciseSalePriceOptions() {
    const loanLabel = this.page.getByText("وام دارد", { exact: true });
    if (await loanLabel.count()) {
      await this.toggleByLabel("وام دارد", true);
      await this.fillInput("مبلغ وام", "300000000");
      await this.fillInput("قسط وام", "5000000");
    }

    const exchangeLabel = this.page.getByText("معاوضه می‌شود", { exact: true });
    if (await exchangeLabel.count()) {
      await this.toggleByLabel("معاوضه می‌شود", true);

      // The visible field title is "معاوضه با", but the actual clickable
      // button is named "انتخاب". Scope it to the exchange card so we do not
      // click another Select button on the page.
      const exchangeCard = this.page
        .getByText("معاوضه با", { exact: true })
        .locator("xpath=ancestor::div[.//button[normalize-space()='انتخاب']][1]");
      const selectExchange = exchangeCard.getByRole("button", {
        name: "انتخاب",
        exact: true,
      });
      await expect(selectExchange).toBeVisible();
      await selectExchange.click();

      const dialog = this.page.getByRole("dialog", { name: "معاوضه با", exact: true });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "خودرو", exact: true }).click();
      await dialog.getByRole("button", { name: "بازگشت", exact: true }).click();
      await expect(dialog).toBeHidden();
    }
  }

  async exerciseProjectSaleTerms() {
    const label = this.page.getByText("شرایط فروش", { exact: true });
    if (!(await label.count())) return;

    await this.toggleByLabel("شرایط فروش", true);
    await this.fillInput("درصد شرایط", "30");
    await this.fillInput("تعداد اقساط", "12");
  }

  async exerciseProjectExchange() {
    const label = this.page.getByText("معاوضه", { exact: true });
    if (!(await label.count())) return;

    await this.toggleByLabel("معاوضه", true);
    const exchangeCard = this.page
      .getByText("معاوضه با", { exact: true })
      .locator("xpath=ancestor::div[.//button[normalize-space()='انتخاب']][1]");
    await exchangeCard.getByRole("button", { name: "انتخاب", exact: true }).click();

    const dialog = this.page.getByRole("dialog", { name: "معاوضه با", exact: true });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "خودرو", exact: true }).click();
    await dialog.getByRole("button", { name: "بازگشت", exact: true }).click();
    await expect(dialog).toBeHidden();
  }

  async exerciseProjectDetails() {
    const open = this.page.getByRole("button", { name: "جزییات پروژه", exact: true });
    if (!(await open.count())) return;

    await open.click();
    await expect(this.page.getByText("جزئیات پروژه", { exact: true }).first()).toBeVisible();
    await this.fillInput("متراژ *", "120");

    for (const title of ["طبقه", "تعداد اتاق", "موقعیت"]) {
      const titleNode = this.page.getByText(title, { exact: true }).first();
      const row = titleNode.locator("xpath=ancestor::div[.//button[normalize-space()='انتخاب']][1]");
      await row.getByRole("button", { name: "انتخاب", exact: true }).click();

      const dialog = this.page.getByRole("dialog", { name: title, exact: true });
      await expect(dialog).toBeVisible();
      await dialog.locator("button:not([disabled])").filter({ hasNotText: /بازگشت|لغو|تایید/ }).first().click();
      // Project detail sheets are multi-select. Close them through the real
      // BottomSheet back action (the shared BottomSheet does not bind Escape).
      await dialog.getByRole("button", { name: "بازگشت", exact: true }).click();
      await expect(dialog).toBeHidden();
    }

    const projectMeterageInputs = this.page.locator('main input[inputmode="numeric"]');
    await this.page.getByRole("button", { name: "اضافه کردن", exact: true }).click();
    await expect(projectMeterageInputs).toHaveCount(2);
    await this.page.getByRole("button", { name: "حذف", exact: true }).last().click();
    await expect(projectMeterageInputs).toHaveCount(1);

    await this.page.getByRole("button", { name: "بازگشت", exact: true }).last().click();
    await expect(this.page.getByRole("button", { name: "جزییات پروژه", exact: true })).toBeVisible();
  }

  async exerciseDailyHotelAdDetails() {
    await this.chooseSelect("دوره اجاره", "دوره اجاره", "روزانه");
    await this.fillInput("حداقل مدت اقامت", "1");
    await this.chooseSelect("ساعت ورود", "ساعت ورود");
    await this.chooseSelect("ساعت خروج", "ساعت خروج");
    await this.chooseSelect("حیوان خانگی", "حیوان خانگی");
  }

  async exerciseDailyHotelRoomEditor(options: { removeAfterSave?: boolean } = {}) {
    const room = this.page.getByRole("button", { name: "اتاق یک تخته", exact: true }).last();
    if (!(await room.count())) return;

    await room.click();

    // The new room editor is a fixed full-screen child view. Verify its own
    // top bar instead of asserting that the covered parent header disappeared
    // from the DOM. This guards the double-top-bar visual regression correctly.
    const editor = this.page
      .locator("div.fixed.inset-0")
      .filter({ has: this.page.getByRole("button", { name: "بازگشت", exact: true }) })
      .filter({ hasText: "اتاق یک تخته" })
      .last();
    await expect(editor).toBeVisible();
    await expect(editor.locator("header")).toHaveCount(1);
    await expect(editor.locator("header").getByText("اتاق یک تخته", { exact: true })).toBeVisible();

    await this.chooseSelect("ظرفیت استاندارد *", "ظرفیت استاندارد", "1");
    await this.chooseSelect("ظرفیت اضافه *", "ظرفیت اضافه", "1");
    await this.chooseSelect("وعده غذایی *", "وعده غذایی", "صبحانه");
    await this.fillInput("قیمت روزهای عادی *", "1000000");
    await this.fillInput("قیمت آخر هفته *", "1200000");
    await this.fillInput("قیمت روزهای خاص *", "1500000");
    await editor.getByRole("button", { name: "ثبت", exact: true }).click();

    const remove = this.page.getByRole("button", { name: "حذف اطلاعات اتاق یک تخته", exact: true });
    await expect(remove).toBeVisible();

    if (options.removeAfterSave) {
      await remove.click();
      await expect(remove).toHaveCount(0);
    }
  }

  async expectBottomSheetForField(field: string) {
    const button = this.page.getByRole("button", { name: field, exact: true }).first();
    await expect(button).toBeVisible();
    await button.click();
    const dialog = this.page.getByRole("dialog", { name: field.replace(/\s*\*$/, ""), exact: true });
    await expect(dialog).toBeVisible();
    await this.pickFirstDialogOption(dialog);
    await expect(dialog).toBeHidden();
  }

  async exerciseRentConversionGuard() {
    const priceSection = this.section("اطلاعات قیمت");
    const conversionLabel = priceSection.getByText("تبدیل رهن و اجاره", { exact: true }).last();
    const conversionContainer = conversionLabel.locator("xpath=ancestor::*[.//button[@role='switch']][1]");
    const toggle = conversionContainer.getByRole("switch").first();

    await expect(toggle).toBeDisabled();
    await this.fillInput("رهن *", "500000000");
    await expect(toggle).toBeEnabled();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "true");

    const range = this.page.getByRole("slider", { name: "تبدیل مبلغ رهن و اجاره" });
    await expect(range).toBeVisible();
    await range.fill("400000000");

    // The range conversion must write back into the real source inputs.
    const mortgageInput = priceSection.locator('input[inputmode="numeric"]').nth(0);
    const rentInput = priceSection.locator('input[inputmode="numeric"]').nth(1);
    await expect(mortgageInput).toHaveValue(/400,?000,?000|400000000/);
    await expect(rentInput).not.toHaveValue("");

    // If both source prices are cleared later, conversion must automatically
    // switch off and become unavailable again.
    await mortgageInput.fill("");
    await rentInput.fill("");
    await expect(toggle).toBeDisabled();
    await expect(toggle).toHaveAttribute("aria-checked", "false");
  }

  async continueToMedia() {
    const button = this.page.getByRole("button", { name: "مرحله بعد", exact: true });
    await expect(button).toBeEnabled();
    await button.click();
    await expect(this.page.getByText("عکس آگهی", { exact: true })).toBeVisible();
  }

  async uploadPhotosAndExerciseRemove() {
    const input = this.page.locator('input[type="file"][accept*="image/png"]').first();

    await input.setInputFiles([
      {
        name: "playwright-property-1.png",
        mimeType: "image/png",
        buffer: Buffer.from(png1x1, "base64"),
      },
      {
        name: "playwright-property-2.png",
        mimeType: "image/png",
        buffer: Buffer.from(png1x1, "base64"),
      },
    ]);

    await expect(this.page.getByAltText("عکس آگهی 1")).toBeVisible();
    await expect(this.page.getByAltText("عکس آگهی 2")).toBeVisible();

    await this.page.getByRole("button", { name: "حذف عکس", exact: true }).first().click();
    await expect(this.page.getByRole("button", { name: "حذف عکس", exact: true })).toHaveCount(1);
  }

  async enableAndUploadVideo() {
    const media = this.section("عکس آگهی");
    const videoToggle = media.getByRole("switch").first();
    await videoToggle.click();
    await expect(videoToggle).toHaveAttribute("aria-checked", "true");

    const videoInput = media.locator('input[type="file"][accept*="video/mp4"]');
    await videoInput.setInputFiles({
      name: "playwright-property.mp4",
      mimeType: "video/mp4",
      buffer: Buffer.from("playwright-video-test"),
    });

    await expect(this.page.getByText("playwright-property.mp4", { exact: true })).toBeVisible();
  }

  async enableVirtualTour() {
    const media = this.section("عکس آگهی");
    const virtualTourToggle = media.getByRole("switch").nth(1);
    await virtualTourToggle.click();
    await expect(virtualTourToggle).toHaveAttribute("aria-checked", "true");

    // InputBox intentionally removes its placeholder once it has a value, so
    // keep a stable role-based locator instead of re-querying by placeholder.
    const input = media.getByRole("textbox").first();
    await expect(input).toBeVisible();
    await input.fill("https://example.com/virtual-tour");
    await expect(input).toHaveValue("https://example.com/virtual-tour");

    return input;
  }

  async selectPersonalRegistrant() {
    const personal = this.page.getByRole("button", { name: /شخصی/ }).first();
    await personal.click();
    await expect(personal).toHaveAttribute("aria-pressed", "true");
  }

  async selectAgencyRegistrant() {
    const agency = this.page.getByRole("button", { name: /آژانس/ }).first();
    await agency.click();
    await expect(agency).toHaveAttribute("aria-pressed", "true");
  }

  async enablePhoneContact() {
    const phone = this.page.getByRole("button", { name: /شماره تماس/ }).first();
    if (await phone.count()) await phone.click();
  }

  async fillSocials() {
    await this.fillInput("آیدی تلگرام خود را وارد کنید", "bonga_playwright");
    await this.fillInput("شماره واتساپ خود را بدون صفر وارد کنید", "9120000000");
  }

  async fillAgencyOwnerFields() {
    const ownerName = this.page.getByPlaceholder("نام و نام خانوادگی خودتان را وارد کنید", {
      exact: true,
    });
    if (await ownerName.count()) await ownerName.fill("کاربر تست پلی‌رایت");

    await this.fillInput(
      "مثال: بلوار هاشمیه، هاشمیه ۲۰، پلاک ۲۰، طبقه ۲",
      "مشهد، بلوار سجاد، پلاک ۱۰",
    );
  }

  async fillAdInformation(label = "آپارتمان") {
    await this.page.getByPlaceholder(/^مثال:/).last().fill(`${label} تست Playwright`);
    await this.page
      .getByPlaceholder("اطلاعات بیشتر را وارد کنید...", { exact: true })
      .fill(`ثبت کامل ${label} برای تست خودکار Playwright بنگاه.`);
  }

  async exerciseAllMediaForPersonal(label: string) {
    await this.uploadPhotosAndExerciseRemove();
    await this.enableAndUploadVideo();
    await this.enableVirtualTour();
    await this.selectPersonalRegistrant();
    await this.enablePhoneContact();
    await this.fillSocials();
    await this.fillAdInformation(label);
  }

  async submitInformation() {
    await this.page.getByRole("button", { name: "ثبت اطلاعات", exact: true }).click();
  }
}
