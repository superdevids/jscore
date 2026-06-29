# Product Requirements Document — SpeexKit

> **Version:** 1.0 (PRD)
> **Status:** Draft
> **Last Updated:** 2026-06-29
> **Document Owner:** SpeexKit Core Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Market Analysis](#2-market-analysis)
3. [User Personas](#3-user-personas)
4. [Feature Taxonomy](#4-feature-taxonomy)
5. [Version Roadmap](#5-version-roadmap)
6. [Technical Architecture](#6-technical-architecture)
7. [Competitive Analysis](#7-competitive-analysis)
8. [Risk Register](#8-risk-register)
9. [Success Metrics](#9-success-metrics)
10. [Appendix](#10-appendix)

---

## 1. Executive Summary

### 1.1 Product Vision

**"The Zero-Dependency TypeScript Standard Library"**

SpeexKit aims to be the single most comprehensive zero-dependency TypeScript utility toolkit — a drop-in replacement for lodash, mathjs, validator.js, date-fns, and basic scikit-learn/NumPy/ SciPy functionality, all in one package with zero runtime dependencies and full tree-shakeability.

### 1.2 One-Line Pitch

> SpeexKit is a **zero-dependency TypeScript toolkit** delivering **400+ functions** across **19 modules** — from NDArray (NumPy-style) and ML (scikit-learn-style) to validation, async concurrency, functional programming, color manipulation, cryptography, and dependency scanning — all **tree-shakeable, type-safe, and free of external dependencies**.

### 1.3 Current State (v1.4.12)

| Metric | Value |
|--------|-------|
| Bundle Size | ~200 KB (25 KB gzipped) |
| Runtime Dependencies | **Zero** |
| Modules | **19** |
| Exported Functions | **400+** |
| Tests | **1,477** across 24 test files |
| TypeScript | Strict mode, **0 errors** |
| CLI Tools | `dep-exray` (dependency scanner) |
| Build | ESM-only, 33 entry points, tree-shakeable |
| License | MIT |

### 1.4 Strategic Positioning

SpeexKit occupies a unique position in the JavaScript/TypeScript utility landscape:

```
                  Lightweight (< 50 KB gzip)
                  │
      speexkit ●  │
                  │
  Feature-Rich    │    Minimal
  (400+ fns)      │    (1-10 fns)
                  │
        mathjs ●  │  ● date-fns
                  │
        lodash ●  │
                  └─────────────────────
                  Heavy (> 50 KB gzip)
```

No other library combines **zero dependencies** with **400+ functions spanning NumPy, ML, stats, validation, async, and functional programming** in a single package.

---

## 2. Market Analysis

### 2.1 Target Audience

| Segment | Size | Need |
|---------|------|------|
| Solo/Indie Devs | Large | One package for everything, no dependency hell |
| Data Science JS/TS | Growing | NumPy/scikit-learn in browser without Python |
| Fullstack Engineers | Medium | Tree-shakeable utilities, validation, async |
| CLI Tool Authors | Medium | Zero-dependency utilities for CLI tools |
| Enterprise with Compliance | Niche | Audit-friendly single package, minimal supply chain risk |

### 2.2 Competitive Landscape

| Competitor | Strengths | Weaknesses vs SpeexKit |
|------------|-----------|----------------------|
| **lodash** | Ubiquitous, well-tested, 200+ functions | 71 KB gzip, no NDArray/ML/Stats, has deps, not ESM-first |
| **date-fns** | Modular date functions | 1 file ≈ 1 KB but needs many imports, no other utilities |
| **mathjs** | Full math suite + NDArray | ~200 KB gzip, heavy, complex API, has dependencies |
| **validator.js** | 100+ validators | Only validation, 59 KB, not ESM-first |
| **scikit-learn** (Python) | Production-grade ML | Python-only, cannot run in browser/Node.js TS |
| **NumPy** (Python) | Battle-tested array computing | Python-only, heavy, no JS equivalent at this level |
| **es-toolkit** | Modern lodash alternative | ~2 KB, very limited scope (30 fns), no NDArray/ML |

### 2.3 Market Opportunity

- **TAM**: All JS/TS developers needing utilities (≈ 15M developers)
- **SAM**: Developers who prefer zero-dependency, all-in-one toolkits (≈ 2M)
- **Target v2**: 5,000+ weekly npm downloads, 500+ GitHub stars

---

## 3. User Personas

### Persona 1: Alex — Solo App Developer

| Attribute | Detail |
|-----------|--------|
| **Role** | Fullstack freelancer |
| **Stack** | TypeScript, React, Node.js |
| **Pain** | "I need slugify, date formatting, email validation, and basic math in every project. Installing 5 separate packages is exhausting." |
| **Value** | Single `npm install speexkit` covers all utility needs. Zero deps means fewer audit warnings. |
| **Key modules** | string, date, validation, math, collection |

### Persona 2: Maya — Data Scientist in JS

| Attribute | Detail |
|-----------|--------|
| **Role** | ML engineer building browser-based tools |
| **Stack** | TypeScript, TensorFlow.js, Observable |
| **Pain** | "I need basic NumPy (ndarray, broadcasting, matmul) and scikit-learn (scaling, regression, clustering) in the browser without Python." |
| **Value** | NDArray + ML modules provide 80% of common data science needs in pure TS. |
| **Key modules** | nlarray, ml, stats, viz-data |

### Persona 3: David — CLI Tool Author

| Attribute | Detail |
|-----------|--------|
| **Role** | Open-source developer |
| **Stack** | Node.js, TypeScript |
| **Pain** | "My CLI tool needs path manipulation, basic crypto, logging, and CSV parsing. I want to minimize dependencies." |
| **Value** | SpeexKit has everything in one zero-dep package. `dep-exray` also helps audit my own deps. |
| **Key modules** | path, crypto, io, logger, dep-exray |

### Persona 4: Putra — Hobbyist/Student

| Attribute | Detail |
|-----------|--------|
| **Role** | Learning TypeScript and data science |
| **Stack** | TypeScript basics |
| **Pain** | "I want to experiment with ML and array operations in TypeScript without setting up a Python environment." |
| **Value** | NDArray + ML + Stats modules let them learn data science concepts in a familiar language. |
| **Key modules** | nlarray, ml, stats, nlfunction, validation |

---

## 4. Feature Taxonomy

### 4.1 Existing Modules (v1.4.12)

| # | Module | Functions | Status | Priority |
|---|--------|-----------|--------|----------|
| 1 | **core** | 12 | ✅ Stable | P0 |
| 2 | **math** | 35 | ✅ Stable | P0 |
| 3 | **date** | 55 | ✅ Stable | P0 |
| 4 | **string** | 47 | ✅ Stable | P0 |
| 5 | **async** | 19 | ✅ Stable | P0 |
| 6 | **validation** | 21 | ✅ Stable | P0 |
| 7 | **collection** | 62 | ✅ Stable | P0 |
| 8 | **type** | 28 | ✅ Stable | P0 |
| 9 | **crypto** | 10 | ✅ Stable | P0 |
| 10 | **path** | 10 | ✅ Stable | P0 |
| 11 | **color** | 21 | ✅ Stable | P0 |
| 12 | **error** | 5 | ✅ Stable | P0 |
| 13 | **logger** | 6 | ✅ Stable | P0 |
| 14 | **io** | 6 | ✅ Stable | P0 |
| 15 | **nlfunction** | 25 | ✅ Stable | P0 |
| 16 | **nlarray** | 55+ | ✅ Stable | P0 |
| 17 | **ml** | 14 | ✅ Stable | P1 |
| 18 | **stats** | 13 | ✅ Stable | P1 |
| 19 | **viz-data** | 7 | ✅ Stable | P1 |
| 20 | **dep-exray** | 5 + CLI | ✅ Stable | P1 |

### 4.2 Future Feature Pipeline

| Category | Feature | Priority | Target Version |
|----------|---------|----------|----------------|
| **ML** | KNN Classifier | P1 | v1.5.0 |
| **ML** | PCA (Dimensionality Reduction) | P1 | v1.5.0 |
| **ML** | Logistic Regression | P1 | v1.5.0 |
| **ML** | Decision Tree / Random Forest | P2 | v1.7.0 |
| **ML** | DBSCAN Clustering | P2 | v1.7.0 |
| **ML** | OneHotEncoder, LabelEncoder | P2 | v1.5.0 |
| **ML** | Train/test cross-validation | P2 | v1.5.0 |
| **Reactive** | signal, computed, effect | P1 | v1.6.0 |
| **IO** | Streaming CSV/JSONL parser | P1 | v1.6.0 |
| **IO** | XLSX basic reader | P3 | v2.0.0 |
| **Crypto** | AES-GCM encrypt/decrypt | P1 | v1.6.0 |
| **Crypto** | RSA keygen + sign/verify | P2 | v2.0.0 |
| **NDArray** | SVD decomposition | P1 | v1.6.0 |
| **NDArray** | FFT | P2 | v1.7.0 |
| **NDArray** | Sparse matrix support | P3 | v2.0.0 |
| **NDArray** | GPU.js backend acceleration | P4 | v3.0.0 |
| **Stats** | ANOVA test | P2 | v1.6.0 |
| **Stats** | Chi-square test | P2 | v1.6.0 |
| **Stats** | Mann-Whitney U test | P2 | v1.7.0 |
| **Viz** | SVG chart generators | P2 | v1.7.0 |
| **Viz** | ASCII table/sparkline | P3 | v2.0.0 |
| **Validation** | 10 additional validators | P2 | v1.6.0 |
| **Validation** | Zod-compatible schema inference | P3 | v2.0.0 |
| **Functional** | Monad (Maybe, Either, Result) | P2 | v1.7.0 |
| **Functional** | Pattern matching | P3 | v2.0.0 |
| **String** | Template engine (mustache-like) | P2 | v1.6.0 |
| **String** | Markdown-to-text parser | P3 | v2.0.0 |
| **Dep-exray** | VS Code extension diagnostics | P2 | v1.6.0 |
| **Dep-exray** | Bundle size analyzer mode | P2 | v1.7.0 |
| **Dep-exray** | Auto-fix suggestions with PR | P3 | v2.0.0 |
| **Collection** | DataFrame (pandas-like) | P3 | v2.0.0 |
| **Collection** | Observable (RxJS-like) | P4 | v3.0.0 |

---

## 5. Version Roadmap

### v1.4.x — Foundation (Current)

**Theme:** Stabilize and harden all 19 modules.

| Feature | Priority | Status |
|---------|----------|--------|
| 19 modules, 400+ exports | P0 | ✅ Done |
| Zero dependencies | P0 | ✅ Done |
| 1,477 tests | P0 | ✅ Done |
| NDArray with broadcasting/matmul | P0 | ✅ Done |
| ML: StandardScaler, LinearRegression, KMeans | P1 | ✅ Done |
| Stats: normalPDF, ttestInd, pearson, spearman | P1 | ✅ Done |
| Viz-data: histogram, kde, boxPlot, ecdf | P1 | ✅ Done |
| dep-exray CLI | P1 | ✅ Done |
| Brutal testing (10 phases, 0 failures) | P1 | ✅ Done |
| TypeScript strict, 0 errors | P0 | ✅ Done |

**Goals:**
- [x] All 19 modules fully functional
- [x] Zero regression risk
- [x] Documented API surface
- [x] 1,477+ tests passing

---

### v1.5.0 — ML Expansion (Next)

**Theme:** Expand ML module to cover more common algorithms.

| Feature | Priority | Effort |
|---------|----------|--------|
| KNN Classifier (k-nearest neighbors) | P1 | M |
| PCA (Principal Component Analysis) | P1 | L |
| Logistic Regression | P1 | M |
| OneHotEncoder / LabelEncoder | P2 | S |
| trainTestSplit — stratified sampling | P2 | S |
| Cross-validation (k-fold) | P2 | M |
| ML module test coverage to > 90% | P1 | M |
| NDArray — boolean indexing | P2 | S |
| NDArray — `np.where` 3-argument form | P2 | S |

**Technical Considerations:**
- PCA implementation must handle both SVD and eigendecomposition approaches
- KNN should support both brute-force and (optionally) KD-tree for large datasets
- Logistic Regression uses IRLS (Iteratively Reweighted Least Squares) for stability
- No external dependencies added — all math is pure TypeScript

**Breaking Changes:** None

**Estimated Effort:** L (2-3 weeks)

**Success Metrics:**
- 100+ new tests for ML module
- ML coverage ≥ 90%
- 1,600+ total tests
- KNN accuracy validated against scikit-learn reference

---

### v1.6.0 — Reactive & IO (Mid-Term)

**Theme:** Add reactive programming primitives and streaming IO.

| Feature | Priority | Effort |
|---------|----------|--------|
| Reactive signals: `signal()`, `computed()`, `effect()` | P1 | L |
| Streaming CSV parser (node:stream based) | P1 | M |
| AES-GCM encrypt/decrypt (using node:crypto) | P1 | S |
| 10 additional validators (isMongoId, isSemVer, isMACAddress, etc.) | P2 | M |
| ANOVA one-way test | P2 | M |
| Chi-square test for independence | P2 | M |
| Template engine (mustache-compatible) | P2 | M |
| dep-exray VS Code diagnostics | P2 | M |
| NDArray — SVD decomposition | P1 | L |

**Technical Considerations:**
- Signals must be framework-agnostic (not tied to React/Vue)
- Streaming CSV parser must handle large files without loading into memory
- AES-GCM uses Node.js native `crypto` module — no npm deps needed
- SVD via Golub-Kahan bidiagonalization or Jacobi algorithm

**Breaking Changes:** None

**Estimated Effort:** XL (4-6 weeks)

**Success Metrics:**
- 1,800+ total tests
- 22 modules (+3 new)
- Validator count: 31
- Reactive signals benchmark vs Preact Signals / SolidJS

---

### v1.7.0 — Advanced Analytics (Mid-Term)

**Theme:** Deeper ML and statistical analysis capabilities.

| Feature | Priority | Effort |
|---------|----------|--------|
| Decision Tree (CART) Classifier | P2 | L |
| DBSCAN Clustering | P2 | M |
| FFT (Fast Fourier Transform) — Cooley-Tukey | P2 | L |
| Mann-Whitney U test | P2 | M |
| SVG chart generators (bar, line, scatter) | P2 | L |
| dep-exray bundle size analyzer mode | P2 | M |
| Monad: Maybe, Either, Result | P2 | M |
| NDArray — polynomial fitting (polyfit) | P3 | M |
| NDArray — advanced indexing (fancy/boolean) | P2 | M |

**Technical Considerations:**
- Decision Tree: CART algorithm with Gini impurity and entropy
- FFT: Radix-2 Cooley-Tukey, power-of-two length requirement documented
- SVG charts: zero-dependency, inline SVG strings, responsive viewBox
- All statistical tests include p-value computation where applicable

**Breaking Changes:** None

**Estimated Effort:** XL (6-8 weeks)

**Success Metrics:**
- 2,000+ total tests
- 25 modules
- 500+ total exports
- Chart rendering verified in Node.js and browser

---

### v2.0.0 — DataFrame & Schema (Long-Term)

**Theme:** pandas-style DataFrame and Zod-compatible validation.

| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| DataFrame (pandas-like) | P1 | XXL | Columnar ops, groupby, join, filter |
| Zod-compatible schema inference | P2 | XL | Runtime type inference from validators |
| Additional validators (50+ total) | P2 | L | |
| XLSX basic reader | P3 | M | .xlsx to array of objects |
| Pattern matching (switch expressions) | P3 | M | |
| dep-exray auto-fix PR creation | P3 | L | GitHub API integration |
| NDArray — sparse matrix support | P3 | XL | CSR/CSC format |
| ASCII table generator | P3 | S | For CLI output |
| Markdown-to-text parser | P3 | M | |

**Technical Considerations:**
- DataFrame: lazy evaluation where possible, chainable API (dplyr-style)
- Schema inference: partial Zod compatibility (not full parser, just type inference)
- Sparse matrix: CSR format initially, COO for construction
- Breaking: `dep-exray` CLI output format may change

**Breaking Changes:**
- `dep-exray` JSON output format v2 (add `version` field)
- Deprecate `simpleHash()` (security advisory — use SHA-256 via `hash()` instead)

**Estimated Effort:** XXL (3-4 months)

**Success Metrics:**
- 2,500+ total tests
- 28+ modules
- npm downloads: 1,000+/week
- GitHub stars: 500+

---

### v3.0.0 — Performance & Ecosystem (Vision)

**Theme:** Native acceleration and developer ecosystem.

| Feature | Priority | Effort |
|---------|----------|--------|
| NDArray — GPU.js backend for browser | P4 | XXL |
| NDArray — WebAssembly SIMD acceleration | P4 | XXL |
| Observable (RxJS-light) with operators | P4 | XL |
| Plugin system for custom validators/transforms | P4 | L |
| Official VS Code extension (snippets, preview) | P4 | L |
| Website with playground (RunKit-style) | P4 | XL |
| Benchmark suite (vs lodash, mathjs, date-fns) | P2 (v2.x) | M |

**Technical Considerations:**
- GPU.js backend: optional peer dependency, graceful fallback to CPU
- WASM SIMD: compile NDArray hot paths (matmul, broadcasting) to WebAssembly
- Plugin system: registry pattern with typed interfaces
- RxJS-light: subset of RxJS operators, 1/10 the size

**Breaking Changes:** Possible if GPU/WASM backends change NDArray API

**Estimated Effort:** XXL (6+ months)

**Success Metrics:**
- 3,000+ total tests
- 5,000+ weekly npm downloads
- 1,000+ GitHub stars

---

## 6. Technical Architecture

### 6.1 Module Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    speexkit (barrel)                      │
│                   src/index.ts (512 lines)                │
├──────────┬──────────┬──────────┬──────────┬──────────────┤
│  core    │  math    │  date    │  string  │  collection   │
│ (497 L)  │ (250 L)  │ (1083 L) │ (560 L)  │  (1075 L)    │
├──────────┼──────────┼──────────┼──────────┼──────────────┤
│  async   │  type    │  io      │  path    │  crypto       │
│ (400 L)  │ (200 L)  │ (150 L)  │ (150 L)  │  (150 L)      │
├──────────┼──────────┼──────────┼──────────┼──────────────┤
│  color   │  error   │  logger  │ nlarray  │  nlfunction   │
│ (281 L)  │ (100 L)  │ (200 L)  │ (2011 L) │  (200 L)      │
├──────────┼──────────┼──────────┼──────────┼──────────────┤
│  ml      │  stats   │viz-data  │validation│  dep-exray    │
│ (134 L)  │ (123 L)  │ (79 L)   │ (400 L)  │  (300 L)      │
└──────────┴──────────┴──────────┴──────────┴──────────────┘
```

### 6.2 Module Dependency Graph

```
                     nlarray (standalone)
                    /    |        \
                  ml   stats    viz-data
                    \    |        /
                  nlfunction (standalone)

core ───────────────────────────────── (standalone)
math ─── date ─── string ─── crypto ─── (standalone)
async ─── collection ─── io ─── path ── (standalone)
color ─── error ─── logger ─── type ─── (standalone)
validation ──────────────────────────── (standalone)
dep-exray ───────────────────────────── (standalone)
```

**Key design principle:** Every module is **fully independent**. No module imports from another speexkit module. This ensures:
- Maximum tree-shakeability
- No circular dependencies
- Individual modules can be imported without pulling in unrelated code

### 6.3 Build Pipeline

```
TypeScript source (src/)
    │
    ▼
tsup (ESM bundler)
    │
    ├── 33 entry points → dist/*.js
    ├── Declaration files → dist/*.d.ts
    └── No code splitting (single file per entry)
    │
    ▼
npm publish (dist/ only)
```

### 6.4 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **ESM-only** | Modern ecosystem standard, better tree-shaking |
| **No code splitting** | Each entry is already small; splitting adds overhead |
| **No minification** | Consumer's bundler handles minification |
| **sideEffects: false** | Maximum tree-shakeability |
| **Zero runtime deps** | No supply chain risk, smallest possible install |
| **Deep imports** | Users import only what they need: `import { slugify } from 'speexkit/string'` |
| **TypeScript strict** | Full type safety, better IDE support |
| **No classes where possible** | Prefer pure functions for tree-shakeability |

---

## 7. Competitive Analysis

### 7.1 Feature Matrix

| Feature | speexkit | lodash | es-toolkit | mathjs | date-fns | validator.js |
|---------|----------|--------|------------|--------|----------|--------------|
| Zero deps | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| NDArray (NumPy) | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| ML (scikit-learn) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Stats (SciPy) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Viz data prep | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Collection ops | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Async concurrency | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Validation (21+) | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (100+) |
| Date utilities | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Color manipulation | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Crypto helpers | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Functional tools | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Type guards (28) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Logger | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| dep-exray CLI | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bundle size (gzip) | ~25 KB | ~71 KB | ~2 KB | ~200 KB | ~1 KB/fn | ~59 KB |
| ESM-first | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |

### 7.2 When to Choose SpeexKit

- **You want one package for everything** — 19 modules, 400+ functions
- **You need NDArray or ML in JS/TS** — No other zero-dep option exists
- **You care about bundle size** — 25 KB gzip for the full toolkit
- **You want zero supply chain risk** — No runtime dependencies
- **You need tree-shakeability** — ESM + sideEffects: false + 33 entry points

### 7.3 When NOT to Choose SpeexKit

- **You need production-grade ML** → Use Python scikit-learn + ONNX runtime
- **You only need 1-2 functions** → Consider a micro library
- **You need 100+ validators** → Use validator.js (but accept the dep weight)

---

## 8. Risk Register

| # | Risk | Probability | Impact | Severity | Mitigation |
|---|------|-------------|--------|----------|------------|
| 1 | **NDArray numerical accuracy** — Floating-point errors in broadcasting/matmul | Medium | High | **Critical** | Comprehensive edge-case tests, tolerance-based comparisons in tests |
| 2 | **ML algorithm correctness** — LinearRegression/KMeans divergence from reference | Medium | High | **High** | Validate outputs against scikit-learn reference, test on known datasets |
| 3 | **Bundle size creep** — New modules bloat the main barrel | Low | Medium | **Medium** | Size-limit CI gate (60 KB max), deep imports for heavy modules |
| 4 | **Browser compatibility** — Node APIs used in crypto/io modules | Medium | Medium | **Medium** | Document Node-only modules, provide browser fallbacks where possible |
| 5 | **Maintenance burden** — 19 modules need ongoing updates | Medium | Low | **Medium** | Modular architecture allows isolated changes, shared test utilities |
| 6 | **Community adoption** — Hard to displace lodash | High | Medium | **Medium** | Focus on unique value (NDArray, ML), not replacement |
| 7 | **TypeScript breaking changes** — Future TS versions break types | Low | High | **High** | Pin TS version, CI tests across multiple TS versions |
| 8 | **dep-exray false positives** — Incorrect replacement suggestions | Medium | Low | **Low** | Confidence scoring, manual review gate for suggestions |
| 9 | **Validation edge cases** — isEmail/isURL false negatives/positives | Medium | Medium | **Medium** | Test against known-edge-case datasets, RFC compliance |
| 10 | **Reactive signals compatibility** — Conflicting with existing frameworks | Medium | Medium | **Medium** | Framework-agnostic design, no framework-specific dependencies |

---

## 9. Success Metrics

### 9.1 Per-Version KPIs

| Version | Tests | Modules | Exports | Coverage | Target Downloads/Week |
|---------|-------|---------|---------|----------|---------------------|
| v1.4.x (Current) | 1,477 | 19 | 400+ | ~90% | — |
| v1.5.0 | 1,600+ | 19 | 420+ | >90% | 500+ |
| v1.6.0 | 1,800+ | 22 | 460+ | >92% | 1,000+ |
| v1.7.0 | 2,000+ | 25 | 500+ | >92% | 2,000+ |
| v2.0.0 | 2,500+ | 28 | 550+ | >93% | 5,000+ |
| v3.0.0 | 3,000+ | 30+ | 600+ | >95% | 10,000+ |

### 9.2 Quality Gates

| Gate | Standard |
|------|----------|
| TypeScript | Strict mode, **0 errors** (`tsc --noEmit`) |
| Tests | 100% pass rate required before release |
| Coverage | Minimum 85%, target >90% |
| Bundle | Main entry < 60 KB uncompressed |
| Lint | Biome, zero warnings |
| Security | No hardcoded secrets, no eval(), no unsafe regex |
| Breaking changes | Documented in CHANGELOG with migration guide |

### 9.3 Community Metrics

| Metric | v1.x Target | v2.x Target | v3.x Target |
|--------|-------------|-------------|-------------|
| GitHub Stars | 500+ | 2,000+ | 5,000+ |
| npm Downloads/week | 1,000+ | 10,000+ | 50,000+ |
| Contributors | 5+ | 20+ | 50+ |
| Open Issues (max) | < 20 | < 30 | < 50 |
| Time to PR review | < 48h | < 24h | < 24h |

---

## 10. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **NDArray** | N-dimensional array with NumPy-like operations (broadcasting, slicing, matmul) |
| **Tree-shakeable** | Unused exports can be removed by bundlers (Rollup, esbuild, webpack) |
| **Barrel export** | Central index.ts that re-exports all module functions |
| **Deep import** | Importing from a specific module path: `speexkit/string` instead of `speexkit` |
| **dep-exray** | Built-in dependency scanner that analyzes projects and suggests npm package replacements |
| **Side-effects** | Whether importing a module executes code beyond defining exports |
| **Broadcasting** | NumPy-style automatic dimension expansion for array operations |

### B. References

- [SpeexKit GitHub](https://github.com/superdevids/speexjs/tree/master/packages/speexkit)
- [NDArray Tests](https://github.com/superdevids/speexjs/blob/master/packages/speexkit/tests/nlarray.test.ts)
- [ML Module](https://github.com/superdevids/speexjs/blob/master/packages/speexkit/src/ml/index.ts)
- [dep-exray CLI](https://github.com/superdevids/speexjs/tree/master/packages/speexkit/src/dep-exray)
- [lodash](https://lodash.com/) | [mathjs](https://mathjs.org/) | [date-fns](https://date-fns.org/) | [validator.js](https://github.com/validatorjs/validator.js)

### C. Open Questions

1. Should we add `react`/`vue` adapter packages for reactive signals?
2. Binary size target for NDArray WASM SIMD (v3.0)?
3. Should DataFrame support SQL-style queries (à la DuckDB WASM)?
4. Plugin registry: npm package convention or in-repo extensions?
