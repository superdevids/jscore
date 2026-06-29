import { randomBytes } from 'node:crypto'
import { hashPassword } from '../../native/hashing.js'

export class PasswordReset {
  private tokens = new Map<string, { email: string; expiresAt: number }>()

  generateToken(email: string): string {
    const token = randomBytes(32).toString('hex')
    this.tokens.set(token, { email, expiresAt: Date.now() + 3600000 })
    return token
  }

  async reset(token: string, newPassword: string): Promise<string | null> {
    const entry = this.tokens.get(token)
    if (!entry || entry.expiresAt < Date.now()) { this.tokens.delete(token); return null }
    this.tokens.delete(token)
    const hashed = await hashPassword(newPassword)
    return hashed
  }
}
