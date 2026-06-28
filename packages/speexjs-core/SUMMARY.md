# speexjs-core — Module Reference

> **Version:** 0.7.0 | **License:** MIT | **Zero runtime dependencies**

```
npm install speexjs-core
```

## Module Index

| Subpath Export | Module |
|----------------|--------|
| `.` / `./core` | Core utilities (barrel + deep utilities) |
| `./math` | Mathematics & statistics |
| `./date` | Date/time formatting & manipulation |
| `./string` | String transformations, UUID, slug |
| `./async` | Async concurrency primitives |
| `./validation` | Email, phone, URL validation |
| `./collection` | Object & array manipulation |
| `./crypto` | Hashing, tokens, encoding |
| `./path` | File path utilities |
| `./color` | Color conversion & manipulation |
| `./error` | Typed errors & multi-error |
| `./logger` | Structured logging with transports |
| `./io` | CSV parsing, JSON, environment |
| `./type` | Type guards & assertions |
| `./nlarray` | NDArray — NumPy-like arrays |
| `./nlfunction` | Functional programming toolkit |
| `./dep-exray` | Dependency analyzer & scanner |

---

## `speexjs-core` (barrel) & `speexjs-core/core`

**Entry point.** Re-exports core and all module functions.

```
import { deepClone, pipe, memoize, retry } from 'speexjs-core'
import { deepClone, deepEqual, throttle } from 'speexjs-core/core'
```

| Function | Description |
|----------|-------------|
| `deepClone` | Deep clone with circular reference support (Map, Set, Date, RegExp) |
| `deepEqual` | Deep equality comparison |
| `deepMerge` | Deep merge multiple objects |
| `debounce` | Debounce with leading/trailing/maxWait options |
| `throttle` | Throttle function invocation |
| `memoize` | Memoize with custom key resolver |
| `pipe` | Left-to-right function composition |
| `compose` | Right-to-left function composition |
| `retry` | Retry with exponential backoff and jitter |
| `once` | Invoke function only once |
| `noop` | No-operation function |
| `identity` | Return value unchanged |

---

## `speexjs-core/math`

**Safe floating-point math, statistics, and combinatorics.**

```
import { add, median, stddev, percentile, factorial } from 'speexjs-core/math'
```

| Function | Description |
|----------|-------------|
| `add`, `sub`, `mul`, `div` | Precise floating-point arithmetic |
| `round`, `floor`, `ceil` | Rounding with configurable precision |
| `approxEqual` | Approximate equality with epsilon |
| `clamp` | Clamp value to range |
| `sum`, `average` | Sum and arithmetic mean |
| `median`, `mode` | Median and mode |
| `stddev`, `sampleStddev` | Population and sample standard deviation |
| `percentile` | Percentile calculation |
| `correlation` | Pearson correlation coefficient |
| `weightedAverage` | Weighted mean |
| `geometricMean` | Geometric mean |
| `range` | Generate numeric range |
| `randomInt` | Random integer in range |
| `inRange` | Check if value is in range |
| `gcd`, `lcm` | Greatest common divisor, least common multiple |
| `factorial` | Factorial |
| `isPrime`, `isEven`, `isOdd` | Number predicates |
| `combinations`, `permutations` | Combinatorics |
| `lerp` | Linear interpolation |
| `mapRange` | Map value from one range to another |
| `percentageOf` | Percentage calculation |
| `toRadians`, `toDegrees` | Angle conversion |
| `formatCurrency` | Locale-aware currency formatting |

---

## `speexjs-core/date`

**Date formatting, manipulation, and business day calculations.**

```
import { formatDate, timeAgo, addDays, isBusinessDay } from 'speexjs-core/date'
```

