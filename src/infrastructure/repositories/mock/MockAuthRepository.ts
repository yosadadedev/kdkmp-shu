import type { AuthRepository } from '@domain/repositories/AuthRepository'
import type {
  OtpSession,
  ResendOtpResult,
  SendOtpResult,
  VerifyOtpResult,
} from '@domain/entities/OtpSession'
import type { AuthenticatedSession } from '@domain/entities/AuthenticatedSession'
import { OtpSessionStatus } from '@domain/enums/OtpSessionStatus'
import { SecureStorage } from '@infra/storage/SecureStorage'
import { StorageKeys } from '@infra/storage/StorageKeys'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'
import {
  MOCK_MEMBERS,
  MOCK_OTP_CODE_FOR_DEV,
} from './MockSeed'
import { hashNationalIdDummy, isNationalIdWellFormed, normalizeNationalId } from '@domain/value-objects/NationalId'

const OTP_EXPIRE_SECONDS = 3 * 60
const RESEND_COOLDOWN_SECONDS = 3 * 60
const MAX_ATTEMPTS = 5
const MAX_RESENDS_PER_HOUR = 3
const LOCK_DURATION_SECONDS = 15 * 60

const mockDelayMs = () => new Promise<void>((r) => setTimeout(r, 520 + Math.floor(Math.random() * 280)))

interface InMemoryOtpState {
  session: OtpSession
  actualOtpCode: string
}

const inMemoryOtpSessions = new Map<string, InMemoryOtpState>()

const buildOtpSession = (
  sessionId: string,
  memberId: string,
  nationalIdNikHash: string,
  maskDestination: string,
): OtpSession => {
  const now = Date.now()
  return {
    sessionId,
    memberId,
    nationalIdNikHash,
    attemptCount: 0,
    maxAttempts: MAX_ATTEMPTS,
    resendCount: 0,
    maxResendsPerHour: MAX_RESENDS_PER_HOUR,
    expireAtEpochMs: now + OTP_EXPIRE_SECONDS * 1000,
    createdAtEpochMs: now,
    lockedUntilEpochMs: null,
    status: OtpSessionStatus.PENDING,
    maskDestination,
  }
}

