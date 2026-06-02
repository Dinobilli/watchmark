import { expect, test } from "bun:test"
import { createApp } from "./app"

test("serves_dashboard_at_watch_route", async () => {
  const app = createApp()
  const response = await app.request(new Request("http://localhost/watch"))
  const html = await response.text()

  expect(response.status).toBe(200)
  expect(html).toContain("Watchmark")
  expect(html).toContain('id="watch-form"')
})

test("rejects_malformed_watch_url", async () => {
  const app = createApp()
  const response = await app.request(
    new Request("http://localhost/api/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "not-a-url", name: "broken" }),
    }),
  )
  const payload: unknown = await response.json()

  expect(response.status).toBe(400)
  expect(payload).toBeObject()
  if (payload === null || typeof payload !== "object") {
    throw new TypeError("expected object payload")
  }
  expect("ok" in payload && payload.ok).toBe(false)
  expect("watch" in payload).toBe(false)
  expect("summary" in payload).toBe(false)
  expect("error" in payload && typeof payload.error).toBe("object")
})

test("blocks_private_urls_without_dev_override", async () => {
  const app = createApp()
  const response = await app.request(
    new Request("http://localhost/api/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "http://127.0.0.1:9/internal", name: "internal" }),
    }),
  )
  const payload: unknown = await response.json()

  expect(response.status).toBe(400)
  expect(payload).toBeObject()
  if (payload === null || typeof payload !== "object") {
    throw new TypeError("expected object payload")
  }
  expect("ok" in payload && payload.ok).toBe(false)
  expect("error" in payload && typeof payload.error).toBe("object")
})

test("returns_empty_diff_arrays_for_unchanged_second_check", async () => {
  const app = createApp({
    service: {
      checkUrl: async () => ({
        ok: true,
        watch: {
          url: "https://example.com/notice",
          name: "Example Notice",
          category: "public",
          checkedAt: "2026-06-02T00:00:00.000Z",
        },
        changed: false,
        summary: "의미 있는 본문 변경은 감지되지 않았습니다.",
        diff: {
          meaningfulAdded: [],
          meaningfulRemoved: [],
        },
      }),
    },
  })
  const response = await app.request(
    new Request("http://localhost/api/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "https://example.com/notice", name: "Example Notice" }),
    }),
  )
  const payload: unknown = await response.json()

  expect(response.status).toBe(200)
  expect(payload).toBeObject()
  if (payload === null || typeof payload !== "object") {
    throw new TypeError("expected object payload")
  }
  expect("changed" in payload && payload.changed).toBe(false)
  expect("diff" in payload && payload.diff).toEqual({
    meaningfulAdded: [],
    meaningfulRemoved: [],
  })
})

test("does_not_expose_fetch_error_details", async () => {
  const leakedToken = ["gho", "private"].join("_")
  const leakedIp = ["10", "0", "0", "5"].join(".")
  const leakedEmail = ["person", "example.com"].join("@")
  const app = createApp({
    service: {
      checkUrl: async () => {
        throw new Error(`token=${leakedToken} ip=${leakedIp} email=${leakedEmail}`)
      },
    },
  })
  const response = await app.request(
    new Request("http://localhost/api/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: "https://example.com/private" }),
    }),
  )
  const body = await response.text()

  expect(response.status).toBe(502)
  expect(body).not.toContain(leakedToken)
  expect(body).not.toContain(leakedIp)
  expect(body).not.toContain(leakedEmail)
  expect(body).toContain("FETCH_FAILED")
})
