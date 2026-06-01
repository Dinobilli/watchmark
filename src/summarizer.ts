import { extractMeaningfulLinesFromHtml, extractMeaningfulLinesFromText } from "./text"

export type ChangeSummary = {
  readonly summary: string
  readonly meaningfulAdded: readonly string[]
  readonly meaningfulRemoved: readonly string[]
}

export function extractMeaningfulText(html: string): string {
  return extractMeaningfulLinesFromHtml(html).join("\n")
}

export function summarizeMeaningfulChanges(before: string, after: string): ChangeSummary {
  const beforeLines = meaningfulLines(before)
  const afterLines = meaningfulLines(after)
  const beforeSet = new Set(beforeLines)
  const afterSet = new Set(afterLines)
  const meaningfulAdded = afterLines.filter((line) => !beforeSet.has(line))
  const meaningfulRemoved = beforeLines.filter((line) => !afterSet.has(line))
  const summary = buildSummary(meaningfulAdded, meaningfulRemoved)

  return { summary, meaningfulAdded, meaningfulRemoved }
}

function meaningfulLines(text: string): readonly string[] {
  return extractMeaningfulLinesFromText(text)
}

function buildSummary(
  meaningfulAdded: readonly string[],
  meaningfulRemoved: readonly string[],
): string {
  if (meaningfulAdded.length === 0 && meaningfulRemoved.length === 0) {
    return "의미 있는 본문 변경은 감지되지 않았습니다."
  }

  const parts: string[] = []
  const firstAdded = meaningfulAdded[0]
  const firstRemoved = meaningfulRemoved[0]

  if (firstAdded !== undefined) {
    parts.push(`새로 추가됨: ${firstAdded}`)
  }
  if (firstRemoved !== undefined) {
    parts.push(`삭제/변경됨: ${firstRemoved}`)
  }

  return parts.join(" / ")
}
