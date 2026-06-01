import { expect, test } from "bun:test"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const BLOCKED_DIRS = new Set([".git", ".omo", "dist", "node_modules"])
const TEXT_FILE_PATTERN = /\.(?:json|md|ts|yml|yaml|toml|lock|gitignore)$/u

const CONSUMER_EMAIL_PATTERN =
  /\b[A-Z0-9._%+-]+@(gmail|naver|daum|kakao|icloud|outlook|hotmail)\.(com|net|kr)\b/iu
const GITHUB_TOKEN_PATTERN = new RegExp(["gh", "[opsu]_", "[A-Za-z0-9_]{20,}"].join(""))
const OPENAI_KEY_PATTERN = new RegExp(["sk", "-", "[A-Za-z0-9_-]{20,}"].join(""))
const ENV_ASSIGNMENT_PATTERN = /(?:OPENAI_API_KEY|GITHUB_TOKEN|GH_TOKEN|API_KEY|SECRET)=/u

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