| Function | Description |
|----------|-------------|
| `formatDate` | Format date as string (YYYY-MM-DD, etc.) |
| `parseDate` | Parse string to Date |
| `dateDiff` | Difference between two dates |
| `addDays`, `addMonths`, `addYears` | Date arithmetic |
| `startOfDay`, `endOfDay` | Day boundaries |
| `startOfMonth`, `endOfMonth` | Month boundaries |
| `startOfYear`, `endOfYear` | Year boundaries |
| `timeAgo` | Relative time ("5 seconds ago", "2 hours ago") |
| `timeRemaining` | Time until a future date |
| `formatDuration` | Format duration from milliseconds |
| `toTimezone` | Convert date to another timezone |
| `formatInTimezone` | Format date in a specific timezone |
| `isWeekend`, `isBusinessDay` | Day-of-week predicates |
| `addBusinessDays` | Add business days skipping weekends |
| `isToday`, `isYesterday`, `isTomorrow` | Day comparison |
| `isPast`, `isFuture` | Temporal predicates |
| `isBefore`, `isAfter`, `isBetween` | Date comparison |
| `isSameDay` | Check if two dates are the same day |
| `isLeapYear` | Leap year check |
| `calculateAge` | Age from birth date |
| `daysInMonth` | Number of days in a month |
| `dayOfYear`, `weekOfYear` | Ordinal day/week |
| `quarter` | Fiscal quarter |
| `maxDate`, `minDate` | Extremum dates |
| `nextMonday` … `nextSunday` | Next weekday |
| `lastMonday` … `lastSunday` | Previous weekday |
| `parseDuration` | Parse duration string to milliseconds |

---

## `speexjs-core/string`

**String transformations, UUID generation, and text utilities.**

```
import { slugify, uuid, nanoid, truncate } from 'speexjs-core/string'
```

| Function | Description |
|----------|-------------|
| `capitalize` | Capitalize first character |
| `camelCase`, `kebabCase`, `snakeCase`, `pascalCase` | Case conversion |
| `truncate`, `truncateWords` | Truncate with ellipsis |
| `template` | String template interpolation |
| `uuid` | RFC 4122 v4 UUID |
| `nanoid` | URL-safe unique ID |
| `slugify` | URL-friendly slug |
| `escapeHtml`, `unescapeHtml` | HTML entity encoding |
| `levenshtein` | Levenshtein distance |
| `fuzzyMatch` | Fuzzy string matching |
| `maskString` | Mask portions of a string |
| `formatBytes` | Format byte size (KB, MB, GB) |
| `randomString`, `randomBoolean` | Random generation |
| `pluralize` | Simple English pluralization |
| `stripHtml` | Strip HTML tags |
| `isPalindrome` | Palindrome check |
| `isAnagram` | Anagram check |
| `similarity` | String similarity score |
| `wordCount`, `charCount` | Count words / characters |
| `countOccurrences` | Count substring occurrences |
| `dedent` | Remove leading whitespace |
| `trim`, `trimStart`, `trimEnd` | Whitespace trimming |
| `pad`, `padStart`, `padEnd` | String padding |
| `reverse` | Reverse string |
| `words` | Split into words |
| `swapCase` | Swap character case |
| `toCobolCase` | Convert to COBOL-style case |

---

## `speexjs-core/async`

**Async concurrency primitives — queues, semaphores, rate limiters, and parallel execution.**

```
import { Queue, Semaphore, retryAsync, parallelMap } from 'speexjs-core/async'
```

| Function | Description |
|----------|-------------|
| `sleep` | Delay execution (ms) |
| `timeout` | Reject promise if not resolved within ms |
| `raceWithTimeout` | Race promise with a timeout signal |
| `parallelMap` | Concurrent async map with concurrency limit |
| `allSettledMap` | Async map with allSettled |
| `retryAsync` | Retry with exponential backoff |
| `pipeline` | Compose async functions |
| `deferred` | Create a deferred promise |
| `Queue` | Async task queue with concurrency control |
| `Semaphore` | Counting semaphore |
| `RateLimiter` | Token-bucket rate limiter |
| `Mutex` | Mutual exclusion lock |
| `memoizeAsync` | Memoize async functions with TTL |
| `batch` | Batch items and process in groups |
| `waterfall` | Sequential async task execution |

---

## `speexjs-core/validation`

**Input validation utilities.**

```
import { isEmail, isPhone, isURL } from 'speexjs-core/validation'
```

| Function | Description |
|----------|-------------|
| `isEmail` | Validate email address |
| `isPhone` | Validate phone number (E.164 format) |
| `isURL` | Validate URL |

