import { expect, type Page, type Route, test } from "@playwright/test"

test("shows meaningful added and removed lines", async ({ page }) => {
  await mockCheckApi(page, {
    ok: true,
    watch: {
      url: "https://example.go.kr/notice",
      name: "지원사업 공고",
      category: "public",
      checkedAt: "2026-06-02T00:00:00.000Z",
    },
    changed: true,
    summary: "마감일과 접수 안내 문구가 바뀌었습니다.",
    diff: {
      meaningfulAdded: ["접수 마감: 2026-06-20", "온라인 신청 가능"],
      meaningfulRemoved: ["접수 마감: 2026-06-10"],
    },
  })

  await page.goto("/watch")
  await page.getByLabel("URL").fill("https://example.go.kr/notice")
  await page.getByLabel("Watch name").fill("지원사업 공고")
  await page.getByRole("button", { name: "변경 확인" }).click()

  await expect(page.getByText("변경 감지", { exact: true })).toBeVisible()
  await expect(page.getByText("마감일과 접수 안내 문구가 바뀌었습니다.")).toBeVisible()
  await expect(page.getByRole("heading", { name: "추가된 내용" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "삭제된 내용" })).toBeVisible()
  await expect(page.getByText("접수 마감: 2026-06-20")).toBeVisible()
  await expect(page.getByText("온라인 신청 가능")).toBeVisible()
  await expect(page.getByText("접수 마감: 2026-06-10")).toBeVisible()
})

test("keeps the dashboard stable when diff arrays are missing", async ({ page }) => {
  await mockCheckApi(page, {
    ok: true,
    watch: {
      url: "https://store.example.com/product",
      name: "상품 상세",
      category: "shopping",
      checkedAt: "2026-06-02T00:00:00.000Z",
    },
    changed: false,
    summary: "의미 있는 본문 변경은 감지되지 않았습니다.",
    diff: {
      meaningfulAdded: "not an array",
      meaningfulRemoved: null,
    },
  })

  await page.goto("/watch")
  await page.getByLabel("URL").fill("https://store.example.com/product")
  await page.getByRole("button", { name: "변경 확인" }).click()

  await expect(page.getByText("변경 없음", { exact: true })).toBeVisible()
  await expect(page.getByText("변경 상세 없음")).toBeVisible()
  await expect(page.getByText("추가된 의미 있는 문구 없음")).toBeVisible()
  await expect(page.getByText("삭제된 의미 있는 문구 없음")).toBeVisible()
})

test("caps long diff sections so the result stays scannable", async ({ page }) => {
  await mockCheckApi(page, {
    ok: true,
    watch: {
      url: "https://example.go.kr/notice",
      name: "긴 공고",
      category: "public",
      checkedAt: "2026-06-02T00:00:00.000Z",
    },
    changed: true,
    summary: "여러 공고 문구가 한 번에 바뀌었습니다.",
    diff: {
      meaningfulAdded: [
        "1번째 변경",
        "2번째 변경",
        "3번째 변경",
        "4번째 변경",
        "5번째 변경",
        "6번째 변경",
      ],
      meaningfulRemoved: [],
    },
  })

  await page.goto("/watch")
  await page.getByLabel("URL").fill("https://example.go.kr/notice")
  await page.getByRole("button", { name: "변경 확인" }).click()

  await expect(page.getByText("1번째 변경")).toBeVisible()
  await expect(page.getByText("5번째 변경")).toBeVisible()
  await expect(page.getByText("6번째 변경")).toHaveCount(0)
  await expect(page.getByText("외 1개 더 있음")).toBeVisible()
  await expect(page.getByText("삭제된 의미 있는 문구 없음")).toBeVisible()
})

async function mockCheckApi(page: Page, payload: unknown): Promise<void> {
  await page.route("**/api/check", async (route: Route) => {
    await route.fulfill({
      body: JSON.stringify(payload),
      contentType: "application/json",
      status: 200,
    })
  })
}
