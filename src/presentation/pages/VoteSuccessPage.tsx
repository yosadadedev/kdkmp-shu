import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, ShieldHalf, Copy, ChevronLeft, Sparkles } from 'lucide-react'
import { Button } from '@presentation/components/ui/Button'
import { Card } from '@presentation/components/ui/Card'
import { InfoRow } from '@presentation/components/ui/InfoRow'
import { BadgeTag } from '@presentation/components/ui/BadgeTag'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { RoutePaths } from '@presentation/constants/routePaths'
import { formatDateLongId } from '@presentation/utils/formatters'
import { VoteChoice } from '@domain/enums/VoteChoice'
import type { VoteSubmission } from '@domain/entities/VoteSubmission'
import { useToast } from '@presentation/hooks/useToast'

const PSEUDO_SUBMISSION: VoteSubmission = {
  id: 'fallback-vote',
  profitSharingRecordId: 'psr-2025-sukamaju',
  anonymousVoteToken: 'anon_mock_success_placeholder',
  choice: VoteChoice.AGREE,
  submittedAtEpochMs: Date.now(),
  fiscalYear: 2025,
}

export function VoteSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const submission = useMemo<VoteSubmission>(() => {
    const state = location.state as { submission?: VoteSubmission } | null
    return state?.submission ?? PSEUDO_SUBMISSION
  }, [location.state])

  const choiceLabel =
    submission.choice === VoteChoice.AGREE
      ? USER_STRINGS.voteSuccess.receiptChoiceAgree
      : USER_STRINGS.voteSuccess.receiptChoiceDisagree

  const handleCopyToken = async () => {
    if (!submission.anonymousVoteToken) return
    try {
      if (typeof navigator?.clipboard?.writeText === 'function') {
        await navigator.clipboard.writeText(submission.anonymousVoteToken)
      }
      toast.success(USER_STRINGS.common.copied, `Token bukti suara berhasil disalin.`)
    } catch {
      toast.warning('Gagal menyalin', 'Pilih & salin secara manual ya.')
    }
  }

  return (
    <div className="app-shell min-h-dvh bg-surface flex flex-col">
      <header className="sticky top-0 z-20 bg-surface-raised/90 backdrop-blur-md border-b border-border-light">
        <div className="px-4 pt-4 pb-3 w-full h-stack gap-2">
          <button
            type="button"
            onClick={() => navigate(RoutePaths.DASHBOARD_HOME)}
            aria-label={USER_STRINGS.common.back}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-surface-muted tap-highlight-transparent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <span className="text-xs text-text-muted leading-4">Voting SHU 2025</span>
            <h1 className="text-[15px] font-bold leading-5 text-text truncate">Bukti Partisipasi</h1>
          </div>
          <BadgeTag tone="success">
            <Sparkles className="h-3.5 w-3.5" />
            Sukses
          </BadgeTag>
        </div>
      </header>
      <main className="flex-1 screen-container">
        <div className="flex flex-col items-center pt-4 text-center animate-scale-pop">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-success-soft rounded-full blur-2xl opacity-80 scale-125" aria-hidden />
            <div className="relative h-24 w-24 rounded-full bg-success text-white inline-flex items-center justify-center shadow-[0_20px_60px_rgba(76,175,80,0.35)]">
              <CheckCircle2 className="h-14 w-14" strokeWidth={1.75} />
            </div>
          </div>
          <h2 className="text-[26px] leading-8 font-extrabold tracking-tight text-text mb-2">
            {USER_STRINGS.voteSuccess.title}
          </h2>
          <p className="text-sm leading-6 text-text-body px-2 max-w-[320px] mb-6">
            {USER_STRINGS.voteSuccess.subtitle}
          </p>
        </div>

        <Card variant="muted" padding="md" className="mb-5 animate-slide-up">
          <div className="h-stack justify-between mb-3">
            <div className="h-stack gap-2 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
                <ShieldHalf className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold leading-5 text-text">
                  {USER_STRINGS.voteSuccess.receiptTitle}
                </h3>
                <p className="text-[11px] leading-4 text-text-muted">
                  Tanda terima ini verifikasi suara kamu sudah terekam.
                </p>
              </div>
            </div>
            <BadgeTag tone="success">Terhubung</BadgeTag>
          </div>

          <div className="rounded-2xl bg-surface-raised border border-border-light p-4">
            <InfoRow
              label={USER_STRINGS.voteSuccess.receiptYear}
              value={submission.fiscalYear}
              divider
              stackOnNarrow
            />
            <InfoRow
              label={USER_STRINGS.voteSuccess.receiptChoice}
              value={
                <BadgeTag tone={submission.choice === VoteChoice.AGREE ? 'success' : 'warning'}>
                  {choiceLabel}
                </BadgeTag>
              }
              divider
              stackOnNarrow
            />
            <InfoRow
              label={USER_STRINGS.voteSuccess.receiptTime}
              value={formatDateLongId(new Date(submission.submittedAtEpochMs))}
              divider
              stackOnNarrow
            />
            <div className="flex items-start justify-between gap-2 pt-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold leading-4 text-text-muted mb-1">
                  {USER_STRINGS.voteSuccess.receiptToken}
                </p>
                <code className="block text-[12px] leading-5 text-brand-700 font-mono break-all bg-brand-50 rounded-lg px-3 py-2 border border-brand-100">
                  {submission.anonymousVoteToken}
                </code>
              </div>
              <button
                type="button"
                onClick={() => void handleCopyToken()}
                className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-lg hover:bg-brand-50 text-brand-600 tap-highlight-transparent"
                aria-label={USER_STRINGS.voteSuccess.copyTokenCta}
              >
                <Copy className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </Card>

        <Button
          size="lg"
          isBlock
          onClick={() => navigate(RoutePaths.DASHBOARD_HOME, { replace: true })}
        >
          {USER_STRINGS.voteSuccess.ctaBackHome}
        </Button>
        <p className="mt-4 text-center text-[11px] leading-4 text-text-muted">
          Kembali ke{' '}
          <Link className="font-semibold text-brand-600 hover:underline" to={RoutePaths.DASHBOARD_HOME}>
            Halaman Utama
          </Link>
        </p>
      </main>
    </div>
  )
}
