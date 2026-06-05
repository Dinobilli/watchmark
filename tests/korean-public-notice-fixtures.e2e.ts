import { expect, type Page, type Route, test } from "@playwright/test"

test("previews Korean public notice deadline fixture", async ({ page }) => {
  await page.goto("/watch")
  await page.getByRole("button", { name: "마감일 변경" }).click()

  await expect(page.getByText("변경 감지", { exact: true })).toBeVisible()
  await expect(page.getByText("접수 마감: 2026-06-20", { exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: "추가된 내용" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "삭제된 내용" })).toBeVisible()
})

test("keeps fixture preview text escaped", async ({ page }) => {
  await page.goto("/watch")
  await page.getByRole("button", { name: "첨부파일 변경" }).click()

  await expect(page.getByRole("heading", { name: "추가된 내용" })).toBeVisible()
  await expect(page.locator("#result script")).toHaveCount(0)
})

test("renders hostile fixture API payload as text", async ({ page }) => {
  const hostileLine = "<script>window.__watchmarkXss = true</script>"
  await mockFixtureApi(page, "attachment-change", {
    ok: true,
    watch: {
      url: "https://public-notice-fixture.example/attachment-change",
      name: "첨부파일 변경",
      category: "public",
      checkedAt: "2026-06-05T00:00:00.000Z",
    },
    changed: true,
    summary: hostileLine,
    diff: {
      meaningfulAdded: [hostileLine],
      meaningfulRemoved: [],
    },
  })

  await page.goto("/watch")
  await page.getByRole("button", { name: "첨부파일 변경" }).click()

  await expect(page.getByText(hostileLine).first()).toBeVisible()
  await expect(page.locator("#result script")).toHaveCount(0)
  const scriptRan = await page.evaluate(() => Reflect.has(globalThis, "__watchmarkXss"))
  expect(scriptRan).toBe(false)
})

async function mockFixtureApi(page: Page, fixtureId: string, payload: unknown): Promise<void> {
  await page.route(`**/api/fixtures/korean-public-notices/${fixtureId}`, async (route: Route) => {
    await route.fulfill({
      body: JSON.stringify(payload),
      contentType: "application/json",
      status: 200,
    })
  })
}
