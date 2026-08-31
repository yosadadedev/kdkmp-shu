export interface MemberVoteStatus {
  profitSharingRecordId: string
  memberId: string
  hasMemberVoted: boolean
  votedChoice: 'AGREE' | 'DISAGREE' | null
  votedAtEpochMs: number | null
  anonymousVoteToken: string | null
  fiscalYear: number
}
