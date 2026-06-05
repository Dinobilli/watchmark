import { expect, test } from "bun:test"
import { extractMeaningfulLinesFromHtml } from "./text"

test("ignores_korean_public_notice_boilerplate_churn", () => {
  const html = [
    "<html><body>",
    "<a>본문 바로가기</a>",
    "<nav>전체메뉴</nav>",
    "<footer>누리집 안내</footer>",
    "<main><p>접수 마감: 2026-06-20</p></main>",
    "</body></html>",
  ].join("")

  const lines = extractMeaningfulLinesFromHtml(html)

  expect(lines).toContain("접수 마감: 2026-06-20")
  expect(lines).not.toContain("본문 바로가기")
  expect(lines).not.toContain("전체메뉴")
  expect(lines).not.toContain("누리집 안내")
})

test("keeps_public_notice_deadline_attachment_and_department_lines", () => {
  const html = [
    "<html><body><main>",
    "<p>접수기간: 2026-06-01 ~ 2026-06-20</p>",
    "<p>첨부파일: 모집요강 개정본.pdf</p>",
    "<p>담당부서: 지역사업팀</p>",
    "</main></body></html>",
  ].join("")

  const lines = extractMeaningfulLinesFromHtml(html)

  expect(lines).toContain("접수기간: 2026-06-01 ~ 2026-06-20")
  expect(lines).toContain("첨부파일: 모집요강 개정본.pdf")
  expect(lines).toContain("담당부서: 지역사업팀")
})
