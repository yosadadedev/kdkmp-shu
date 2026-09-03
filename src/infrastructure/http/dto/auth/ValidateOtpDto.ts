import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface ValidateOtpRequestDto {
  nik: string
  otp: string
}

export interface ValidateOtpDataDto {
  access_token: string
}

export type ValidateOtpResponseDto = ApiResponseEnvelope<ValidateOtpDataDto>
