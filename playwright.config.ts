import { defineConfig, devices } from "@playwright/test"

const port = 43140
const baseURL = `http://127.0.0.1:${port}`

const config = defineConfig({
  testDir: "./tests",
  testMatch: "**/*.e2e.ts",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: `PORT=${port} bun run src/index.ts`,
    reuseExistingServer: process.env["CI"] !== "true",
    timeout: 30_000,
    url: `${baseURL}/watch`,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],
})

// biome-ignore lint/style/noDefaultExport: Playwright loads configuration through a default export.
export default config
