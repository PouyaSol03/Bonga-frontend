import { expect, test, type Page } from "@playwright/test";

async function seedMultiRoleUser(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem("bonga-selected-city", "مشهد");
    window.localStorage.setItem("bonga-selected-city-id", "101");
    window.localStorage.setItem(
      "bonga-auth-session",
      JSON.stringify({
        accessToken: "publisher-test-token",
        accountType: "user",
        activeRole: "user",
        expiresAt: Date.now() + 60 * 60 * 1000,
        mobile: "09120000000",
        role: "user",
        roles: [
          { id: "user", name: "کاربر", slug: "user" },
          { id: "manager", name: "مدیر آژانس", slug: "real_estate_manager" },
          { id: "agency-agent", name: "مشاور آژانس", slug: "real_estate_consultant" },
          { id: "independent", name: "مشاور مستقل", slug: "independent_consultant" },
        ],
      }),
    );
  });

  await page.route("**/me/agency/show**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ status: true, data: { id: 12, name: "آژانس تست" } }),
    }),
  );
}

async function activeRole(page: Page) {
  return page.evaluate(() => {
    const session = JSON.parse(window.localStorage.getItem("bonga-auth-session") || "{}");
    return session.activeRole;
  });
}

test.describe("advertise publisher context", () => {
  test.beforeEach(async ({ page }) => {
    await seedMultiRoleUser(page);
    await page.goto("/home");
    await page.getByText("ثبت آگهی", { exact: true }).last().click();
  });

  test("shows user, agency and both consultant publisher identities separately", async ({ page }) => {
    await expect(page.getByText("شخصی", { exact: true })).toBeVisible();
    await expect(page.getByText("آژانس تست", { exact: true })).toBeVisible();
    await expect(page.getByText("مشاور آژانس", { exact: true })).toBeVisible();
    await expect(page.getByText("مشاور مستقل", { exact: true })).toBeVisible();
  });

  test("selecting agency changes active user-type context instead of creating an assignment", async ({ page }) => {
    await page.getByText("آژانس تست", { exact: true }).click();
    await expect(page).toHaveURL(/\/new-ad\/agency\?registrantType=personal/);
    await expect.poll(() => activeRole(page)).toBe("real_estate_manager");
  });

  test("selecting agency consultant uses agent publisher context", async ({ page }) => {
    await page.getByText("مشاور آژانس", { exact: true }).click();
    await expect(page).toHaveURL(/\/new-ad\/agency-consultant\?registrantType=personal/);
    await expect.poll(() => activeRole(page)).toBe("real_estate_consultant");
  });
});
