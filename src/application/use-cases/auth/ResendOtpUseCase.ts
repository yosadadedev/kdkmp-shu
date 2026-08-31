import type { AuthRepository } from '@domain/repositories/AuthRepository'
import type { ResendOtpResult } from '@domain/entities/OtpSession'
import { createAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'

export class ResendOtpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(sessionId: string): Promise<ResendOtpResult> {
    if (!sessionId || sessionId.trim().length === 0) {
      throw createAppError(ErrorCode.OTP_SESSION_NOT_FOUND)
    }
    return this.authRepository.resendOtp(sessionId.trim())
  }
}
