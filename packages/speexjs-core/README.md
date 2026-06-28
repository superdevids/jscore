# speexjs-core

**A JavaScript/TypeScript utility toolkit — NDArray, functional programming, and 250+ functions across 17 modules. Zero dependencies.**

```bash
npm install speexjs-core
```

## Highlights

| | |
|---|---|
| **NDArray** | NumPy-like multi-dimensional array with broadcasting, slicing, reshaping, and vectorized math |
| **250+ functions** | 17 well-organized modules covering everything from math to async concurrency |
| **Zero dependencies** | Tiny bundle, no runtime baggage |
| **Functional utilities** | `curry`, `pipe`, `compose`, `partial`, `tap`, `memoize`, and more |
| **Tree-shakeable** | Import only what you need — each module is a separate subpath export |
| **TypeScript-first** | Full type declarations for every function |

## Modules

| Subpath | Contents |
|---------|----------|
| **.** (barrel) | deepClone, deepMerge, debounce, memoize, pipe, compose, once, noop, identity |
| **./core** | Identical to barrel — deepClone, deepMerge, deepEqual, debounce, throttle, memoize, retry, pipe, compose, once, noop, identity |
| **./math** | add, sub, mul, div, round, clamp, sum, average, median, stddev, percentile, correlation, randomInt, gcd, lcm, factorial, isPrime, lerp, range, combinations, permutations |
| **./date** | formatDate, parseDate, dateDiff, addDays, addMonths, addYears, timeAgo, timeRemaining, formatDuration, isWeekend, isBusinessDay, calculateAge, toTimezone, daysInMonth, dayOfYear, weekOfYear, and more |
| **./string** | camelCase, kebabCase, snakeCase, pascalCase, slugify, uuid, nanoid, truncate, template, capitalize, levenshtein, fuzzyMatch, escapeHtml, pluralize, formatBytes, randomString |
| **./async** | sleep, timeout, parallelMap, retryAsync, pipeline, deferred, Queue, Semaphore, RateLimiter, Mutex, memoizeAsync, batch, waterfall |
| **./validation** | isEmail, isPhone, isURL |
| **./collection** | groupBy, keyBy, sortBy, orderBy, topoSort, shuffle, chunk, flatten, uniq, deepGet, deepSet, omit, pick, partition, zip, unzip, countBy, diff, mergeWith |
| **./crypto** | hash, simpleHash, randomHex, base64Encode, base64Decode, generateToken, generateOTP, checksum, constantTimeEqual |
| **./path** | join, resolve, basename, dirname, extname, normalize, isAbsolute, relative, parse, format |
| **./color** | hexToRgb, rgbToHex, hexToHsl, hslToHex, lighten, darken, mix, contrastRatio, meetsWCAG, complementary, randomColor, alpha |
| **./error** | createError, isTypedError, TypedError, MultiError, collectErrors |
| **./logger** | Logger class, consoleTransport, createConsoleTransport, createJsonTransport, createFileTransport, createBufferedTransport |
| **./io** | parseCsv, stringifyCsv, safeJsonParse, env, envInt, envBool |
| **./type** | 18 type guards: isString, isNumber, isObject, isArray, isFunction, isDate, isNil, isEmpty, assertDefined, getType, and more |
| **./nlarray** | `NDArray` class — NumPy-like array operations with broadcasting, slicing, reshaping, ufuncs |
| **./nlfunction** | Functional programming: curry, partial, partialRight, tap, trace, memoizeSync, memoizeLast, negate, before, id, constant, over, apply, comparing, wrapArray |
| **./dep-exray** | Dependency scanner: scanProject, analyzeUsage, generateReport |

## Quick Start

```typescript
import { deepClone } from 'speexjs-core'
import { formatDate, timeAgo } from 'speexjs-core/date'
import { NDArray } from 'speexjs-core/nlarray'
import { curry, pipe } from 'speexjs-core/nlfunction'
import { isEmail, isPhone, isURL } from 'speexjs-core/validation'

// NDArray — NumPy-style multi-dimensional arrays
const arr = NDArray.arange(12).reshape([3, 4])
const sum = arr.sum(1) // sum along axis 1
// arr:       [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]]
// sum(1):    [6, 22, 38]

// Broadcasting
const a = NDArray.arange(3).reshape([1, 3]) // [[0, 1, 2]]
const b = NDArray.arange(3).reshape([3, 1]) // [[0], [1], [2]]
const c = a.add(b) // shape [3, 3]

// Functional programming
const add = curry((a: number, b: number) => a + b)
add(1)(2) // 3

const process = pipe(
  (x: number) => x + 1,
  (x: number) => x * 2
)
process(5) // 12

// Date & time
timeAgo(new Date(Date.now() - 5000))   // "5 seconds ago"
formatDate(new Date(), 'YYYY-MM-DD')   // "2026-06-29"

// Validation
isEmail('user@example.com')            // true
isPhone('+14155552671')                // true
isURL('https://example.com')           // true

// Deep clone & merge
const cloned = deepClone({ a: 1, b: { c: 2 } })
```

## Documentation

📖 [Full module reference →](./SUMMARY.md)

---

MIT
