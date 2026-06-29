import { resolve } from 'node:path'
import { renderToString } from '../../client/vdom/index.js'

export interface ViewEngine {
  render(page: string, props?: Record<string, unknown>): Promise<string>
}

export class PageView implements ViewEngine {
  private pagesDir: string

  constructor(pagesDir?: string) {
    const base = pagesDir ?? resolve(process.cwd(), 'src/pages')
    this.pagesDir = base
  }

  /**
   * Load a .tsx page component and render it to HTML string.
   * The page file should export a default function that returns JSX.
   *
   * Example page file (src/pages/home.tsx):
   * ```tsx
   * export default function Home({ name }: { name: string }) {
   *   return <div><h1>Hello {name}!</h1></div>
   * }
   * ```
   */
  async render(page: string, props?: Record<string, unknown>): Promise<string> {
    const pagePath = resolve(this.pagesDir, page)

    let mod: any
    try {
      mod = await import(pagePath)
    } catch {
      try {
        mod = await import(`${pagePath}.tsx`)
      } catch {
        try {
          mod = await import(`${pagePath}/index.tsx`)
        } catch {
          throw new Error(`Page not found: ${page} (tried ${pagePath}.tsx and ${pagePath}/index.tsx)`)
        }
      }
    }

    const Component = mod.default || mod
    if (typeof Component !== 'function') {
      throw new Error(`Page "${page}" must export a default function component`)
    }

    const vnode = Component(props ?? {})
    return renderToString(vnode)
  }
}
