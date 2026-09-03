import type { AuthRepository } from '@domain/repositories/AuthRepository'
import type { VerifyOtpResult } from '@domain/entities/OtpSession'
import { normalizeNationalId } from '@domain/value-objects/NationalId'
import { createAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'

const OTP_CODE_LENGTH = 6

export class VerifyOtpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(sessionId: string, otpCode: string, nationalIdNikPlain: string): Promise<VerifyOtpResult> {
  if (!sessionId || sessionId.trim().length === 0) {
    throw createAppError(ErrorCode.OTP_SESSION_NOT_FOUND)
  }
  if (!nationalIdNikPlain || nationalIdNikPlain.trim().length === 0) {
    throw createAppError(ErrorCode.OTP_SESSION_NOT_FOUND)
  }
  const cleaned = otpCode.trim()
  if (cleaned.length !== OTP_CODE_LENGTH || !/^\d{6}$/.test(cleaned)) {
    throw createAppError(ErrorCode.OTP_CODE_INVALID, { overrideMessage: 'OTP code must contain exactly 6 digits' })
  }
  return this.authRepository.verifyOtpCode(sessionId, cleaned, normalizeNationalId(nationalIdNikPlain))
}
}
