export const NATIONAL_ID_LENGTH = 16

export const isNationalIdWellFormed = (raw: unknown): raw is string => {
  if (typeof raw !== 'string') return false
  const cleaned = raw.replace(/\s+/g, '')
  return cleaned.length === NATIONAL_ID_LENGTH && /^\d{16}$/.test(cleaned)
}

export const normalizeNationalId = (raw: string): string => {
  return raw.replace(/\s+/g, '').trim()
}

export const maskNationalId = (nationalIdNikPlainOrMasked: string): string => {
  const cleaned = nationalIdNikPlainOrMasked.replace(/\s+/g, '')
  if (cleaned.length !== 16) {
    return '************' + cleaned.slice(-4)
  }
  return '************' + cleaned.slice(12)
}

export const hashNationalIdDummy = (nationalIdNikPlain: string): string => {
  const normalized = normalizeNationalId(nationalIdNikPlain)
  let hash = 0x811c9dc5
  for (let i = 0; i < normalized.length; i += 1) {
    hash ^= normalized.charCodeAt(i)
    hash = (hash * 0x01000193) >>> 0
  }
  const suffix = normalized.slice(-6)
  return `sha256_mock_${hash.toString(16).padStart(8, '0')}${suffix}`
}
