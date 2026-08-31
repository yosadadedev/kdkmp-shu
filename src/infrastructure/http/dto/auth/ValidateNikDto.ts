import type { ApiMessageResponseDto } from '@infra/http/dto/ApiResponseEnvelope'

export interface ValidateNikRequestDto {
  nik: string
}

/**
 * Confirmed from the backend's swagger docs: this endpoint returns no
 * `data` payload on success, just { message, success }.
 */
export type ValidateNikResponseDto = ApiMessageResponseDto
