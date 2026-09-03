import type {
  OtpSession,
  ResendOtpResult,
  SendOtpResult,
  VerifyOtpResult,
} from '@domain/entities/OtpSession'
import type { AuthenticatedSession } from '@domain/entities/AuthenticatedSession'

export interface AuthRepository {
  sendOtpByNationalId(nationalIdNikPlain: string): Promise<SendOtpResult>
  verifyOtpCode(sessionId: string, otpCode: string, nationalIdNikPlain: string): Promise<VerifyOtpResult>
  resendOtp(sessionId: string): Promise<ResendOtpResult>
  storeAuthenticatedSession(session: AuthenticatedSession): Promise<void>
  loadAuthenticatedSession(): Promise<AuthenticatedSession | null>
  clearAuthenticatedSession(): Promise<void>
  getOtpSession(sessionId: string): Promise<OtpSession | null>
}
