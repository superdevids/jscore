# SuperJS Monorepo 🚀

**Dua package dalam satu monorepo — untuk developer JavaScript/TypeScript Indonesia dan dunia.**

```
superjs/
├── packages/
│   ├── core/         → superjs-core     (Utility Library — zero dep, 90+ functions)
│   └── superjs/      → superjs          (Fullstack Framework — zero dep, server+client+rpc+db+auth+cli)
```

---

## 📦 Package

| Package | npm | Deskripsi |
|---------|-----|-----------|
| **superjs-core** | `npm install superjs-core` | Utility library: deepClone, debounce, formatDate, terbilang, isNIK, Logger, dep-exray, dan 90+ fungsi lainnya. Zero runtime dependencies. |
| **superjs** | `npm install superjs` | Fullstack framework: Server (Laravel-like), Client (Signal-based VDOM), RPC (type-safe), Database (Query Builder + Migrations), Auth (Session + Token), CLI. Zero dependencies. |

---

## 🚀 Quickstart

### superjs-core (Utility Library)

```bash
npm install superjs-core
```

```typescript
import { deepClone } from 'superjs-core'
import { formatDate } from 'superjs-core/date'
import { isNIK } from 'superjs-core/validation'
import { terbilang, formatRupiah } from 'superjs-core/string'

deepClone({ a: 1, b: { c: new Date() } })
formatDate(new Date(), 'DD/MM/YYYY')  // "28/06/2026"
isNIK('3201010203940001')             // true
terbilang(1500000)                    // "satu juta lima ratus ribu"
formatRupiah(1500000)                 // "Rp1.500.000"
```

Dokumentasi lengkap: **[packages/core/README.md](./packages/core/README.md)**

### superjs (Fullstack Framework)

```bash
npm install superjs
```

```typescript
import { superjs } from 'superjs/server'
import { s } from 'superjs/schema'

const app = superjs()

app.get('/', async ({ response }) => {
  return response.html('<h1>SuperJS 🚀</h1>')
})

app.get('/api/users', async ({ response }) => {
  const users = await db.table('users').paginate(10, 1)
  return response.json(users)
})

app.listen(3000, () => console.log('SuperJS running on http://localhost:3000'))
```

Dokumentasi lengkap: **[packages/superjs/README.md](./packages/superjs/README.md)**

---

## ✨ Fitur Unggulan

### superjs-core
- **90+ functions** — 16 modules (core, math, date, collection, string, async, io, type, crypto, path, validation, error, logger, color, dep-exray)
- **TypeScript strict** — full type safety, zero `any`
- **Zero runtime dependencies** — pure JS/TS
- **Tree-shakeable** — import only what you need
- **🇮🇩 Indonesia** — NIK, NPWP, Phone, terbilang, formatRupiah

### superjs (Framework)
- **Zero dependencies** — 100% native Node.js
- **Server** — Laravel-like: Router, Middleware, Controller, DI, Engine
- **Database** — Query Builder, Migrations, Pagination (MySQL/SQLite/PostgreSQL)
- **Auth** — Session Guard, Token Guard, Gate Authorization
- **Schema** — 25+ validation types + 🇮🇩 NIK/NPWP/Phone/Kodepos
- **Client** — Signal-based reactivity, Virtual DOM, JSX, SSR
- **RPC** — Type-safe bidirectional communication
- **Cache, Storage, Events** — Enterprise features
- **CLI** — `superjs init`, `make:*`, `serve`, `list-routes`

---

## 📊 Statistik

| Metrik | superjs-core | superjs |
|--------|-------------|---------|
| Versi | 0.6.0 | 0.2.0 |
| File | 50+ | 67 |
| Baris kode | 6.500+ | 9.887 |
| Dependencies | 0 (runtime) | **0** |
| Tests | 828 | 69 |
| TypeScript | Strict ✅ | Strict ✅ |

---

## 🗺️ Roadmap

Lihat roadmap masing-masing package:
- [superjs-core ROADMAP](./packages/core/ROADMAP.md)
- [superjs ROADMAP](./packages/superjs/ROADMAP.md)

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request.

- [CONTRIBUTING.md](./packages/core/CONTRIBUTING.md)
- [SECURITY.md](./packages/core/SECURITY.md)

---

## 📝 License

MIT — bebas digunakan, dimodifikasi, dan didistribusikan.

---

**🇮🇩 Dibuat oleh developer Indonesia, untuk developer dunia.**
