# Rocinante Mission Template

A Svelte 5 + Vite quality-infrastructure template. Ships with every quality gate
pre-configured so you can start building features immediately.

## What's included

| Layer | Directory | Purpose |
|-------|-----------|---------|
| UI | `src/` | Svelte 5 components, entry point |
| Business logic | `core/` | Pure JS functions — no framework, no side effects |
| Strings | `content/` | User-facing copy (`en.json`) — i18n-ready |
| Design tokens | `design-system/` | Tailwind v4 `@theme` variables |
| Integrations | `services/` | API wrappers, all fetch/side-effect code |

## Quality infrastructure

| Tool | Purpose |
|------|---------|
| Vitest | Unit + integration tests |
| Cucumber.js | Acceptance tests (ATDD / BDD) |
| Playwright | E2E + visual regression |
| ESLint + Prettier | Lint and format |
| Husky + lint-staged | Pre-commit gate |

## Usage

### Create a new project from this template

```bash
/new-project <name>
```

Or directly via GitHub CLI:

```bash
gh repo create <name> --template gbrettmiller/rocinante-mission-template --clone
cd <name>
pnpm install
cp .env.example .env
pnpm dev
```

### Essential commands

```bash
pnpm dev              # Start dev server
pnpm test             # Unit tests (Vitest)
pnpm test:acceptance  # Acceptance tests (Cucumber)
pnpm test:all         # All tests
pnpm build            # Production build
pnpm lint             # Lint
```

### Quality gate (run before every commit)

```bash
pnpm test && pnpm build && pnpm lint
```

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `/api` | API base URL |
