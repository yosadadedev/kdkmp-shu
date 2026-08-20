import { useCallback } from 'react'
import { ShieldHalf, Copy } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { InfoRow } from '@presentation/components/ui/InfoRow'
import { BadgeTag } from '@presentation/components/ui/BadgeTag'
import { Skeleton } from '@presentation/components/ui/Skeleton'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import type { MemberVoteStatus } from '@domain/entities/MemberVoteStatus'
import { VoteChoice } from '@domain/enums/VoteChoice'
import { formatDateLongId } from '@presentation/utils/formatters'
import { useToast } from '@presentation/hooks/useToast'

export interface MemberVoteReceiptCardProps {
  receipt: MemberVoteStatus | null
  isLoading: boolean
}

export function MemberVoteReceiptCard({ receipt, isLoading }: MemberVoteReceiptCardProps) {
  const toast = useToast()

  const handleCopyToken = useCallback(
    async (token: string) => {
      try {
        if (typeof navigator?.clipboard?.writeText === 'function') {
          await navigator.clipboard.writeText(token)
        }
        toast.success(USER_STRINGS.common.copied, 'Token bukti suara berhasil disalin.')
      } catch {
        toast.warning('Gagal menyalin', 'Pilih & salin secara manual ya.')
      }
    },
    [toast],
  )

  if (isLoading || !receipt) {
    return (
      <Card variant="success" padding="md" aria-hidden>
        <div className="h-stack justify-between mb-3">
          <div className="h-stack gap-2 min-w-0 flex-1">
            <Skeleton widthClass="w-9 h-9 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton widthClass="w-1/2 h-5 rounded-md" />
              <Skeleton widthClass="w-2/3 h-4 rounded-md" />
            </div>
          </div>
          <Skeleton widthClass="w-24 h-6 rounded-full" />
        </div>
        <Skeleton widthClass="w-full h-36 rounded-2xl" />
      </Card>
    )
  }

  if (!receipt.hasMemberVoted) return null

  const choiceLabel =
    receipt.votedChoice === VoteChoice.AGREE
      ? USER_STRINGS.voteSuccess.receiptChoiceAgree
      : USER_STRINGS.voteSuccess.receiptChoiceDisagree
  const tone: 'success' | 'warning' = receipt.votedChoice === VoteChoice.AGREE ? 'success' : 'warning'

  return (
    <Card variant="success" padding="md" className="animate-fade-in">
      <div className="h-stack justify-between mb-3">
        <div className="h-stack gap-2 min-w-0 flex-1">
          <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
            <ShieldHalf className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-5 text-success-text">
              {USER_STRINGS.voteSuccess.receiptTitle}
            </h3>
            <p className="text-[11px] leading-4 text-success-text/80">
              Tanda terima verifikasi suara kamu sudah terekam.
            </p>
          </div>
        </div>
        <BadgeTag tone="success">Terhubung</BadgeTag>
      </div>

      <div className="rounded-2xl bg-surface-raised border border-success/15 p-4">
        <InfoRow
          label={USER_STRINGS.voteSuccess.receiptYear}
          value={receipt.fiscalYear}
          divider
          stackOnNarrow
        />
        <InfoRow
          label={USER_STRINGS.voteSuccess.receiptChoice}
          value={<BadgeTag tone={tone}>{choiceLabel}</BadgeTag>}
          divider
          stackOnNarrow
        />
        {receipt.votedAtEpochMs ? (
          <InfoRow
            label={USER_STRINGS.voteSuccess.receiptTime}
            value={formatDateLongId(new Date(receipt.votedAtEpochMs))}
            divider
            stackOnNarrow
          />
        ) : null}
        <div className="flex items-start justify-between gap-2 pt-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold leading-4 text-text-muted mb-1">
              {USER_STRINGS.voteSuccess.receiptToken}
            </p>
            <code className="block text-[12px] leading-5 text-brand-700 font-mono break-all bg-brand-50 rounded-lg px-3 py-2 border border-brand-100">
              {receipt.anonymousVoteToken ?? '-'}
            </code>
          </div>
          {receipt.anonymousVoteToken ? (
            <button
              type="button"
              onClick={() => void handleCopyToken(receipt.anonymousVoteToken as string)}
              className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-lg hover:bg-brand-50 text-brand-600 tap-highlight-transparent"
              aria-label={USER_STRINGS.voteSuccess.copyTokenCta}
            >
              <Copy className="h-[18px] w-[18px]" />
            </button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
