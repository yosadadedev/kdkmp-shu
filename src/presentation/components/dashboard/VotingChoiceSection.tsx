import { useState } from 'react'
import { ThumbsUp, ThumbsDown, ShieldHalf, Info, Gavel } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { Button } from '@presentation/components/ui/Button'
import { Divider } from '@presentation/components/ui/Divider'
import { ConfirmationDialog } from '@presentation/components/ui/Dialog'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { VoteChoice } from '@domain/enums/VoteChoice'
import type { ProfitSharingRecord } from '@domain/entities/ProfitSharingRecord'
import type { MemberVoteStatus } from '@domain/entities/MemberVoteStatus'
import { cn } from '@presentation/utils/cn'
import { useSubmitVoteChoice } from '@application/hooks/vote/useSubmitVoteChoice'
import { Skeleton } from '@presentation/components/ui/Skeleton'
import { useCurrentProfitSharing } from '@application/hooks/profit-sharing/useCurrentProfitSharing'

export interface VotingChoiceSectionProps {
  profitSharingRecord: ProfitSharingRecord | null
  voteStatus: MemberVoteStatus | null
  isLoadingRecord?: boolean
  isLoadingVote?: boolean
}

export function VotingChoiceSection({
  profitSharingRecord,
  voteStatus,
  isLoadingRecord = false,
  isLoadingVote = false,
}: VotingChoiceSectionProps) {
  const [selectedChoice, setSelectedChoice] = useState<VoteChoice | null>(null)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const { refetch } = useCurrentProfitSharing()
  const { isLoading: isSubmitting, submitVote } = useSubmitVoteChoice()

  if (voteStatus?.hasMemberVoted) return null

  if (isLoadingRecord || !profitSharingRecord) {
    return (
      <Card padding="md" aria-hidden>
        <div className="h-stack justify-between mb-3">
          <Skeleton widthClass="w-2/3 h-5 rounded-md" />
          <Skeleton widthClass="w-20 h-6 rounded-full" />
        </div>
        <Skeleton widthClass="w-full h-3 rounded-md mb-2" />
        <Skeleton widthClass="w-11/12 h-3 rounded-md mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton widthClass="w-full h-28 rounded-2xl" />
          <Skeleton widthClass="w-full h-28 rounded-2xl" />
        </div>
        <Skeleton widthClass="w-full h-12 rounded-xl mt-5" />
      </Card>
    )
  }

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
      {/* <div className="h-stack justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
            <Gavel className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold leading-6 text-text">
              {USER_STRINGS.dashboard.votingSectionTitle}
            </h3>
            <p className="text-xs leading-5 text-text-muted">
              {USER_STRINGS.dashboard.votingSectionSubtitle}
            </p>
          </div>
        </div>
        <BadgeTag tone="brand">1 Hak Suara</BadgeTag>
      </div> */}

      <div className="card-padded mt-4 bg-surface-muted/70 border-border-light">
        <div className="h-stack gap-2 mb-2">
          <Info className="h-4 w-4 text-link shrink-0" />
          <h4 className="text-xs font-bold leading-5 text-text">Penting sebelum pilih</h4>
        </div>
        <p className="text-[12px] leading-5 text-text-body">
          {USER_STRINGS.dashboard.votingInstruction}
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
