/**
 * Validasi kode pos Indonesia.
 * Kode pos Indonesia terdiri dari 5 digit angka.
 *
 * @example isKodepos('16110') // true (Bogor)
 * @example isKodepos('12345') // true
 * @example isKodepos('1234') // false (kurang)
 * @example isKodepos('ABCDE') // false
 */
export function isKodepos(value: string): boolean {
  if (value.length !== 5) return false
  return /^\d{5}$/.test(value)
}
