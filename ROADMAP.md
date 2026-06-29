# Roadmap

> **Last Updated:** 2026-06-29
> **Status:** Active Development

---

## Overview

The SpeexJS monorepo contains two independently evolving packages. This document provides a high-level view of the project direction. For detailed feature priorities (P0–P4) per release, see the respective **PRD** documents.

### Quick Navigation

| Package | Version | Status | Detailed Roadmap |
|---------|---------|--------|------------------|
| **speexjs** | v1.6.1 | ✅ Production - Active Development | [PRD.md](./packages/speexjs/PRD.md) · [ROADMAP.md](./packages/speexjs/ROADMAP.md) |
| **speexkit** | v1.4.12 | ✅ Production - Active Development | [PRD.md](./packages/speexkit/PRD.md) · [ROADMAP.md](./packages/speexkit/ROADMAP.md) |

### Current Project Health

| Metric | speexjs | speexkit |
|--------|---------|----------|
| **Version** | 1.6.1 | 1.4.12 |
| **Tests** | 1,990 ✅ | 1,477 ✅ |
| **TypeScript Errors** | 0 ✅ | 0 ✅ |
| **Known Bugs** | 0 ✅ | 0 ✅ |
| **Coverage** | 96.3% | ~90% |
| **Dependencies** | Zero | Zero |

---

## speexjs — Fullstack Web Framework

### Current Focus (v1.6.x)

**Status:** ✅ Production-ready, actively adding features.

- **Security hardening** — CSRF rewrite, path traversal guards, OAuth state enforcement
- **Dev experience** — Graceful error handling in dev server, better reload behavior
- **Documentation** — Comprehensive PRD, architecture guide, consistent markdown

### Next Up (v2.0)

| Feature | Priority | Description |
|---------|----------|-------------|
| Hot Module Replacement (HMR) | P1 | Instant reload on file changes without full restart |
| File-based Routing | P1 | Next.js-style file system routing (`src/pages/` → routes) |
| Auto-API from ORM | P1 | RESTful API generation from Model definitions |
| Admin Panel Generator | P2 | Scaffold admin CRUD interfaces from schema |
| One-command Deploy | P2 | Built-in deploy to Vercel, Railway, or Docker |

**Full details:** [speexjs PRD.md](./packages/speexjs/PRD.md) → Version 2.0

### Future Phases

| Phase | Theme | Target |
|-------|-------|--------|
| **v2.x** | Performance | Bun runtime, Edge Workers, SSG/ISR |
| **v3.0** | Enterprise | Multi-tenant, audit logging, GraphQL subscriptions |
| **v3.x** | AI-Native | Vector search, RAG pipelines, AI agent API |
| **v4.0** | Ecosystem | Plugin marketplace, official starters |
| **v5.0** | Zero Code | Visual page builder, AI-generated apps |

---

## speexkit — Utility Toolkit

### Current Focus (v1.4.x)

**Status:** ✅ Production-ready, stable API surface.

- **19 modules** — 400+ functions, all zero-dependency
- **NDArray** — NumPy-style arrays with broadcasting and matmul
- **ML module** — StandardScaler, LinearRegression, KMeans
- **Stats module** — t-tests, correlations, normal distribution
- **Validation** — 21 validators (email, URL, IP, UUID, etc.)
- **dep-exray CLI** — Dependency scanner with replacement suggestions

### Next Up (v1.5.0 — ML Expansion)

| Feature | Priority | Description |
|---------|----------|-------------|
| KNN Classifier | P1 | k-nearest neighbors classification |
| PCA | P1 | Principal component analysis |
| Logistic Regression | P1 | Binary classification via IRLS |
| OneHotEncoder / LabelEncoder | P2 | Categorical feature encoding |
| Cross-validation | P2 | k-fold stratified CV |

### Then (v1.6.0 — Reactive & IO)

| Feature | Priority | Description |
|---------|----------|-------------|
| Reactive Signals | P1 | signal(), computed(), effect() |
| Streaming CSV Parser | P1 | Stream-based large file CSV parsing |
| AES-GCM Encrypt/Decrypt | P1 | Authenticated encryption utilities |
| 10+ New Validators | P2 | isMongoId, isSemVer, isMACAddress, etc. |

**Full details:** [speexkit PRD.md](./packages/speexkit/PRD.md) → Version Roadmap

---

## How to Contribute

Interested in helping with any of these features?

1. Check the [CONTRIBUTING.md](./CONTRIBUTING.md) guide
2. Review the relevant [PRD.md](./packages/speexjs/PRD.md) for feature priorities
3. Open an issue to discuss implementation before starting
4. Submit a PR following our [commit conventions](./CONTRIBUTING.md#commit-conventions)

---

## Legend

| Priority | Meaning |
|----------|---------|
| **P0** | Critical — must-have, blocker |
| **P1** | High — very important, planned for next minor version |
| **P2** | Medium — important, nice to have soon |
| **P3** | Low — nice to have, future consideration |
| **P4** | Vision — long-term, requires research |
