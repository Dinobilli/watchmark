import { expect, test } from "bun:test"
import { renderDashboardPage } from "./ui"

test("renders_dashboard_and_result", () => {
  const html = renderDashboardPage()

  expect(html).toContain("Watchmark")
  expect(html).toContain("Korea Public Sector")
  expect(html).toContain("Shopping & Product")
  expect(html).toContain("변경 감지 결과")
  expect(html).toContain("요약")
})

test("renders_dashboard_diff_view_from_changed_payload", () => {
  const html = renderDashboardPage()

  expect(html).toContain("추가된 내용")
  expect(html).toContain("삭제된 내용")
  expect(html).toContain("renderDiffSection")
  expect(html).toContain("normalizeDiffLines")
  expect(html).toContain("Array.isArray")
  expect(html).toContain("외 ")
  expect(html).toContain("payload.diff?.meaningfulAdded")
  expect(html).toContain("payload.diff?.meaningfulRemoved")
})

test("renders_dashboard_empty_diff_state_from_unchanged_payload", () => {
  const html = renderDashboardPage()

  expect(html).toContain("변경 상세 없음")
  expect(html).toContain("추가된 의미 있는 문구 없음")
  expect(html).toContain("삭제된 의미 있는 문구 없음")
  expect(html).toContain("diff-grid")
})

test("renders_public_notice_fixture_preview_controls", () => {
  const html = renderDashboardPage()

  expect(html).toContain("fixture-preview")
  expect(html).toContain('data-fixture-id="deadline-change"')
  expect(html).toContain('data-fixture-id="attachment-change"')
  expect(html).toContain("/api/fixtures/korean-public-notices/")
})

test("keeps_fixture_preview_rendering_text_safe", () => {
  const html = renderDashboardPage()

  expect(html).toContain("renderResult")
  expect(html).toContain("textContent")
  expect(html).not.toContain("innerHTML")
})

test("escapes_dashboard_result_content", () => {
  const html = renderDashboardPage()

  expect(html).not.toContain("innerHTML")
  expect(html).toContain("document.createElement")
  expect(html).toContain("textContent")
})
