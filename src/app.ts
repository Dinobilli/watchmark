import { Hono } from "hono"
import { z } from "zod"
import {
  buildKoreanPublicNoticeFixtureResult,
  findKoreanPublicNoticeFixture,
  listKoreanPublicNoticeFixtureMetadata,
} from "./korean-public-notice-fixtures"
import { createWatchmarkService, InvalidWatchInputError, type WatchmarkService } from "./monitor"
import { renderDashboardPage } from "./ui"

const CheckBodySchema = z.object({
  url: z.string(),
  name: z.string().optional(),
  category: z.string().optional(),
})

type CreateAppOptions = {
  readonly service?: WatchmarkService
  readonly allowPrivateUrls?: boolean
}

export function createApp(options: CreateAppOptions = {}): Hono {
  const app = new Hono()
  const service =
    options.service ??
    createWatchmarkService({
      allowPrivateUrls: options.allowPrivateUrls ?? Bun.env["WATCHMARK_ALLOW_PRIVATE"] === "1",
    })

  app.get("/", (context) => context.html(renderDashboardPage()))
  app.get("/watch", (context) => context.html(renderDashboardPage()))
  app.get("/api/fixtures/korean-public-notices", (context) =>
    context.json({
      ok: true,
      fixtures: listKoreanPublicNoticeFixtureMetadata(),
    }),
  )
  app.get("/api/fixtures/korean-public-notices/:id", (context) => {
    const fixture = findKoreanPublicNoticeFixture(context.req.param("id"))
    if (fixture === undefined) {
      return context.json(
        {
          ok: false,
          error: {
            code: "FIXTURE_NOT_FOUND",
            message: "알 수 없는 공공 공고 예시입니다.",
          },
        },
        404,
      )
    }
    return context.json(buildKoreanPublicNoticeFixtureResult(fixture))
  })

  app.post("/api/check", async (context) => {
    try {
      const body: unknown = await context.req.json()
      const parsed = CheckBodySchema.safeParse(body)
      if (!parsed.success) {
        return context.json(invalidInput(parsed.error.issues.map((issue) => issue.message)), 400)
      }
      return context.json(await service.checkUrl(parsed.data))
    } catch (error) {
      if (error instanceof InvalidWatchInputError) {
        return context.json(invalidInput(error.issues), 400)
      }
      if (error instanceof Error) {
        return context.json(
          {
            ok: false,
            error: {
              code: "FETCH_FAILED",
              message: "페이지를 가져오지 못했습니다. 공개 접근 가능한 URL인지 확인해 주세요.",
            },
          },
          502,
        )
      }
      throw error
    }
  })

  return app
}

function invalidInput(issues: readonly string[]): {
  readonly ok: false
  readonly error: {
    readonly code: "INVALID_INPUT"
    readonly message: string
    readonly issues: readonly string[]
  }
} {
  return {
    ok: false,
    error: {
      code: "INVALID_INPUT",
      message: "URL과 입력값을 확인해 주세요.",
      issues,
    },
  }
}
