import { lookup } from "node:dns/promises"
import { isIP } from "node:net"
import ky from "ky"
import { InvalidWatchInputError } from "./errors"

export type HttpTransport = (url: string, init?: RequestInit) => Promise<Response>
export type HostResolver = (hostname: string) => Promise<readonly string[]>

class FetchFailedError extends Error {
  constructor() {
    super("FETCH_FAILED")
    this.name = "FetchFailedError"
  }
}

export function assertAllowedHttpUrl(url: string, allowPrivateUrls: boolean): void {
  const parsed = new URL(url)
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new InvalidWatchInputError(["Only http and https URLs are supported."])
  }
  if (parsed.username !== "" || parsed.password !== "") {
    throw new InvalidWatchInputError(["URL credentials are not supported."])
  }
  if (parsed.hash !== "") {
    throw new InvalidWatchInputError(["URL fragments are not supported."])
  }
  if (!allowPrivateUrls && isPrivateHostname(normalizeHostname(parsed.hostname))) {
    throw new InvalidWatchInputError(["Private or local network URLs are blocked by default."])
  }
}

export async function fetchSafeHtml(
  initialUrl: string,
  allowPrivateUrls: boolean,
  transport: HttpTransport,
  resolveHostname: HostResolver,
): Promise<string> {
  let currentUrl = initialUrl

  for (let redirectCount = 0; redirectCount <= 5; redirectCount += 1) {
    await assertNetworkSafeUrl(currentUrl, allowPrivateUrls, resolveHostname)
    const response = await ky.get(currentUrl, {
      fetch: toKyFetch(transport),
      redirect: "manual",
      retry: { limit: 1 },
      throwHttpErrors: false,
      timeout: 10_000,
    })

    if (isRedirectStatus(response.status)) {
      const location = response.headers.get("location")
      if (location === null) {
        throw new InvalidWatchInputError(["Redirect response is missing a Location header."])
      }
      currentUrl = new URL(location, currentUrl).toString()
      continue
    }

    if (!response.ok) {
      throw new FetchFailedError()
    }

    return response.text()
  }

  throw new InvalidWatchInputError(["Too many redirects while fetching URL."])
}

export async function defaultResolveHostname(hostname: string): Promise<readonly string[]> {
  const records = await lookup(hostname, { all: true })
  return records.map((record) => record.address)
}

async function assertNetworkSafeUrl(
  url: string,
  allowPrivateUrls: boolean,
  resolveHostname: HostResolver,
): Promise<void> {
  const parsed = new URL(url)
  const hostname = normalizeHostname(parsed.hostname)
  assertAllowedHttpUrl(parsed.toString(), allowPrivateUrls)
  if (allowPrivateUrls || isIP(hostname) !== 0) {
    return
  }
  const addresses = await resolveHostname(hostname)
  if (addresses.some((address) => isPrivateHostname(normalizeHostname(address)))) {
    throw new InvalidWatchInputError(["Hostnames resolving to private networks are blocked."])
  }
}

function normalizeHostname(hostname: string): string {
  const lowered = hostname.toLowerCase()
  if (lowered.startsWith("[") && lowered.endsWith("]")) {
    return lowered.slice(1, -1)
  }
  return lowered
}

function isPrivateHostname(hostname: string): boolean {
  const mappedIpv4 = ipv4FromMappedIpv6(hostname)
  if (mappedIpv4 !== undefined) {
    return isPrivateIpv4Address(mappedIpv4)
  }

  const ipVersion = isIP(hostname)
  if (hostname === "localhost" || hostname.endsWith(".local")) {
    return true
  }
  if (ipVersion === 4) {
    return isPrivateIpv4Address(hostname)
  }
  if (ipVersion === 6) {
    return isPrivateIpv6Address(hostname)
  }
  return false
}

function isPrivateIpv4Address(address: string): boolean {
  const octets = parseIpv4Address(address)
  if (octets === undefined) {
    return true
  }

  const [first, second, third] = octets
  if (first === 0 || first === 10 || first === 127 || first >= 224) {
    return true
  }
  if (first === 100 && second >= 64 && second <= 127) {
    return true
  }
  if (first === 169 && second === 254) {
    return true
  }
  if (first === 172 && second >= 16 && second <= 31) {
    return true
  }
  if (first === 192 && second === 0 && (third === 0 || third === 2)) {
    return true
  }
  if (first === 192 && second === 168) {
    return true
  }
  if (first === 198 && (second === 18 || second === 19)) {
    return true
  }
  if (first === 198 && second === 51 && third === 100) {
    return true
  }
  return first === 203 && second === 0 && third === 113
}

function isPrivateIpv6Address(address: string): boolean {
  const first = firstIpv6Hextet(address)
  if (first === undefined) {
    return true
  }

  return (
    first === 0 ||
    (first & 0xfe00) === 0xfc00 ||
    (first & 0xffc0) === 0xfe80 ||
    (first & 0xffc0) === 0xfec0 ||
    (first & 0xff00) === 0xff00
  )
}

function parseIpv4Address(address: string): readonly [number, number, number, number] | undefined {
  const parts = address.split(".")
  if (parts.length !== 4) {
    return undefined
  }

  const first = parseIpv4Octet(parts[0])
  const second = parseIpv4Octet(parts[1])
  const third = parseIpv4Octet(parts[2])
  const fourth = parseIpv4Octet(parts[3])
  if (first === undefined || second === undefined || third === undefined || fourth === undefined) {
    return undefined
  }

  return [first, second, third, fourth]
}

function parseIpv4Octet(part: string | undefined): number | undefined {
  if (part === undefined || !/^\d{1,3}$/u.test(part)) {
    return undefined
  }

  const octet = Number.parseInt(part, 10)
  if (octet > 255) {
    return undefined
  }
  return octet
}

function firstIpv6Hextet(address: string): number | undefined {
  const [first] = address.split(":")
  if (first === "") {
    return 0
  }
  return parseIpv6Hextet(first)
}

function ipv4FromMappedIpv6(hostname: string): string | undefined {
  const prefix = "::ffff:"
  if (!hostname.startsWith(prefix)) {
    return undefined
  }

  const suffix = hostname.slice(prefix.length)
  if (/^\d+\.\d+\.\d+\.\d+$/u.test(suffix)) {
    return suffix
  }

  const parts = suffix.split(":")
  if (parts.length !== 2) {
    return undefined
  }

  const high = parseIpv6Hextet(parts[0])
  const low = parseIpv6Hextet(parts[1])
  if (high === undefined || low === undefined) {
    return undefined
  }

  return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`
}

function parseIpv6Hextet(part: string | undefined): number | undefined {
  if (part === undefined || !/^[\da-f]{1,4}$/u.test(part)) {
    return undefined
  }
  return Number.parseInt(part, 16)
}

function isRedirectStatus(status: number): boolean {
  return status >= 300 && status < 400
}

function toKyFetch(
  transport: HttpTransport,
): (input: string | URL | Request, init?: RequestInit) => Promise<Response> {
  return (input, init) => transport(inputToUrl(input), init)
}

function inputToUrl(input: string | URL | Request): string {
  if (typeof input === "string") {
    return input
  }
  if (input instanceof URL) {
    return input.toString()
  }
  return input.url
}
