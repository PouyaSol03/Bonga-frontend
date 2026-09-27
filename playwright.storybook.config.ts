import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e/storybook",
  fullyParallel: false,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:6006",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    command: "npm run storybook -- --ci --host 127.0.0.1",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