const genSessionId = () => `otp_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
const genAuthToken = () => `tk_${Math.random().toString(36).slice(2, 18)}_${Date.now().toString(36)}`
const genRefreshToken = () => `rf_${Math.random().toString(36).slice(2, 24)}`

const findMemberByNikPlain = (nikPlain: string) => {
  const normalized = normalizeNationalId(nikPlain)
  const hash = hashNationalIdDummy(normalized)
  return MOCK_MEMBERS.find((m) => m.nationalIdNikHash === hash) ?? null
}

const buildAuthSessionForMember = (memberId: string): AuthenticatedSession => {
  const now = Date.now()
  return {
    authToken: genAuthToken(),
    memberId,
    refreshToken: genRefreshToken(),
    issuedAtEpochMs: now,
    expireAtEpochMs: now + 1000 * 60 * 60 * 12,
  }
}

export class MockAuthRepository implements AuthRepository {
  async sendOtpByNationalId(nationalIdNikPlain: string): Promise<SendOtpResult> {
    await mockDelayMs()
    try {
      const normalized = normalizeNationalId(nationalIdNikPlain)
      if (!isNationalIdWellFormed(normalized)) {
        throw wrapUnknownAsAppError({ code: ErrorCode.NATIONAL_ID_INVALID_FORMAT })
      }
      const member = findMemberByNikPlain(normalized)
      if (!member) {
        throw wrapUnknownAsAppError({ code: ErrorCode.NATIONAL_ID_NOT_REGISTERED })
      }
      const sessionId = genSessionId()
      const session = buildOtpSession(sessionId, member.id, member.nationalIdNikHash, member.phoneNumberMasked)
      inMemoryOtpSessions.set(sessionId, { session, actualOtpCode: MOCK_OTP_CODE_FOR_DEV })
      return {
        session,
        countdownResendSeconds: RESEND_COOLDOWN_SECONDS,
        countdownExpireSeconds: OTP_EXPIRE_SECONDS,
      }
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }

  async verifyOtpCode(sessionId: string, otpCode: string): Promise<VerifyOtpResult> {
    await mockDelayMs()
    try {
      const state = inMemoryOtpSessions.get(sessionId)
      if (!state) {
        throw wrapUnknownAsAppError({ code: ErrorCode.OTP_SESSION_NOT_FOUND })
      }
      const now = Date.now()
      const { session, actualOtpCode } = state

      if (session.lockedUntilEpochMs && now < session.lockedUntilEpochMs) {
        const remaining = Math.ceil((session.lockedUntilEpochMs - now) / 1000)
        return {
          isVerified: false,
          nextAttemptWaitSeconds: remaining,
          session: { ...session, status: OtpSessionStatus.LOCKED },
        }
      }

      if (now > session.expireAtEpochMs) {
        session.status = OtpSessionStatus.EXPIRED
        state.session = session
        throw wrapUnknownAsAppError({ code: ErrorCode.OTP_EXPIRED })
      }

      session.attemptCount += 1
      const isMatch = otpCode === actualOtpCode

      if (!isMatch) {
        if (session.attemptCount >= MAX_ATTEMPTS) {
          session.status = OtpSessionStatus.LOCKED
          session.lockedUntilEpochMs = now + LOCK_DURATION_SECONDS * 1000
          state.session = session
          return {
            isVerified: false,
            nextAttemptWaitSeconds: LOCK_DURATION_SECONDS,
            session,
          }
        }
        state.session = session
        throw wrapUnknownAsAppError({ code: ErrorCode.OTP_CODE_INVALID })
      }

      session.status = OtpSessionStatus.VERIFIED
      state.session = session
      const authSession = buildAuthSessionForMember(session.memberId)
      await this.storeAuthenticatedSession(authSession)
      return {
        isVerified: true,
        authToken: authSession.authToken,
        memberId: session.memberId,
        nextAttemptWaitSeconds: 0,
        session,
      }
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }

  async resendOtp(sessionId: string): Promise<ResendOtpResult> {
    await mockDelayMs()
    try {
      const state = inMemoryOtpSessions.get(sessionId)
      if (!state) {
        throw wrapUnknownAsAppError({ code: ErrorCode.OTP_SESSION_NOT_FOUND })
      }
      const now = Date.now()
      const { session } = state
      if (session.resendCount >= MAX_RESENDS_PER_HOUR) {
        throw wrapUnknownAsAppError({ code: ErrorCode.OTP_RESEND_LIMIT_EXCEEDED })
      }
      session.resendCount += 1
      session.expireAtEpochMs = now + OTP_EXPIRE_SECONDS * 1000
      session.createdAtEpochMs = now
      session.attemptCount = 0
      session.status = OtpSessionStatus.PENDING
      session.lockedUntilEpochMs = null
      state.actualOtpCode = MOCK_OTP_CODE_FOR_DEV
      state.session = session
      return {
        session,
        countdownResendSeconds: RESEND_COOLDOWN_SECONDS,
        countdownExpireSeconds: OTP_EXPIRE_SECONDS,
      }
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }

  async storeAuthenticatedSession(session: AuthenticatedSession): Promise<void> {
    await mockDelayMs()
    SecureStorage.set(StorageKeys.AUTHENTICATED_SESSION, session)
  }

  async loadAuthenticatedSession(): Promise<AuthenticatedSession | null> {
    await mockDelayMs()
    const raw = SecureStorage.get<AuthenticatedSession>(StorageKeys.AUTHENTICATED_SESSION)
    if (!raw) return null
    if (raw.expireAtEpochMs < Date.now()) {
      SecureStorage.remove(StorageKeys.AUTHENTICATED_SESSION)
      return null
    }
    return raw
  }

  async clearAuthenticatedSession(): Promise<void> {
    SecureStorage.remove(StorageKeys.AUTHENTICATED_SESSION)
  }

  async getOtpSession(sessionId: string): Promise<OtpSession | null> {
    return inMemoryOtpSessions.get(sessionId)?.session ?? null
  }
}
