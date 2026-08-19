import type { OtpSessionStatus } from '@domain/enums/OtpSessionStatus'

export interface OtpSession {
  sessionId: string
  memberId: string
  nationalIdNikHash: string
  attemptCount: number
  maxAttempts: number
  resendCount: number
  maxResendsPerHour: number
  expireAtEpochMs: number
  createdAtEpochMs: number
  lockedUntilEpochMs: number | null
  status: OtpSessionStatus
  maskDestination: string
}

export interface SendOtpResult {
  session: OtpSession
  countdownResendSeconds: number
  countdownExpireSeconds: number
}

export interface VerifyOtpResult {
  isVerified: boolean
  authToken?: string
  memberId?: string
  nextAttemptWaitSeconds: number
  session: OtpSession
}

export interface ResendOtpResult {
  session: OtpSession
  countdownResendSeconds: number
  countdownExpireSeconds: number
}
