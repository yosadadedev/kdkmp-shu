import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface RefreshTokenRequestDto {
  refresh_token: string
}

export interface RefreshTokenResultDto {
  access_token: string
}

export type RefreshTokenResponseDto = ApiResponseEnvelope<RefreshTokenResultDto>
