import type { Router } from '../router/index.js'

interface RouteInfo {
  methods: string[]
  path: string
}

interface OpenApiConfig {
  title?: string
  version?: string
  description?: string
  servers?: { url: string; description?: string }[]
}

export function generateOpenApiSpec(router: Router, config: OpenApiConfig = {}): Record<string, unknown> {
  const routes = ((router as unknown as Record<string, unknown>).routes as RouteInfo[]) ?? []

  const paths: Record<string, Record<string, unknown>> = {}
  for (const route of routes) {
    for (const method of route.methods) {
      const m = method.toLowerCase()
      if (!paths[route.path]) paths[route.path] = {}
      const entry = paths[route.path]!
      entry[m] = {
        summary: `Route ${method} ${route.path}`,
        responses: { '200': { description: 'Success' } },
        parameters: extractParams(route.path),
      }
    }
  }

  return {
    openapi: '3.0.3',
    info: {
      title: config.title ?? 'SpeexJS API',
      version: config.version ?? '1.0.0',
      description: config.description ?? '',
    },
    servers: config.servers ?? [{ url: 'http://localhost:3000' }],
    paths,
  }
}

function extractParams(path: string): any[] {
  const params: any[] = []
  const matches = path.match(/:(\w+)/g)
  if (matches) {
    for (const m of matches) {
      params.push({
        name: m.slice(1),
        in: 'path',
        required: true,
        schema: { type: 'string' },
      })
    }
  }
  return params
}
