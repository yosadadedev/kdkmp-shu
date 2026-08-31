import { PieChart, Wallet, BadgeDollarSign, UsersRound, TrendingUp, DivideCircle } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { RupiahText } from '@presentation/components/ui/RupiahText'
import { InfoRow } from '@presentation/components/ui/InfoRow'
import { BadgeTag } from '@presentation/components/ui/BadgeTag'
import { Divider } from '@presentation/components/ui/Divider'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import type { ProfitSharingTotalsBreakdown } from '@domain/entities/ProfitSharingRecord'
import type { ProfitSharingRecord } from '@domain/entities/ProfitSharingRecord'
import { Skeleton } from '@presentation/components/ui/Skeleton'
import { formatPercentage } from '@presentation/utils/formatters'
import { formatRupiah } from '@presentation/utils/formatters'
import { cn } from '@presentation/utils/cn'

export interface YearlySummaryCardProps {
  breakdown: ProfitSharingTotalsBreakdown | null
  record: ProfitSharingRecord | null
  isLoading: boolean
}

const nominal = (cents: number): string =>
  formatRupiah(cents, { withSymbol: false, fractionDigits: 2 })

export function YearlySummaryCard({ breakdown, record, isLoading }: YearlySummaryCardProps) {
  if (isLoading || !breakdown || !record) {
    return (
      <Card padding="md" aria-hidden>
        <div className="h-stack gap-2 mb-3">
          <Skeleton widthClass="w-9 h-9 rounded-xl" />
          <div className="flex-1 space-y-1.5">
            <Skeleton widthClass="w-1/2 h-5 rounded-md" />
            <Skeleton widthClass="w-2/3 h-4 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton widthClass="w-full h-20 rounded-xl" />
          <Skeleton widthClass="w-full h-20 rounded-xl" />
          <Skeleton widthClass="w-full h-20 rounded-xl" />
          <Skeleton widthClass="w-full h-20 rounded-xl" />
        </div>
      </Card>
    )
  }

  const alloc = record.shuAllocation

  return (
    <Card padding="md">
      <div className="h-stack justify-between gap-2 mb-4">
        <div className="h-stack gap-2 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
            <PieChart className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold leading-5 text-text">
              {USER_STRINGS.dashboard.yearlySummaryTitle}
            </h4>
            <p className="text-[11px] leading-4 text-text-muted">
              {USER_STRINGS.dashboard.yearlySavings} · {USER_STRINGS.dashboard.yearlyProfitLoss}
            </p>
          </div>
        </div>
        <BadgeTag tone="brand">{record.fiscalYear}</BadgeTag>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl bg-surface-muted p-3 space-y-1">
          <div className="h-stack gap-1 text-[11px] text-text-muted">
            <Wallet className="h-3.5 w-3.5" />
            {USER_STRINGS.dashboard.yearlyPrincipalSavings}
          </div>
          <RupiahText cents={breakdown.totalPrincipalSavingsCents} size="sm" />
        </div>
        <div className="rounded-xl bg-surface-muted p-3 space-y-1">
          <div className="h-stack gap-1 text-[11px] text-text-muted">
            <UsersRound className="h-3.5 w-3.5" />
            {USER_STRINGS.dashboard.yearlyMandatorySavings}
          </div>
          <RupiahText cents={breakdown.totalMandatorySavingsCents} size="sm" />
        </div>
        <div className="rounded-xl bg-surface-muted p-3 space-y-1">
          <div className="h-stack gap-1 text-[11px] text-text-muted">
            <TrendingUp className="h-3.5 w-3.5 text-success-text" />
            {USER_STRINGS.dashboard.yearlyVoluntarySavings}
          </div>
          <RupiahText cents={breakdown.totalVoluntarySavingsCents} size="sm" />
        </div>
        <div className="rounded-xl bg-brand-50 p-3 space-y-1 border border-brand-100">
          <div className="h-stack gap-1 text-[11px] text-brand-700 font-semibold">
            <BadgeDollarSign className="h-3.5 w-3.5" />
            Jasa Usaha (SHU)
          </div>
          <RupiahText cents={breakdown.totalPatronageDividendCents} size="sm" tone="brand" />
        </div>
      </div>

      <div className="mt-4">
        <InfoRow
          label={USER_STRINGS.dashboard.yearlyTotalShare}
          value={<RupiahText cents={breakdown.totalMemberShareCents} size="md" tone="brand" />}
          divider
          stackOnNarrow
        />
        <InfoRow
          label="Porsi anggota"
          value={formatPercentage(record.memberSharePercentage)}
          stackOnNarrow
        />
      </div>

      <Divider spacing="md" label={USER_STRINGS.dashboard.shuAllocationTitle} />

      <div className="rounded-2xl border border-border bg-surface-raised p-0 overflow-hidden">
        <div className="px-4 pt-4 pb-1">
          <InfoRow
            label={USER_STRINGS.dashboard.shuAllocationRevenue}
            value={nominal(alloc.revenueCents)}
            divider
            stackOnNarrow
            valueClassName="tabular-nums text-right"
          />
          <InfoRow
            label={USER_STRINGS.dashboard.shuAllocationOperatingExpense}
            value={nominal(alloc.operatingExpenseCents)}
            divider
            stackOnNarrow
            valueClassName="tabular-nums text-right"
          />
          <div className="grid grid-cols-[1fr_auto] px-0 py-2.5 items-center">
            <span className="text-sm font-semibold text-text leading-6">
              {USER_STRINGS.dashboard.shuAllocationNetProfit}
            </span>
            <span className="tabular-nums text-right pl-3 shrink-0 text-base font-extrabold text-success-text leading-6">
              {nominal(alloc.netProfitCents)}
            </span>
          </div>
        </div>

        <div className="px-4 pb-4 pt-1 border-t border-border/60 bg-surface-muted/50">
          <div className="h-stack gap-1.5 text-xs text-text-muted mb-2">
            <DivideCircle className="h-3.5 w-3.5" />
            <span className="font-semibold">Pembagian Margin HO</span>
          </div>
          <InfoRow
            label={USER_STRINGS.dashboard.shuAllocationApnFee}
            value={nominal(alloc.apnManagementFeeCents)}
            divider
            stackOnNarrow
            valueClassName="tabular-nums text-right"
          />
          <div
            className={cn(
              'grid grid-cols-[1fr_auto] px-0 py-2.5 items-center',
            )}
          >
            <span className="text-sm font-bold text-text leading-6">
              {USER_STRINGS.dashboard.shuAllocationHoMargin}
            </span>
            <span className="tabular-nums text-right pl-3 shrink-0 text-sm font-extrabold text-text leading-6">
              {nominal(alloc.hoMarginCents)}
            </span>
          </div>
          <InfoRow
            label={USER_STRINGS.dashboard.shuAllocationRegencyManager}
            value={nominal(alloc.regencyManagerCents)}
            divider
            stackOnNarrow
            valueClassName="tabular-nums text-right"
          />
          <InfoRow
            label={USER_STRINGS.dashboard.shuAllocationBoard}
            value={nominal(alloc.boardCents)}
            divider
            stackOnNarrow
            valueClassName="tabular-nums text-right"
          />
          <InfoRow
            label={USER_STRINGS.dashboard.shuAllocationMembers}
            value={nominal(alloc.membersCents)}
            stackOnNarrow
            valueClassName="tabular-nums text-right font-bold text-brand-700"
            labelClassName="font-semibold"
          />
        </div>
      </div>
    </Card>
  )
}
