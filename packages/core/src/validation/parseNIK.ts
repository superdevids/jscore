/**
 * Parse data dari NIK (Nomor Induk Kependudukan).
 *
 * @example parseNIK('3201010203940001')
 * // { nik: '3201010203940001', valid: true, gender: 'LAKI-LAKI', birthDate: Date(1994-03-02), province: 'JAWA BARAT', city: 'BOGOR', district: 'CIAWI' }
 *
 * @example parseNIK('3201015203940001')
 * // { nik: '3201015203940001', valid: true, gender: 'PEREMPUAN', birthDate: Date(1994-03-12), province: 'JAWA BARAT', ... }
 */
export function parseNIK(value: string): NIKInfo {
  const digits = value.replace(/\D/g, '')
  const info: NIKInfo = {
    nik: value,
    valid: false,
    gender: null,
    birthDate: null,
    province: null,
    provinceCode: null,
    city: null,
    cityCode: null,
    district: null,
    districtCode: null,
    uniqueCode: null,
  }

  if (digits.length !== 16) return info

  const provinceCode = digits.slice(0, 2)
  const cityCode = digits.slice(2, 4)
  const districtCode = digits.slice(4, 6)
  const rawDay = Number.parseInt(digits.slice(6, 8), 10)
  const month = Number.parseInt(digits.slice(8, 10), 10)
  const year = Number.parseInt(digits.slice(10, 12), 10)
  const uniqueCode = digits.slice(12, 16)

  if (rawDay < 1 || rawDay > 71 || month < 1 || month > 12) return info

  const gender: 'LAKI-LAKI' | 'PEREMPUAN' = rawDay >= 41 ? 'PEREMPUAN' : 'LAKI-LAKI'
  let day = rawDay
  if (day >= 41) day -= 40

  const fullYear = year < 70 ? 2000 + year : 1900 + year
  const birthDate = new Date(fullYear, month - 1, day)

  if (
    birthDate.getFullYear() !== fullYear ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return info
  }

  return {
    nik: value,
    valid: true,
    gender,
    birthDate,
    province: PROVINCE_CODES[provinceCode] ?? null,
    provinceCode,
    city: null,
    cityCode,
    district: null,
    districtCode,
    uniqueCode,
  }
}

export interface NIKInfo {
  nik: string
  valid: boolean
  gender: 'LAKI-LAKI' | 'PEREMPUAN' | null
  birthDate: Date | null
  province: string | null
  provinceCode: string | null
  city: string | null
  cityCode: string | null
  district: string | null
  districtCode: string | null
  uniqueCode: string | null
}

const PROVINCE_CODES: Record<string, string> = {
  '11': 'ACEH',
  '12': 'SUMATERA UTARA',
  '13': 'SUMATERA BARAT',
  '14': 'RIAU',
  '15': 'JAMBI',
  '16': 'SUMATERA SELATAN',
  '17': 'BENGKULU',
  '18': 'LAMPUNG',
  '19': 'KEPULAUAN BANGKA BELITUNG',
  '21': 'KEPULAUAN RIAU',
  '31': 'DKI JAKARTA',
  '32': 'JAWA BARAT',
  '33': 'JAWA TENGAH',
  '34': 'DI YOGYAKARTA',
  '35': 'JAWA TIMUR',
  '36': 'BANTEN',
  '51': 'BALI',
  '52': 'NUSA TENGGARA BARAT',
  '53': 'NUSA TENGGARA TIMUR',
  '61': 'KALIMANTAN BARAT',
  '62': 'KALIMANTAN TENGAH',
  '63': 'KALIMANTAN SELATAN',
  '64': 'KALIMANTAN TIMUR',
  '65': 'KALIMANTAN UTARA',
  '71': 'SULAWESI UTARA',
  '72': 'SULAWESI TENGAH',
  '73': 'SULAWESI SELATAN',
  '74': 'SULAWESI TENGGARA',
  '75': 'GORONTALO',
  '76': 'SULAWESI BARAT',
  '81': 'MALUKU',
  '82': 'MALUKU UTARA',
  '91': 'PAPUA',
  '92': 'PAPUA BARAT',
  '93': 'PAPUA SELATAN',
  '94': 'PAPUA TENGAH',
  '95': 'PAPUA PEGUNUNGAN',
}
