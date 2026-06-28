# speexjs-core

**Utility library — 200+ functions, zero dependencies.**

```bash
npm install speexjs-core
```

## Modules

| Module | Isi |
|--------|-----|
| **core** | deepClone, deepMerge, debounce, memoize, pipe |
| **math** | Safe float ops, median, stddev, percentile |
| **date** | formatDate, timeAgo, Duration, WIB/WITA/WIT |
| **string** | terbilang, formatRupiah, slugify, uuid, nanoid |
| **validation** | isNIK, isNPWP, isPhone, isKodepos, isPlatNomor |
| **async** | Queue, Semaphore, retryAsync, memoizeAsync |
| **crypto** | hash, generateToken, generateOTP, base64 |
| **collection** | groupBy, sortBy, topoSort, deepGet, deepSet |
| **color** | hexToRgb, lighten, darken, contrastRatio |
| **error** | TypedError, createError, MultiError |
| **logger** | Logger class, console/JSON/file transports |
| **io** | parseCsv, stringifyCsv, safeJsonParse |
| **type** | 20+ type guards: isString, isNil, assertDefined |

## Contoh

```typescript
import { deepClone } from 'speexjs-core'
import { formatDate, timeAgo } from 'speexjs-core/date'
import { terbilang, formatRupiah } from 'speexjs-core/string'
import { isNIK, isNPWP, isPhone } from 'speexjs-core/validation'

isNIK('3201010203940001')       // true
isPhone('08123456789')           // true
terbilang(1500000)               // "satu juta lima ratus ribu"
formatRupiah(1500000)            // "Rp1.500.000"
timeAgo(new Date(Date.now() - 5000)) // "5 detik yang lalu"
```

📖 [Dokumentasi lengkap →](./SUMMARY.md)

---

MIT
