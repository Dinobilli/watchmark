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
