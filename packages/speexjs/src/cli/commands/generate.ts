import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { colors } from '../../native/colors.js'

interface StaticPage { path: string; content: string }

export async function generate(pages: StaticPage[], outDir = 'dist'): Promise<void> {
  const out = resolve(process.cwd(), outDir)
  if (!existsSync(out)) mkdirSync(out, { recursive: true })

  for (const page of pages) {
    const filePath = resolve(out, page.path === '/' ? 'index.html' : `${page.path}.html`.replace(/\/\//g, '/'))
    const dir = resolve(filePath, '..')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(filePath, page.content, 'utf-8')
    console.log(`  ${colors.green('✓')} Generated ${page.path}`)
  }
  console.log(`  ${colors.cyan('→')} ${pages.length} pages generated to ${outDir}/`)
}
