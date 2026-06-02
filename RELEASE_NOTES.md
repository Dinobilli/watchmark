# Watchmark v0.1.2

Watchmark v0.1.2 is a post-submission maintenance release that closes the first dashboard usability issue after the Codex OSS application.

## Highlights

- Dashboard now shows meaningful additions and removals next to the plain-language summary.
- Unchanged checks keep a quiet "변경 상세 없음" state instead of noisy empty cards.
- Added tests for dashboard diff rendering and unchanged diff responses.
- README, changelog, and roadmap now show the ongoing maintenance trail.

## Install

```bash
bun install
bun run dev
```

Open `http://localhost:3000/watch`.
