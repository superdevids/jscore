import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { renderToString } from '../../client/vdom/index.js'

interface PageModule {
  default?: (props: any) => any
  loader?: (ctx: any) => Promise<Record<string, unknown> | { props?: Record<string, unknown>; metadata?: Record<string, string> }>
  metadata?: Record<string, string>
  middleware?: (ctx: any) => Promise<boolean>
}

interface ResolvedLayout {
  path: string
  component: (props: any) => any
}

async function tryImport(filePath: string): Promise<any | null> {
  try {
    const url = pathToFileURL(filePath).href
    return await import(url)
  } catch { return null }
}

async function resolveLayouts(pagesDir: string, pagePath: string): Promise<ResolvedLayout[]> {
  const layouts: ResolvedLayout[] = []
  const segments = pagePath.replace(/\\/g, '/').split('/')
  
  let currentPath = resolve(pagesDir)
  for (let i = 0; i < segments.length - 1; i++) {
    currentPath = resolve(currentPath, segments[i]!)
    const layoutPath = resolve(currentPath, '_layout.tsx')
    const mod = await tryImport(layoutPath)
    if (mod?.default) layouts.push({ path: layoutPath, component: mod.default })
  }

  const rootLayout = resolve(pagesDir, '_layout.tsx')
  const rootMod = await tryImport(rootLayout)
  if (rootMod?.default) layouts.push({ path: rootLayout, component: rootMod.default })

  const appShell = resolve(pagesDir, '_app.tsx')
  const appMod = await tryImport(appShell)
  if (appMod?.default) layouts.push({ path: appShell, component: appMod.default })

  return layouts
}

export async function resolveAndRender(
  pagesDir: string,
  pagePath: string,
  ctx: any = {},
): Promise<{ html: string; metadata: Record<string, string> }> {
  const fullPath = resolve(pagesDir, pagePath)
  let pageMod: PageModule = {}

  const pageAttempts = [`${fullPath}.tsx`, `${fullPath}/index.tsx`]
  for (const attempt of pageAttempts) {
    const mod = await tryImport(attempt)
    if (mod) { pageMod = mod; break }
  }
  if (!pageMod.default) throw new Error(`Page not found: ${pagePath}`)

  // Run middleware if present
  if (pageMod.middleware) {
    const allowed = await pageMod.middleware(ctx)
    if (!allowed) return { html: '', metadata: {} }
  }

  // Run loader if present
  let loaderProps: Record<string, unknown> = {}
  let metadata: Record<string, string> = pageMod.metadata ?? {}
  if (pageMod.loader) {
    const result = await pageMod.loader(ctx)
    if (result) {
      if ('props' in result) loaderProps = (result as any).props ?? {}
      if ('metadata' in result) metadata = { ...metadata, ...(result as any).metadata }
    }
  }

  // Resolve layouts (bottom-up)
  const layouts = await resolveLayouts(pagesDir, pagePath)

  // Render page → layout → app shell
  let content = pageMod.default({ ...ctx, ...loaderProps })
  for (let i = layouts.length - 1; i >= 0; i--) {
    content = layouts[i]!.component({ children: content, ...metadata, ...loaderProps })
  }

  const html = renderToString(content)
  return { html, metadata }
}
