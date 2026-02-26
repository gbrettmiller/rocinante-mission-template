# Testing Standards

## Test-First Development (TDD)

**Tests must always be written before implementation code.**

When implementing any feature or bug fix:
1. Write the failing test(s) first
2. Verify the test fails for the expected reason
3. Write the minimum code to make the test pass
4. Refactor while keeping tests green

This applies to:
- **Acceptance tests** - Write feature files before any implementation
- **Unit tests** - Write test cases before implementing functions
- **Integration tests** - Write tests before wiring components together

## Testing Pyramid

1. **Acceptance Tests** (Cucumber) - User-facing behavior
2. **Integration Tests** - Component interactions
3. **Unit Tests** - Utility functions and calculations

## Acceptance Tests (ATDD)

Acceptance tests are the primary driver of development. See `atdd-workflow.md` for detailed guidelines.

### Structure

```
features/
├── builder/           # VSM builder features
├── visualization/     # Map display features
├── simulation/        # Simulation features
└── step-definitions/  # Cucumber step definitions
```

### Running Acceptance Tests

```bash
# Run all acceptance tests
pnpm test:acceptance

# Run specific feature
pnpm test:acceptance -- features/builder/add-step.feature

# Watch mode
pnpm test:acceptance --watch
```

## Unit Tests

Unit tests cover utility functions, calculations, and business logic.

### Organization

```
tests/
├── unit/
│   ├── calculations/
│   │   ├── flowEfficiency.test.js
│   │   └── metrics.test.js
│   └── simulation/
│       └── simulateTick.test.js
└── integration/
    └── vsmStore.test.js
```

### Naming Conventions

- Test files: `{moduleName}.test.js`
- Describe blocks: Module or function name
- It blocks: Start with verb describing behavior

See `examples/testing-patterns.md` for naming and calculation examples.

## Integration Tests

Integration tests verify component interactions and store behavior. See `examples/testing-patterns.md`.

## Simulation Testing

Simulations require deterministic testing with controlled inputs. See `examples/testing-patterns.md`.

## Test Commands

```bash
# Run all unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test --watch

# Run acceptance tests
pnpm test:acceptance

# Run all tests
pnpm test:all
```

## Coverage Goals

Focus on meaningful coverage:

- Calculations: 90%+
- Simulation logic: 90%+
- Utility functions: 80%+

Acceptance tests cover user-facing behavior and don't need coverage metrics.
