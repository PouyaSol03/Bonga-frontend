import { expect, test } from "@playwright/test";
import storybookConfig from "../../../.storybook/main";

test("Storybook does not register the removed viewport addon", () => {
  expect(storybookConfig.addons).not.toContain("@storybook/addon-viewport");
});

test("assigned-ad published story renders without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" && !text.includes("404 (Not Found)")) errors.push(text);
  });

  await page.goto(
    "/iframe.html?id=features-account-accountmyadstatepage--agency-docs-1-published&viewMode=story",
  );

  await expect(page.getByText("منتشر شده", { exact: true }).first()).toBeVisible();
  expect(errors).toEqual([]);
});
