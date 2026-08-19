import type { AuthRepository } from '@domain/repositories/AuthRepository'
import type { SendOtpResult } from '@domain/entities/OtpSession'
import { isNationalIdWellFormed, normalizeNationalId } from '@domain/value-objects/NationalId'
import { createAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'

export class SendOtpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(nationalIdNikPlain: string): Promise<SendOtpResult> {
    const normalized = normalizeNationalId(nationalIdNikPlain)
    if (!isNationalIdWellFormed(normalized)) {
      throw createAppError(ErrorCode.NATIONAL_ID_INVALID_FORMAT)
    }
    return this.authRepository.sendOtpByNationalId(normalized)
  }
}
