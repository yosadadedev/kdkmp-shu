import type { VoteRepository } from '@domain/repositories/VoteRepository'
import { VoteChoice } from '@domain/enums/VoteChoice'
import type { MemberVoteStatus } from '@domain/entities/MemberVoteStatus'
import type { SubmitVoteResult, VoteSubmission } from '@domain/entities/VoteSubmission'
import type { HttpClient } from '@infra/http/HttpClient'
import { submitVote } from '@infra/http/api/votingApi'
import type { VoteChoiceDto } from '@infra/http/dto/voting/VoteDto'
import { createAppError, wrapUnknownAsAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'

const VOTE_CHOICE_TO_DTO: Record<VoteChoice, VoteChoiceDto> = {
  [VoteChoice.AGREE]: 'ACCEPTED',
  [VoteChoice.DISAGREE]: 'NOT_ACCEPTED',
}

export interface VoteIdentity {
  userNik: string
  companyNik: string
}

/**
 * Real backend is only live for vote submission so far — it has no endpoint
 * yet to read back per-member vote status or the aggregate tally, so those
 * two are stubbed to safe defaults ("hasn't voted" / all-zero) rather than
 * backed by a mock. Replace the stubs once the backend implements them.
 */
export class HttpVoteRepository implements VoteRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly getVoteIdentity: () => VoteIdentity | null,
  ) {}

  async getMemberVoteStatus(memberId: string, profitSharingRecordId: string): Promise<MemberVoteStatus> {
    return {
      profitSharingRecordId,
      memberId,
      hasMemberVoted: false,
      votedChoice: null,
      votedAtEpochMs: null,
      anonymousVoteToken: null,
      fiscalYear: new Date().getFullYear(),
    }
  }

  async submitVote(
    _memberId: string,
    profitSharingRecordId: string,
    choice: VoteChoice,
  ): Promise<SubmitVoteResult> {
    const identity = this.getVoteIdentity()
    if (!identity) {
      throw createAppError(ErrorCode.AUTH_SESSION_NOT_FOUND)
    }

    try {
      const result = await submitVote(this.httpClient, {
        company_nik: identity.companyNik,
        user_nik: identity.userNik,
        vote: VOTE_CHOICE_TO_DTO[choice],
      })
      if (!result.success) {
        throw createAppError(ErrorCode.VALIDATION_ERROR, { meta: { message: result.message } })
      }
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }

    // The real backend only confirms the vote was recorded — it doesn't
    // return submission metadata (id/anonymous token/etc), so synthesize a
    // minimal one. Nothing downstream reads these fields meaningfully
    // (VoteSuccessPage receives it but never renders any of its values).
    const submittedVote: VoteSubmission = {
      id: `vote_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      profitSharingRecordId,
      anonymousVoteToken: `anon_${Math.random().toString(36).slice(2, 14)}`,
      choice,
      submittedAtEpochMs: Date.now(),
      fiscalYear: new Date().getFullYear(),
    }
    return { isSuccess: true, submittedVote, failureReasonCode: null }
  }

  async getVotingAggregate(_profitSharingRecordId: string): Promise<{
    totalVoters: number
    agreeCount: number
    disagreeCount: number
    abstainCount: number
  }> {
    return { totalVoters: 0, agreeCount: 0, disagreeCount: 0, abstainCount: 0 }
  }
}
