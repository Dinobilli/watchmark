# Watchmark Security Review

Date: 2026-06-01

## Scope

This review covers the public open-source MVP in this repository: the Hono API, local dashboard, URL-fetching monitor, documentation, and repository contents.

## Primary Risks

- SSRF through user-provided URLs.
- Redirects from apparently public URLs to private or local network targets.
- XSS through fetched page text rendered in the dashboard.
- Leaking local errors, API keys, tokens, emails, or private IP details in API responses or committed files.

## Controls Added

- Only `http` and `https` watch URLs are accepted.
- Private/local hostnames and IP ranges are blocked by default.
- Redirect responses are followed manually and each redirect target is revalidated before fetching.
- Public hostnames that resolve to private/local addresses are blocked before fetching.
- Dashboard result rendering uses DOM nodes and `textContent` instead of HTML string injection.
- Generic fetch failure responses avoid echoing raw exception messages.
- A repository privacy test scans committed text files for common token and personal email patterns.

## Known Limits

- DNS rebinding protection is reduced but not mathematically complete in the MVP because the runtime still performs its own connection after the preflight DNS check. A hosted version should pin the resolved address at the connector layer.
- The MVP stores snapshots in memory only. Future persistence should avoid storing credentials or private page bodies in logs.
- Users should not monitor login-only, paid, or private pages with the public issue templates or fixtures.
