# Hello World Template - Claude Development Guide

## Project Overview

This is a **quality-infrastructure template** for Svelte 5 applications. The app itself is a minimal hello world — the value is in the pre-configured toolchain:

- **Svelte 5** — component framework
- **Vite** — build tool
- **Tailwind CSS v4** — utility-first styling
- **Vitest** — unit testing
- **Cucumber.js** — acceptance testing (ATDD)
- **Playwright** — end-to-end + visual regression tests
- **ESLint + Prettier** — linting and formatting
- **Husky + lint-staged** — pre-commit hooks
- **pnpm** — package manager

---

## Quick Navigation

| Need | Go to |
|------|-------|
| Code standards | [rules/javascript-react.md](rules/javascript-react.md) |
| TDD workflow | [rules/atdd-workflow.md](rules/atdd-workflow.md) |
| Quality gates | [rules/quality-verification.md](rules/quality-verification.md) |
| Testing guide | [rules/testing.md](rules/testing.md) |
| UI patterns | [rules/ui-patterns.md](rules/ui-patterns.md) |
| Pre-commit checklist | [checklists/pre-commit.md](checklists/pre-commit.md) |

---

## Essential Commands

```bash
pnpm dev                              # Start dev server
pnpm test                             # Unit tests
pnpm test:acceptance                  # Acceptance tests
pnpm test:all                         # All tests
pnpm test && pnpm build && pnpm lint  # Full quality gate
```

---

## Core Principles

1. **Tests first** — write failing tests before any implementation
2. **No classes** — factory functions only
3. **Quality gates mandatory** — `test && build && lint` before every commit
