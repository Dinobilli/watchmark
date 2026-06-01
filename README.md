# Watchmark

Website change monitoring with local AI-style summaries.

Watchmark tracks pages where missing a change costs time or money: Korean public-sector notices, shopping/product pages, competitor landing pages, pricing pages, hiring pages, and policy pages. The open-source core can run locally, while the product can grow into a hosted SaaS with scheduled checks, team alerts, and richer AI summaries.

![Watchmark dashboard](docs/assets/watchmark-dashboard.png)

## Why it matters

Most change monitors stop at "this page changed." Watchmark stores a baseline, filters boilerplate churn, and explains the meaningful difference in plain language. That makes it useful for:

- Korean public notices: bid postings, subsidy deadlines, hiring notices.
- Shopping and product operations: price, stock, option, and product-detail changes.
- Founder and sales intelligence: competitor copy, pricing, terms, and job-posting updates.

## MVP Features

- `POST /api/check`: add or check a watched URL.
- First check creates a baseline.
- Later checks detect meaningful text changes.
- Deterministic local summarizer, so no API key is required.
- Browser dashboard with Korea/public-sector and shopping-page positioning.
- Private/local network URL blocking by default.
- Strict TypeScript, Bun, Hono, Zod, Biome, and tests.

## Quick Start

```bash
bun install
bun run dev
```

Open `http://127.0.0.1:3000`.

API example:

```bash
curl -i -X POST http://127.0.0.1:3000/api/check \
  -H 'content-type: application/json' \
  -d '{"url":"https://example.com","name":"Example","category":"public"}'
```

## Scripts

```bash
bun test
bun run typecheck
bun run lint
bun run build
```

## Open Source + SaaS Path

The open-source project is the local monitor engine and dashboard. A hosted SaaS can add:

- Scheduled checks and team workspaces.
- Email, Slack, KakaoTalk, Discord, and webhook alerts.
- Login, watch limits, and paid history retention.
- OpenAI-powered summaries for dense Korean notices and product pages.
- Public templates for government sites, shopping malls, and competitor pages.

## Maintainer Workflow

- CI runs lint, typecheck, tests, and build on pull requests.
- Issue templates collect bug reports, feature requests, and public site-template requests.
- `ROADMAP.md`, `CHANGELOG.md`, `SECURITY.md`, and `CONTRIBUTING.md` keep the maintenance path visible.
- `docs/backlog.md` lists the first public issues to seed the project after GitHub launch.

## Codex for Open Source Fit

Watchmark is designed as a real OSS project that benefits from Codex: issue triage, PR review, release workflows, scraper hardening, and regression test generation for many website shapes. See `application/codex-for-oss-draft.md`.

## License

MIT. See `LICENSE`.
