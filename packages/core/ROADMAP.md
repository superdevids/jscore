# Roadmap — SpeexJS Core

## ✅ Completed (v0.7.0)

- **validation** — `isNIK()`, `parseNIK()`, `isNPWP()`, `isPlatNomor()`, `isPhone()`, `isKodepos()`, `isNoRekening()`, `isEmail()`, `isURL()`
- **color** — `hexToRgb()`, `rgbToHex()`, `lighten()`, `darken()`, `contrastRatio()`, `meetsWCAG()`
- **error** — `createError()`, `TypedError`, `MultiError`, `collectErrors()`
- **logger** — Structured logger, child loggers, file transport
- **async** — `Queue()`, `Semaphore`, `memoizeAsync()`
- **math** — `median()`, `stddev()`, `percentile()`, `correlation()`, `formatCurrency()`
- **string** — `terbilang()`, `formatRupiah()`, `maskString()`, `levenshtein()`, `fuzzyMatch()`
- **date** — `timeAgo()`, `Duration`, `formatDuration()`, timezone helpers, WIB/WITA/WIT
- **collection** — `topoSort()`, `slidingWindows()`, `deepGet()`, `deepSet()`
- **crypto** — `hash()`, `randomHex()`, `generateToken()`, `generateOTP()`, `base64`
- **dep-exray** — Dependency health scanner + CLI
- **828+ tests** — 19 test files

## 🔜 Next (v0.8.0)

- **validation** — `isEmail()` detail check, `isURL()` strict mode
- **io** — `parseJSONL()`, streaming CSV parser
- **crypto** — AES-GCM encrypt/decrypt, HMAC signing
- TypeDoc API documentation
- Benchmark suite vs lodash/moment/dayjs

## 🔜 v0.9.0

- **signal** — Reactive primitives: `signal()`, `computed()`, `effect()` — framework-agnostic
- **ml** — `cosineSimilarity()`, confusion matrix, F1 score, k-means
- **crypto** — JWT lite untuk edge runtime
- **type** — Schema validation lite

## 💡 Future (v1.0.0+)

- API freeze — no breaking changes
- Dependabot + Renovate
- Co-maintainer onboarding
- VS Code extension
