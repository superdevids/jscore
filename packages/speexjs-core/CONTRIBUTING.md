# Contributing — SpeexJS Core

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
cd packages/speexjs-core
npm install
npx tsup              # build
npx vitest run        # run all tests (1167+)
npx biome check src/  # lint
```

## Coding Standards

- **TypeScript strict mode** — `strict: true` in tsconfig. No explicit `any` unless absolutely necessary; use `unknown` and type guards instead.
- **Zero runtime dependencies** — the package must remain dependency-free at runtime. Dev tooling (tsup, vitest, Biome) is fine.
- **JSDoc required** — every public function must have a JSDoc block describing purpose, parameters, return value, and at least one `@example`.
- **Biome linter & formatter** — all code must pass `npx biome check --write`. Project settings:
  - 2-space indentation
  - 120 character line width
  - Single quotes (`'`) instead of double quotes
  - Semicolons as needed (`asNeeded`)
  - Trailing commas everywhere
- **Tests required** — every public function must have unit tests. Run `npx vitest run` before committing.

### Adding a New Module

1. Create your source directory: `src/<module>/`
2. Implement functions and re-export from `src/<module>/index.ts`
3. Add an entry to **`tsup.config.ts`** under the `entry` array (e.g. `'src/<module>/index.ts'`)
4. Add a corresponding export entry in **`package.json`** under the `"exports"` field:
   ```json
   "./<module>": {
     "import": "./dist/<module>/index.js",
     "types": "./dist/<module>/index.d.ts"
   }
   ```
5. Write unit tests in `tests/<module>.test.ts`
6. Run the full suite: `npx tsup && npx vitest run`
7. Update `SUMMARY.md` if one exists

## Reporting Bugs

Open a [GitHub Issue](https://github.com/superdevids/speexjs/issues) with:

- A clear description and steps to reproduce
- The speexjs-core version and environment (Node.js version, OS)
- Minimal code that reproduces the problem

## Feature Requests

Open a GitHub Issue with the `enhancement` label. Include:

- The problem you're trying to solve
- Desired API or usage example
- Alternatives you've considered

## Pull Request Process

1. Branch from `master`
2. Ensure `npx tsup && npx vitest run` passes
3. Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(core): add deepMerge function
fix(math): correct floating-point rounding in mean
docs: update README with new module
```

4. Open a PR against `master` with a clear description
5. A maintainer will review within a few days

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
