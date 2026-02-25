# Rocinante Mission Template - Claude Development Guide

> **This repo is a quality-infrastructure template.**
> It ships with Svelte 5, Vite, Tailwind CSS, Vitest, Cucumber.js, Playwright, ESLint, Prettier, and Husky pre-configured — ready to build on.

---

## Quick Links

- **Project overview** → [.claude/INDEX.md](.claude/INDEX.md)
- **Rules & standards** → [.claude/rules/_INDEX.md](.claude/rules/_INDEX.md)
- **Skills (workflows)** → [.claude/skills/_GUIDE.md](.claude/skills/_GUIDE.md)
- **Before committing** → [.claude/checklists/pre-commit.md](.claude/checklists/pre-commit.md)

---

## Essential Commands

```bash
# Development
pnpm dev                # Start dev server

# Testing
pnpm test              # Unit tests (Vitest)
pnpm test:acceptance   # Acceptance tests (Cucumber)
pnpm test:all          # All tests

# Quality Gates (MANDATORY before commit)
pnpm test && pnpm build && pnpm lint
```

---

## Core Principles

### 1. Tests First, Always
**NO implementation without tests first.**
Feature file → Review → Implementation

### 2. No Classes, Only Functions
```javascript
// ✅ GOOD
export const createThing = () => {
  let state = {}
  return { doWork: () => {} }
}

// ❌ BAD
export class Thing {}
```

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Svelte 5 |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Unit tests | Vitest |
| Acceptance tests | Cucumber.js |
| E2E tests | Playwright |
| Linting | ESLint |
| Formatting | Prettier |
| Git hooks | Husky + lint-staged |
| Package manager | pnpm |
