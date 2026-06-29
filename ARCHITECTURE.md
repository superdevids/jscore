# Architecture — SpeexJS Monorepo

> **Last Updated:** 2026-06-29
> **Monorepo Version:** 0.8.2

---

## 1. Overview

SpeexJS is a **pnpm monorepo** containing two independent npm packages plus a VS Code extension.

```
speexjs/
├── packages/
│   ├── speexjs/        # Fullstack TypeScript web framework (v1.6.1)
│   └── speexkit/       # Zero-dep utility toolkit (v1.4.12)
├── extensions/
│   └── vscode-dep-exray/  # VS Code dependency scanner
├── .github/            # CI/CD workflows, issue templates
└── *.md                # Root-level documentation
```

---

## 2. Package Relationships

```
                    ┌─────────────────────┐
                    │   speexjs-monorepo   │
                    │   (pnpm workspace)   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │   speexjs    │  │   speexkit   │  │vscode-dep-   │
     │  Web FW      │  │  Toolkit     │  │exray (VSCODE)│
     │  v1.6.1      │  │  v1.4.12     │  │  v0.1.0      │
     │  300+ ft     │  │  400+ fns    │  │  Dependency  │
     │  1990 tests  │  │  1477 tests  │  │  Scanner UI  │
     └──────┬───────┘  └──────────────┘  └──────────────┘
            │
            │ (imports tsx for dev)
            ▼
     ┌──────────────┐
     │   Node.js    │
     │  (≥ 18.0.0)  │
     └──────────────┘
```

**Key principle:** `speexjs` and `speexkit` are **fully independent**. Neither depends on the other. They share only the monorepo tooling (pnpm, Biome, TypeScript config base).

---

## 3. Package: speexjs (Web Framework)

### 3.1 Module Map

```
src/
├── index.ts          # Barrel export (re-exports all modules)
├── cli/              # CLI commands: init, serve, make:*, tinker
├── client/           # Client-side: Signals, VDOM, JSX, Router
│   ├── signals/      #   Reactive: signal, computed, effect
│   └── vdom/         #   Virtual DOM: h, render, patch, hydrate
├── rpc/              # Type-safe RPC (HTTP + WebSocket)
├── schema/           # Validation: 25+ schema types (Zod-compatible)
├── server/           # Server framework (the bulk)
│   ├── http/         #   SuperRequest, SuperResponse, Cookies
│   ├── router/       #   Router, groups, resources, file-routing
│   ├── middleware/   #   CORS, Auth, CSRF, Throttle, Logger...
│   ├── controller/   #   Base Controller + decorators
│   ├── container/    #   DI Container
│   ├── engine/       #   NodeEngine, HttpsEngine
│   ├── database/     #   QueryBuilder, ORM, Migrations, Seeders
│   ├── auth/         #   SessionGuard, TokenGuard, Sanctum, Socialite
│   ├── gate/         #   Authorization / Policies
│   ├── cache/        #   Memory, File, Redis stores
│   ├── storage/      #   Local, S3
│   ├── queue/        #   In-memory, Redis, SQLite drivers
│   ├── mail/         #   Console, SMTP, Nodemailer
│   ├── websocket/    #   Native + Pusher/Ably broadcasting
│   ├── view/         #   TSX View Engine
│   ├── schedule/     #   Task scheduler (cron)
│   ├── events/       #   EventEmitter + wildcards
│   ├── notifications/#   Database notification system
│   ├── graphql/      #   GraphQL support
│   ├── openapi/      #   OpenAPI spec generator
│   ├── billing/      #   Cashier billing
│   ├── flags/        #   Feature flags
│   ├── testing/      #   TestRequest, RefreshDatabase, actingAs
│   ├── i18n/         #   Internationalization
│   ├── search/       #   Full-text search
│   ├── cluster/      #   Multi-core clustering
│   ├── edge/         #   Edge runtime support
│   ├── health/       #   Health checks
│   └── ...           #   ~40+ submodules total
├── native/           # Core helpers (zero-dep): colors, logger, crypto
└── tests/            # 11 test files, 1,990 tests
```

### 3.2 Request Lifecycle

```
HTTP Request
    │
    ▼
Engine (NodeEngine / HttpsEngine)
    │
    ▼
SuperApp.handleRequest()
    │
    ├── Global Middleware Pipeline
    │   ├── CORS
    │   ├── CSRF
    │   ├── Session
    │   ├── Auth (if global)
    │   ├── Throttle
    │   ├── Helmet
    │   └── Logger
    │
    ├── Router.match(method, path)
    │   └── Route + Route Middleware
    │
    ├── Controller Action
    │   └── Response (JSON / HTML / Stream / Redirect)
    │
    └── Error Handler
        ├── HTTP Exceptions (12 classes)
        └── Fallback 500
```

### 3.3 Build Configuration

| Setting | Value |
|---------|-------|
| Bundler | tsup (esbuild-based) |
| Format | ESM |
| Entry points | ~40+ (barrel + deep imports) |
| Splitting | Yes (code-split by module) |
| Target | ES2022 |
| TypeScript | Strict mode |
| Bundle size | ~218 KB (69 KB gzip) |

---

## 4. Package: speexkit (Utility Toolkit)

### 4.1 Module Map

