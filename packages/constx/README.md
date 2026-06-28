# SpeexJS

**Fullstack TypeScript Framework — zero dependencies.** 🇮🇩

```bash
npm install speexjs
```

## Quick Start

```typescript
import { speexjs } from 'speexjs/server'

const app = speexjs()
app.get('/', ({ response }) => response.html('<h1>SpeexJS 🚀</h1>'))
app.listen(3000)
```

```bash
npx speexjs serve
```

## Fitur

| Kategori | Fitur |
|----------|-------|
| **Server** | Router, Middleware (10 built-in), Controller, DI Container |
| **Database** | Query Builder, Migrations, Pagination — MySQL/SQLite/PG |
| **Auth** | Session Guard, Token Guard, Gate Authorization |
| **Validation** | 25+ schema types, 🇮🇩 NIK/NPWP/Phone/Kodepos |
| **Client** | Signals, VDOM, JSX, SSR — tanpa React |
| **RPC** | Type-safe server-client communication |
| **CLI** | `speexjs init`, `serve`, `make:*`, `list-routes` |
| **Zero Dep** | 100% native Node.js |

## Contoh

### Routing

```typescript
import { speexjs } from 'speexjs/server'

const app = speexjs()

app.group('/api', (router) => {
  router.get('/users', [UserController, 'index'])
  router.post('/users', [UserController, 'store'])
}).middleware(['auth', 'throttle'])

app.router.resource('/posts', PostController)
```

### Validation

```typescript
import { s } from 'speexjs/schema'

const UserSchema = s.object({
  name: s.string().min(3).max(100),
  email: s.string().email(),
  age: s.number().min(17).optional(),
  phone: s.phone(),
  nik: s.nik(),
})
```

### Database

```typescript
import { db } from 'speexjs/server/database'

await db.connect({ driver: 'mysql', database: 'myapp' })

const users = await db.table('users')
  .select('id', 'name', 'email')
  .where('age', '>', 18)
  .paginate(10, 1)
```

### Auth

```typescript
import { auth } from 'speexjs/server/auth'

app.post('/login', async ({ request, response }) => {
  const { email, password } = await request.json()
  const ok = await auth.attempt({ email, password })
  if (!ok) return response.json({ error: 'Login gagal' }, 401)
  return response.json({ message: 'Login berhasil' })
})
```

## CLI

| Perintah | Fungsi |
|----------|--------|
| `speexjs init` | Buat project baru |
| `speexjs serve` | Jalankan dev server |
| `speexjs make:controller User` | Generate controller |
| `speexjs make:middleware Auth` | Generate middleware |
| `speexjs make:schema User` | Generate schema |
| `speexjs list-routes` | Lihat semua route |

---

MIT
