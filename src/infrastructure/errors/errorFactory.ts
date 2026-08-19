import { ApplicationError } from './ApplicationError'
import { ErrorCode } from './ErrorCode'

const MESSAGE_BY_CODE: Readonly<Record<ErrorCode, string>> = {
  [ErrorCode.NATIONAL_ID_NOT_REGISTERED]: 'National ID is not registered in cooperative database',
  [ErrorCode.NATIONAL_ID_INVALID_FORMAT]: 'National ID must contain exactly 16 digits',
  [ErrorCode.OTP_SESSION_NOT_FOUND]: 'OTP session is not found or already consumed',
  [ErrorCode.OTP_CODE_INVALID]: 'OTP code is wrong. Please check again.',
  [ErrorCode.OTP_ATTEMPTS_EXCEEDED]: 'OTP wrong attempt count exceeded the limit',
  [ErrorCode.OTP_EXPIRED]: 'OTP code already expired. Please request a new one.',
  [ErrorCode.OTP_RESEND_LIMIT_EXCEEDED]: 'OTP resend limit per hour has been reached',
  [ErrorCode.OTP_LOCKED_TEMPORARILY]: 'OTP verification is locked temporarily. Please wait.',
  [ErrorCode.AUTH_SESSION_EXPIRED]: 'Your session has expired. Please log in again.',
  [ErrorCode.AUTH_SESSION_NOT_FOUND]: 'Authenticated session could not be found',
  [ErrorCode.MEMBER_PROFILE_NOT_FOUND]: 'Member profile data is not available',
  [ErrorCode.VOTE_ALREADY_SUBMITTED]: 'Member already submitted a vote for this fiscal year',
  [ErrorCode.VOTING_PERIOD_CLOSED]: 'Voting period for this SHU record has been closed',
  [ErrorCode.PROFIT_SHARING_RECORD_NOT_FOUND]: 'Profit sharing record is not found for current fiscal year',
  [ErrorCode.NETWORK_ERROR]: 'Network connection failed. Please try again.',
  [ErrorCode.UNKNOWN]: 'An unexpected error occurred. Please try again later.',
  [ErrorCode.VALIDATION_ERROR]: 'Validation error. Please review the input fields.',
}

export const createAppError = (
  code: ErrorCode,
  options?: { cause?: unknown; meta?: Record<string, unknown>; overrideMessage?: string },
): ApplicationError => {
  return new ApplicationError(code, options?.overrideMessage ?? MESSAGE_BY_CODE[code], options)
}

export const wrapUnknownAsAppError = (err: unknown): ApplicationError => {
  if (err instanceof ApplicationError) return err
  if (err instanceof Error) {
    if (err.name === 'AbortError' || /network|fetch|timeout/i.test(err.message)) {
      return createAppError(ErrorCode.NETWORK_ERROR, { cause: err })
    }
    return createAppError(ErrorCode.UNKNOWN, { cause: err, meta: { stack: err.stack } })
  }
  return createAppError(ErrorCode.UNKNOWN, { meta: { rawErr: String(err) } })
}
