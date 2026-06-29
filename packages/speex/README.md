<div align="center">

# ⚡ speexkit

**The JavaScript/TypeScript Utility Toolkit** — Zero dependencies · 19 modules · 400+ functions

[![npm version](https://img.shields.io/npm/v/speexkit?color=blue&logo=npm)](https://www.npmjs.com/package/speexkit)
[![npm downloads](https://img.shields.io/npm/dm/speexkit?color=blue)](https://www.npmjs.com/package/speexkit)
[![license](https://img.shields.io/npm/l/speexkit?color=blue)](LICENSE)
[![bundle size](https://img.shields.io/badge/bundle-358%20kB-blue)](https://www.npmjs.com/package/speexkit)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/speexkit)

```bash
npm install speexkit
```

</div>

---

## 🚀 Quick Start

```typescript
import { NDArray } from 'speexkit/nlarray'
import { StandardScaler, LinearRegression } from 'speexkit/ml'
import { normalPDF, ttestInd } from 'speexkit/stats'
import { curry, pipe } from 'speexkit/nlfunction'
import { formatDate, timeAgo } from 'speexkit/date'
import { isEmail, isStrongPassword } from 'speexkit/validation'
```

### NDArray — NumPy-style multi-dimensional arrays

```typescript
const arr = NDArray.arange(12).reshape([3, 4])
// [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]]

arr.sum(1)            // [6, 22, 38]
arr.mean(0)           // [4, 5, 6, 7]
arr.matmul(arr.T)     // matrix multiplication
```

### ML — scikit-learn style

```typescript
// StandardScaler
const scaler = new StandardScaler()
scaler.fit([[1, 2], [3, 4], [5, 6]])
const X = scaler.transform([[1, 2]]) // [[-1.22, -1.22]]

// LinearRegression
const model = new LinearRegression()
model.fit([[1], [2], [3]], [2, 4, 6])
model.predict([[4]]) // ~8

// Train/Test Split
const [Xtr, Xte, ytr, yte] = trainTestSplit(X, y, { testSize: 0.25 })
```

### Stats — SciPy style

```typescript
normalPDF(0)                // ~0.3989 (standard normal PDF)
ttestInd([1, 2, 3], [4, 5, 6]) // { statistic: -3, pValue: ~0.095 }
skewness([1, 2, 3, 4, 5])  // 0
```

### Viz — Matplotlib/Seaborn data preparation

```typescript
histogram([1, 1, 2, 2, 3, 3, 4, 4], { bins: 4 })
kde([1, 2, 3, 4, 5])           // kernel density estimation
colorMap('viridis', 256)        // hex color array
```

---

## 📦 Modules

| Module | Description | Key Functions |
|--------|-------------|---------------|
| **core** | Core utilities | `deepClone`, `deepMerge`, `pipe`, `compose`, `debounce`, `throttle`, `memoize` |
| **math** | Math & statistics | `add`(safe float), `median`, `stddev`, `percentile`, `correlation`, `factorial` |
| **date** | Date/time | `formatDate`, `timeAgo`, `addDays`, `parseDuration`, `isBusinessDay` |
| **string** | String utilities | `slugify`, `uuid`, `nanoid`, `camelCase`, `levenshtein`, `fuzzyMatch` |
| **async** | Async concurrency | `Queue`, `Semaphore`, `RateLimiter`, `Mutex`, `retryAsync`, `debounceAsync` |
| **validation** | Input validation | `isEmail`, `isIP`, `isUUID`, `isCreditCard`, `isStrongPassword`, `matches` |
| **collection** | Object/array ops | `groupBy`, `topoSort`, `deepGet`, `pickBy`, `mapValues`, `diff`, `mergeWith` |
| **nlarray** | NumPy-like arrays | `NDArray` class + broadcasting, slicing, matmul, ufuncs |
| **nlfunction** | Functional tools | `curry`, `pipe`, `ifElse`, `when`, `memoizeSync`, `converge`, `flip` |
| **color** | Color utilities | `hexToRgb`, `lighten`, `contrastRatio`, `meetsWCAG`, `mix` |
| **crypto** | Security | `generateToken`, `base64`, `randomHex`, `constantTimeEqual` |
| **error** | Error handling | `TypedError`, `MultiError`, `createError` |
| **logger** | Logging | Structured logger with console, JSON, file, buffered transports |
| **io** | I/O utilities | `parseCsv`, `safeJsonParse`, `env`, `envInt` |
| **path** | File paths | `join`, `resolve`, `basename`, `dirname` (cross-platform) |
| **type** | Type guards | `isString`, `isNil`, `isPlainObject`, `isTypedArray`, `getType` (28 guards) |
| **ml** 🆕 | Machine Learning | `StandardScaler`, `LinearRegression`, `KMeans`, `KNN`, `PCA` |
| **stats** 🆕 | Statistics | `normalPDF`, `ttestInd`, `skewness`, `pearsonCorrelation` |
| **viz-data** 🆕 | Viz prep | `histogram`, `kde`, `boxPlotData`, `colorMap` |
| **dep-exray** | Dep scanner | `scanProject`, `generateReport` — CLI: `npx dep-exray .` |

---

## ✨ Why speexkit?

| Feature | speexkit | lodash | mathjs | date-fns |
|---------|----------|--------|--------|----------|
| **Zero dependencies** | ✅ | ❌ | ❌ | ✅ |
| **NDArray (NumPy-like)** | ✅ | ❌ | ✅ (heavy) | ❌ |
| **ML (scikit-learn)** | ✅ | ❌ | ❌ | ❌ |
| **Stats (hypothesis tests)** | ✅ | ❌ | ✅ | ❌ |
| **Async concurrency** | ✅ | ❌ | ❌ | ❌ |
| **Validation** | ✅ | ❌ | ❌ | ❌ |
| **Functional tools** | ✅ | ✅ | ❌ | ❌ |
| **Tree-shakeable** | ✅ | 🟡 | ❌ | ✅ |
| **Bundle size (gzip)** | ~25 KB | ~71 KB | ~200 KB | ~1 KB/fn |

**speexkit** replaces **lodash + mathjs + date-fns + validator.js + async** in a single zero-dependency package — plus adds ML, stats, and NDArray functionality that no other utility library provides.

---

## 📊 Test & Quality

- **1,477 tests** — 24 test files, all passing ✅
- **0 dependencies** — no runtime baggage
- **TypeScript strict** — full type declarations (`.d.ts`)
- **Tree-shakeable** — ESM with `sideEffects: false`
- **MIT licensed**

---

## 📖 Documentation

- [Full Module Reference](./SUMMARY.md)
- [Changelog](./CHANGELOG.md)
- [Roadmap](./ROADMAP.md)
- [Contributing](./CONTRIBUTING.md)

---

<div align="center">

**MIT** · Built with ❤️ for the JavaScript community

</div>
