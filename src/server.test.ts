import { expect, test } from "bun:test"
import { createApp } from "./app"

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
