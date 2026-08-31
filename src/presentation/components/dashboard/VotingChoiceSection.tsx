import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ThumbsUp, ThumbsDown, ShieldHalf, Info, Gavel, Scale, ChevronRight } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { Button } from '@presentation/components/ui/Button'
import { Divider } from '@presentation/components/ui/Divider'
import { ConfirmationDialog } from '@presentation/components/ui/Dialog'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { RoutePaths } from '@presentation/constants/routePaths'
import { VoteChoice } from '@domain/enums/VoteChoice'
import type { MemberVoteStatus } from '@domain/entities/MemberVoteStatus'
import { cn } from '@presentation/utils/cn'
import { useSubmitVoteChoice } from '@application/hooks/vote/useSubmitVoteChoice'
import { useCurrentProfitSharing } from '@application/hooks/profit-sharing/useCurrentProfitSharing'

export interface VotingChoiceSectionProps {
  voteStatus: MemberVoteStatus | null
  isLoadingVote?: boolean
}

export function VotingChoiceSection({
  voteStatus,
  isLoadingVote = false,
}: VotingChoiceSectionProps) {
  const [selectedChoice, setSelectedChoice] = useState<VoteChoice | null>(null)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const { refetch } = useCurrentProfitSharing()
  const { isLoading: isSubmitting, submitVote } = useSubmitVoteChoice()

  if (voteStatus?.hasMemberVoted) return null

  const handleSelectAgree = () => setSelectedChoice((cur) => (cur === VoteChoice.AGREE ? null : VoteChoice.AGREE))
  const handleSelectDisagree = () => setSelectedChoice((cur) => (cur === VoteChoice.DISAGREE ? null : VoteChoice.DISAGREE))

  const submitWithRefetch = async (choice: VoteChoice) => {
    setShowConfirm(false)
    const result = await submitVote(choice)
    if (result.success) {
      setSelectedChoice(null)
      await refetch()
    }
  }

  return (
    <Card padding="md" className={cn(isLoadingVote && 'opacity-70 pointer-events-none')}>

      <div className="card-padded mt-4 bg-surface-muted/70 border-border-light">
        <div className="h-stack gap-2 mb-2">
          <Info className="h-4 w-4 text-link shrink-0" />
          <h4 className="text-xs font-bold leading-5 text-text">Penting sebelum pilih</h4>
        </div>
        <p className="text-[12px] leading-5 text-text-body">
          {USER_STRINGS.dashboard.votingInstruction}{' '}
          <Link
            to={RoutePaths.VOTING_LEGAL_BASIS}
            className="inline-flex items-center gap-1 align-[-2.5px] text-link font-semibold hover:underline underline-offset-2"
          >
            <Scale className="h-3.5 w-3.5 shrink-0" />
            {USER_STRINGS.dashboard.votingLegalBasisLabel}
            <ChevronRight className="h-3 w-3 text-text-muted shrink-0" />
          </Link>
        </p>
      </div>

      <Divider spacing="md" />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleSelectAgree}
          aria-pressed={selectedChoice === VoteChoice.AGREE}
          className={cn(
            'relative rounded-2xl border p-4 flex flex-col items-center justify-center gap-3 transition-all duration-150 tap-highlight-transparent min-h-[124px]',
            selectedChoice === VoteChoice.AGREE
              ? 'border-success bg-success-soft ring-4 ring-success/20 shadow-[0_10px_30px_rgba(76,175,80,0.22)] scale-[1.015]'
              : 'border-border bg-surface-raised hover:bg-surface-muted active:scale-[0.992]',
          )}
        >
          <span
            className={cn(
              'h-12 w-12 rounded-2xl inline-flex items-center justify-center transition',
              selectedChoice === VoteChoice.AGREE
                ? 'bg-success text-white shadow-[0_10px_24px_rgba(76,175,80,0.35)]'
                : 'bg-surface-muted text-success-text',
            )}
          >
            <ThumbsUp className="h-6 w-6" strokeWidth={2.1} />
          </span>
          <span
            className={cn(
              'text-sm font-bold leading-5',
              selectedChoice === VoteChoice.AGREE ? 'text-success-text' : 'text-text',
            )}
          >
            {USER_STRINGS.dashboard.voteAgree}
          </span>
          <span className="text-[11px] leading-4 text-text-muted text-center px-1">
            Setuju pembagian SHU sesuai laporan
          </span>
        </button>

        <button
          type="button"
          onClick={handleSelectDisagree}
          aria-pressed={selectedChoice === VoteChoice.DISAGREE}
          className={cn(
            'relative rounded-2xl border p-4 flex flex-col items-center justify-center gap-3 transition-all duration-150 tap-highlight-transparent min-h-[124px]',
            selectedChoice === VoteChoice.DISAGREE
              ? 'border-warning bg-warning-soft ring-4 ring-warning/20 shadow-[0_10px_30px_rgba(255,152,0,0.22)] scale-[1.015]'
              : 'border-border bg-surface-raised hover:bg-surface-muted active:scale-[0.992]',
          )}
        >
          <span
            className={cn(
              'h-12 w-12 rounded-2xl inline-flex items-center justify-center transition',
              selectedChoice === VoteChoice.DISAGREE
                ? 'bg-warning text-white shadow-[0_10px_24px_rgba(255,152,0,0.35)]'
                : 'bg-surface-muted text-warning-text',
            )}
          >
            <ThumbsDown className="h-6 w-6" strokeWidth={2.1} />
          </span>
          <span
            className={cn(
              'text-sm font-bold leading-5',
              selectedChoice === VoteChoice.DISAGREE ? 'text-warning-text' : 'text-text',
            )}
          >
            {USER_STRINGS.dashboard.voteDisagree}
          </span>
          <span className="text-[11px] leading-4 text-text-muted text-center px-1">
            Minta perbaikan laporan ke pengurus
          </span>
        </button>
      </div>

      <Button
        type="button"
        size="lg"
        isBlock
        className="mt-5"
        disabled={selectedChoice === null || isSubmitting}
        isLoading={isSubmitting}
        leftIcon={<ShieldHalf className="h-5 w-5" />}
        onClick={() => setShowConfirm(selectedChoice !== null)}
      >
        {selectedChoice === null
          ? USER_STRINGS.dashboard.voteCtaChoose
          : USER_STRINGS.dashboard.voteCtaSubmit}
      </Button>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={USER_STRINGS.dashboard.voteConfirmDialogTitle}
        description={USER_STRINGS.dashboard.voteConfirmDialogBody}
        icon={<Gavel className="h-6 w-6" />}
        actions={[
          { label: USER_STRINGS.common.cancel, variant: 'ghost', onClick: () => setShowConfirm(false) },
          {
            label: USER_STRINGS.dashboard.voteConfirmDialogConfirm,
            variant: 'primary',
            isLoading: isSubmitting,
            onClick: () => {
              if (selectedChoice) void submitWithRefetch(selectedChoice)
            },
          },
        ]}
      />
    </Card>
  )
}
