# Watchmark v0.1.0

Watchmark v0.1.0 is the first public MVP of an open-source website change monitor focused on meaningful summaries for Korean public notices, shopping/product pages, and competitor intelligence.

## Highlights

- Local dashboard and `POST /api/check` endpoint.
- First check creates a baseline; later checks detect meaningful text changes.
- Local deterministic summaries, so the MVP runs without an API key.
- Boilerplate filtering to reduce noisy "page changed" alerts.
- Private/local network URL guard to reduce SSRF-style risk.
- Tests, typecheck, lint, build, CI, issue templates, and maintainer docs.

## Install

```bash
bun install
bun run dev
```

Open `http://127.0.0.1:3000`.
