# REFACTOR LOG — SpeexJS

## Initial State (Pre-Phase 1)
- Source files: 153 files in src/
- Test files: 11 files in tests/
- Bundle size: 219.0 KB package, 917.3 KB unpacked, 100 files
- TypeScript errors: 2 pre-existing (`resolveCache`/`resolveCacheMaxSize` unused in router, `Infer` in schema)
- Test pass rate: 1990 passed, 11 test files — all green

## Phase 1 — Dead Code Elimination

### Removed
1. **`src/native/helpers/number.ts` — `formatRupiah` method** — Indonesia-specific currency formatter. Never called from any production code. Only referenced in tests. Method deleted.
2. **`src/cli/templates/pages/about.tsx`** — Standalone template file. Not imported or referenced by any source file. The `init.ts` CLI command uses inline templates (`TEMPLATES` object). Deleted.
3. **`src/cli/templates/pages/home.tsx`** — Same as above. Deleted.
4. **`src/cli/templates/pages/`** — Directory emptied and removed.
5. **`src/cli/templates/`** — Directory removed (parent became empty).
6. **`tests/native.test.ts` — `formatRupiah` test block** (3 tests) — Removed alongside the production method.

### Dependency Audit
| Dependency | Type | Status |
|---|---|---|
| `tsx` | devDependency (correct) | Used in `serve.ts` for TS runtime loading |
| `@types/node` | devDependency | Required for TypeScript compilation |
| `typescript` | devDependency | Required for TypeScript compilation |
| `tsup` | devDependency | Build tool, used in `tsup.config.ts` |
| `vitest` | devDependency | Test runner, used in all test files |
| `vite` | devDependency | Used by vitest under the hood |
| `@biomejs/biome` | devDependency | Referenced in init.ts template configs |
| `@vitest/coverage-v8` | devDependency | Configured in `vitest.config.ts` |
| `mitata` | devDependency | Used in `benchmarks/index.bench.ts` |

All dependencies verified as used. No dependency removals.

### Validation Results
- Tests: **1987 passed** (3 fewer from formatRupiah test removal) — all 11 test files green
- TypeScript: Pre-existing errors unchanged (no new errors introduced)
- Build: Succeeds (ESM build), DTS build has pre-existing errors

### File Count Changes
- Before: 153 src files, 11 test files
- After: 151 src files (-2 templates), 11 test files
- Directories removed: 2 (`templates/pages/`, `templates/`)
