# Project Structure Guide

**Directory layout and file organization for the hello-world template.**

---

## Complete Directory Tree

```
service-audit/
├── .claude/                 # Claude development configuration
│   ├── INDEX.md             # Main entry point
│   ├── QUICK_START.md       # 5-minute onboarding
│   ├── rules/               # Core development rules
│   ├── guides/              # Deep-dive guides (this file)
│   ├── examples/            # Code pattern examples
│   ├── checklists/          # Quick reference checklists
│   └── skills/              # Task-specific workflows
│
├── core/                    # Pure JS/TS functions — no framework deps, no side effects
│   └── theme.js             # createTheme() factory; systemPrefersDark() helper
│
├── content/                 # User-facing copy as JSON
│   └── en.json              # English strings (app title, theme-toggle labels)
│
├── design-system/           # Tailwind v4 @theme CSS token definitions
│   └── tokens.css           # Color, typography, and spacing tokens
│
├── services/                # API wrappers and side-effectful fetch code
│   └── api.js               # get() and post() helpers; reads VITE_API_URL
│
├── src/                     # Svelte components, routes, and entry point
│   ├── App.svelte           # Root component
│   ├── main.js              # Entry point — mounts App via svelte/mount
│   └── index.css            # Imports design-system tokens; global styles
│
├── features/                # Gherkin feature files (BDD/ATDD)
│   ├── builder/             # VSM builder features
│   ├── data/                # Data management features
│   ├── simulation/          # Simulation features
│   ├── visualization/       # Map display features
│   └── step-definitions/    # Cucumber step definitions
│       └── helpers/         # Step definition helpers
│
├── tests/                   # Test files
│   ├── unit/                # Unit tests (Vitest)
│   │   ├── calculations/    # Calculation tests
│   │   ├── simulation/      # Simulation tests
│   │   ├── stores/          # Store tests
│   │   └── components/      # Component tests
│   └── e2e/                 # End-to-end tests (Playwright)
│
├── public/                  # Static assets
├── dist/                    # Production build output (generated)
├── node_modules/            # Dependencies (generated)
│
├── package.json             # Project metadata and scripts
├── pnpm-lock.yaml           # Lock file
├── vite.config.js           # Vite configuration
├── vitest.config.js         # Vitest configuration
├── playwright.config.js     # Playwright configuration
├── cucumber.js              # Cucumber configuration
├── .eslintrc.json           # ESLint configuration
├── .prettierrc              # Prettier configuration
├── .gitignore               # Git ignore rules
└── README.md                # User-facing project documentation
```

---

## Layer Organization

### `core/` — pure business logic

Framework-agnostic JS functions. No Svelte imports, no DOM side effects, no `fetch`. Everything here must be fully unit-testable without a browser.

**Naming conventions:**
- Factory functions prefixed with `create` (e.g., `createTheme`)
- Named exports — no default exports
- JSDoc on every exported function

### `content/` — user-facing copy

JSON only. One file per locale (e.g., `en.json`). Keys are grouped by feature. Components import these files directly via Vite's JSON support.

### `design-system/` — CSS tokens

Tailwind v4 `@theme` blocks. These define the visual primitives — colors, fonts, spacing overrides. Components reference token names via Tailwind utility classes; raw values live only here.

### `services/` — side-effectful code

Fetch calls and external API wrappers. Functions here may have network side effects and should be easy to mock in tests. No Svelte imports.

**Current exports from `api.js`:**
- `get(endpoint)` — GET request, returns parsed JSON
- `post(endpoint, data)` — POST request with JSON body, returns parsed JSON
- Base URL: `VITE_API_URL` env var, falling back to `/api`

### `src/` — Svelte application

Svelte components, routes, and the entry point. This is the only layer that uses `.svelte` files or imports Svelte APIs. It imports from all other layers; no other layer imports from `src/`.

**Component naming conventions:**
- PascalCase for `.svelte` files (e.g., `App.svelte`)
- Use Svelte 5 runes (`$state`, `$effect`, `$derived`) — not the legacy store API
- Event handlers use `onclick={}` syntax (not `on:click`)

---

## Feature Files (`features/`)

BDD/ATDD test specifications organized by domain:

| Directory | Contents | Example Files |
|-----------|----------|---------------|
| `builder/` | VSM builder features | `add-step.feature`, `edit-step.feature` |
| `simulation/` | Simulation features | `basic-flow.feature`, `bottleneck-detection.feature` |
| `visualization/` | Map display features | `display-map.feature`, `metrics-dashboard.feature` |
| `data/` | Data management | `import-vsm.feature`, `export-vsm.feature` |
| `step-definitions/` | Cucumber step implementations | `builder.steps.js`, `simulation.steps.js` |