```
src/
├── index.ts          # Barrel export (re-exports all 19 modules)
├── core/             # deepClone, deepMerge, pipe, compose, debounce...
├── math/             # safe float, median, stddev, percentile...
├── date/             # formatDate, timeAgo, addBusinessDays, parseDuration...
├── string/           # slugify, uuid, camelCase, levenshtein...
├── async/            # Queue, Semaphore, RateLimiter, Mutex...
├── validation/       # 21 validators: isEmail, isIP, isUUID...
├── collection/       # groupBy, topoSort, deepGet, partition...
├── ml/               # StandardScaler, LinearRegression, KMeans...
├── stats/            # normalPDF, ttestInd, pearsonCorrelation...
├── nlarray/          # NDArray (NumPy-style): broadcasting, matmul...
├── nlfunction/       # curry, pipe, ifElse, converge, tryCatch...
├── crypto/           # randomHex, base64, generateToken...
├── color/            # hexToRgb, lighten, contrastRatio, meetsWCAG...
├── io/               # parseCsv, safeJsonParse, env helpers...
├── path/             # join, resolve, basename, extname...
├── type/             # 28 type guards: isString, isNil, isPlainObject...
├── logger/           # Logger, transports (console/JSON/file)
├── error/            # TypedError, MultiError, createError
├── viz-data/         # histogram, kde, boxPlotData, ecdf, colorMap
├── dep-exray/        # Dependency scanner + CLI
└── tests/            # 24 test files, 1,477 tests
```

### 4.2 Design Principles

| Principle | Description |
|-----------|-------------|
| **Zero dependencies** | No runtime deps. Pure TypeScript + Node.js built-ins. |
| **Module independence** | No module imports from another speexkit module. Full tree-shakeability. |
| **Deep imports** | `import { slugify } from 'speexkit/string'` — import only what you need. |
| **TypeScript strict** | Full type safety, `strict: true`, `noUncheckedIndexedAccess`. |
| **ESM-only** | `"type": "module"` in package.json. |
| **sideEffects: false** | Max tree-shakeability for bundlers. |
| **No classes** | Prefer pure functions and standalone exports. |

### 4.3 Build Configuration

| Setting | Value |
|---------|-------|
| Bundler | tsup (esbuild-based) |
| Format | ESM |
| Entry points | 33 (one per module + subpaths) |
| Splitting | False (single file per entry) |
| Target | ES2022 |
| Bundle size | ~200 KB (25 KB gzip) |

---

## 5. Shared Tooling

### 5.1 Root Configuration

| Tool | Config File | Purpose |
|------|-------------|---------|
| **pnpm** | `pnpm-workspace.yaml` | Monorepo workspace management |
| **TypeScript** | `tsconfig.base.json` | Shared TS strict settings |
| **Biome** | `biome.json` | Linting + formatting (2 spaces, single quotes) |
| **Vitest** | Per-package `vitest.config.ts` | Test runner |

### 5.2 Version Alignment

All packages in the monorepo evolve independently:

| Package | Version | Stable | Tests |
|---------|---------|--------|-------|
| speexjs | 1.6.1 | ✅ Production | 1,990 |
| speexkit | 1.4.12 | ✅ Production | 1,477 |
| vscode-dep-exray | 0.1.0 | ⚠️ Alpha | — |

---

## 6. CI/CD Pipeline

```
                    .github/workflows/
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      speexjs CI                  speexkit CI
    ┌──────────────┐          ┌──────────────┐
    │ npm install   │          │ npm install   │
    │ npm run lint  │          │ npm run lint  │
    │ npm run build │          │ npm run build │
    │ npm test      │          │ npm test      │
    │ npm run bench │          │              │
    └──────┬───────┘          └──────┬───────┘
           │                         │
           └──────────┬──────────────┘
                      ▼
             GitHub Actions
             (matrix: ubuntu, windows, macos)
```

---

## 7. Development Workflow

```bash
# Clone
git clone https://github.com/superdevids/speexjs.git
cd speexjs

# Install (all packages)
pnpm install

# Build all packages
pnpm -r build

# Test all packages
pnpm -r test

# Work on speexjs only
cd packages/speexjs
npm run dev       # Watch mode build
npm test          # Run tests

# Work on speexkit only
cd packages/speexkit
npm run dev       # Watch mode build
npm test          # Run tests
```

### 7.1 Adding New Features

1. **Check the PRD** (`packages/<name>/PRD.md`) for roadmap alignment
2. **Write tests first** (TDD: `vitest` in watch mode)
3. **Implement** following the module's existing patterns
4. **Verify:** `npm run lint && npm run typecheck && npm test`
5. **Update docs:** CHANGELOG.md, SUMMARY.md if applicable
6. **Commit** using Conventional Commits

---

## 8. Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **pnpm over npm/yarn** | Disk efficiency, strict dependency isolation |
| **ESM-only** | Future-proof, better tree-shaking, aligned with Node.js direction |
| **tsup over tsc** | 10x faster build, bundle splitting, DTS generation |
| **Biome over ESLint** | 50x faster linting, zero config, formatter + linter in one |
| **Vitest over Jest** | ESM-native, faster, better TypeScript integration |
| **Zero runtime deps** | Minimal supply chain attack surface, fastest install |
| **Monorepo** | Shared tooling config, one CI pipeline, cross-package visibility |
| **Deep import paths** | Maximum tree-shakeability, explicit dependencies |
