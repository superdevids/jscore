# Changelog

## [0.7.0] - 2026-06-28

### Ditambahkan
- **validation** — `parseNIK()` extract data dari NIK (gender, provinsi, tanggal lahir)
- **validation** — `isPlatNomor()` validasi plat kendaraan Indonesia
- **validation** — `isKodepos()` validasi kode pos Indonesia
- **validation** — `isNoRekening()` validasi nomor rekening bank
- **color** — `hexToRgb()`, `rgbToHex()`, `lighten()`, `darken()`, `contrastRatio()`, `meetsWCAG()`
- **core** — `deepEqual()`, `pipe()`, `compose()`
- **string** — `formatBytes()`, `randomString()`, `randomBoolean()`, `pluralize()`
- **collection** — `deepGet()`, `deepSet()`
- **async** — `Queue()`, `Semaphore`, `memoizeAsync()`
- **math** — `median()`, `stddev()`, `sampleStddev()`, `percentile()`, `correlation()`, `formatCurrency()`
- **string** — `levenshtein()`, `fuzzyMatch()`, `maskString()`, `terbilang()`, `formatRupiah()`
- **date** — `timeAgo()`, `timeRemaining()`, `Duration`, `formatDuration()`, `toTimezone()`, `formatInTimezone()`
- **validation** — `isNIK()`, `isNPWP()`, `isPhone()`, `isEmail()`, `isURL()`
- **error** — `createError()`, `TypedError`, `MultiError`, `collectErrors()`
- **logger** — `Logger` class dengan console/JSON/file transport

### Diubah
- Dokumentasi menggunakan Bahasa Indonesia
- Penambahan 828 total tests (19 test files)
- `sideEffects: false` untuk tree-shaking optimal

### Dibenerin
- `round(1.005, 2)` floating-point bug
- `parseDate('29/02/2023')` invalid leap year detection
- Prototype pollution dan ReDoS edge cases

## [0.6.0] - 2026-06-27

### Ditambahkan
- **dep-exray** — `scanProject()`, `analyzeUsage()`, `generateReport()`
- CLI: `npx dep-exray .`
- **crypto** — `hash()`, `randomHex()`, `base64`, `generateToken()`, `generateOTP()`
- **path** — `join()`, `resolve()`, `basename()`, `dirname()`, `extname()`

### Diubah
- Integrasi dep-exray sebagai module built-in
- Satu package: `npm install speexjs-core` untuk semua modul

## [0.1.0] - 2026-06-27

### Ditambahkan
- Initial release
- Modul: core, math, date, collection, string, async, io, type
- 100+ utility functions
- Full TypeScript strict mode
