# GitHub Launch Checklist

This repository should be public before submitting the Codex for Open Source form.

## Before Publishing

- Confirm the GitHub profile is public.
- Choose a short repository description: `Open-source website change monitor with meaningful summaries for Korean public notices and product pages.`
- Add topics: `website-monitoring`, `change-detection`, `korea`, `public-notices`, `ecommerce`, `typescript`, `bun`, `hono`, `open-source`.
- Keep the license as MIT.

## Publish

Create the first commit locally:

```bash
git config user.name "<your name>"
git config user.email "<your GitHub email or noreply email>"
git add .
git commit -m "Initial Watchmark OSS MVP"
```

Then create and push the public repository:

```bash
gh auth login
gh repo create watchmark --public --source . --remote origin --push
```

If the repository already exists:

```bash
git remote add origin git@github.com:<your-github-username>/watchmark.git
git push -u origin main
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

## First Release

```bash
git tag v0.1.0
git push origin v0.1.0
gh release create v0.1.0 --title "Watchmark v0.1.0" --notes-file RELEASE_NOTES.md
```

## Before Applying

- Check that the Actions tab shows a passing CI run.
- Check that the release page shows `v0.1.0`.
- Check that README, LICENSE, ROADMAP, SECURITY, CONTRIBUTING, and issue templates are visible.
- Use `docs/form-answers.ko.md` as the source for the form answers.
