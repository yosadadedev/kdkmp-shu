import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface ProfileCompanyDto {
  id: number
  name: string
  nik: string
  city: string
  state: string
  street: string
  is_active: boolean
  is_independent: boolean
  latitude: string
  longitude: string
  sn_edc: string | null
  sn_pos: string | null
}

export interface ProfileDto {
  id: number
  nik: string
  full_name: string
  address: string
  company: ProfileCompanyDto
}

export type GetMyProfileResponseDto = ApiResponseEnvelope<ProfileDto>
