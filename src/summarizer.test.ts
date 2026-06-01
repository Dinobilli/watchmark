import { expect, test } from "bun:test"
import { summarizeMeaningfulChanges } from "./summarizer"

test("summarizes_meaningful_changes_not_boilerplate", () => {
  const before = [
    "Privacy Policy",
    "Terms of Service",
    "지원금 신청 마감일은 2026-06-10 입니다.",
  ].join("\n")
  const after = [
    "Privacy Policy updated",
    "Terms of Service",
    "지원금 신청 마감일은 2026-06-20 입니다.",
  ].join("\n")

  const summary = summarizeMeaningfulChanges(before, after)

  expect(summary.meaningfulAdded.length).toBeGreaterThan(0)
  expect(summary.summary).toContain("2026-06-20")
  expect(summary.summary).not.toContain("Privacy Policy")
})
