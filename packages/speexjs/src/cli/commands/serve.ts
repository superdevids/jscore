import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { colors } from '../../native/colors.js'
import { logger } from '../../native/logger.js'

interface ServeOptions {
  port?: string | number
  host?: string
  dev?: string | boolean
}

/**
 * Convert filesystem path to a valid file:// URL.
 * Needed for Windows: path.resolve() returns C:\... but ESM import() requires file:///C:/...
 */
function toFileUrl(path: string): string {
  return pathToFileURL(path).href
}

/**
 * Try to register a TypeScript loader (tsx) so Node can import .ts files.
 * Falls back silently if none available — Node 22.6+ has native --experimental-strip-types.
 */
async function ensureTsLoader(): Promise<void> {
  // If `--experimental-strip-types` is already active or native TS is on, skip
  if (process.execArgv.some(a => a.includes('strip-types') || a.includes('tsx') || a.includes('ts-node'))) {
    return
  }

  // Try to register tsx if available locally or globally
  for (const mod of ['tsx', 'ts-node/esm']) {
    try {
      await import(mod)
      return
    } catch {
      continue
    }
  }
}

export async function serve(options: Record<string, any>): Promise<void> {
  const opts: ServeOptions = {
    port: options.port || options.p || 3000,
    host: options.host || options.H || 'localhost',
    dev: options.dev !== false,
  }

  const port = parseInt(String(opts.port), 10)
  const host = String(opts.host)

  const serverEntry = resolve(process.cwd(), 'src/app.ts')
  const serverEntryAlt = resolve(process.cwd(), 'src/server/index.ts')
  const serverEntryIndex = resolve(process.cwd(), 'src/index.ts')

  let entryPath: string | null = null
  if (existsSync(serverEntry)) entryPath = serverEntry
  else if (existsSync(serverEntryAlt)) entryPath = serverEntryAlt
  else if (existsSync(serverEntryIndex)) entryPath = serverEntryIndex

  if (!entryPath) {
    console.error(
      colors.red(
        'Entry point not found. Create src/app.ts or src/index.ts',
      ),
    )
    process.exit(1)
  }

  // ── Ensure TypeScript loader ─────────────────────────────────
  if (opts.dev) {
    try {
      await ensureTsLoader()
    } catch {
      // Non-fatal: user may have native TS support in Node
    }
  }

  // ── Convert path to file:// URL (critical for Windows) ──────
  const entryUrl = toFileUrl(entryPath)

  if (opts.dev) {
    logger.info(
      `Development server starting at ${colors.cyan(`http://${host}:${port}`)}`,
    )

    try {
      const { app } = await import(entryUrl)

      if (!app || typeof app.listen !== 'function') {
        console.error(
          colors.red(
            'Entry point must export { app } with .listen() method',
          ),
        )
        process.exit(1)
      }

      app.listen(port, host, () => {
        console.log()
        console.log(`  ${colors.bold('SpeexJS')} ${colors.green('running')}`)
        console.log(`  ${colors.dim('→')}  ${colors.cyan(`http://${host}:${port}`)}`)
        console.log()
      })
    } catch (err: any) {
      console.error(colors.red(`Failed to start server: ${err.message}`))
      process.exit(1)
    }
  } else {
    try {
      const { app } = await import(entryUrl)

      if (!app || typeof app.listen !== 'function') {
        console.error(
          colors.red(
            'Entry point must export { app } with .listen() method',
          ),
        )
        process.exit(1)
      }

      app.listen(port, host, () => {
        console.log()
        console.log(`  ${colors.bold('SpeexJS')} ${colors.green('running')}`)
        console.log(`  ${colors.dim('→')}  ${colors.cyan(`http://${host}:${port}`)}`)
        console.log()
      })
    } catch (err: any) {
      console.error(colors.red(`Failed to start server: ${err.message}`))
      process.exit(1)
    }
  }
}
