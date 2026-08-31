import type { HttpClient } from '@infra/http/HttpClient'
import { ApiEndpoints } from '@infra/http/apiEndpoints'
import type { SubmitVoteRequestDto, SubmitVoteResponseDto } from '@infra/http/dto/voting/VoteDto'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'

export const submitVote = async (
  httpClient: HttpClient,
  payload: SubmitVoteRequestDto,
): Promise<SubmitVoteResponseDto> => {
  try {
    const response = await httpClient.post<SubmitVoteResponseDto>(ApiEndpoints.voting.vote, {
      body: payload,
    })
    return response.data
  } catch (err) {
    throw wrapUnknownAsAppError(err)
  }
}
