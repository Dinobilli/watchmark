# Watchmark v0.1.3

Watchmark v0.1.3 is an issue-driven maintenance release that closes issue #5 by adding local, anonymized Korean public-notice fixtures.

## Highlights

- Adds five fixture classes: title, deadline, attachment, department, and application-period changes.
- Adds `GET /api/fixtures/korean-public-notices` and fixture detail previews.
- Adds dashboard buttons for previewing public-notice fixture diffs without an API key.
- Adds privacy guardrails for fixture content and Korean public-notice boilerplate filtering.

## Related Issue

- Closes #5: Build Korean public notice fixtures.

## Verify

```bash
bun run lint
bun run typecheck
bun test
bun run browser-test
bun run build
```