**Feature file naming:**
- kebab-case (e.g., `add-step.feature`)
- Descriptive of the capability being tested

See [../rules/atdd-workflow.md](../rules/atdd-workflow.md) for ATDD guidelines.

---

## Test Files (`tests/`)

Unit tests mirror the layer they cover. Place tests adjacent to the layer being tested, not inside `src/`:

```
tests/
├── unit/
│   ├── core/
│   │   └── theme.test.js         # Tests core/theme.js
│   └── services/
│       └── api.test.js           # Tests services/api.js
└── e2e/
    └── app.spec.js               # E2E tests for user-visible behavior
```

**Test file naming convention:**
- `{moduleName}.test.js` for unit tests
- `{feature}.spec.js` for E2E tests
- Mirror the directory structure of the layer under test

See [../rules/testing.md](../rules/testing.md) for testing guidelines.

---

## Configuration Files

### Build & Development

| File | Purpose |
|------|---------|
| `vite.config.js` | Vite configuration (build tool) |
| `package.json` | Project metadata, scripts, dependencies |
| `pnpm-lock.yaml` | Dependency lock file |

### Testing

| File | Purpose |
|------|---------|
| `vitest.config.js` | Unit test configuration |
| `playwright.config.js` | E2E test configuration |
| `cucumber.js` | Acceptance test configuration |

### Code Quality

| File | Purpose |
|------|---------|
| `.eslintrc.json` | ESLint rules (linting) |
| `.prettierrc` | Prettier rules (formatting) |
| `.gitignore` | Files to exclude from git |

---

## File Naming Conventions

### General Rules

- **Svelte components**: PascalCase (e.g., `App.svelte`)
- **JS modules**: camelCase (e.g., `theme.js`, `api.js`)
- **Tests**: `{name}.test.js` or `{name}.spec.js`
- **Feature files**: kebab-case (e.g., `add-step.feature`)

### Extensions

- `.svelte` for Svelte components
- `.js` for JavaScript modules
- `.css` for stylesheets (including design-system tokens)
- `.json` for content/copy files
- `.feature` for Gherkin/Cucumber feature files
- `.md` for documentation

---

## Import Path Conventions

### Relative Imports

Use relative paths when importing between layers. From `src/`, go up one level to reach `core/`, `content/`, `design-system/`, or `services/`:

```javascript
// In src/App.svelte
import { createTheme, systemPrefersDark } from '../core/theme.js'
import content from '../content/en.json'
```

### Import Order

1. External dependencies (Svelte, libraries)
2. `core/` — pure logic
3. `content/` — copy
4. `services/` — API wrappers
5. Other Svelte components
6. Assets (CSS)

```javascript
// 1. External
import { mount } from 'svelte'

// 2. Core
import { createTheme, systemPrefersDark } from '../core/theme.js'

// 3. Content
import content from '../content/en.json'

// 4. Services (if needed)
import { get } from '../services/api.js'
```

---

## Where to Add New Files

### Adding a new Svelte component

**Location:** `src/{ComponentName}.svelte` or a subdirectory as the app grows (e.g., `src/components/{ComponentName}.svelte`)

### Adding pure business logic

**Location:** `core/{moduleName}.js`

Use a factory function if the logic needs injected dependencies; use named function exports if it's stateless.

### Adding user-facing copy

**Location:** `content/en.json` — add a key under the relevant feature namespace.

### Adding design tokens

**Location:** `design-system/tokens.css` — add a CSS custom property inside the `@theme` block.

### Adding an API wrapper

**Location:** `services/api.js` (extend existing file) or `services/{domain}.js` for a new service domain.

### Adding a new feature

1. Feature file → `features/{domain}/new-feature.feature`
2. Step definitions → `features/step-definitions/{domain}.steps.js`

### Adding Tests

- Unit test → `tests/unit/{mirror-src-path}/{file}.test.js`
- E2E test → `tests/e2e/{feature}.spec.js`

---

## Related Documentation

- [Architecture Guide](architecture.md) - System design and patterns
- [Workflows Guide](workflows.md) - Common development procedures
- [JavaScript Rules](../rules/javascript-react.md) - Code style guidelines (functional programming conventions)
- [Skills Directory](../skills/) - Task-specific workflows

---

**Questions?** See [../INDEX.md](../INDEX.md) for full documentation navigation.
