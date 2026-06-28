import { readdirSync, statSync } from 'node:fs'
import { join, extname, relative } from 'node:path'
import { Router } from './index.js'

export function registerFileRoutes(router: Router, routesDir: string): void {
  const entries = readdirSync(routesDir, { recursive: true })
  
  for (const entry of entries) {
    const fullPath = join(routesDir, entry.toString())
    if (!statSync(fullPath).isFile()) continue
    const ext = extname(fullPath)
    if (ext !== '.ts' && ext !== '.js') continue
    
    const routePath = '/' + relative(routesDir, fullPath)
      .replace(/\\/g, '/')
      .replace(/\.[jt]s$/, '')
      .replace(/\/index$/, '')
      .replace(/\[(\w+)\]/g, ':$1')
    
    const mod = require(fullPath)
    if (typeof mod.get === 'function') router.get(routePath, mod.get)
    if (typeof mod.post === 'function') router.post(routePath, mod.post)
    if (typeof mod.put === 'function') router.put(routePath, mod.put)
    if (typeof mod.patch === 'function') router.patch(routePath, mod.patch)
    if (typeof mod.del === 'function') router.delete(routePath, mod.del)
  }
}
