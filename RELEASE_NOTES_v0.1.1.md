# Watchmark v0.1.1

This release tightens the public OSS MVP before Codex for Open Source submission.

## Highlights

- Added Korean README for the Korea-first audience.
- Added `/watch` as the documented dashboard route.
- Added manual redirect validation to reduce SSRF risk.
- Added DNS preflight blocking for hostnames resolving to private/local addresses.
- Blocked non-HTTP(S) watch URLs.
- Removed dashboard `innerHTML` result rendering in favor of DOM text nodes.
- Stopped exposing raw fetch exception messages in API responses.
- Added repository privacy scan test for common private/token material.
- Added security review notes and Dependabot configuration.
