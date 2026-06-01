import { expect, test } from "bun:test"
import { createWatchmarkService } from "./monitor"

test("detects_changed_content_after_baseline", async () => {
  const pages = new Map<string, string>([
    [
      "https://example.com/notice",
      `<html><body><main><h1>입찰 공고</h1><p>접수 마감: 2026-06-10</p></main></body></html>`,
    ],
  ])

  const service = createWatchmarkService({
    fetchHtml: async (url: string) => {
      const html = pages.get(url)
      if (html === undefined) {
        throw new Error(`missing fixture for ${url}`)
      }
      return html
    },
  })

  const baseline = await service.checkUrl({
    url: "https://example.com/notice",
    name: "조달 공고",
    category: "public",
  })
  expect(baseline.changed).toBe(false)

  pages.set(
    "https://example.com/notice",
    `<html><body><main><h1>입찰 공고</h1><p>접수 마감: 2026-06-15</p></main></body></html>`,
  )

  const changed = await service.checkUrl({
    url: "https://example.com/notice",
    name: "조달 공고",
    category: "public",
  })

  expect(changed.changed).toBe(true)
  expect(changed.summary.length).toBeGreaterThan(0)
})
