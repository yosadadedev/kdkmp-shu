import type { AuthRepository } from '@domain/repositories/AuthRepository'
import type {
  OtpSession,
  ResendOtpResult,
  SendOtpResult,
  VerifyOtpResult,
} from '@domain/entities/OtpSession'
import type { AuthenticatedSession } from '@domain/entities/AuthenticatedSession'
import { normalizeNationalId } from '@domain/value-objects/NationalId'
import type { HttpClient } from '@infra/http/HttpClient'
import { validateNik, validateOtp } from '@infra/http/api/authApi'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { createAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'
import { MOCK_OTP_CODE_FOR_DEV } from '@infra/repositories/mock/MockSeed'

/**
 * Real backend is only live for NIK validation so far — OTP session
 * issuance/verification/resend still has no server-side counterpart, so
 * this repository delegates everything past the NIK check to `fallback`
 * (currently a mock). Narrow `fallback`'s responsibility further as the
 * backend implements each remaining endpoint.
 */
export class HttpAuthRepository implements AuthRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly fallback: AuthRepository,
  ) {}

  async sendOtpByNationalId(nationalIdNikPlain: string): Promise<SendOtpResult> {
    const normalized = normalizeNationalId(nationalIdNikPlain)

    try {
      const result = await validateNik(this.httpClient, { nik: normalized })
      if (!result.success) {
        throw createAppError(ErrorCode.NATIONAL_ID_NOT_REGISTERED, { meta: { message: result.message } })
      }
    } catch (err) {
      // A response the server actually sent (has an HTTP status) but flagged
      // as failed means the NIK is invalid/unregistered, not a connectivity
      // problem — only a status-less failure (timeout/abort/DNS) is a real
      // network error.
      if (isApplicationError(err) && err.code === ErrorCode.NETWORK_ERROR && typeof err.meta?.status === 'number') {
        throw createAppError(ErrorCode.NATIONAL_ID_NOT_REGISTERED, { cause: err, meta: err.meta })
      }
      throw err
    }

    return this.fallback.sendOtpByNationalId(normalized)
  }

  async verifyOtpCode(sessionId: string, otpCode: string, nationalIdNikPlain: string): Promise<VerifyOtpResult> {
    let accessToken: string | undefined
    try {
      const result = await validateOtp(this.httpClient, { nik: nationalIdNikPlain, otp: otpCode })
      if (!result.success) {
        throw createAppError(ErrorCode.OTP_CODE_INVALID, { meta: { message: result.message } })
      }
      accessToken = result.data.access_token
    } catch (err) {
      // Same reasoning as sendOtpByNationalId: a response the server actually
      // sent (has an HTTP status) but flagged as failed means the OTP is
      // wrong, not a connectivity problem — only a status-less failure
      // (timeout/abort/DNS) is a real network error.
      if (isApplicationError(err) && err.code === ErrorCode.NETWORK_ERROR && typeof err.meta?.status === 'number') {
        throw createAppError(ErrorCode.OTP_CODE_INVALID, { cause: err, meta: err.meta })
      }
      throw err
    }

    // The real backend only confirms the OTP is correct so far — session
    // bookkeeping (attempt counts, lock state, auth token issuance) still has
    // no server-side counterpart, so delegate that part to `fallback`. The
    // mock only recognizes its own dev code as "correct", so once the real
    // backend has confirmed the user's code, swap in the dev code here
    // rather than passing the user's code straight through — otherwise the
    // mock would reject an already-confirmed-correct OTP as invalid.
    const result = await this.fallback.verifyOtpCode(sessionId, MOCK_OTP_CODE_FOR_DEV, nationalIdNikPlain)

    // The mock builds its own (fake) AuthenticatedSession as part of
    // verification above — patch in the real access_token the backend just
    // confirmed (used as the Authorization header via authTokenProvider),
    // plus userNik from the already-validated login NIK, so anything reading
    // the stored session gets real values instead of the mock's. The
    // validate-otp response no longer returns company_nik, so that field is
    // left as whatever the fallback session already carries.
    if (result.isVerified && accessToken !== undefined) {
      const authSession = await this.fallback.loadAuthenticatedSession()
      if (authSession) {
        await this.fallback.storeAuthenticatedSession({
          ...authSession,
          userNik: nationalIdNikPlain,
          authToken: accessToken,
        })
      }
    }

    return result
  }

  resendOtp(sessionId: string): Promise<ResendOtpResult> {
    return this.fallback.resendOtp(sessionId)
  }

  storeAuthenticatedSession(session: AuthenticatedSession): Promise<void> {
    return this.fallback.storeAuthenticatedSession(session)
  }

  loadAuthenticatedSession(): Promise<AuthenticatedSession | null> {
    return this.fallback.loadAuthenticatedSession()
  }

  clearAuthenticatedSession(): Promise<void> {
    return this.fallback.clearAuthenticatedSession()
  }

  getOtpSession(sessionId: string): Promise<OtpSession | null> {
    return this.fallback.getOtpSession(sessionId)
  }
}