---

## `speexjs-core/collection`

**Object and array manipulation — lodash-style utilities.**

```
import { groupBy, topoSort, deepGet, deepSet, shuffle } from 'speexjs-core/collection'
```

| Function | Description |
|----------|-------------|
| `groupBy`, `keyBy`, `countBy` | Grouping & indexing |
| `sortBy`, `orderBy` | Sorting |
| `topoSort` | Topological sort |
| `shuffle`, `sample`, `sampleSize` | Random selection |
| `chunk`, `flatten`, `compact` | Array reshaping |
| `uniq`, `uniqueBy` | Deduplication |
| `partition` | Split array by predicate |
| `difference`, `intersection`, `union` | Set operations |
| `zip`, `unzip` | Array transposition |
| `first`, `last`, `nth` | Element access |
| `drop`, `dropRight`, `take`, `takeRight` | Slicing |
| `without` | Remove values |
| `findIndex`, `findLast` | Search |
| `sumBy`, `maxBy`, `minBy` | Aggregation |
| `deepGet`, `deepSet`, `hasPath`, `unset` | Deep object access |
| `omit`, `pick`, `omitBy`, `pickBy` | Property selection |
| `mapKeys`, `mapValues`, `renameKeys` | Key/value mapping |
| `invert`, `invertBy` | Key/value inversion |
| `toPairs`, `fromPairs` | Object ↔ entries |
| `mergeWith`, `defaults`, `defaultsDeep` | Object merging |
| `deepFreeze` | Deep freeze object |
| `diff` | Deep object diff |
| `fromKeys` | Create object from keys |
| `at` | Nested property access |
| `pluck` | Extract property from array of objects |
| `isEmpty` | Check if value is empty |
| `slidingWindows`, `tumblingWindows` | Windowed iteration |

---

## `speexjs-core/crypto`

**Hashing, token generation, and encoding utilities.**

```
import { generateToken, base64Encode, simpleHash } from 'speexjs-core/crypto'
```

| Function | Description |
|----------|-------------|
| `hash` | Fast djb2 hash (non-cryptographic) |
| `simpleHash` | Deterministic hex hash (for cache keys) |
| `randomHex` | Cryptographically random hex string |
| `base64Encode`, `base64Decode` | Base64 encoding |
| `generateToken` | Secure random token |
| `generateOTP` | Numeric one-time password |
| `checksum` | Simple data checksum |
| `constantTimeEqual` | Constant-time string comparison |
| `xorCipher` | XOR cipher (⚠️ not for security) |

---

## `speexjs-core/path`

**File path manipulation (cross-platform).**

```
import { join, resolve, extname, basename } from 'speexjs-core/path'
```

| Function | Description |
|----------|-------------|
| `join` | Join path segments |
| `resolve` | Resolve to absolute path |
| `basename` | File name from path |
| `dirname` | Directory from path |
| `extname` | File extension |
| `normalize` | Normalize path separators |
| `isAbsolute` | Check if path is absolute |
| `relative` | Relative path between two paths |
| `parse` | Parse path to components |
| `format` | Format components to path string |

---

## `speexjs-core/color`

**Color conversion, manipulation, and accessibility.**

```
import { hexToRgb, lighten, contrastRatio, meetsWCAG } from 'speexjs-core/color'
```

| Function | Description |
|----------|-------------|
| `hexToRgb`, `rgbToHex` | Hex ↔ RGB conversion |
| `hexToHsl`, `hslToHex` | HSL ↔ Hex conversion |
| `lighten`, `darken` | Lighten / darken a color |
| `mix` | Blend two colors |
| `contrastRatio` | WCAG contrast ratio |
| `meetsWCAG` | Check WCAG AA/AAA compliance |
| `isValidHex` | Validate hex color string |
| `complementary` | Complementary color |
| `randomColor` | Generate random color |
| `isLight`, `isDark` | Luminance classification |
| `alpha` | Set alpha channel |

---

## `speexjs-core/error`

**Typed error creation and multi-error aggregation.**

```
import { createError, TypedError, MultiError } from 'speexjs-core/error'
```

