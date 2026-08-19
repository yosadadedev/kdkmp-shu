import type { VoteRepository } from '@domain/repositories/VoteRepository'
import type { VoteChoice } from '@domain/enums/VoteChoice'
import type { SubmitVoteResult } from '@domain/entities/VoteSubmission'
import { createAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'

export class SubmitVoteChoiceUseCase {
  constructor(private readonly voteRepository: VoteRepository) {}

  async execute(
    memberId: string,
    profitSharingRecordId: string,
    choice: VoteChoice,
  ): Promise<SubmitVoteResult> {
    if (!memberId || !profitSharingRecordId) {
      throw createAppError(ErrorCode.VALIDATION_ERROR)
    }
    const result = await this.voteRepository.submitVote(memberId, profitSharingRecordId, choice)
    if (!result.isSuccess) {
      if (result.failureReasonCode === 'ALREADY_VOTED') {
        throw createAppError(ErrorCode.VOTE_ALREADY_SUBMITTED)
      }
      if (result.failureReasonCode === 'VOTING_CLOSED') {
        throw createAppError(ErrorCode.VOTING_PERIOD_CLOSED)
      }
      if (result.failureReasonCode === 'RECORD_NOT_FOUND') {
        throw createAppError(ErrorCode.PROFIT_SHARING_RECORD_NOT_FOUND)
      }
    }
    return result
  }
}
