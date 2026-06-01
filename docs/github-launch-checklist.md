# GitHub Launch Checklist

This repository is public at `https://github.com/Dinobilli/watchmark`. Keep this checklist for future launch/release maintenance.

## Current Status

- Repository: `https://github.com/Dinobilli/watchmark`
- Default branch: `main`
- First release: `v0.1.0`

## Repository Profile

- Confirm the GitHub profile and repository remain public.
- Choose a short repository description: `Open-source website change monitor with meaningful summaries for Korean public notices and product pages.`
- Add topics: `website-monitoring`, `change-detection`, `korea`, `public-notices`, `ecommerce`, `typescript`, `bun`, `hono`, `open-source`.
- Keep the license as MIT.

## Maintenance Release

Run the local quality gate before pushing:

```bash
bun run lint
bun run typecheck
bun test
bun run build
```

Commit and push the release-maintenance delta:

```bash
git add .
git commit -m "Harden Watchmark security and OSS docs"
git push origin main
```

Create a new tag only when publishing a new release:

```bash
git tag v0.1.1
git push origin v0.1.1
gh release create v0.1.1 --title "Watchmark v0.1.1" --notes-file RELEASE_NOTES_v0.1.1.md
```

## First Issues

Create the six issues from `docs/backlog.md`, then add labels such as:

- `good first issue`
- `template`
- `enhancement`
- `security`
- `documentation`
- `scheduler`
- `alerts`

## Before Applying

- Check that the Actions tab shows a passing CI run.
- Check that the release page shows `v0.1.0` or the latest published maintenance tag.
- Check that README, LICENSE, ROADMAP, SECURITY, CONTRIBUTING, and issue templates are visible.
- Use `docs/form-answers.ko.md` as the source for the form answers.
