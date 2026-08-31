import type { VoteChoice } from '@domain/enums/VoteChoice'

export interface VoteSubmission {
  id: string
  profitSharingRecordId: string
  anonymousVoteToken: string
  choice: VoteChoice
  submittedAtEpochMs: number
  fiscalYear: number
}

export interface SubmitVoteResult {
  isSuccess: boolean
  submittedVote: VoteSubmission | null
  failureReasonCode: 'ALREADY_VOTED' | 'VOTING_CLOSED' | 'RECORD_NOT_FOUND' | null
}
