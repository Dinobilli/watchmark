# Watchmark v0.1.2

Watchmark v0.1.2 is a small maintenance release shipped after the Codex OSS application submission to show active issue-driven project care.

## Highlights

- Adds a dashboard diff view for meaningful added and removed lines.
- Keeps unchanged checks quiet with a "변경 상세 없음" state.
- Adds regression coverage for changed dashboard rendering, unchanged responses, and safe text rendering.
- Updates README, changelog, and roadmap to reflect the maintenance trail.

## Related Issue

- Closes #3: Add a diff view to the dashboard.

## Verify

```bash
bun run lint
bun run typecheck
bun test
bun run browser-test
bun run build
```
