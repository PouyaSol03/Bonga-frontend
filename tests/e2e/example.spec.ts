import { expect, test } from "@playwright/test";

async function seedLocalAppState(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("bonga-selected-city", "مشهد");
    window.localStorage.setItem("bonga-selected-city-id", "000000000000000000000101");
    window.localStorage.setItem(
      "bonga-auth-session",
      JSON.stringify({
        accessToken: "playwright-smoke-token",
        accountType: "user",
        activeRole: "user",
        expiresAt: Date.now() + 60 * 60 * 1000,
        mobile: "09120000000",
        role: "user",
        roles: [{ id: "user", name: "کاربر", slug: "user" }],
      }),
    );
  });
}

test.describe("local app smoke", () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalAppState(page);
  });

  test("new-ad category shell opens on the local app", async ({ page }) => {
    await page.goto("/new-ad/category");
    await expect(page.getByRole("tablist", { name: "نوع معامله" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ادامه", exact: true })).toBeDisabled();
  });

  test("transaction tabs switch without an external website dependency", async ({ page }) => {
    await page.goto("/new-ad/category");
    const rent = page.getByRole("tab", { name: "اجاره", exact: true });
    await rent.click();
    await expect(rent).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("روزانه", { exact: true })).toBeVisible();
  });
});
