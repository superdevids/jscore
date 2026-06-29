import { resolve } from 'node:path'
import { renderToString } from '../../client/vdom/index.js'

interface LayoutModule {
  default?: (props: any) => any
}

interface ResolvedLayout {
  path: string
  component: (props: any) => any
}

export interface PageModule {
  default?: (props: any) => any
  loader?: (ctx: any) => Promise<Record<string, unknown> | { props?: Record<string, unknown>; metadata?: Record<string, string> }>
  metadata?: Record<string, string>
  middleware?: (ctx: any) => Promise<boolean>
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
    try { pageMod = await import(attempt); break } catch { continue }
  }
  if (!pageMod.default) throw new Error(`Page not found: ${pagePath}`)

  if (pageMod.middleware) {
    const allowed = await pageMod.middleware(ctx)
    if (!allowed) return { html: '', metadata: {} }
  }

  let loaderProps: Record<string, unknown> = {}
  let metadata: Record<string, string> = pageMod.metadata ?? {}
  if (pageMod.loader) {
    const result = await pageMod.loader(ctx)
    if (result) {
      if ('props' in result) loaderProps = (result as any).props ?? {}
      if ('metadata' in result) metadata = { ...metadata, ...(result as any).metadata }
    }
  }

  const layouts = await resolveLayouts(pagesDir, pagePath)

  let content = pageMod.default({ ...ctx, ...loaderProps })

  for (const layout of layouts.reverse()) {
    content = layout.component({ children: content, ...metadata, ...loaderProps })
  }

  const html = renderToString(content)
  return { html, metadata }
}

async function resolveLayouts(pagesDir: string, pagePath: string): Promise<ResolvedLayout[]> {
  const layouts: ResolvedLayout[] = []
  const segments = pagePath.replace(/\\/g, '/').split('/')

  let currentPath = resolve(pagesDir)
  for (let i = 0; i < segments.length - 1; i++) {
    currentPath = resolve(currentPath, segments[i]!)
    const layoutPath = resolve(currentPath, '_layout.tsx')
    try {
      const mod: LayoutModule = await import(layoutPath)
      if (mod.default) layouts.push({ path: layoutPath, component: mod.default })
    } catch { /* no layout at this level */ }
  }

  const rootLayout = resolve(pagesDir, '_layout.tsx')
  try {
    const mod: LayoutModule = await import(rootLayout)
    if (mod.default) layouts.push({ path: rootLayout, component: mod.default })
  } catch { /* no root layout */ }

  const appShell = resolve(pagesDir, '_app.tsx')
  try {
    const mod: LayoutModule = await import(appShell)
    if (mod.default) layouts.push({ path: appShell, component: mod.default })
  } catch { /* no app shell */ }

  return layouts
}
