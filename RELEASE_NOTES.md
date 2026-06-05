# Watchmark v0.1.3

Watchmark v0.1.3 is an issue-driven maintenance release that closes the Korean public-notice fixture work.

## Highlights

- Adds anonymized Korean public-notice fixtures for title, deadline, attachment, department, and application-period changes.
- Adds API and dashboard previews for those fixture diffs.
- Keeps fixture content local and privacy-safe: no API keys, private URLs, login-only content, phone numbers, or personal emails.
- Adds tests for fixture summaries, API responses, dashboard previews, and privacy guardrails.

## Install

```bash
bun install
bun run dev
```

Open `http://localhost:3000/watch`.
