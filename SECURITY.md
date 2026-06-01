# Security Policy

Watchmark fetches user-provided URLs, so URL safety is part of the core project.

## Supported Versions

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |

## Reporting a Vulnerability

After the repository is public on GitHub, please use private vulnerability reporting for issues such as:

- SSRF or private network access bypasses.
- Credential or secret exposure.
- Unsafe handling of fetched page content.
- Cross-site scripting in the dashboard.

Until private reporting is enabled, contact the primary maintainer directly and avoid posting sensitive proof-of-concept details in public issues.

## Security Expectations

- Private and local network URLs are blocked by default.
- Development-only private URL checks must be opt-in.
- Tests should cover URL parsing and fetch safety changes.
- Fixtures should use public pages or anonymized content.
