# Maintainer Backlog

Use these as the first GitHub issues after the repository is public.

## Shipped

- GitHub issue #3: dashboard diff view shipped in v0.1.2. The dashboard now shows capped
  added/removed lines, empty diff states, and browser coverage for changed and unchanged
  responses.
- GitHub issue #5: Korean public notice fixtures shipped in v0.1.3. The project now has
  anonymized examples for title, deadline, attachment, department, and application-period
  changes, with API and dashboard previews.

## 1. Add SQLite persistence for watches and snapshots

Labels: `enhancement`, `core`

Persist watches, snapshots, and check results so users can restart the app without losing baselines.

## 2. Add scheduled checks

Labels: `enhancement`, `scheduler`

Support interval-based checks with a safe default cadence and per-watch configuration.

## 3. Build shopping product-page fixtures

Labels: `template`, `good first issue`

Add fixtures for price, stock, option, coupon, and product-detail changes.

## 4. Add webhook alerts

Labels: `enhancement`, `alerts`

Send changed summaries to a user-provided webhook after a meaningful change is detected.

## 5. Improve dashboard diff filtering

Labels: `enhancement`, `dashboard`

Add search, copied text snippets, and per-section filters once persisted snapshots are available.
