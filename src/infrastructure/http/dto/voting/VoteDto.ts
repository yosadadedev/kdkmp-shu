import type { ApiResponseEnvelope } from '@infra/http/dto/ApiResponseEnvelope'

export type VoteChoiceDto = 'ACCEPTED' | 'NOT_ACCEPTED'

export interface SubmitVoteRequestDto {
  company_nik: string
  user_nik: string
  vote: VoteChoiceDto
}

/**
 * Unlike other endpoints seen so far, `data` here is the vote choice string
 * itself rather than an object.
 */
export type SubmitVoteResponseDto = ApiResponseEnvelope<VoteChoiceDto>
