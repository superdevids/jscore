# Roadmap — SpeexJS Core

## ✅ Completed (v0.8.0)

- **nlarray** — NumPy-like NDArray with 60+ methods (zeros, ones, arange, linspace, reshape, broadcasting, matmul, transpose, slice, concatenate, axis-aware sum/mean/var/std, etc.)
- **nlfunction** — Functional programming toolkit (curry, partial, partialRight, tap, trace, memoizeSync, negate, before, wrapArray, constant, over, comparing, memoizeLast)
- **collection** — 18 new object/dictionary operations (pickBy, omitBy, mapKeys, mapValues, invert, invertBy, toPairs, fromPairs, hasPath, unset, mergeWith, defaults, defaultsDeep, deepFreeze, at, renameKeys, diff, fromKeys)
- **validation** — Cleaned up: removed Indonesia-specific validators, kept global (isEmail, isURL, isPhone)
- **string** — Removed terbilang()/formatRupiah(); kept 40+ string utilities
- **date** — Removed Indonesia holiday/timezone constants; timeAgo/timeRemaining now default to 'en' locale

## ✅ Completed (v0.7.0)

- **color** — hexToRgb(), rgbToHex(), lighten(), darken(), contrastRatio(), meetsWCAG()
- **error** — createError(), TypedError(), MultiError(), collectErrors()
- **logger** — Structured logger, child loggers, file transport
- **async** — Queue(), Semaphore, memoizeAsync()
- **math** — median(), stddev(), percentile(), correlation(), formatCurrency()
- **string** — levenshtein(), fuzzyMatch(), maskString(), formatBytes(), randomString(), pluralize()
- **date** — timeAgo(), timeRemaining(), Duration, formatDuration(), toTimezone(), formatInTimezone()
- **collection** — topoSort(), slidingWindows(), deepGet(), deepSet()
- **crypto** — hash(), randomHex(), generateToken(), generateOTP(), base64
- **dep-exray** — Dependency health scanner + CLI
- **828+ tests** — 19 test files

## ✅ Completed (v0.6.0)

- **dep-exray** — scanProject(), analyzeUsage(), generateReport()
- CLI: npx dep-exray
- **crypto** — hash(), randomHex(), base64, generateToken(), generateOTP()
- **path** — join(), resolve(), basename(), dirname(), extname()

## ✅ Completed (v0.1.0)

- Initial release with 100+ utility functions
- Modules: core, math, date, collection, string, async, io, type

## 🔜 v0.9.0

- **signal** — Reactive primitives: signal(), computed(), effect() — framework-agnostic
- **ml** — cosineSimilarity(), k-means, confusion matrix, F1 score
- **crypto** — AES-GCM encrypt/decrypt
- **io** — parseJSONL(), streaming CSV parser

## 💡 v1.0.0 — API Freeze & Polish

- API freeze — no breaking changes
- TypeDoc API documentation
- Benchmark suite vs lodash/moment/dayjs
- VS Code extension
- Dependabot + Renovate
- Co-maintainer onboarding
