# Contributing to SpeexJS

Thank you for your interest in contributing to **SpeexJS**! We welcome contributions of all kinds — whether it's bug reports, feature requests, documentation improvements, or code changes.

This guide applies to the entire SpeexJS monorepo. For package-specific guidelines, see:

- [speexjs CONTRIBUTING.md](./packages/speexjs/CONTRIBUTING.md) — Web framework
- [speexkit CONTRIBUTING.md](./packages/speexkit/CONTRIBUTING.md) — Utility toolkit

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Commit Conventions](#commit-conventions)
- [Issue Reporting](#issue-reporting)
- [Security Issues](#security-issues)

---

## Code of Conduct

This project is governed by the [Contributor Covenant](./CODE_OF_CONDUCT.md). By participating, you agree to uphold its standards. Please report unacceptable behavior to **adityasuperdev@gmail.com**.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **pnpm** ≥ 8.0.0 (recommended) or **npm** ≥ 9.0.0
- **Git**

### Clone & Setup

```bash
# Clone the repository
git clone https://github.com/superdevids/speexjs.git
cd speexjs

# Install all dependencies (recommended: pnpm)
pnpm install

# Or using npm (one package at a time)
cd packages/speexjs && npm install
cd ../speexkit && npm install
```

### Verify Setup

```bash
# Run all tests across all packages
pnpm -r test

# Or per-package
cd packages/speexjs && npm test
```

---

## Development Workflow

### 1. Choose Your Package

Decide which package your contribution belongs to:

| Package | Focus Area | Key Files |
|---------|------------|-----------|
| **speexjs** | Web framework, server, client, CLI | `packages/speexjs/src/server/`, `client/`, `cli/`, `schema/` |
| **speexkit** | Utility functions, NDArray, ML, validation | `packages/speexkit/src/` (19 modules) |

### 2. Understand the Architecture

Before making changes, review:

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Monorepo structure & design decisions
- [PRD.md](./packages/speexjs/PRD.md) — speexjs product roadmap & priorities
- [PRD.md](./packages/speexkit/PRD.md) — speexkit product roadmap & priorities
- The package's `SUMMARY.md` for module reference

### 3. Create a Branch

```bash
# Create a feature branch from master
git checkout master
git pull origin master
git checkout -b feat/my-feature     # for new features
git checkout -b fix/my-bug-fix      # for bug fixes
git checkout -b docs/my-doc-update  # for documentation
```

### 4. Implement

```bash
# Start the dev server (auto-rebuild on changes)
cd packages/speexjs && npm run dev

# Run tests in watch mode
npm run test:watch
```

### 5. Verify

Before committing, ensure:

```bash
# TypeScript check (must be 0 errors)
npm run typecheck

# Lint (must be 0 warnings)
npm run lint

# Tests (must be 100% passing)
npm test

# Build
npm run build
```

---

## Coding Standards

### General (All Packages)

| Rule | Standard |
|------|----------|
| **Language** | TypeScript strict mode (`strict: true`) |
| **Runtime dependencies** | **Zero** — no exceptions |
| **Formatting** | Biome — 2 spaces, single quotes, 120 width |
| **Naming** | `kebab-case` for files, `PascalCase` for classes, `camelCase` for functions/variables |
| **Imports** | Use deep imports: `import { x } from 'speexjs/server'` |
| **Exports** | Named exports preferred over default exports |
| **Side effects** | All modules must be `sideEffects: false` |

### speexjs-Specific

| Area | Standard |
|------|----------|
| **Server code** | Follow existing pattern (Controller → Service → Repository) |
| **Middleware** | Must support both global and route-level registration |
| **Auth guards** | Must implement `GuardContract` interface |
| **Schema validation** | Extend existing `Schema` base class |
| **CLI commands** | Register in `cli/commands/` and export from barrel |

### speexkit-Specific

| Area | Standard |
|------|----------|
| **Pure functions** | Prefer standalone exported functions over classes |
| **No cross-module imports** | A module must not import from another speexkit module |
| **Deep imports** | Ensure `package.json` exports field covers the module path |
| **JSDoc** | Include `@param`, `@returns`, `@example` for all public exports |
| **Performance** | Avoid object allocations in hot paths |

### What to Avoid

- ❌ No `any` type — use `unknown` with proper narrowing
- ❌ No runtime dependencies — all native Node.js or pure TypeScript
- ❌ No `eval()` or dynamic code execution
- ❌ No hardcoded secrets or credentials
- ❌ No circular imports between modules
- ❌ No debug logs in production code (`console.log` in source)

---

## Testing

### Framework

All packages use **Vitest** as the test runner.

### Requirements

| Requirement | Standard |
|-------------|----------|
| **Coverage** | Minimum 80%, target >90% |
| **New code** | Must include tests |
| **Bug fixes** | Must include a regression test |
| **Test pattern** | One test file per module: `tests/<module>.test.ts` |

### Running Tests

```bash
# Run all tests (current package)
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx vitest run tests/auth.test.ts

# Run tests in watch mode
npm run test:watch

# Run across all packages (from root)
pnpm -r test
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest'

describe('ModuleName', () => {
  describe('functionName', () => {
    it('handles normal input', () => {
      expect(functionName('input')).toBe('expected')
    })

    it('handles edge case', () => {
      expect(functionName(null)).toBeNull()
    })

    it('throws on invalid input', () => {
      expect(() => functionName('')).toThrow('Expected error message')
    })
  })
})
```

---

## Pull Request Process

### Before Submitting

1. **Rebase** your branch on the latest `master`
2. **Run** the full verification: `typecheck` + `lint` + `test` + `build`
3. **Update** CHANGELOG.md with your changes
4. **Update** SUMMARY.md if you added/modified modules
5. **Write** a clear PR description following the template

### PR Title Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

feat(server): add WebSocket compression support
fix(auth): resolve session expiry race condition
docs(schema): add migration guide for v2
perf(orm): cache query compilation results
refactor(cli): extract shared command utilities
test(validation): add edge case coverage for isEmail
```

### PR Checklist

- [ ] TypeScript: 0 errors (`tsc --noEmit`)
- [ ] Lint: 0 warnings (`npm run lint`)
- [ ] Tests: 100% passing, new tests included
- [ ] Build: succeeds (`npm run build`)
- [ ] Documentation: CHANGELOG + SUMMARY updated
- [ ] PR targets `master` branch
- [ ] PR description explains the change and motivation

### Review Process

1. A maintainer will review within **48 hours**
2. Address review feedback with additional commits
3. Once approved, a maintainer will merge

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) for all commits:

```
<type>(<optional-scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Usage |
|------|-------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, dependencies |

### Examples

```
feat(router): support optional route parameters with /:id?
fix(auth): prevent token collision on concurrent refresh
docs: update API reference for query builder
perf(orm): add SQL result caching in QueryBuilder
test: add brutal test phase for database transactions
chore(deps): update Biome to v2.5.1
```

---

## Issue Reporting

### Bug Reports

When filing a bug report, include:

- **SpeexJS version** and package name
- **Node.js version** and OS
- **Minimal reproduction** — code snippet or repository
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable

### Feature Requests

When suggesting a feature:

- **Describe the problem** you're trying to solve
- **Propose a solution** with API surface if possible
- **Explain alternatives** you've considered
- **Reference the PRD** — check if the feature is already planned

---

## Security Issues

For **security vulnerabilities**, **do not** open a public GitHub issue.

Instead, report via email: **adityasuperdev@gmail.com** with subject `[SECURITY]`. See [SECURITY.md](./SECURITY.md) for details.

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

*Thank you for helping make SpeexJS better!*
