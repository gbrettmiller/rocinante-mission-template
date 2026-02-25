# Architecture Guide

**System design, layer responsibilities, and data flow for the hello-world template.**

---

## Overview

The project is a **Svelte 5 + Vite** application organized into five distinct layers. The hard rule is that each layer has a single responsibility and defined dependency direction: the framework layer (`src/`) is the only layer allowed to import from the others; the others do not import from `src/`.

```
┌─────────────────────────────────────────────────────────────────┐
│                        src/                                     │
│             Svelte components, routes, entry point              │
│    (imports from core/, content/, design-system/, services/)    │
└────┬──────────────┬──────────────┬──────────────┬──────────────┘
     │              │              │              │
     ▼              ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌───────────────┐  ┌──────────┐
│  core/  │  │ content/ │  │design-system/ │  │services/ │
│pure JS  │  │ JSON     │  │  CSS tokens   │  │ fetch /  │
│no deps  │  │ copy     │  │  (@theme)     │  │side-efts │
└─────────┘  └──────────┘  └───────────────┘  └──────────┘
```

Dependencies only flow **downward** from `src/` into the other layers. The four supporting layers have no knowledge of Svelte and no imports between each other.

---

## Layer Responsibilities

### `src/` — Svelte application

Contains everything Svelte: components, routes, and the entry point. This is the only layer that uses Svelte syntax or imports Svelte-specific APIs.

**Current files:**
- `App.svelte` — root component; wires theme logic, renders content
- `main.js` — entry point; mounts `App` via `svelte/mount`
- `index.css` — imports the design-system tokens

`App.svelte` is the consumer of all other layers. It imports `createTheme` from `core/`, user-facing strings from `content/`, and would call `services/` for any API interactions.

### `core/` — pure JS functions, no framework dependencies

Framework-agnostic business logic and utilities. No Svelte imports, no DOM side effects, no `fetch`. Functions here must be fully unit-testable without a browser or Svelte runtime.

**Current files:**
- `theme.js` — factory function `createTheme({ storage, prefersDark })` that resolves the current theme from storage/OS preference and toggles between `'light'` and `'dark'`. Also exports `systemPrefersDark`, a convenience wrapper for `window.matchMedia`. Dependencies are injected, making the core logic testable without a DOM.

**Rules for this layer:**
- Pure functions only
- No `import` from `src/`, `content/`, `design-system/`, or `services/`
- No direct DOM access — inject deps that touch the environment

### `content/` — user-facing copy

JSON files containing all user-visible text strings. Keeping copy out of component files makes it easy to audit, translate, or hand off to a content editor without touching code.

**Current files:**
- `en.json` — English strings for app title and theme-toggle labels

Components import content files directly as JSON via Vite's built-in JSON handling (`import content from '../content/en.json'`).

### `design-system/` — Tailwind v4 CSS tokens

Tailwind CSS v4 `@theme` blocks that define design tokens: colors, typography, and spacing overrides. These are the single source of truth for visual primitives. Components use the token names via Tailwind utility classes; they do not hardcode raw values.

**Current files:**
- `tokens.css` — defines `--color-surface`, `--color-surface-dark`, `--color-text`, `--color-text-dark`, and `--font-sans` using the Tailwind v4 `@theme` block

The `src/index.css` entry file imports `tokens.css` so tokens are available globally.

### `services/` — API wrappers and side-effectful code

Fetch calls, external API wrappers, and anything with network or I/O side effects. Isolating these makes it straightforward to mock them in tests and swap implementations.

**Current files:**
- `api.js` — exports `get(endpoint)` and `post(endpoint, data)`. Base URL is read from `VITE_API_URL` env var, falling back to `/api`. Throws on non-OK HTTP responses.

---

## Data Flow Example: theme toggle

```
User clicks button (src/App.svelte)
  → calls theme.toggle(current)          # core/theme.js — pure, no side effects
  → returns next theme string ('dark')
  → Svelte $state updates current
  → $effect toggles class on <html>      # DOM side effect stays in src/
  → new value written to localStorage    # via injected storage dep in core/theme.js
```

The key point: the toggle logic in `core/` never touches the DOM directly. `App.svelte` owns the DOM interaction; `core/theme.js` owns the decision logic.

---

## Svelte 5 Patterns in Use

### Runes-based reactivity

This project uses Svelte 5 runes rather than the legacy store API:

```javascript
// Reactive state
let current = $state(theme.resolve())

// Side effect that runs when `current` changes
$effect(() => {
  document.documentElement.classList.toggle('dark', current === 'dark')
})
```

### Event handlers

Svelte 5 uses inline `onclick` (not `on:click`):

```svelte
<button onclick={handleToggle}>...</button>
```

---

## Architecture Decisions

### Why four supporting layers instead of one `src/utils/`?

A single utils directory collapses distinctions that matter: copy changes on a different cadence than business logic; design tokens are owned by designers; API wrappers need different mocking strategies than pure functions. Keeping them separate makes each layer's ownership and testing approach obvious.

### Why inject dependencies into `core/` functions?

`createTheme` receives `storage` and `prefersDark` as arguments rather than calling `localStorage` and `window.matchMedia` directly. This means tests can pass in simple fakes without mocking globals — the function is pure from the test's perspective even though its production usage touches the browser environment.

### Why Svelte 5 + Vite?

- Svelte 5 runes eliminate the legacy store boilerplate and compile down to minimal JS
- Vite provides fast HMR and native ES module support with minimal config
- Tailwind CSS v4's `@theme` block replaces the separate config file with co-located token definitions

---

## Testing Strategy

| Layer | Test approach | What to test |
|-------|--------------|--------------|
| `core/` | Unit (Vitest) | All branches of pure functions; inject fake deps |
| `services/` | Unit with fetch mock | Request construction, error handling |
| `content/` | Linting / schema | Valid JSON, required keys present |
| `design-system/` | Visual regression (Playwright) | Token values render correctly |
| `src/` | Component + E2E | User-visible behavior end-to-end |

---

## Related Documentation

- [Project Structure](project-structure.md) — directory layout
- [Workflows](workflows.md) — common development procedures
- [Testing Rules](../rules/testing.md) — testing guidelines
- [Quality Verification](../rules/quality-verification.md) — mandatory quality gates
