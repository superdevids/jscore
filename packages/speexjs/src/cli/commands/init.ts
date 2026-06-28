import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { colors } from '../../native/colors.js'

interface TemplateContent {
  dirs: string[]
  files: Record<string, string | ((name: string) => string)>
}

const TEMPLATES: Record<string, TemplateContent> = {
  blank: {
    dirs: ['src', 'src/config'],
    files: {
      'package.json': (name: string) =>
        JSON.stringify(
          {
            name,
            version: '0.1.0',
            type: 'module',
            private: true,
            scripts: {
              dev: 'speexjs serve',
              build: 'speexjs build',
              start: 'node dist/index.js',
              lint: 'tsc --noEmit',
            },
            dependencies: {
              speexjs: 'latest',
            },
            devDependencies: {
              '@types/node': '^26.0.1',
              tsx: '^4.19.0',
              typescript: '^5.7.0',
            },
          },
          null,
          2,
        ),
      'tsconfig.json': JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            strict: true,
            declaration: true,
            sourceMap: true,
            esModuleInterop: true,
            isolatedModules: true,
            resolveJsonModule: true,
            outDir: './dist',
            rootDir: './src',
            skipLibCheck: true,
          },
          include: ['src/**/*.ts'],
          exclude: ['node_modules', 'dist'],
        },
        null,
        2,
      ),
      'src/index.ts': `import { speexjs } from 'speexjs/server'
import { schema } from 'speexjs/schema'
import { Config } from './config/index.js'

// ─── Application ───────────────────────────────────────────
const app = speexjs()

// ─── Routes ────────────────────────────────────────────────
app.get('/', async ({ response }) => {
  return response.html(\`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>SpeexJS App</title>
    </head>
    <body>
      <h1>SpeexJS 🚀</h1>
      <p>Server is running on port \${Config.port}</p>
    </body>
    </html>
  \`)
})

// ─── Health Check ──────────────────────────────────────────
app.get('/api/health', async ({ response }) => {
  return response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// ─── Start Server ─────────────────────────────────────────
app.listen(Config.port, () => {
  console.log(\`✓ SpeexJS running at http://localhost:\${Config.port}\`)
})
`,
      'src/config/index.ts': `export const Config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || 'localhost',
  env: process.env.NODE_ENV || 'development',
  appKey: process.env.APP_KEY || '',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',
} as const
`,
      '.env.example': `# Server
PORT=3000
NODE_ENV=development
HOST=localhost

# Auth (change in production!)
APP_KEY=your-base64-32-byte-key-here
SESSION_SECRET=change-this-in-production
`,
      '.gitignore': `node_modules/
dist/
.env
*.log
`,
    },
  },

  fullstack: {
    dirs: [
      'src/server',
      'src/server/controllers',
      'src/server/middleware',
      'src/client',
      'src/client/components',
      'src/client/pages',
      'src/shared',
      'public',
    ],
    files: {
      'package.json': (name: string) =>
        JSON.stringify(
          {
            name,
            version: '0.1.0',
            type: 'module',
            private: true,
            scripts: {
              dev: 'speexjs serve',
              build: 'tsc',
              start: 'node dist/server/index.js',
            },
            dependencies: {
              speexjs: 'latest',
            },
            devDependencies: {
              '@types/node': '^26.0.1',
              tsx: '^4.19.0',
              typescript: '^5.7.0',
            },
          },
          null,
          2,
        ),
      'tsconfig.json': JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            strict: true,
            declaration: true,
            sourceMap: true,
            esModuleInterop: true,
            isolatedModules: true,
            resolveJsonModule: true,
            jsx: 'react-jsx',
            jsxImportSource: '@speexjs/vdom',
            outDir: './dist',
            rootDir: './src',
          },
          include: ['src/**/*.ts', 'src/**/*.tsx'],
          exclude: ['node_modules', 'dist'],
        },
        null,
        2,
      ),
      'src/server/index.ts': `import { speexjs } from 'speexjs/server'
import { schema } from 'speexjs/schema'
import { UserController } from './controllers/user.controller.js'

const PORT = Number(process.env.PORT) || 3000

const app = speexjs()

// ─── Controllers ───────────────────────────────────────────
app.controller(UserController)

// ─── Routes ────────────────────────────────────────────────
app.get('/', async ({ response }) => {
  return response.html(\`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>SpeexJS Fullstack</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/client/index.js"></script>
    </body>
    </html>
  \`)
})

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(\`✓ SpeexJS running on http://localhost:\${PORT}\`)
})
`,
      'src/server/controllers/user.controller.ts': `import { Controller, get, post } from 'speexjs/server'

export class UserController extends Controller {
  @get('/users')
  async index({ response }) {
    return response.json({ data: [] })
  }

  @post('/users')
  async store({ request, response }) {
    const body = await request.body()
    return response.json({ data: body }, 201)
  }
}
`,
      'src/client/index.ts': `import { createApp } from './app.js'

document.addEventListener('DOMContentLoaded', () => {
  createApp().mount('#root')
})
`,
      'src/client/app.ts': `export function createApp() {
  function mount(selector: string) {
    const root = document.querySelector(selector)
    if (!root) {
      console.error('Root element not found:', selector)
      return
    }
    root.innerHTML = \`
      <div style="text-align:center;padding:2rem">
        <h1>SpeexJS Fullstack</h1>
        <p>Welcome to SpeexJS!</p>
      </div>
    \`
  }

  return { mount }
}
`,
      'public/style.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

