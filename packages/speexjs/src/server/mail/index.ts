export interface MailMessage {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from?: string
}

export interface MailTransport {
  send(message: MailMessage): Promise<void>
}

export class Mailer {
  constructor(private transport: MailTransport) {}

  async send(message: MailMessage): Promise<void> {
    await this.transport.send(message)
  }

  async sendLater(message: MailMessage): Promise<void> {
    setImmediate(() => { this.send(message).catch(() => {}) })
  }
}

export class ConsoleMailTransport implements MailTransport {
  async send(message: MailMessage): Promise<void> {
    console.log('[Mail]', JSON.stringify(message, null, 2))
  }
}
