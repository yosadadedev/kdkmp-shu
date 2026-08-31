import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface KdkmpDto {
  id: number
  name: string
  nik: string
  address: string
  is_active: boolean
  is_independent: boolean
  latitude: string
  longitude: string
  sn_edc: string | null
  sn_pos: string | null
}

export type GetKdkmpByIdResponseDto = ApiResponseEnvelope<KdkmpDto>
