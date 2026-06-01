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

test("escapes_dashboard_result_content", () => {
  const html = renderDashboardPage()

  expect(html).not.toContain("innerHTML")
  expect(html).toContain("document.createElement")
  expect(html).toContain("textContent")
})
