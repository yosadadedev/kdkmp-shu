import type { VoteChoice } from '@domain/enums/VoteChoice'
import type { MemberVoteStatus } from '@domain/entities/MemberVoteStatus'
import type { SubmitVoteResult } from '@domain/entities/VoteSubmission'

export interface VoteRepository {
  getMemberVoteStatus(memberId: string, profitSharingRecordId: string): Promise<MemberVoteStatus>
  submitVote(memberId: string, profitSharingRecordId: string, choice: VoteChoice): Promise<SubmitVoteResult>
  getVotingAggregate(profitSharingRecordId: string): Promise<{
    totalVoters: number
    agreeCount: number
    disagreeCount: number
    abstainCount: number
  }>
}
