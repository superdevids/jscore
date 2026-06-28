# superjs-core — Complete Feature Summary

> **Version:** 0.3.5 | **License:** MIT | **Zero runtime dependencies**

```
npm install superjs-core
```

---

## 1. CORE — Utility Functions

| Function | Description |
|----------|-------------|
| `deepClone(value)` | Deep clone with circular reference, Date, RegExp, Map, Set support |
| `deepMerge(...objects)` | Deep merge multiple objects, nested overwrite |
| `debounce(fn, wait, options?)` | Debounce with leading/trailing/maxWait |
| `throttle(fn, wait)` | Throttle execution |
| `memoize(fn, resolver?)` | Memoize with custom cache key |
| `retry(fn, options?)` | Retry async with exponential backoff |
| `noop()` | No-operation function |
| `identity(value)` | Returns input unchanged |
| `once(fn)` | Run function only once |

---

## 2. MATH

| Function | Description |
|----------|-------------|
| `add(a, b)` | Safe addition (0.1+0.2=0.3) |
| `sub(a, b)` | Safe subtraction |
| `mul(a, b)` | Safe multiplication |
| `div(a, b)` | Safe division (throws on /0) |
| `round(value, precision?)` | Round with floating-point fix |
| `floor(value, precision?)` | Floor with precision |
| `ceil(value, precision?)` | Ceil with precision |
| `clamp(value, min, max)` | Clamp to range |
| `sum(values)` | Sum of array |
| `average(values)` | Average (throws if empty) |
| `randomInt(min, max)` | Random integer in range |
| `inRange(value, min, max)` | Check if in range |
| `median(values)` | Median of array |
| `stddev(values)` | Population standard deviation |
| `sampleStddev(values)` | Sample standard deviation |
| `percentile(values, p)` | Percentile (0-100) |
| `correlation(x, y)` | Pearson correlation |
| `formatCurrency(value, options?)` | Locale-aware currency formatting |

---

## 3. DATE & TIME

| Function | Description |
|----------|-------------|
| `formatDate(date, format?)` | Date formatting (YYYY-MM-DD, etc) |
| `parseDate(input)` | Parse string/number/Date |
| `dateDiff(date1, date2)` | Difference between dates |
| `addDays(date, days)` | Add/subtract days |
| `addMonths(date, months)` | Add/subtract months |
| `addYears(date, years)` | Add/subtract years |
| `startOfDay(date)` | Start of day (00:00:00.000) |
| `endOfDay(date)` | End of day (23:59:59.999) |
| `startOfMonth(date)` | First day of month |
| `endOfMonth(date)` | Last day of month |
| `startOfYear(date)` | Jan 1 00:00:00.000 |
| `endOfYear(date)` | Dec 31 23:59:59.999 |
| `isWeekend(date)` | Saturday or Sunday |
| `isLeapYear(year)` | Leap year check |
| `isBefore(date1, date2)` | Date comparison |
| `isAfter(date1, date2)` | Date comparison |
| `isBetween(date, start, end)` | Date range check |
| `isBusinessDay(date)` | Monday-Friday |
| `addBusinessDays(date, days)` | Add business days |
| `calculateAge(birthDate)` | Age in years |
| `timeAgo(date, options?)` | Relative time ("5 detik yang lalu") |
| `timeRemaining(target, options?)` | Time until future date |
| `formatDuration(duration, options?)` | Format Duration object |
| `toTimezone(date, offsetHours)` | Shift date to timezone |
| `formatInTimezone(date, format, offset)` | Format in timezone |

### Constants: `TIMEZONE_WIB` (7), `TIMEZONE_WITA` (8), `TIMEZONE_WIT` (9)

---

## 4. COLLECTION — Array & Object Utilities

