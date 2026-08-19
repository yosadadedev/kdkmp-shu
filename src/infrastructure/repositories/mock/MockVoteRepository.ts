import type { VoteRepository } from '@domain/repositories/VoteRepository'
import type { VoteChoice } from '@domain/enums/VoteChoice'
import type { MemberVoteStatus } from '@domain/entities/MemberVoteStatus'
import type { SubmitVoteResult, VoteSubmission } from '@domain/entities/VoteSubmission'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'
import { MOCK_PROFIT_SHARING_RECORD, MOCK_VOTING_AGGREGATE, createDummyVoteSubmission } from './MockSeed'
import { ProfitSharingStatus } from '@domain/enums/ProfitSharingStatus'

const mockDelayMs = () => new Promise<void>((r) => setTimeout(r, 500 + Math.floor(Math.random() * 300)))

const memberVotesStore = new Map<string, Map<string, VoteSubmission>>()

const getMemberVotesMap = (memberId: string) => {
  let m = memberVotesStore.get(memberId)
  if (!m) {
    m = new Map<string, VoteSubmission>()
    memberVotesStore.set(memberId, m)
  }
  return m
}

export class MockVoteRepository implements VoteRepository {
  async getMemberVoteStatus(memberId: string, profitSharingRecordId: string): Promise<MemberVoteStatus> {
    await mockDelayMs()
    const map = getMemberVotesMap(memberId)
    const existing = map.get(profitSharingRecordId) ?? null
    return {
      profitSharingRecordId,
      memberId,
      hasMemberVoted: existing !== null,
      votedChoice: existing?.choice ?? null,
      votedAtEpochMs: existing?.submittedAtEpochMs ?? null,
      anonymousVoteToken: existing?.anonymousVoteToken ?? null,
      fiscalYear: MOCK_PROFIT_SHARING_RECORD.fiscalYear,
    }
  }

  async submitVote(
    memberId: string,
    profitSharingRecordId: string,
    choice: VoteChoice,
  ): Promise<SubmitVoteResult> {
    await mockDelayMs()
    try {
      if (profitSharingRecordId !== MOCK_PROFIT_SHARING_RECORD.id) {
        return { isSuccess: false, submittedVote: null, failureReasonCode: 'RECORD_NOT_FOUND' }
      }
      const status = MOCK_PROFIT_SHARING_RECORD.status
      const now = Date.now()
      if (
        status !== ProfitSharingStatus.VOTING_OPEN ||
        now < MOCK_PROFIT_SHARING_RECORD.votingStartEpochMs ||
        now > MOCK_PROFIT_SHARING_RECORD.votingEndEpochMs
      ) {
        return { isSuccess: false, submittedVote: null, failureReasonCode: 'VOTING_CLOSED' }
      }
      const map = getMemberVotesMap(memberId)
      if (map.has(profitSharingRecordId)) {
        return { isSuccess: false, submittedVote: null, failureReasonCode: 'ALREADY_VOTED' }
      }
      const submission = createDummyVoteSubmission(memberId, choice)
      map.set(profitSharingRecordId, submission)
      return { isSuccess: true, submittedVote: submission, failureReasonCode: null }
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }

  async getVotingAggregate(_profitSharingRecordId: string): Promise<{
    totalVoters: number
    agreeCount: number
    disagreeCount: number
    abstainCount: number
  }> {
    await mockDelayMs()
    return { ...MOCK_VOTING_AGGREGATE }
  }
}
