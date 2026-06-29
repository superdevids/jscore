import { createHmac, randomBytes } from 'node:crypto'

export class TOTP {
  generateSecret(): string { return randomBytes(20).toString('base64') }

  generateCode(secret: string): string {
    const counter = Math.floor(Date.now() / 30000)
    const buf = Buffer.alloc(8)
    buf.writeBigUint64BE(BigInt(counter))
    const hmac = createHmac('sha1', Buffer.from(secret, 'base64')).update(buf).digest()
    const offset = hmac[hmac.length - 1]! & 0xf
    const code = ((hmac[offset]! & 0x7f) << 24 | (hmac[offset + 1]! & 0xff) << 16 | (hmac[offset + 2]! & 0xff) << 8 | (hmac[offset + 3]! & 0xff)) % 1000000
    return String(code).padStart(6, '0')
  }

  verify(secret: string, code: string): boolean {
    return this.generateCode(secret) === code
  }

  getProvisioningUri(secret: string, email: string, issuer = 'SpeexJS'): string {
    return `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`
  }
}