| Function | Description |
|----------|-------------|
| `groupBy(items, keyFn)` | Group by key |
| `keyBy(items, keyFn)` | Index by key |
| `omit(obj, keys)` | Exclude keys |
| `pick(obj, keys)` | Select keys |
| `pluck(items, key)` | Extract property |
| `shuffle(items)` | Fisher-Yates shuffle |
| `sample(items)` | Random element |
| `sampleSize(items, size)` | N random elements |
| `chunk(items, size)` | Split into chunks |
| `sortBy(items, ...criteria)` | Multi-criteria sort |
| `orderBy(items, key, dir?)` | Sort by key + direction |
| `uniqueBy(items, keyFn)` | Unique by key function |
| `flatten(items)` | Flatten one level |
| `uniq(items)` | Remove duplicates |
| `first(items)` | First element |
| `last(items)` | Last element |
| `isEmpty(value)` | Empty check |
| `topoSort(items)` | Topological sort (Kahn's algorithm) |
| `slidingWindows(items, size, step?)` | Overlapping windows |
| `tumblingWindows(items, size)` | Non-overlapping chunks |

---

## 5. STRING — Text Manipulation

| Function | Description |
|----------|-------------|
| `capitalize(str)` | Capitalize first letter |
| `camelCase(str)` | Convert to camelCase |
| `kebabCase(str)` | Convert to kebab-case |
| `snakeCase(str)` | Convert to snake_case |
| `pascalCase(str)` | Convert to PascalCase |
| `truncate(str, max, suffix?)` | Truncate with suffix |
| `template(str, data)` | String interpolation `{{key}}` |
| `uuid()` | RFC 4122 v4 UUID |
| `nanoid(size?, alphabet?)` | URL-safe random ID |
| `escapeHtml(str)` | Escape HTML entities |
| `unescapeHtml(str)` | Unescape HTML entities |
| `trim(str)` | Trim whitespace |
| `trimStart(str)` | Trim leading |
| `trimEnd(str)` | Trim trailing |
| `pad(str, length, char?)` | Pad both sides |
| `padStart(str, length, char?)` | Pad start |
| `padEnd(str, length, char?)` | Pad end |
| `reverse(str)` | Reverse string |
| `words(str)` | Split into words |
| `slugify(str)` | URL-friendly slug |
| `countOccurrences(str, sub)` | Count substring occurrences |
| `levenshtein(a, b)` | Levenshtein distance |
| `fuzzyMatch(str, query)` | Fuzzy string match |
| `maskString(str, options?)` | Mask for data compliance |

### 🇮🇩 Indonesian Locale

| Function | Description |
|----------|-------------|
| `terbilang(value)` | Angka ke kata ("satu juta lima ratus ribu") |
| `formatRupiah(value, options?)` | Format Rupiah ("Rp1.500.000") |

---

## 6. ASYNC — Async/Await Utilities

| Function | Description |
|----------|-------------|
| `sleep(ms)` | Delay execution |
| `timeout(promise, ms)` | Reject if not resolved in time |
| `raceWithTimeout(promise, ms)` | Race promise vs timeout |
| `allSettledMap(items, fn)` | Map with allSettled |
| `parallelMap(items, fn, concurrency?)` | Concurrent map with limit |
| `retryAsync(fn, options?)` | Retry with backoff |
| `pipeline(initial, ...fns)` | Async function composition |
| `deferred()` | Deferred promise |
| `Queue(options?)` | Priority task queue with concurrency |
| `Semaphore(concurrency)` | Semaphore for resource control |
| `memoizeAsync(fn, options?)` | Async memoize with TTL + SWR |

---

## 7. IO — Input/Output

| Function | Description |
|----------|-------------|
| `parseCsv(input, options?)` | Parse CSV string |
| `stringifyCsv(data, options?)` | Convert records to CSV |
| `safeJsonParse(input, default?)` | Safe JSON parse |
| `env(name, default?)` | Read environment variable |
| `envInt(name, default?)` | Read env var as integer |
| `envBool(name, default?)` | Read env var as boolean |

---

## 8. TYPE — Type Guards

| Function | Description |
|----------|-------------|
| `isString`, `isNumber`, `isBoolean`, `isObject`, `isArray`, `isFunction` | Type checks |
| `isDate`, `isRegExp`, `isMap`, `isSet`, `isPromise` | Instance checks |
| `isNull`, `isUndefined`, `isNil` | Nullish checks |
| `isEmpty(value)` | Empty/blank check |
| `assertDefined(value, msg?)` | Runtime assertion |
| `assertType(value, guard, msg?)` | Type assertion |
| `ensureArray(value)` / `castArray(value)` | Wrap in array |
| `getType(value)` | String type name |

---

## 9. CRYPTO

| Function | Description |
|----------|-------------|
| `hash(str)` | djb2 hash (32-bit) |
| `simpleHash(str)` | Simple hex hash |
| `randomHex(size?)` | Random hex string |
| `base64Encode(str)` | Base64 encode (UTF-8 safe) |
| `base64Decode(str)` | Base64 decode |
| `generateToken(bytes?)` | Crypto-random hex token |
| `generateOTP(length?)` | Numeric OTP |
| `xorCipher(str, key)` | ⚠️ XOR obfuscation (NOT encryption) |
| `checksum(input)` | CRC-like checksum |
| `constantTimeEqual(a, b)` | Timing-safe string comparison |

---

## 10. PATH

| Function | Description |
|----------|-------------|
| `join(...segments)` | Join path segments |
| `resolve(...segments)` | Resolve to absolute path |
| `basename(p, ext?)` | Get filename |
| `dirname(p)` | Get directory |
| `extname(p)` | Get extension |
| `normalize(p)` | Normalize path |
| `isAbsolute(p)` | Check if absolute |
| `relative(from, to)` | Relative path |
| `parse(p)` | Parse path into components |
| `format(parsed)` | Format parsed path |

---

## 11. VALIDATION — 🇮🇩 Indonesia-Specific

| Function | Description |
|----------|-------------|
| `isNIK(value)` | Validasi NIK 16 digit + tanggal lahir |
| `isNPWP(value)` | Validasi NPWP + checksum |
| `isPhone(value, country?)` | Validasi nomor telepon Indonesia |
| `isEmail(value)` | RFC-compliant email validation |
| `isURL(value)` | URL validation (http/https only) |

---

## 12. ERROR — Typed Errors

| Function | Description |
|----------|-------------|
| `createError(code, message, options?)` | Create typed error with HTTP status |
| `isTypedError(error)` | Type guard |
| `TypedError` | Class with code + status + details + toJSON |
| `MultiError` | Collect multiple errors |
| `collectErrors(fn)` | Run function, collect thrown errors |

### Error Codes: `BAD_REQUEST` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `VALIDATION_ERROR` (422), `TOO_MANY` (429), `INTERNAL` (500), `BAD_GATEWAY` (502), `UNAVAILABLE` (503)

---

## 13. LOGGER — Structured Logging

| Function | Description |
|----------|-------------|
| `Logger(options?)` | Structured logger with levels |
| `logger` | Default singleton (info level) |
| `createConsoleTransport(options?)` | Colored console output |
| `createJsonTransport(options?)` | JSON-line output |
| `createFileTransport(filename, options?)` | File appender |
| `createBufferedTransport(transport, options?)` | Batched transport |

### Log Levels: `debug`, `info`, `warn`, `error`

---

## 14. DEP-EXRAY — Dependency Health Scanner

| Function | Description |
|----------|-------------|
| `scanProject(config)` | Scan project for bloat + security issues |
| `generateReport(result, json?)` | Generate scan report |
| `analyzeUsage(projectPath, packageName)` | Detect dependency usage |
| `KNOWN_MAPPINGS` | 11 known replacement mappings |
| `KNOWN_CVES` | CVE database for known packages |

**CLI:** `npx dep-exray .`

---

## Test Stats

| File | Tests |
|------|-------|
| core.test.ts | 49 |
| math.test.ts | 47 |
| date.test.ts | 63 |
| collection.test.ts | 50 |
| string.test.ts | 37 |
| async.test.ts | 33 |
| io.test.ts | 24 |
| type.test.ts | 67 |
| crypto.test.ts | 33 |
| path.test.ts | 43 |
| scanner.test.ts | 8 |
| analyzer.test.ts | 10 |
| reporter.test.ts | 10 |
| known-mappings.test.ts | 11 |
| validation.test.ts | 28 |
| error.test.ts | 22 |
| brutal.test.ts | 273 |
| **TOTAL** | **757** |

## Quick Reference

```bash
npm install superjs-core

# Subpath imports
import { deepClone } from 'superjs-core'
import { formatDate } from 'superjs-core/date'
import { groupBy } from 'superjs-core/collection'
import { isNIK } from 'superjs-core/validation'
import { createError } from 'superjs-core/error'
import { Logger } from 'superjs-core/logger'
import { scanProject } from 'superjs-core/dep-exray'
import { formatRupiah } from 'superjs-core/string'
```
