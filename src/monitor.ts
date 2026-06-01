import { z } from "zod"
import { InvalidWatchInputError } from "./errors"
import { extractMeaningfulText, summarizeMeaningfulChanges } from "./summarizer"
import {
  assertAllowedHttpUrl,
  defaultResolveHostname,
  fetchSafeHtml,
  type HostResolver,
  type HttpTransport,
} from "./url-safety"

export { InvalidWatchInputError } from "./errors"

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
  readonly fetchResponse?: HttpTransport
  readonly resolveHostname?: HostResolver
  readonly now?: () => Date
  readonly allowPrivateUrls?: boolean
}

export function createWatchmarkService(options: WatchmarkServiceOptions = {}): WatchmarkService {
  const snapshots = new Map<string, string>()
  const now = options.now ?? (() => new Date())
  const allowPrivateUrls = options.allowPrivateUrls ?? false
  const fetchHtml =
    options.fetchHtml ??
    ((url: string) =>
      fetchSafeHtml(
        url,
        allowPrivateUrls,
        options.fetchResponse ?? fetch,
        options.resolveHostname ?? defaultResolveHostname,
      ))

  return {
    checkUrl: async (rawInput) => {
      const input = parseWatchInput(rawInput)
      assertAllowedHttpUrl(input.url, allowPrivateUrls)
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
