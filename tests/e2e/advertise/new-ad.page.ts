import { expect, type Locator, type Page } from "@playwright/test";
import type { NewAdScenario, TransactionLabel } from "./new-ad.scenarios";

const png1x1 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

function valueForRequiredField(field: string) {
  if (field.includes("سهم سازنده")) return "50";
  if (field.includes("حداقل قیمت")) return "1000000000";
  if (field.includes("حداکثر قیمت")) return "2000000000";
  if (field.includes("رهن")) return "500000000";
  if (field.includes("اجاره")) return "10000000";
  if (field.includes("قیمت")) return "1500000000";
  if (field.includes("تعداد کل طبقات")) return "8";
  if (field.includes("تعداد کل واحدها")) return "24";
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

  async chooseDeliveryDate() {
    await this.page.getByRole("button", { name: "تاریخ تحویل *", exact: true }).click();

    const dialog = this.page.getByRole("dialog", { name: "تاریخ تحویل", exact: true });
    await expect(dialog).toBeVisible();

    // react-multi-date-picker keeps hidden month/year cells in the DOM. Pick a
    // visible 1-2 digit day only, otherwise Playwright can resolve a hidden
    // year such as ۱۴۱۲.
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

      if (field === "تاریخ تحویل *") {
        await this.chooseDeliveryDate();
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
      .getByRole("button", { name: /مشخصات دیگر|ویرایش مشخصات/ })
      .first();

    if (!expectedFields.length) {
      await expect(moreButton).toHaveCount(0);
      return;
    }

    await expect(moreButton).toBeVisible();
    await moreButton.click();
    await expect(this.page.getByText("ویژگی‌های بیشتر", { exact: true })).toBeVisible();

    for (const field of expectedFields) {
      const input = this.page.getByPlaceholder(field, { exact: true });
      const select = this.page.getByRole("button", { name: field, exact: true });
      const text = this.page.getByText(field, { exact: true });

      // Wait for the actual control instead of using count() while the step is
      // rendering/re-rendering.
      await expect(input.or(select).or(text).first()).toBeVisible();
    }

    // Cancel is a real user path and must not commit draft changes.
    await this.page.getByRole("button", { name: "انصراف", exact: true }).click();
    await expect(this.page.getByText("موقعیت ملک", { exact: true })).toBeVisible();

    await this.page
      .getByRole("button", { name: /مشخصات دیگر|ویرایش مشخصات/ })
      .first()
      .click();

    for (const field of expectedFields) {
      const input = this.page.getByPlaceholder(field, { exact: true });
      const select = this.page.getByRole("button", { name: field, exact: true });
      const label = this.page.getByText(field, { exact: true });

      // MoreFeaturesStep re-renders after each selection. Do not use count()
      // as a readiness check; it can briefly return 0 and misclassify a
      // select field (for example "جنس کابینت") as a switch.
      await expect(input.or(select).or(label).first()).toBeVisible();

      if (await input.isVisible()) {
        await input.fill("12");
        continue;
      }

      if (await select.isVisible()) {
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
    await expect(this.page.getByText("موقعیت ملک", { exact: true })).toBeVisible();
  }

  async exerciseHeatingAndFacilities() {
    const heating = this.section("سرمایش و گرمایش");
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
    await this.fillInput("درصد", "30");
    await this.fillInput("تعداد قسط", "12");
  }

  async exerciseProjectDetails() {
    const open = this.page.getByRole("button", { name: "ثبت جزئیات پروژه", exact: true });
    if (!(await open.count())) return;

    await open.click();
    await expect(this.page.getByText("جزئیات پروژه", { exact: true })).toBeVisible();
    await this.fillInput("متراژ *", "120");

    for (const title of ["طبقه", "تعداد اتاق", "موقعیت"]) {
      const titleNode = this.page.getByText(title, { exact: true }).first();
      const row = titleNode.locator("xpath=ancestor::div[contains(@class,'space-y-3')][1]");
      await row.getByRole("button", { name: "انتخاب", exact: true }).click();

      const dialog = this.page.getByRole("dialog", { name: title, exact: true });
      await expect(dialog).toBeVisible();
      await this.pickFirstDialogOption(dialog);
      await this.page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    }

    const projectMeterageInputs = this.page.locator('main input[inputmode="numeric"]');
    await this.page.getByRole("button", { name: "اضافه کردن", exact: true }).click();
    await expect(projectMeterageInputs).toHaveCount(2);
    await this.page.getByRole("button", { name: "حذف", exact: true }).last().click();
    await expect(projectMeterageInputs).toHaveCount(1);

    await this.page.getByRole("button", { name: "بازگشت", exact: true }).last().click();
    await expect(this.page.getByRole("button", { name: "ثبت جزئیات پروژه", exact: true })).toBeVisible();
  }

  async exerciseDailyHotelRoomEditor() {
    const room = this.page.getByRole("button", { name: "اتاق یک تخته", exact: true }).last();
    if (!(await room.count())) return;

    await room.click();
    await expect(
      this.page.getByRole("heading", { name: "اتاق یک تخته", exact: true }),
    ).toBeVisible();

    await this.chooseSelect("تعداد نفر *", "تعداد نفر", "1");
    await this.chooseSelect("تعداد نفر اضافه *", "تعداد نفر اضافه", "1");
    await this.chooseSelect("وعده غذایی *", "وعده غذایی", "صبحانه");
    await this.fillInput("قیمت روزهای عادی *", "1000000");
    await this.fillInput("قیمت آخر هفته *", "1200000");
    await this.fillInput("قیمت روزهای خاص *", "1500000");
    await this.page.getByRole("button", { name: "ثبت", exact: true }).click();

    const remove = this.page.getByRole("button", { name: "حذف اطلاعات اتاق یک تخته", exact: true });
    await expect(remove).toBeVisible();
    await remove.click();
    await expect(remove).toHaveCount(0);
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
