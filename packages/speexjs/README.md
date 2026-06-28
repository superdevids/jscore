# SpeexJS

**Fullstack TypeScript Framework — zero dependencies.**

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

## Features

| Category | Description |
|----------|-------------|
| **Server** | Router, Middleware (10 built-in), Controller, DI Container |
| **Database** | Query Builder, Migrations, Pagination — MySQL/SQLite/PG |
| **Auth** | Session Guard, Token Guard, Gate Authorization |
| **Validation** | 25+ schema types — string, number, objects, arrays, and more |
| **Client** | Signals, VDOM, JSX, SSR — no React required |
| **RPC** | Type-safe server-client communication |
| **CLI** | `speexjs init`, `serve`, `make:*`, `list-routes` |
| **Zero Dep** | 100% native Node.js |

## Examples

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
import { schema } from 'speexjs/schema'

const UserSchema = schema.object({
  name: schema.string().min(3).max(100),
  email: schema.string().email(),
  age: schema.number().min(17).optional(),
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
  if (!ok) return response.json({ error: 'Login failed' }, 401)
  return response.json({ message: 'Login successful' })
})
```

## CLI

| Command | Description |
|---------|-------------|
| `speexjs init` | Create a new project |
| `speexjs serve` | Start development server |
| `speexjs make:controller User` | Generate a controller |
| `speexjs make:middleware Auth` | Generate a middleware |
| `speexjs make:schema User` | Generate a schema |
| `speexjs list-routes` | Display all registered routes |

MIT
