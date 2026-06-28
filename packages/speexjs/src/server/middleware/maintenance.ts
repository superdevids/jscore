import type { Middleware } from './index.js'

let isDown = false
let retrySeconds = 60

export function enableMaintenanceMode(retryAfter = 60): void {
  isDown = true
  retrySeconds = retryAfter
}

export function disableMaintenanceMode(): void {
  isDown = false
}

export function isInMaintenanceMode(): boolean {
  return isDown
}

export function maintenance(): Middleware {
  return (ctx, next) => {
    if (isDown) {
      ctx.response
        .status(503)
        .header('retry-after', String(retrySeconds))
        .json({
          error: 'SERVICE_UNAVAILABLE',
          message: 'Application is in maintenance mode. Please try again later.',
        })
      return
    }
    return next()
  }
}
