import type { VoteRepository } from '@domain/repositories/VoteRepository'
import type { MemberVoteStatus } from '@domain/entities/MemberVoteStatus'

export class GetMemberVoteStatusUseCase {
  constructor(private readonly voteRepository: VoteRepository) {}

  async execute(memberId: string, profitSharingRecordId: string): Promise<MemberVoteStatus> {
    return this.voteRepository.getMemberVoteStatus(memberId, profitSharingRecordId)
  }
}