| Function | Description |
|----------|-------------|
| `createError(name, code, httpStatus)` | Create typed error class |
| `isTypedError(error, code)` | Check error code |
| `TypedError` | Base typed error class |
| `MultiError` | Aggregate multiple errors |
| `collectErrors` | Collect errors from array of results |

---

## `speexjs-core/logger`

**Structured logging with pluggable transports.**

```
import { Logger, consoleTransport } from 'speexjs-core/logger'
```

| Export | Description |
|--------|-------------|
| `Logger` | Configurable logger class (levels: debug, info, warn, error) |
| `logger` | Pre-configured default logger instance |
| `consoleTransport` | Default console transport |
| `createConsoleTransport()` | Create console transport with options |
| `createJsonTransport()` | JSON-formatted transport |
| `createFileTransport()` | File-based transport |
| `createBufferedTransport()` | Buffered transport (batched writes) |

---

## `speexjs-core/io`

**CSV parsing, JSON safety, and environment variable access.**

```
import { parseCsv, safeJsonParse, env } from 'speexjs-core/io'
```

| Function | Description |
|----------|-------------|
| `parseCsv` | Parse CSV string to array of records |
| `stringifyCsv` | Convert records to CSV string |
| `safeJsonParse` | JSON.parse without throwing |
| `env` | Get environment variable |
| `envInt` | Get environment variable as integer |
| `envBool` | Get environment variable as boolean |

---

## `speexjs-core/type`

**Type guards and type assertions for TypeScript.**

```
import { isString, isNil, assertDefined, getType } from 'speexjs-core/type'
```

| Function | Description |
|----------|-------------|
| `isString`, `isNumber`, `isBoolean` | Primitive type checks |
| `isObject`, `isArray`, `isFunction` | Object type checks |
| `isDate`, `isRegExp`, `isMap`, `isSet` | Instance checks |
| `isPromise` | Promise check |
| `isNull`, `isUndefined`, `isNil` | Nullish checks |
| `assertDefined` | TypeScript assertion (throws if nil) |
| `assertType` | Runtime type assertion |
| `ensureArray` | Wrap in array if not array |
| `castArray` | Alias for ensureArray |
| `getType` | Get internal `[[Class]]` tag |

---

## `speexjs-core/nlarray`

**NumPy-style multi-dimensional array for JavaScript/TypeScript. Pure functions, zero dependencies.**

```
import { NDArray } from 'speexjs-core/nlarray'
```

### NDArray Static Methods

| Method | Description |
|--------|-------------|
| `NDArray.from(shape, fn)` | Create from a shape and initializer function |
| `NDArray.zeros(shape)` | Array filled with 0 |
| `NDArray.ones(shape)` | Array filled with 1 |
| `NDArray.full(shape, value)` | Array filled with a constant |
| `NDArray.arange(start, stop?, step?)` | Linearly spaced values |
| `NDArray.linspace(start, stop, num)` | Evenly spaced values |
| `NDArray.eye(n)` | Identity matrix |
| `NDArray.random(shape)` | Array of random floats [0, 1) |
| `NDArray.concatenate(arrays, axis)` | Join arrays along an axis |
| `NDArray.stack(arrays, axis)` | Stack arrays along new axis |
| `NDArray.hstack(arrays)` | Horizontal (column-wise) stack |
| `NDArray.vstack(arrays)` | Vertical (row-wise) stack |

### NDArray Instance Methods

