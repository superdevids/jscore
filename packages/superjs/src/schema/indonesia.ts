import { Schema, SchemaError } from './types.js'
import { msg } from './messages.js'
import { isNIK, isNPWP, isPhone } from 'superjs-core/validation'

// ─── NIKSchema ──────────────────────────────────────────────

export class NIKSchema extends Schema<string> {
  protected _parse(value: unknown): string {
    if (typeof value !== 'string') throw new SchemaError(msg('type_string'))
    if (!isNIK(value)) throw new SchemaError(msg('indonesia_nik'))
    return value
  }
}

// ─── NPWPSchema ─────────────────────────────────────────────

export class NPWPSchema extends Schema<string> {
  protected _parse(value: unknown): string {
    if (typeof value !== 'string') throw new SchemaError(msg('type_string'))
    if (!isNPWP(value)) throw new SchemaError(msg('indonesia_npwp'))
    return value
  }
}

// ─── PhoneSchema ────────────────────────────────────────────

export class PhoneSchema extends Schema<string> {
  protected _parse(value: unknown): string {
    if (typeof value !== 'string') throw new SchemaError(msg('type_string'))
    if (!isPhone(value, 'id')) throw new SchemaError(msg('indonesia_phone'))
    return value
  }
}

// ─── AlamatSchema ───────────────────────────────────────────

const ALAMAT_KEYWORDS = [
  /^jl[.\s]/i,
  /^jalan\s/i,
  /^gg[.\s]/i,
  /^gang\s/i,
  /rt\s*\d/i,
  /rw\s*\d/i,
  /dsn/i,
  /dusun/i,
  /kec/i,
  /kelurahan/i,
  /desa/i,
  /perum/i,
  /komplek/i,
]

export class AlamatSchema extends Schema<string> {
  protected _parse(value: unknown): string {
    if (typeof value !== 'string') throw new SchemaError(msg('type_string'))
    if (value.length < 10) throw new SchemaError(msg('indonesia_alamat'))

    let hasKeyword = false
    for (const pattern of ALAMAT_KEYWORDS) {
      if (pattern.test(value)) {
        hasKeyword = true
        break
      }
    }
    if (!hasKeyword) throw new SchemaError(msg('indonesia_alamat'))

    return value
  }
}

// ─── KodeposSchema ──────────────────────────────────────────

export class KodeposSchema extends Schema<string> {
  protected _parse(value: unknown): string {
    if (typeof value !== 'string') throw new SchemaError(msg('type_string'))
    const digits = value.replace(/\s/g, '')
    if (!/^\d{5}$/.test(digits)) throw new SchemaError(msg('indonesia_kodepos'))
    return digits
  }
}

// ─── RekeningSchema ─────────────────────────────────────────

export class RekeningSchema extends Schema<string> {
  protected _parse(value: unknown): string {
    if (typeof value !== 'string') throw new SchemaError(msg('type_string'))
    const digits = value.replace(/\s/g, '')
    if (!/^\d{10,16}$/.test(digits)) throw new SchemaError(msg('indonesia_rekening'))
    return digits
  }
}
