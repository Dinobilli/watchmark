# Changelog

All notable changes to Watchmark will be documented in this file.

## 0.1.2 - 2026-06-02

### Added

- Dashboard diff view for meaningful added and removed lines.
- UI tests for changed and unchanged diff rendering.
- Playwright browser tests for desktop and mobile dashboard diff states.
- API characterization test for unchanged pages returning empty diff arrays.

### Changed

- README and roadmap now reflect the post-submission maintenance update.

## 0.1.1 - 2026-06-01

### Added

- Korean README for Korea-first users.
- Dashboard route at `/watch`.
- Repository privacy scan test for common private/token material.
- Security review notes and Dependabot configuration.

### Changed

- Dashboard result rendering now uses DOM text nodes instead of `innerHTML`.
- Fetch failure responses no longer expose raw exception details.
- Package metadata is marked as public OSS.

### Security

- Watch URLs are restricted to HTTP(S).
- Redirect targets are revalidated before fetch.
- Hostnames resolving to private/local addresses are blocked by default.

## 0.1.0 - 2026-06-01

### Added

- Bun/Hono HTTP API for checking watched URLs.
- Browser dashboard for local monitoring.
- Baseline storage and meaningful text-change detection.
- Deterministic local summaries with no API key required.
- Private/local network URL blocking by default.
- CI workflow, issue templates, PR template, and maintainer docs.
