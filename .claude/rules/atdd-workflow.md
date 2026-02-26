# ATDD Workflow Rules

## Core Principle

**Tests come before code. Always.**

1. **No implementation without tests first** - Write failing tests before any implementation code
2. **No feature without an approved feature file** - Gherkin specifications must be reviewed and approved before coding
3. **Red-Green-Refactor** - Follow the TDD cycle strictly

Every feature must start with a Gherkin specification that is reviewed and approved before any code is written.

## Workflow Steps

### 1. Feature File Creation

When starting any new feature:

1. Create a `.feature` file in the appropriate `features/` subdirectory
2. Write scenarios in Gherkin syntax
3. **STOP** and present for review
4. Wait for explicit approval before proceeding

### 2. Feature File Structure

```gherkin
Feature: [Clear feature name]
  As a [role]
  I want [capability]
  So that [benefit]

  Background:
    Given [common setup steps]

  Scenario: [Happy path description]
    Given [precondition]
    When [action]
    Then [expected result]

  Scenario: [Edge case or alternative path]
    Given [precondition]
    When [action]
    Then [expected result]
```

### 3. Review Checklist

Before presenting a feature file for review, verify:

- [ ] Feature name clearly describes the capability
- [ ] User story captures who, what, and why
- [ ] Happy path scenario is complete
- [ ] Key edge cases are covered
- [ ] Steps are written from user's perspective
- [ ] No implementation details in scenarios
- [ ] Steps are atomic and reusable

### 4. After Approval

Once a feature file is approved:

1. Create step definitions in `features/step-definitions/`
2. Run tests (should fail - red phase)
3. Implement minimum code to pass (green phase)
4. Refactor while keeping tests green

### 5. Step Definition Guidelines

- Use regex for flexible matching
- Use data tables for complex inputs
- Make steps reusable across scenarios

## File Organization

```
features/
├── builder/
│   ├── add-step.feature
│   ├── edit-step.feature
│   └── connect-steps.feature
├── visualization/
│   ├── display-map.feature
│   └── metrics-dashboard.feature
├── simulation/
│   ├── basic-flow.feature
│   └── bottleneck-detection.feature
└── step-definitions/
    ├── builder.steps.js
    ├── visualization.steps.js
    ├── simulation.steps.js
    └── common.steps.js
```

## Scenario Guidelines

Write scenarios from the user's perspective with no implementation details. Steps should be atomic and reusable.

## Running Tests

```bash
# Run all acceptance tests
pnpm test:acceptance

# Run specific feature
pnpm test:acceptance -- features/builder/add-step.feature

# Run with tags
pnpm test:acceptance -- --tags @wip

# Watch mode during development
pnpm test:acceptance --watch
```

## Tags

Use tags to organize and filter scenarios:

```gherkin
@wip
Scenario: Work in progress scenario

@smoke
Scenario: Critical path scenario for smoke testing

@slow
Scenario: Performance-intensive scenario
```

## Definition of Done

A feature is complete when:

- [ ] All scenarios pass
- [ ] No pending or skipped steps
- [ ] Code is refactored and clean
- [ ] Unit tests exist for complex calculations
- [ ] Feature file serves as living documentation
