import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface ValidateOtpRequestDto {
  otp: string
}

export interface ValidateOtpDataDto {
  user_nik: string
  company_nik: string
}

export type ValidateOtpResponseDto = ApiResponseEnvelope<ValidateOtpDataDto>
