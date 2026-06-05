import type { WatchResult } from "./monitor"
import type { ChangeSummary } from "./summarizer"
import { extractMeaningfulText, summarizeMeaningfulChanges } from "./summarizer"

const changeTypes = {
  title: "title",
  deadline: "deadline",
  attachment: "attachment",
  department: "department",
  applicationPeriod: "application-period",
} as const

export type KoreanPublicNoticeFixtureId =
  | "notice-title-change"
  | "deadline-change"
  | "attachment-change"
  | "department-change"
  | "application-period-change"

export type KoreanPublicNoticeChangeType = (typeof changeTypes)[keyof typeof changeTypes]

export type KoreanPublicNoticeFixture = {
  readonly id: KoreanPublicNoticeFixtureId
  readonly title: string
  readonly changeType: KoreanPublicNoticeChangeType
  readonly beforeHtml: string
  readonly afterHtml: string
  readonly expectedAdded: readonly string[]
  readonly expectedRemoved: readonly string[]
}

export type KoreanPublicNoticeFixtureMetadata = {
  readonly id: KoreanPublicNoticeFixtureId
  readonly title: string
  readonly changeType: KoreanPublicNoticeChangeType
}

export const KOREAN_PUBLIC_NOTICE_FIXTURES: readonly KoreanPublicNoticeFixture[] = [
  {
    id: "notice-title-change",
    title: "공고 제목 변경",
    changeType: changeTypes.title,
    beforeHtml: noticeHtml("2026 지역 창업 지원사업 모집 공고", [
      "담당부서: 지역사업팀",
      "접수기간: 2026-06-01 ~ 2026-06-14",
      "첨부파일: 모집 공고문.pdf",
    ]),
    afterHtml: noticeHtml("2026 지역 창업 지원사업 추가 모집 공고", [
      "담당부서: 지역사업팀",
      "접수기간: 2026-06-01 ~ 2026-06-14",
      "첨부파일: 모집 공고문.pdf",
    ]),
    expectedAdded: ["2026 지역 창업 지원사업 추가 모집 공고"],
    expectedRemoved: ["2026 지역 창업 지원사업 모집 공고"],
  },
  {
    id: "deadline-change",
    title: "접수 마감일 변경",
    changeType: changeTypes.deadline,
    beforeHtml: noticeHtml("지역 상생 바우처 참여자 모집", [
      "담당부서: 생활지원팀",
      "접수 마감: 2026-06-10",
      "첨부파일: 신청 안내문.pdf",
    ]),
    afterHtml: noticeHtml("지역 상생 바우처 참여자 모집", [
      "담당부서: 생활지원팀",
      "접수 마감: 2026-06-20",
      "첨부파일: 신청 안내문.pdf",
    ]),
    expectedAdded: ["접수 마감: 2026-06-20"],
    expectedRemoved: ["접수 마감: 2026-06-10"],
  },
  {
    id: "attachment-change",
    title: "첨부파일 변경",
    changeType: changeTypes.attachment,
    beforeHtml: noticeHtml("청년 역량강화 교육생 모집", [
      "담당부서: 교육운영팀",
      "접수기간: 2026-06-03 ~ 2026-06-18",
      "첨부파일: 교육 신청서.pdf",
    ]),
    afterHtml: noticeHtml("청년 역량강화 교육생 모집", [
      "담당부서: 교육운영팀",
      "접수기간: 2026-06-03 ~ 2026-06-18",
      "첨부파일: 교육 신청서 개정본.pdf",
    ]),
    expectedAdded: ["첨부파일: 교육 신청서 개정본.pdf"],
    expectedRemoved: ["첨부파일: 교육 신청서.pdf"],
  },
  {
    id: "department-change",
    title: "담당부서 변경",
    changeType: changeTypes.department,
    beforeHtml: noticeHtml("소상공인 컨설팅 참여 업체 모집", [
      "담당부서: 경제지원팀",
      "접수기간: 2026-06-05 ~ 2026-06-19",
      "첨부파일: 컨설팅 안내서.pdf",
    ]),
    afterHtml: noticeHtml("소상공인 컨설팅 참여 업체 모집", [
      "담당부서: 민생경제팀",
      "접수기간: 2026-06-05 ~ 2026-06-19",
      "첨부파일: 컨설팅 안내서.pdf",
    ]),
    expectedAdded: ["담당부서: 민생경제팀"],
    expectedRemoved: ["담당부서: 경제지원팀"],
  },
  {
    id: "application-period-change",
    title: "접수기간 변경",
    changeType: changeTypes.applicationPeriod,
    beforeHtml: noticeHtml("마을공동체 활동 지원 공고", [
      "담당부서: 공동체협력팀",
      "접수기간: 2026-06-01 ~ 2026-06-15",
      "첨부파일: 활동계획서 양식.pdf",
    ]),
    afterHtml: noticeHtml("마을공동체 활동 지원 공고", [
      "담당부서: 공동체협력팀",
      "접수기간: 2026-06-01 ~ 2026-06-22",
      "첨부파일: 활동계획서 양식.pdf",
    ]),
    expectedAdded: ["접수기간: 2026-06-01 ~ 2026-06-22"],
    expectedRemoved: ["접수기간: 2026-06-01 ~ 2026-06-15"],
  },
] as const

export function findKoreanPublicNoticeFixture(id: string): KoreanPublicNoticeFixture | undefined {
  return KOREAN_PUBLIC_NOTICE_FIXTURES.find((fixture) => fixture.id === id)
}

export function listKoreanPublicNoticeFixtureMetadata(): readonly KoreanPublicNoticeFixtureMetadata[] {
  return KOREAN_PUBLIC_NOTICE_FIXTURES.map((fixture) => ({
    id: fixture.id,
    title: fixture.title,
    changeType: fixture.changeType,
  }))
}

export function summarizeKoreanPublicNoticeFixture(
  fixture: KoreanPublicNoticeFixture,
): ChangeSummary {
  return summarizeMeaningfulChanges(
    extractMeaningfulText(fixture.beforeHtml),
    extractMeaningfulText(fixture.afterHtml),
  )
}

export function buildKoreanPublicNoticeFixtureResult(
  fixture: KoreanPublicNoticeFixture,
): WatchResult {
  const summary = summarizeKoreanPublicNoticeFixture(fixture)
  return {
    ok: true,
    watch: {
      url: `https://public-notice-fixture.example/${fixture.id}`,
      name: fixture.title,
      category: "public",
      checkedAt: "2026-06-05T00:00:00.000Z",
    },
    changed: summary.meaningfulAdded.length > 0 || summary.meaningfulRemoved.length > 0,
    summary: summary.summary,
    diff: {
      meaningfulAdded: summary.meaningfulAdded,
      meaningfulRemoved: summary.meaningfulRemoved,
    },
  }
}

function noticeHtml(title: string, lines: readonly string[]): string {
  return [
    "<html><body>",
    "<a>본문 바로가기</a>",
    "<nav>전체메뉴</nav>",
    "<main>",
    `<h1>${title}</h1>`,
    ...lines.map((line) => `<p>${line}</p>`),
    "</main>",
    "<footer>저작권 안내</footer>",
    "</body></html>",
  ].join("")
}
