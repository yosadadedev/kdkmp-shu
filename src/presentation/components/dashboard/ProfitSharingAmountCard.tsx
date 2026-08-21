import { TrendingUp, Calendar } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { RupiahText } from '@presentation/components/ui/RupiahText'
import { formatMonthYearFullId } from '@presentation/utils/formatters'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import type { ProfitSharingRecord } from '@domain/entities/ProfitSharingRecord'
import { cn } from '@presentation/utils/cn'
import { Skeleton } from '@presentation/components/ui/Skeleton'

export interface ProfitSharingAmountCardProps {
  record: ProfitSharingRecord | null
  isLoading: boolean
}

export function ProfitSharingAmountCard({ record, isLoading }: ProfitSharingAmountCardProps) {
  if (isLoading || !record) {
    return (
      <Card variant="brand" padding="lg" aria-hidden>
        <div className="h-stack justify-between mb-3">
          <Skeleton widthClass="w-1/2 h-5 rounded-lg" />
          <Skeleton widthClass="w-24 h-6 rounded-full" />
        </div>
        <Skeleton widthClass="w-5/6 h-10 rounded-lg mt-2" />
        <div className="h-stack justify-between mt-6">
          <Skeleton widthClass="w-24 h-4 rounded-md" />
          <Skeleton widthClass="w-16 h-4 rounded-md" />
        </div>
      </Card>
    )
  }

  return (
    <Card
      variant="brand"
      padding="lg"
      className={cn('relative overflow-hidden animate-scale-pop')}
    >
      <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none" aria-hidden />
      <div className="absolute left-10 bottom-0 h-28 w-28 rounded-full bg-white/5 blur-2xl pointer-events-none" aria-hidden />
      <div className="relative flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-9 w-9 rounded-xl bg-white/20 text-white inline-flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white/90 leading-4 truncate">
              {USER_STRINGS.dashboard.profitSharingCardTitle(record.fiscalYear)}
            </p>
            <p className="text-[11px] leading-4 text-white/70 truncate">
              {USER_STRINGS.dashboard.profitSharingCardSubtitle}
            </p>
          </div>
        </div>
      </div>
      <div className="relative mb-5">
        <RupiahText
          cents={record.totalProfitSharingCentsShu}
          variant="full"
          size="xl"
          tone="default"
          className="!text-white"
        />
      </div>
      <div className="relative h-stack justify-between pt-3 border-t border-white/15">
        <div className="h-stack gap-2 text-[14px] text-white/95">
          <Calendar className="h-4.5 w-4.5" />
          <span className="font-bold">
            {formatMonthYearFullId(record.periodStartDateIso)} – {formatMonthYearFullId(record.periodEndDateIso)}
          </span>
        </div>
      </div>
    </Card>
  )
}
