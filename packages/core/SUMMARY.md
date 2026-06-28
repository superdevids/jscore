# SpeexJS Core — Ringkasan Modul

> **Versi:** 0.7.0 | **License:** MIT | **Zero runtime dependencies**

```
npm install speexjs-core
```

## Daftar Modul

| Modul | Fungsi Utama |
|-------|--------------|
| **core** | `deepClone()`, `deepEqual()`, `deepMerge()`, `debounce()`, `throttle()`, `memoize()`, `pipe()`, `compose()`, `retry()`, `once()`, `noop()`, `identity()` |
| **math** | `add()`, `sub()`, `mul()`, `div()`, `round()`, `clamp()`, `sum()`, `average()`, `median()`, `stddev()`, `percentile()`, `correlation()`, `formatCurrency()`, `randomInt()`, `inRange()` |
| **date** | `formatDate()`, `parseDate()`, `dateDiff()`, `addDays()`, `addMonths()`, `timeAgo()`, `timeRemaining()`, `formatDuration()`, `toTimezone()`, `formatInTimezone()`, `isWeekend()`, `isLeapYear()`, `isBusinessDay()`, `calculateAge()` — Konstanta: WIB (7), WITA (8), WIT (9) |
| **collection** | `groupBy()`, `keyBy()`, `omit()`, `pick()`, `shuffle()`, `chunk()`, `sortBy()`, `orderBy()`, `uniq()`, `flatten()`, `topoSort()`, `slidingWindows()`, `tumblingWindows()`, `deepGet()`, `deepSet()` |
| **string** | `camelCase()`, `kebabCase()`, `snakeCase()`, `pascalCase()`, `truncate()`, `template()`, `uuid()`, `nanoid()`, `slugify()`, `escapeHtml()`, `levenshtein()`, `fuzzyMatch()`, `maskString()`, `formatBytes()`, `randomString()`, `pluralize()` — **I10N:** `terbilang()`, `formatRupiah()` |
| **async** | `sleep()`, `timeout()`, `parallelMap()`, `retryAsync()`, `pipeline()`, `deferred()`, `Queue()`, `Semaphore()`, `memoizeAsync()` |
| **io** | `parseCsv()`, `stringifyCsv()`, `safeJsonParse()`, `env()`, `envInt()`, `envBool()` |
| **type** | `isString()`, `isNumber()`, `isObject()`, `isArray()`, `isFunction()`, `isDate()`, `isNil()`, `isEmpty()`, `assertDefined()`, `ensureArray()`, `getType()` |
| **crypto** | `hash()`, `simpleHash()`, `randomHex()`, `base64Encode()`, `base64Decode()`, `generateToken()`, `generateOTP()`, `checksum()`, `constantTimeEqual()` — ⚠️ `xorCipher()` (bukan untuk keamanan) |
| **path** | `join()`, `resolve()`, `basename()`, `dirname()`, `extname()`, `normalize()`, `isAbsolute()`, `relative()`, `parse()`, `format()` |
| **color** | `hexToRgb()`, `rgbToHex()`, `lighten()`, `darken()`, `contrastRatio()`, `meetsWCAG()` |
| **validation** | `isNIK()`, `parseNIK()`, `isNPWP()`, `isPlatNomor()`, `isPhone()`, `isKodepos()`, `isNoRekening()`, `isEmail()`, `isURL()` — **Khusus Indonesia** |
| **error** | `createError()`, `isTypedError()`, `TypedError`, `MultiError`, `collectErrors()` — 10 error codes + HTTP status |
| **logger** | `Logger()`, `createConsoleTransport()`, `createJsonTransport()`, `createFileTransport()`, `createBufferedTransport()` — Level: debug, info, warn, error |
| **dep-exray** | `scanProject()`, `analyzeUsage()`, `generateReport()` — CLI: `npx dep-exray .` |

## Statistik Test

| Total Files | Total Tests |
|-------------|-------------|
| 19 | **828+** ✅ |

## Referensi Cepat

```typescript
// Import semua module
import { deepClone, deepEqual, pipe } from 'speexjs-core'
import { formatDate, timeAgo, TIMEZONE_WIB } from 'speexjs-core/date'
import { groupBy, topoSort, deepGet } from 'speexjs-core/collection'
import { terbilang, formatRupiah } from 'speexjs-core/string'
import { Queue, Semaphore } from 'speexjs-core/async'
import { isNIK, isNPWP, isPhone } from 'speexjs-core/validation'
import { createError, MultiError } from 'speexjs-core/error'
import { Logger } from 'speexjs-core/logger'
import { hexToRgb, lighten, contrastRatio } from 'speexjs-core/color'
import { median, stddev, formatCurrency } from 'speexjs-core/math'
import { scanProject } from 'speexjs-core/dep-exray'
```
