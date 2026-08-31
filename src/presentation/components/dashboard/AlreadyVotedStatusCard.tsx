import { CheckCircle2, Clock } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { BadgeTag } from '@presentation/components/ui/BadgeTag'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import type { MemberVoteStatus } from '@domain/entities/MemberVoteStatus'
import { VoteChoice } from '@domain/enums/VoteChoice'
import { formatDateLongId } from '@presentation/utils/formatters'
import { Skeleton } from '@presentation/components/ui/Skeleton'

export interface AlreadyVotedStatusCardProps {
  voteStatus: MemberVoteStatus | null
  isLoading: boolean
}

export function AlreadyVotedStatusCard({ voteStatus, isLoading }: AlreadyVotedStatusCardProps) {
  if (isLoading || !voteStatus) {
    return (
      <Card variant="success" padding="md" aria-hidden>
        <div className="h-stack gap-3">
          <Skeleton widthClass="w-11 h-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton widthClass="w-2/3 h-4 rounded-md" />
            <Skeleton widthClass="w-5/6 h-3 rounded-md" />
          </div>
        </div>
      </Card>
    )
  }
  if (!voteStatus.hasMemberVoted) return null
  const pickedLabel =
    voteStatus.votedChoice === VoteChoice.AGREE
      ? USER_STRINGS.dashboard.alreadyVotedAgree
      : USER_STRINGS.dashboard.alreadyVotedDisagree

  return (
    <Card variant="success" padding="md" className="animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-xl bg-success inline-flex items-center justify-center text-white shrink-0 shadow-[0_8px_20px_rgba(76,175,80,0.25)]">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-stack gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-bold leading-5 text-success-text">
              {USER_STRINGS.dashboard.alreadyVotedTitle}
            </h3>
            <BadgeTag tone={voteStatus.votedChoice === VoteChoice.AGREE ? 'success' : 'warning'}>
              {pickedLabel}
            </BadgeTag>
          </div>
          <p className="text-xs leading-5 text-success-text/90 mb-2">
            {USER_STRINGS.dashboard.alreadyVotedSubtitle}
          </p>
          {voteStatus.votedAtEpochMs ? (
            <div className="h-stack gap-2 text-[11px] text-success-text/85">
              <Clock className="h-3.5 w-3.5" />
              <span>{USER_STRINGS.dashboard.alreadyVotedAt} {formatDateLongId(new Date(voteStatus.votedAtEpochMs))}</span>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
