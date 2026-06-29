import { verifyPassword } from '../../native/hashing.js'

export class PasswordConfirm {
  private confirmed = new Map<string | number, number>()

  async confirm(userId: string | number, password: string, hashedPassword: string): Promise<boolean> {
    const valid = await verifyPassword(password, hashedPassword)
    if (valid) this.confirmed.set(userId, Date.now() + 3600000)
    return valid
  }

  isRecentlyConfirmed(userId: string | number): boolean {
    const expiry = this.confirmed.get(userId)
    if (!expiry) return false
    if (expiry < Date.now()) { this.confirmed.delete(userId); return false }
    return true
  }

  reset(userId: string | number): void { this.confirmed.delete(userId) }
}
