export type JobHandler = (payload: unknown) => void | Promise<void>

interface Job {
  name: string
  payload: unknown
  handler: JobHandler
}

export class Queue {
  private jobs: Job[] = []
  private processing = false
  private handlers: Map<string, JobHandler> = new Map()

  register(name: string, handler: JobHandler): void {
    this.handlers.set(name, handler)
  }

  push(name: string, payload: unknown): void {
    const handler = this.handlers.get(name)
    if (!handler) throw new Error(`No handler registered for job: ${name}`)
    this.jobs.push({ name, payload, handler })
    this.process()
  }

  private async process(): Promise<void> {
    if (this.processing) return
    this.processing = true
    while (this.jobs.length > 0) {
      const job = this.jobs.shift()!
      try { await job.handler(job.payload) }
      catch (err) { console.error(`[Queue] Job ${job.name} failed:`, err) }
    }
    this.processing = false
  }

  get length(): number { return this.jobs.length }
}
