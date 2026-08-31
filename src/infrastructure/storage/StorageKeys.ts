export const StorageKeys = {
  AUTHENTICATED_SESSION: 'kdkmp_shu_auth_session_v1',
  LAST_USED_NATIONAL_ID_MASKED: 'kdkmp_shu_last_nik_masked_v1',
  LANGUAGE_PREFERENCE: 'kdkmp_shu_language_v1',
  GATE_COMPANY: 'kdkmp_shu_gate_company_v1',
} as const

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys]