| Method | Description |
|--------|-------------|
| `.shape` | Shape tuple |
| `.ndim` | Number of dimensions |
| `.size` | Total number of elements |
| `.data` | Flat data array |
| `.get(...indices)` | Get value at indices |
| `.set(indices, value)` | Set value at indices |
| `.reshape(...dims)` | Reshape to new dimensions |
| `.transpose()` | Transpose (reverse axes) |
| `.T` | Transpose property |
| `.slice(...slices)` | Slice array (NumPy-style) |
| `.flatten()` | Flatten to 1-D |
| `.squeeze()` | Remove dimensions of size 1 |
| `.expandDims(axis)` | Insert a new dimension |
| `.repeat(count, axis?)` | Repeat elements |
| `.copy()` | Deep copy |
| `.fill(value)` | Fill with value |
| `.map(fn)` | Element-wise map |
| `.apply(fn)` | Apply function along axis |
| `.sum(axis?)` | Sum along axis |
| `.mean(axis?)` | Mean along axis |
| `.min(axis?)`, `.max(axis?)` | Min / max along axis |
| `.argmin(axis?)`, `.argmax(axis?)` | Index of min / max |
| `.std(axis?)` | Standard deviation along axis |
| `.equals(other)` | Shape and value equality |
| `.add(other)`, `.sub(other)`, `.mul(other)`, `.div(other)` | Arithmetic |
| `.pow(exponent)` | Exponentiation |
| `.mod(divisor)` | Modulo |
| `.abs()` | Absolute value |
| `.neg()` | Negation |
| `.clip(min, max)` | Clip values |
| `.round()` | Round elements |
| `.dot(other)` | Dot product |
| `.matmul(other)` | Matrix multiplication |
| `.norm(order?)` | Matrix or vector norm |
| `.transposeAxes(axes)` | Permute axes |
| `.swapAxes(i, j)` | Swap two axes |
| `.pad(padWidth, mode?)` | Pad array edges |
| `.cumsum(axis?)` | Cumulative sum |
| `.cumprod(axis?)` | Cumulative product |
| `.all(axis?)` | Test if all elements are truthy |
| `.any(axis?)` | Test if any element is truthy |
| `.nonzero()` | Indices of non-zero elements |
| `.diagonal(offset?)` | Diagonal of a matrix |
| `.trace(offset?)` | Sum of diagonal elements |

### Standalone Ufuncs

```
import { sin, cos, exp, log, sqrt } from 'speexjs-core/nlarray'
```

| Function | Description |
|----------|-------------|
| `sin(arr)` | Element-wise sine |
| `cos(arr)` | Element-wise cosine |
| `exp(arr)` | Element-wise exponential (eˣ) |
| `log(arr)` | Element-wise natural logarithm |
| `sqrt(arr)` | Element-wise square root |

---

## `speexjs-core/nlfunction`

**Functional programming toolkit — curry, pipelines, memoization, and combinators (Ramda / lodash-fp style).**

```
import { curry, pipe, tap, memoizeSync, compose, partial } from 'speexjs-core/nlfunction'
```

| Function | Description |
|----------|-------------|
| `curry(fn, arity?)` | Curry a function (lodash-style) |
| `partial(fn, ...args)` | Left-to-right partial application |
| `partialRight(fn, ...args)` | Right-to-left partial application |
| `tap(fn)` | Side-effect wrapper for pipelines |
| `trace(message?)` | Debug logging for pipelines |
| `memoizeSync(fn, resolver?, maxSize?)` | LRU memoization |
| `memoizeLast(fn)` | Cache only the last result |
| `negate(predicate)` | Negate a predicate |
| `before(n, fn)` | Limit calls to N |
| `id(value)` | Identity function |
| `constant(value)` | Always return value |
| `over(fns)` | Apply args to multiple functions |
| `apply(fn)` | Apply function to value |
| `comparing(fn)` | Create comparator from transform |
| `wrapArray(value)` | Wrap in array if not array |
| `debounce(fn, wait, leading?)` | Debounce (re-exported from core) |
| `throttle(fn, wait)` | Throttle (re-exported from core) |
| `once(fn)` | Invoke only once (re-exported from core) |

---

## `speexjs-core/dep-exray`

**Dependency scanner — analyze project dependencies for bloat, security issues, and replacement suggestions.**

```
import { scanProject, generateReport } from 'speexjs-core/dep-exray'
```

| Function | Description |
|----------|-------------|
| `scanProject(root?)` | Scan project for dependency issues |
| `analyzeUsage(result)` | Analyze dependency usage patterns |
| `generateReport(result)` | Generate a human-readable report |

```bash
# Also available as a CLI
npx dep-exray .
```

---

## Test Statistics

| Total Files | Total Tests |
|-------------|-------------|
| 19 | **828+** ✅ |
