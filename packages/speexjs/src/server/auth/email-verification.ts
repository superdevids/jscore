import { randomBytes } from 'node:crypto'

export class EmailVerification {
  private tokens = new Map<string, { email: string; expiresAt: number }>()

  generateToken(email: string): string {
    const token = randomBytes(32).toString('hex')
    this.tokens.set(token, { email, expiresAt: Date.now() + 3600000 })
    return token
  }

  verify(token: string): string | null {
    const entry = this.tokens.get(token)
    if (!entry || entry.expiresAt < Date.now()) { this.tokens.delete(token); return null }
    this.tokens.delete(token)
    return entry.email
  }

  isValid(email: string): boolean {
    for (const [, entry] of this.tokens) {
      if (entry.email === email && entry.expiresAt > Date.now()) return true
    }
    return false
  }
}
