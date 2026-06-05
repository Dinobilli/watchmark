import { expect, test } from "bun:test"
import {
  findKoreanPublicNoticeFixture,
  KOREAN_PUBLIC_NOTICE_FIXTURES,
  summarizeKoreanPublicNoticeFixture,
} from "./korean-public-notice-fixtures"

test("lists_five_anonymized_public_notice_fixture_cases", () => {
  const ids = KOREAN_PUBLIC_NOTICE_FIXTURES.map((fixture) => fixture.id).sort()

  expect(ids).toEqual([
    "application-period-change",
    "attachment-change",
    "deadline-change",
    "department-change",
    "notice-title-change",
  ])
})

test("fixtures_match_public_notice_change_contract", () => {
  for (const fixture of KOREAN_PUBLIC_NOTICE_FIXTURES) {
    expect(fixture.title.length).toBeGreaterThan(0)
    expect(fixture.beforeHtml).toContain("<main>")
    expect(fixture.afterHtml).toContain("<main>")
    expect(fixture.expectedAdded.length).toBeGreaterThan(0)
    expect(fixture.expectedRemoved.length).toBeGreaterThan(0)
    expect(fixture.beforeHtml).not.toContain("@")
    expect(fixture.afterHtml).not.toContain("@")
    expect(fixture.beforeHtml).not.toContain("010-")
    expect(fixture.afterHtml).not.toContain("010-")
  }
})

test("finds_known_fixture_and_returns_undefined_for_unknown_fixture", () => {
  expect(findKoreanPublicNoticeFixture("deadline-change")?.title).toContain("마감")
  expect(findKoreanPublicNoticeFixture("unknown-fixture")).toBeUndefined()
})

test("summarizes_deadline_and_attachment_fixture_changes", () => {
  const deadline = findKoreanPublicNoticeFixture("deadline-change")
  const attachment = findKoreanPublicNoticeFixture("attachment-change")
  if (deadline === undefined || attachment === undefined) {
    throw new TypeError("expected fixture")
  }

  const deadlineSummary = summarizeKoreanPublicNoticeFixture(deadline)
  const attachmentSummary = summarizeKoreanPublicNoticeFixture(attachment)

  expect(deadlineSummary.summary).toContain("2026-06-20")
  expect(attachmentSummary.meaningfulAdded.some((line) => line.includes("첨부파일"))).toBe(true)
  expect(attachmentSummary.meaningfulRemoved.some((line) => line.includes("첨부파일"))).toBe(true)
})

test("summarizes_department_and_application_period_fixture_changes", () => {
  const department = findKoreanPublicNoticeFixture("department-change")
  const period = findKoreanPublicNoticeFixture("application-period-change")
  if (department === undefined || period === undefined) {
    throw new TypeError("expected fixture")
  }

  const departmentSummary = summarizeKoreanPublicNoticeFixture(department)
  const periodSummary = summarizeKoreanPublicNoticeFixture(period)

  expect(departmentSummary.meaningfulAdded.some((line) => line.includes("담당부서"))).toBe(true)
  expect(periodSummary.meaningfulAdded.some((line) => line.includes("접수기간"))).toBe(true)
})

test("ignores_fixture_boilerplate_churn", () => {
  const fixture = findKoreanPublicNoticeFixture("deadline-change")
  if (fixture === undefined) {
    throw new TypeError("expected fixture")
  }

  const summary = summarizeKoreanPublicNoticeFixture(fixture)

  expect(summary.meaningfulAdded.some((line) => line.includes("전체메뉴"))).toBe(false)
  expect(summary.meaningfulRemoved.some((line) => line.includes("저작권"))).toBe(false)
})
