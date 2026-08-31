import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface ReportCardDataDto {
  amount: number
  description: string
  period: string
  title: string
}

export type ReportCardResponseDto = ApiResponseEnvelope<ReportCardDataDto>
