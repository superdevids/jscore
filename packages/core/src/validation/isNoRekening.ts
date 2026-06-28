/**
 * Validasi nomor rekening bank Indonesia.
 * Format: 8-16 digit angka (tergantung bank).
 *
 * @example isNoRekening('1234567890') // true (10 digit)
 * @example isNoRekening('12345678') // true (8 digit - minimum)
 * @example isNoRekening('1234567890123456') // true (16 digit - maksimum)
 * @example isNoRekening('12345') // false (kurang dari 8 digit)
 */
export function isNoRekening(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 16) return false
  return true
}