#root {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
`,
      'src/shared/types.ts': `export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}
`,
      '.env.example': `# Server
PORT=3000
NODE_ENV=development
HOST=localhost

# Auth (change in production!)
APP_KEY=your-base64-32-byte-key-here
SESSION_SECRET=change-this-in-production

# Database (example)
DATABASE_URL=postgresql://localhost:5432/myapp
`,
      '.gitignore': `node_modules/
dist/
.env
*.log
`,
    },
  },

  'api-only': {
    dirs: ['src', 'src/config', 'src/controllers', 'src/middleware'],
    files: {
      'package.json': (name: string) =>
        JSON.stringify(
          {
            name,
            version: '0.1.0',
            type: 'module',
            private: true,
            scripts: {
              dev: 'speexjs serve',
              build: 'tsc',
              start: 'node dist/index.js',
            },
            dependencies: {
              speexjs: 'latest',
            },
            devDependencies: {
              '@types/node': '^26.0.1',
              tsx: '^4.19.0',
              typescript: '^5.7.0',
            },
          },
          null,
          2,
        ),
      'tsconfig.json': JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'bundler',
            strict: true,
            declaration: true,
            sourceMap: true,
            esModuleInterop: true,
            isolatedModules: true,
            resolveJsonModule: true,
            outDir: './dist',
            rootDir: './src',
          },
          include: ['src/**/*.ts'],
          exclude: ['node_modules', 'dist'],
        },
        null,
        2,
      ),
      'src/index.ts': `import { speexjs } from 'speexjs/server'
import { schema } from 'speexjs/schema'
import { Config } from './config/index.js'
import { HealthController } from './controllers/health.controller.js'

// ─── Application ───────────────────────────────────────────
const app = speexjs()

// ─── Controllers ───────────────────────────────────────────
app.controller(HealthController)

// ─── Routes ────────────────────────────────────────────────
app.get('/api/health', async ({ response }) => {
  return response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: Config.env,
  })
})

// ─── Start Server ─────────────────────────────────────────
app.listen(Config.port, () => {
  console.log(\`✓ SpeexJS API running at http://localhost:\${Config.port}\`)
})
`,
      'src/config/index.ts': `export const Config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || 'localhost',
  env: process.env.NODE_ENV || 'development',
  appKey: process.env.APP_KEY || '',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',
} as const
`,
      'src/controllers/health.controller.ts': `import { Controller, get } from 'speexjs/server'
import { schema } from 'speexjs/schema'

// ─── Health Response Schema ────────────────────────────────
const HealthResponse = schema.object({
  status: schema.string(),
  uptime: schema.number(),
  timestamp: schema.string(),
})

export class HealthController extends Controller {
  @get('/health')
  async check({ response }) {
    const payload = HealthResponse.parse({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
    return response.json(payload)
  }
}
`,
      'src/middleware/auth.ts': `import type { RouteContext } from 'speexjs/server/router'

export function auth() {
  return async (ctx: RouteContext, next: () => Promise<void>) => {
    const token = ctx.request.headers.get('authorization')

    if (!token) {
      ctx.response.status(401).json({
        error: 'Unauthorized',
        message: 'Missing authorization header',
      })
      return
    }

    await next()
  }
}
`,
      '.env.example': `# Server
PORT=3000
NODE_ENV=development
HOST=localhost

# Auth (change in production!)
APP_KEY=your-base64-32-byte-key-here
SESSION_SECRET=change-this-in-production

# Database (example)
DATABASE_URL=postgresql://localhost:5432/myapp
`,
      '.gitignore': `node_modules/
dist/
.env
*.log
`,
    },
  },

  spark: {
    dirs: ['src', 'src/controllers', 'src/middleware', 'src/config', 'src/database/migrations', 'src/models'],
    files: {
      'package.json': (name: string) => JSON.stringify({
        name, version: '0.1.0', type: 'module', private: true,
        scripts: { dev: 'speexjs serve', build: 'tsc', start: 'node dist/index.js', lint: 'biome check src/' },
        dependencies: { speexjs: 'latest' },
        devDependencies: { '@types/node': '^26.0.1', tsx: '^4.19.0', typescript: '^5.7.0' },
      }, null, 2),
      'tsconfig.json': JSON.stringify({
        compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler', strict: true, outDir: './dist', rootDir: './src', skipLibCheck: true },
        include: ['src/**/*.ts'], exclude: ['node_modules', 'dist'],
      }, null, 2),
      'src/index.ts': `import { speexjs } from 'speexjs/server'
import { schema } from 'speexjs/schema'

const app = speexjs()
const PORT = Number(process.env.PORT) || 3000

app.use(app.router.cors())
app.use(app.router.bodyParser())
app.use(app.router.csrf())

app.get('/api/health', async ({ response }) => {
  return response.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(\`⚡ SpeexJS API running on http://localhost:\${PORT}\`)
})
`,
      'src/config/index.ts': `export const Config = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  appKey: process.env.APP_KEY || '',
} as const
`,
      '.env.example': `PORT=3000
NODE_ENV=development
APP_KEY=
`,
      '.gitignore': 'node_modules/\ndist/\n.env\n*.log\n',
    },
  },
}

