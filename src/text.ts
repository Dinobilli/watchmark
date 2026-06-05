const TAG_BLOCK_PATTERN =
  /<(script|style|noscript|svg|header|footer|nav|form)[^>]*>[\s\S]*?<\/\1>/gi
const TAG_PATTERN = /<[^>]+>/g
const MULTI_SPACE_PATTERN = /[ \t]+/g

const BOILERPLATE_MARKERS = [
  "privacy policy",
  "terms of service",
  "all rights reserved",
  "cookie",
  "sign in",
  "log in",
  "개인정보처리방침",
  "이용약관",
  "쿠키",
  "로그인",
  "본문 바로가기",
  "전체메뉴",
  "사이트맵",
  "누리집 안내",
  "저작권",
  "관련사이트",
] as const

function decodeEntities(raw: string): string {
  return raw
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
}

function normalizeLine(raw: string): string {
  return raw.replace(MULTI_SPACE_PATTERN, " ").trim()
}

function isBoilerplateLine(line: string): boolean {
  const lowered = line.toLowerCase()
  return BOILERPLATE_MARKERS.some((marker) => lowered.includes(marker))
}

export function extractMeaningfulLinesFromHtml(html: string): readonly string[] {
  const withoutBlocks = html.replace(TAG_BLOCK_PATTERN, "\n")
  const plainText = decodeEntities(withoutBlocks.replace(TAG_PATTERN, "\n"))
  const lines = plainText.split("\n")
  const deduped = new Set<string>()
  for (const line of lines) {
    const normalized = normalizeLine(line)
    if (normalized.length < 3) {
      continue
    }
    if (isBoilerplateLine(normalized)) {
      continue
    }
    deduped.add(normalized)
  }
  return [...deduped]
}

export function extractMeaningfulLinesFromText(text: string): readonly string[] {
  const lines = text.split("\n")
  const deduped = new Set<string>()
  for (const line of lines) {
    const normalized = normalizeLine(line)
    if (normalized.length < 3) {
      continue
    }
    if (isBoilerplateLine(normalized)) {
      continue
    }
    deduped.add(normalized)
  }
  return [...deduped]
}
