import { expect, test } from "bun:test"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { KOREAN_PUBLIC_NOTICE_FIXTURES } from "./korean-public-notice-fixtures"

const BLOCKED_DIRS = new Set([
  ".git",
  ".omo",
  "dist",
  "evidence",
  "node_modules",
  "plans",
  "playwright-report",
  "test-results",
])
const TEXT_FILE_PATTERN = /\.(?:json|md|ts|yml|yaml|toml|lock|gitignore)$/u

const CONSUMER_EMAIL_PATTERN =
  /\b[A-Z0-9._%+-]+@(gmail|naver|daum|kakao|icloud|outlook|hotmail)\.(com|net|kr)\b/iu
const GITHUB_TOKEN_PATTERN = new RegExp(["gh", "[opsu]_", "[A-Za-z0-9_]{20,}"].join(""))
const OPENAI_KEY_PATTERN = new RegExp(["sk", "-", "[A-Za-z0-9_-]{20,}"].join(""))
const ENV_ASSIGNMENT_PATTERN = /(?:OPENAI_API_KEY|GITHUB_TOKEN|GH_TOKEN|API_KEY|SECRET)=/u
const PHONE_PATTERN = /\b010-\d{4}-\d{4}\b/u
const KOREAN_PRIVATE_ID_PATTERN = /\b\d{6}-[1-4]\d{6}\b/u
const LOGIN_ONLY_PATTERN = /로그인 후|회원 전용|비공개|내부망/u

test("repository_does_not_contain_private_material", () => {
  const hits: string[] = []

  for (const filePath of listTextFiles(".")) {
    const content = readFileSync(filePath, "utf8")
    if (
      CONSUMER_EMAIL_PATTERN.test(content) ||
      GITHUB_TOKEN_PATTERN.test(content) ||
      OPENAI_KEY_PATTERN.test(content) ||
      ENV_ASSIGNMENT_PATTERN.test(content)
    ) {
      hits.push(filePath)
    }
  }

  expect(hits).toEqual([])
})

test("fixtures_do_not_contain_private_or_login_only_material", () => {
  const hits: string[] = []

  for (const fixture of KOREAN_PUBLIC_NOTICE_FIXTURES) {
    for (const content of [fixture.beforeHtml, fixture.afterHtml]) {
      if (CONSUMER_EMAIL_PATTERN.test(content)) {
        hits.push(`${fixture.id}:consumer-email`)
      }
      if (PHONE_PATTERN.test(content)) {
        hits.push(`${fixture.id}:phone`)
      }
      if (KOREAN_PRIVATE_ID_PATTERN.test(content)) {
        hits.push(`${fixture.id}:private-id`)
      }
      if (LOGIN_ONLY_PATTERN.test(content)) {
        hits.push(`${fixture.id}:login-only`)
      }
    }
  }

  expect(hits).toEqual([])
})

function listTextFiles(root: string): readonly string[] {
  const entries = readdirSync(root)
  const files: string[] = []

  for (const entry of entries) {
    if (BLOCKED_DIRS.has(entry)) {
      continue
    }
    const path = join(root, entry)
    const stats = statSync(path)
    if (stats.isDirectory()) {
      files.push(...listTextFiles(path))
      continue
    }
    if (stats.isFile() && TEXT_FILE_PATTERN.test(path)) {
      files.push(path)
    }
  }

  return files
}
