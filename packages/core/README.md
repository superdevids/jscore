# superjs-core

> **All-in-one JavaScript toolkit — Standard Library + Dependency Scanner + 🇮🇩 Indonesia Validation + Logger + Typed Errors**

```bash
npm install superjs-core
```

One package for all your JavaScript needs: utility functions, async helpers, crypto, path manipulation, typed errors, structured logging, **plus** dependency health scanner and Indonesia-specific data validation (NIK, NPWP, Phone).

---

## Features

- ✅ **90+ functions** — 16 modules covering everything from `deepClone` to `terbilang`
- ✅ **Tree-shakeable** — import only what you need via subpath exports
- ✅ **TypeScript strict** — full type safety, zero `any`
- ✅ **Zero runtime dependencies** — commander + picocolors are CLI-only
- ✅ **ESM-first** — target ES2022, optimized for Node 18+ and modern browsers
- ✅ **Biome linted** — consistent code style enforced

---

## Modules

| Module | Key Functions |
|--------|---------------|
| **core** | deepClone, deepMerge, debounce, throttle, memoize, retry, once |
| **math** | add/sub/mul/div (safe float), median, stddev, percentile, correlation, formatCurrency |
| **date** | formatDate, parseDate, timeAgo, Duration, timezone helpers (WIB/WITA/WIT) |
| **collection** | sortBy, groupBy, shuffle, topoSort, slidingWindows, chunk |
| **string** | camelCase, uuid, nanoid, slugify, levenshtein, fuzzyMatch, maskString |
| **async** | sleep, parallelMap, Queue, Semaphore, memoizeAsync, retryAsync |
| **io** | parseCsv, stringifyCsv, safeJsonParse, env, envInt, envBool |
| **type** | 20+ type guards (isString, isNil, assertDefined, getType) |
| **crypto** | hash, base64, generateToken, generateOTP, constantTimeEqual |
| **path** | join, resolve, basename, dirname, extname, normalize |
| **validation** | isNIK, isNPWP, isPhone("id"), isEmail, isURL |
| **error** | createError (typed + HTTP status), TypedError, MultiError |
| **logger** | Logger class, child loggers, console/JSON/file transports |
| **dep-exray** | scanProject, generateReport, analyzeUsage, CLI: `npx dep-exray .` |

### 🇮🇩 Indonesian Locale

| Function | Description |
|----------|-------------|
| `terbilang(value)` | Convert numbers to Indonesian words ("satu juta lima ratus ribu") |
| `formatRupiah(value)` | Format as Rupiah ("Rp1.500.000") |
| `isNIK(value)` | Validate Indonesian NIK (16-digit ID number) |
| `isNPWP(value)` | Validate Indonesian NPWP (tax ID with checksum) |
| `isPhone(value)` | Validate Indonesian phone numbers |

---

## Quick Examples

```typescript
import { deepClone, debounce } from "superjs-core"
import { formatDate, timeAgo } from "superjs-core/date"
import { groupBy, topoSort } from "superjs-core/collection"
import { Queue } from "superjs-core/async"
import { uuid, maskString, terbilang, formatRupiah } from "superjs-core/string"
import { generateToken } from "superjs-core/crypto"
import { isNIK, isNPWP, isPhone } from "superjs-core/validation"
import { createError } from "superjs-core/error"
import { Logger } from "superjs-core/logger"
import { median, stddev, formatCurrency } from "superjs-core/math"
import { scanProject } from "superjs-core/dep-exray"

// Deep clone with circular reference support
const cloned = deepClone({ a: 1, b: { c: new Date() } })

// Safe math (0.1 + 0.2 = 0.3 ✅)
import { add } from "superjs-core/math"
console.log(add(0.1, 0.2)) // 0.3

// Date formatting without moment
console.log(formatDate(new Date(), "DD/MM/YYYY")) // "28/06/2026"
console.log(timeAgo(new Date(Date.now() - 5000))) // "5 seconds ago"

// Priority task queue
const queue = new Queue({ concurrency: 2 })
await queue.add(() => fetch("/api/data"))

// Indonesia validation
isNIK("3201010203940001") // true
isNPWP("12.345.678.9-012.344") // true
isPhone("08123456789") // true

// Indonesian locale
terbilang(1500000) // "satu juta lima ratus ribu"
formatRupiah(1500000) // "Rp1.500.000"

// Statistics
median([1, 2, 3, 4, 5]) // 3
percentile([1, 2, 3, 4, 5], 90) // 4.6
formatCurrency(1500000, { locale: "en-US", currency: "USD" }) // "$1,500,000"

// Typed errors
throw createError("VALIDATION_ERROR", "Email required", { details: { field: "email" } })

// Structured logger
const log = new Logger({ level: "info", name: "app" })
log.info("Server started", { port: 3000 })

// Dependency scanning
const report = await scanProject({ path: "./my-project" })
console.log(report.totalEstimatedSize) // "2.3 MB"
```

---

## dep-exray — Dependency Health Scanner (built-in)

**Scan your project to find bloated, unused, or vulnerable dependencies.**

```bash
npx dep-exray .
npx dep-exray /path/to/project --json --verbose
```

### Features
- Detect replacements: lodash → superjs-core, moment → superjs-core/date, uuid → native crypto.randomUUID()
- Estimate dependency size in MB/KB
- CVE detection from known vulnerability database
- JSON output for CI/CD integration
- Usage analyzer — detects whether dependencies are actually imported

---

## Project Structure

```
packages/core/
├── src/
│   ├── core/          # deepClone, debounce, retry, once
│   ├── math/          # add, median, stddev, formatCurrency
│   ├── date/          # formatDate, timeAgo, Duration, timezone
│   ├── collection/    # groupBy, topoSort, slidingWindows
│   ├── string/        # camelCase, terbilang, formatRupiah
│   ├── async/         # sleep, Queue, Semaphore, memoizeAsync
│   ├── io/            # parseCsv, safeJsonParse, env
│   ├── type/          # 20+ type guards
│   ├── crypto/        # hash, generateToken, base64
│   ├── path/          # join, resolve, basename
│   ├── validation/    # isNIK, isNPWP, isPhone, isEmail, isURL
│   ├── error/         # createError, TypedError, MultiError
│   ├── logger/        # Logger, transports
│   └── dep-exray/     # Dependency scanner
├── tests/             # 757 tests
├── dist/              # Built output
├── tsup.config.ts
├── vitest.config.ts
├── biome.json
└── package.json
```

---

## Test Stats

| Test Files | Tests |
|-----------|-------|
| 17 | **757** passing |

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for full details.

### Priority
- **P0 ✅** validation, error, logger modules
- **P1 ✅** async (Queue, Semaphore), math (stats), string (terbilang), collection (topoSort), date (timeAgo)
- **P2** core (pipe/compose, Result type), signal module, crypto (AES-GCM)
- **P3** ml, color modules

---

## License

MIT
