/**
 * Common success envelope observed across this backend's endpoints
 * (e.g. POST /api/auth/refresh): { data, message, success }.
 */
export interface ApiResponseEnvelope<T> {
  data: T
  message: string
  success: boolean
}

/**
 * Message-only envelope with no `data` payload — used both for error
 * responses (e.g. 401 on POST /api/auth/refresh) and for endpoints whose
 * success response carries no data (e.g. POST /api/auth/validate-nik):
 * { message, success }.
 */
export interface ApiMessageResponseDto {
  message: string
  success: boolean
}
