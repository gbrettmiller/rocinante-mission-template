# JavaScript & React Coding Standards

## Code Formatting

This project uses **Prettier** with the following configuration:

- Single quotes (`'`) instead of double quotes
- No semicolons
- 2-space indentation
- Trailing commas in ES5 contexts

Prettier runs automatically on save and pre-commit. Do not manually format code.

## JavaScript

### Functional Programming Style

**CRITICAL: This project uses functional programming style exclusively.**

- **NEVER use ES6 classes** - Use factory functions that return objects with methods
- **Use closures for state management** - Encapsulate state in function scope
- **Use pure functions** - Functions should not mutate arguments or have side effects
- **Prefer composition over inheritance** - Build complex behavior by combining simple functions

#### Factory Function Pattern

Instead of classes, use factory functions. See `examples/factory-functions.md`.

### Modern ES6+ Syntax

- Use `const` by default, `let` when reassignment is needed
- Never use `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring for objects and arrays
- Use spread operator for immutable updates

### Naming Conventions

- PascalCase for React components
- camelCase for variables, functions, and properties
- SCREAMING_SNAKE_CASE for constants
- Factory functions: prefix with `create` (e.g., `createSimulationRunner`)
- Prefix props interfaces with component name in comments

### JSDoc Comments

Use JSDoc for function documentation:

```javascript
/**
 * Calculate flow efficiency for a value stream
 * @param {Object} vsm - The value stream map
 * @param {Array} vsm.steps - Array of process steps
 * @returns {number} Flow efficiency as decimal (0-1)
 */
function calculateFlowEfficiency(vsm) {
  // implementation
}
```

## React

### Component Structure

1. Imports (external, then internal)
2. Component function
3. Hooks (useState, useEffect, custom hooks)
4. Event handlers
5. Render logic
6. PropTypes definition
7. Default props
8. Export

See `examples/react-components.md` for a full component example.

### PropTypes

Always define PropTypes for all components. Use `.isRequired` for mandatory props. Example:

```javascript
import PropTypes from 'prop-types'

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
}
```

### Hooks

- Always follow Rules of Hooks
- Extract complex logic into custom hooks in `src/hooks/`
- Name custom hooks with `use` prefix

### Event Handlers

- Prefix with `handle`: `handleClick`, `handleSubmit`

### Memoization

- Use `useMemo` for expensive calculations
- Use `useCallback` for handlers passed to memoized children
- Don't over-memoize - measure before optimizing

## Imports

Use relative imports with clear paths:

```javascript
// External imports first
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// Internal imports
import { useVsmStore } from '../stores/vsmStore'
import { calculateMetrics } from '../utils/calculations/metrics'
import StepNode from './canvas/nodes/StepNode'
```

## Data Testability

Always add `data-testid` attributes for acceptance testing:

```jsx
<button data-testid="add-step-button">Add Step</button>
<div data-testid="metrics-dashboard">...</div>
<input data-testid="process-time-input" />
```
