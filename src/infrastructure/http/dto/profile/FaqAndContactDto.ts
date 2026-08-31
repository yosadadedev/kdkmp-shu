import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export interface FaqItemDto {
  id: number
  question: string
  answer: string
}

export interface ContactDto {
  email: string
  whatsapp: string
}

export interface FaqAndContactDataDto {
  contact: ContactDto
  faq: FaqItemDto[]
}

export type FaqAndContactResponseDto = ApiResponseEnvelope<FaqAndContactDataDto>
