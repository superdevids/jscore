# SpeexJS Monorepo

Monorepo for **speexkit** — the JavaScript/TypeScript utility toolkit, and **speexjs** — the fullstack web framework.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [speexkit](./packages/speexkit) | Utility toolkit: NDArray, ML, Stats, validation, functional, date, async, collection, color, error, logger, crypto, path, IO, type, dep-exray. 400+ functions, zero deps. | `npm install speexkit` |
| [speexjs](./packages/speexjs) | Fullstack TypeScript web framework. 250+ features. Zero deps. | `npm install speexjs` |

## speexkit Quick Start

```bash
npm install speexkit
```

```typescript
import { NDArray } from 'speexkit/nlarray'
import { StandardScaler } from 'speexkit/ml'
import { normalPDF, ttestInd } from 'speexkit/stats'
import { curry, pipe } from 'speexkit/nlfunction'
import { isEmail, isStrongPassword } from 'speexkit/validation'
```

## Development

```bash
pnpm install
cd packages/speexkit
npm run build
npm test
```

MIT