const TEMPLATE_ALIASES: Record<string, string> = {
  api: 'api-only',
  full: 'fullstack',
  spark: 'spark',
}

function getTemplate(name: string): string {
  return TEMPLATE_ALIASES[name] ?? name
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c: string) => (c ?? '').toUpperCase())
    .replace(/^(.)/, (c: string) => c.toUpperCase())
}

export async function initProject(
  name: string,
  options: Record<string, any>,
): Promise<void> {
  const targetDir = resolve(process.cwd(), name)

  if (existsSync(targetDir)) {
    console.error(colors.red(`Directory '${name}' already exists!`))
    process.exit(1)
  }

  const templateName = getTemplate(String(options.template || 'blank'))
  const template = TEMPLATES[templateName]

  if (!template) {
    console.error(
      colors.red(
        `Unknown template '${options.template}'. Use: blank, fullstack, api-only, spark`,
      ),
    )
    process.exit(1)
  }

  mkdirSync(targetDir, { recursive: true })

  for (const dir of template.dirs) {
    mkdirSync(resolve(targetDir, dir), { recursive: true })
  }

  for (const [filePath, content] of Object.entries(template.files)) {
    const fullPath = resolve(targetDir, filePath)
    mkdirSync(dirname(fullPath), { recursive: true })

    const resolvedContent =
      typeof content === 'function' ? content(name) : content

    writeFileSync(fullPath, resolvedContent, 'utf-8')
  }

  if (options.git !== false) {
    try {
      const { execSync } = await import('child_process')
      execSync('git init', { cwd: targetDir, stdio: 'ignore' })
    } catch {
      // git not available
    }
  }

  if (options.install !== false) {
    const pm = String(options['package-manager'] || options.packageManager || 'npm')
    try {
      const { execSync } = await import('child_process')
      console.log(`  ${colors.cyan('→')} Installing dependencies with ${pm}...`)
      execSync(`${pm} install`, { cwd: targetDir, stdio: 'inherit' })
    } catch {
      console.log(
        `  ${colors.yellow('!')} Dependency install skipped. Run '${pm} install' manually.`,
      )
    }
  }

  const packageManager = String(options['package-manager'] || options.packageManager || 'npm')

  console.log()
  console.log(`${colors.bold('╔════════════════════════════════════╗')}`)
  console.log(`${colors.bold('║')}        ${colors.green('speexjs 🚀 Project Created')}${colors.bold('       ║')}`)
  console.log(`${colors.bold('╚════════════════════════════════════╝')}`)
  console.log()
  console.log(`  ${colors.bold('Name:')}     ${toPascalCase(name)}`)
  console.log(`  ${colors.bold('Template:')} ${templateName}`)
  console.log(`  ${colors.bold('Dir:')}      ${targetDir}`)
  console.log()
  console.log(`  ${colors.cyan('$')} cd ${name}`)
  console.log(`  ${colors.cyan('$')} ${packageManager} run dev`)
  console.log()
}
