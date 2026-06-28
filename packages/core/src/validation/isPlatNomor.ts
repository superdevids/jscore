/**
 * Validasi Plat Nomor Kendaraan Bermotor Indonesia.
 *
 * Format: [KODE_DEPAN] [ANGKA] [KODE_BELAKANG]
 * - Kode depan: 1-2 huruf (kode daerah)
 * - Angka: 1-4 digit
 * - Kode belakang: 1-3 huruf (opsional)
 *
 * @example isPlatNomor('B 1234 CD') // true (Jakarta)
 * @example isPlatNomor('AB 5678 XYZ') // true
 * @example isPlatNomor('B 1 A') // true
 * @example isPlatNomor('INVALID') // false
 */
export function isPlatNomor(value: string): boolean {
  const trimmed = value.trim().toUpperCase()
  const regex = /^([A-Z]{1,2})\s*(\d{1,4})\s*([A-Z]{0,3})$/
  const match = trimmed.match(regex)
  if (!match) return false

  const kodeDepan = match[1]!
  const angka = parseInt(match[2]!, 10)
  const kodeBelakang = match[3] || ''

  if (!KODE_DAERAH.includes(kodeDepan)) return false
  if (angka < 1 || angka > 9999) return false
  if (kodeBelakang.length > 3) return false
  return true
}

const KODE_DAERAH = [
  'A', 'AA', 'AB', 'AD', 'AE', 'AG', 'B', 'BA', 'BB', 'BD', 'BE', 'BG',
  'BH', 'BK', 'BL', 'BM', 'BN', 'BP', 'BR', 'BT', 'BU', 'BV', 'BW', 'D',
  'DA', 'DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DK', 'DL', 'DM', 'DN',
  'DP', 'DR', 'DT', 'DU', 'DW', 'E', 'EA', 'EB', 'ED', 'EE', 'F', 'G',
  'H', 'K', 'KB', 'KH', 'KI', 'KU', 'KT', 'L', 'M', 'N', 'NB', 'NG',
  'NK', 'NM', 'P', 'PA', 'PB', 'R', 'S', 'ST', 'T', 'W', 'Z',
]
