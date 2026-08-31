import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface PnlSummaryItemDto {
  expense: number
  /** "MM-YYYY" for monthly items, "YYYY" for the yearly item — also usable
   * directly as the `section` query param for GET /report/pnl-detail. */
  period: string
  net_profit: number
  omzet: number
}

export type PnlSummaryResponseDto = ApiResponseEnvelope<PnlSummaryItemDto[]>

export interface PnlDetailItemDto {
  code: string
  name: string
  value: number
  children?: PnlDetailItemDto[]
}

export interface PnlDetailDataDto {
  items: PnlDetailItemDto[]
  net_profit: number
}

export type PnlDetailResponseDto = ApiResponseEnvelope<PnlDetailDataDto>
