import ky from "ky"
import { z } from "zod"
import { extractMeaningfulText, summarizeMeaningfulChanges } from "./summarizer"

const WatchInputSchema = z.object({
  url: z.url(),
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
})

export type WatchInput = z.infer<typeof WatchInputSchema>

export type WatchResult = {
  readonly ok: true
  readonly watch: {
    readonly url: string
    readonly name: string
    readonly category: string
    readonly checkedAt: string
  }
  readonly changed: boolean
  readonly summary: string
  readonly diff: {
    readonly meaningfulAdded: readonly string[]
    readonly meaningfulRemoved: readonly string[]
  }
}

export type WatchmarkService = {
  readonly checkUrl: (input: WatchInput) => Promise<WatchResult>
}

export type WatchmarkServiceOptions = {
  readonly fetchHtml?: (url: string) => Promise<string>
  readonly now?: () => Date
  readonly allowPrivateUrls?: boolean
}

export class InvalidWatchInputError extends Error {
  readonly issues: readonly string[]

  constructor(issues: readonly string[]) {
    super("Invalid watch input")
    this.name = "InvalidWatchInputError"
    this.issues = issues
  }
}

export function createWatchmarkService(options: WatchmarkServiceOptions = {}): WatchmarkService {
  const snapshots = new Map<string, string>()
  const fetchHtml = options.fetchHtml ?? defaultFetchHtml
  const now = options.now ?? (() => new Date())
  const allowPrivateUrls = options.allowPrivateUrls ?? false

  return {
    checkUrl: async (rawInput) => {
      const input = parseWatchInput(rawInput)
      assertPublicUrl(input.url, allowPrivateUrls)
      const html = await fetchHtml(input.url)
      const meaningfulText = extractMeaningfulText(html)
      const previousText = snapshots.get(input.url)
      snapshots.set(input.url, meaningfulText)

      if (previousText === undefined) {
        return buildResult(input, now(), false, "첫 스냅샷을 저장했습니다.", [], [])
      }

      const summary = summarizeMeaningfulChanges(previousText, meaningfulText)

      return buildResult(
        input,
        now(),
        summary.meaningfulAdded.length > 0 || summary.meaningfulRemoved.length > 0,
        summary.summary,
        summary.meaningfulAdded,
        summary.meaningfulRemoved,
      )
    },
  }
}

function assertPublicUrl(url: string, allowPrivateUrls: boolean): void {
  if (allowPrivateUrls) {
    return
  }
  const hostname = new URL(url).hostname.toLowerCase()
  if (isPrivateHostname(hostname)) {
    throw new InvalidWatchInputError(["Private or local network URLs are blocked by default."])
  }
}

function isPrivateHostname(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "::1" || hostname.endsWith(".local")) {
    return true
  }
  if (/^127\./.test(hostname) || hostname === "0.0.0.0") {
    return true
  }
  if (/^10\./.test(hostname) || /^192\.168\./.test(hostname)) {
    return true
  }
  return /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
}

function parseWatchInput(input: WatchInput): WatchInput {
  const parsed = WatchInputSchema.safeParse(input)
  if (!parsed.success) {
    throw new InvalidWatchInputError(parsed.error.issues.map((issue) => issue.message))
  }
  return parsed.data
}

function buildResult(
  input: WatchInput,
  checkedAt: Date,
  changed: boolean,
  summary: string,
  meaningfulAdded: readonly string[],
  meaningfulRemoved: readonly string[],
): WatchResult {
  return {
    ok: true,
    watch: {
      url: input.url,
      name: input.name ?? new URL(input.url).hostname,
      category: input.category ?? "general",
      checkedAt: checkedAt.toISOString(),
    },
    changed,
    summary,
    diff: { meaningfulAdded, meaningfulRemoved },
  }
}

async function defaultFetchHtml(url: string): Promise<string> {
  return ky.get(url, { timeout: 10_000, retry: { limit: 1 } }).text()
}
