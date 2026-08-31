export const CENTS_PER_RUPIAH = 100

export const rupiahFromCents = (cents: number): number => Math.round(cents) / CENTS_PER_RUPIAH

export const formatInteger = (value: number, locale = 'id-ID'): string => {
  const intValue = Math.round(value)
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(intValue)
}

export const formatRupiah = (
  cents: number,
  options: { withSymbol?: boolean; fractionDigits?: 0 | 2; compactShort?: boolean } = {},
): string => {
  const { withSymbol = true, fractionDigits = 0, compactShort = false } = options
  const rupiah = rupiahFromCents(cents)
  const sign = rupiah < 0 ? '- ' : ''
  const absolute = Math.abs(rupiah)
  const formatter = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
    notation: compactShort ? 'compact' : 'standard',
    compactDisplay: 'short',
  })
  const numeric = formatter.format(absolute)
  const symbol = withSymbol ? 'Rp' : ''
  return `${sign}${symbol}${symbol ? ' ' : ''}${numeric}`
}

export const formatShortRupiah = (cents: number): string => formatRupiah(cents, { compactShort: true })

export const formatPercentage = (value: number, fractionDigits = 0): string =>
  `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: fractionDigits, minimumFractionDigits: 0 }).format(value)}%`

export const maskPhone = (rawPhone: string): string => {
  const digits = rawPhone.replace(/\D+/g, '')
  if (digits.length <= 6) return rawPhone
  return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`
}

const maskNationalIdFromPlain = (plain: string): string => {
  const digits = plain.replace(/\D+/g, '')
  if (digits.length < 4) return digits
  return `${'*'.repeat(Math.max(digits.length - 4, 12))}${digits.slice(-4)}`
}

export const maskNationalId = maskNationalIdFromPlain

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const MONTH_NAMES_SHORT_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

export const formatDateLongId = (isoOrDate: string | Date): string => {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate
  if (Number.isNaN(d.getTime())) return '-'
  return `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`
}

export const formatMonthLabelId = (monthNumber1To12: number, year: number): string =>
  `${MONTH_NAMES_SHORT_ID[monthNumber1To12 - 1]} ${year}`

export const formatMonthYearFullId = (isoOrDate: string | Date): string => {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate
  if (Number.isNaN(d.getTime())) return '-'
  return `${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`
}

export const formatCountdownMmSs = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const mm = Math.floor(safe / 60)
  const ss = safe % 60
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export const formatCountdownHumanId = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  if (m === 0) return `${s} detik`
  if (s === 0) return `${m} menit`
  return `${m} menit ${s} detik`
}
