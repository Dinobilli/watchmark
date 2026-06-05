import { expect, test } from "bun:test"
import { createWatchmarkService, InvalidWatchInputError } from "./monitor"

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

test("blocks_redirects_to_private_networks", async () => {
  const service = createWatchmarkService({
    fetchResponse: async (url: string) => {
      if (url === "https://safe.example/start") {
        return new Response(null, {
          status: 302,
          headers: { location: "http://127.0.0.1/admin" },
        })
      }
      return new Response("<html><body><main>private</main></body></html>")
    },
    resolveHostname: async () => ["93.184.216.34"],
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "https://safe.example/start" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
})

test("blocks_non_http_url_schemes", async () => {
  const service = createWatchmarkService({
    fetchHtml: async () => "<html><body><main>file</main></body></html>",
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "file:///etc/passwd" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
})

test("blocks_urls_with_embedded_credentials_before_fetching", async () => {
  let fetchCalls = 0
  const service = createWatchmarkService({
    fetchHtml: async () => {
      fetchCalls += 1
      return "<html><body><main>private</main></body></html>"
    },
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "https://user:secret@example.com/private" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
  expect(fetchCalls).toBe(0)
})

test("blocks_url_fragments_before_fetching", async () => {
  let fetchCalls = 0
  const service = createWatchmarkService({
    fetchHtml: async () => {
      fetchCalls += 1
      return "<html><body><main>private</main></body></html>"
    },
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "https://example.com/notice#access_token=secret" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
  expect(fetchCalls).toBe(0)
})

test("blocks_ipv6_loopback_urls", async () => {
  const service = createWatchmarkService({
    fetchHtml: async () => "<html><body><main>private</main></body></html>",
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "http://[::1]/admin" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
})

test("blocks_ipv4_mapped_ipv6_private_urls", async () => {
  const service = createWatchmarkService({
    fetchHtml: async () => "<html><body><main>private</main></body></html>",
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "http://[::ffff:127.0.0.1]/admin" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
})

test("blocks_ipv6_link_local_urls", async () => {
  const service = createWatchmarkService({
    fetchHtml: async () => "<html><body><main>private</main></body></html>",
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "http://[fea0::1]/admin" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
})

test("allows_public_hostnames_that_start_like_ipv6_ranges", async () => {
  const service = createWatchmarkService({
    fetchResponse: async () => new Response("<html><body><main>public</main></body></html>"),
    resolveHostname: async () => ["93.184.216.34"],
  })

  const result = await service.checkUrl({ url: "https://fc.example.com/start" })

  expect(result.changed).toBe(false)
})

test("allows_public_ipv4_addresses_outside_special_ranges", async () => {
  const service = createWatchmarkService({
    fetchHtml: async () => "<html><body><main>public</main></body></html>",
  })

  const result = await service.checkUrl({ url: "http://203.0.114.1/start" })

  expect(result.changed).toBe(false)
})

test("blocks_hostnames_that_resolve_to_private_networks", async () => {
  const service = createWatchmarkService({
    fetchResponse: async () => new Response("<html><body><main>private</main></body></html>"),
    resolveHostname: async () => ["127.0.0.1"],
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "https://safe.example/start" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
})

test("blocks_hostnames_that_resolve_to_ipv6_link_local_networks", async () => {
  const service = createWatchmarkService({
    fetchResponse: async () => new Response("<html><body><main>private</main></body></html>"),
    resolveHostname: async () => ["fea0::1"],
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "https://safe.example/start" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
})

test("blocks_hostnames_that_resolve_to_ipv4_mapped_private_networks", async () => {
  const service = createWatchmarkService({
    fetchResponse: async () => new Response("<html><body><main>private</main></body></html>"),
    resolveHostname: async () => ["::ffff:7f00:1"],
  })

  let caughtError: unknown
  try {
    await service.checkUrl({ url: "https://safe.example/start" })
  } catch (error) {
    caughtError = error
  }

  expect(caughtError).toBeInstanceOf(InvalidWatchInputError)
})
