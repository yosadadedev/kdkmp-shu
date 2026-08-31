import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface GateCompanyDto {
  name: string
  nik: string
}

export interface GateAccessDataDto {
  company: GateCompanyDto
}

export type GateAccessResponseDto = ApiResponseEnvelope<GateAccessDataDto>
