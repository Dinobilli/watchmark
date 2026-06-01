# Contributing

Thanks for considering a contribution to Watchmark.

## Local Setup

```bash
bun install
bun run dev
```

Open `http://localhost:3000/watch`.

## Quality Checks

Run the same checks used by CI before opening a pull request:

```bash
bun run lint
bun run typecheck
bun test
bun run build
```

## Good First Contributions

- Add fixtures for noisy public notice pages.
- Improve Korean text extraction and summarization examples.
- Add shopping/product-page templates for price, stock, and option changes.
- Improve dashboard states and accessibility.
- Expand tests around URL safety and boilerplate filtering.

## Security and Privacy

Do not include private URLs, credentials, paid content, or login-only page bodies in issues, tests, screenshots, or fixtures. Watchmark blocks private/local network targets by default; changes to URL fetching should preserve that behavior unless a maintainer explicitly approves a development-only exception.
