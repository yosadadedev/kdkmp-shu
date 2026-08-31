import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface ShuAllocationLineItemDto {
  amount: number
  category_id: string
  key: string
  label: string
  percentage: number
  target_source: string
  target_type: string
  voucher_id: string
}

export interface ShuAllocationPeriodDto {
  allocations: ShuAllocationLineItemDto[]
  /** "MM-YYYY" for monthly items, "YYYY" for the yearly item. */
  period: string
  shu_percentage: number
}

/**
 * Monthly returns an array (one entry per month); yearly returns a single
 * object — see the "period" description on GET /report/shu-allocation.
 */
export type ShuAllocationResponseDto = ApiResponseEnvelope<ShuAllocationPeriodDto[] | ShuAllocationPeriodDto>
