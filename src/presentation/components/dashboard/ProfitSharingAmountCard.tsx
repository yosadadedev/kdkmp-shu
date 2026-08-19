import { TrendingUp, Calendar, BadgeCheck } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { RupiahText } from '@presentation/components/ui/RupiahText'
import { BadgeTag } from '@presentation/components/ui/BadgeTag'
import { formatDateLongId, formatPercentage } from '@presentation/utils/formatters'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { ProfitSharingStatus } from '@domain/enums/ProfitSharingStatus'
import type { ProfitSharingRecord } from '@domain/entities/ProfitSharingRecord'
import { cn } from '@presentation/utils/cn'
import { Skeleton } from '@presentation/components/ui/Skeleton'

export interface ProfitSharingAmountCardProps {
  record: ProfitSharingRecord | null
  isLoading: boolean
}

const renderStatusBadge = (status: ProfitSharingStatus, voted: boolean) => {
  if (voted) {
    return (
      <BadgeTag tone="success">
        <BadgeCheck className="h-3.5 w-3.5" />
        {USER_STRINGS.dashboard.profitSharingCardStatusVoted}
      </BadgeTag>
    )
  }
  switch (status) {
    case ProfitSharingStatus.VOTING_OPEN:
      return <BadgeTag tone="brand">{USER_STRINGS.dashboard.profitSharingCardStatusOpen}</BadgeTag>
    case ProfitSharingStatus.APPROVED:
      return <BadgeTag tone="success">{USER_STRINGS.dashboard.profitSharingCardStatusApproved}</BadgeTag>
    case ProfitSharingStatus.DISTRIBUTED:
      return <BadgeTag tone="info">{USER_STRINGS.dashboard.profitSharingCardStatusDistributed}</BadgeTag>
    case ProfitSharingStatus.DRAFT:
      return <BadgeTag tone="muted">Penyusunan Laporan</BadgeTag>
    case ProfitSharingStatus.REJECTED:
      return <BadgeTag tone="danger">Belum disetujui anggota</BadgeTag>
    default:
      return null
  }
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

  const isVotingOpen = record.status === ProfitSharingStatus.VOTING_OPEN

  return (
    <Card
      variant="brand"
      padding="lg"
      className={cn('relative overflow-hidden animate-scale-pop', isVotingOpen && 'ring-1 ring-brand-100/40')}
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
        {/* <div className="shrink-0">{renderStatusBadge(record.status, false)}</div> */}
      </div>
      <div className="relative mb-5">
        <RupiahText
          cents={record.totalProfitSharingCentsShu}
          variant="full"
          size="xl"
          tone="default"
          className="!text-white"
        />
        {/* <p className="mt-2 text-[12px] leading-5 text-white/80">
          Bagian anggota: {formatPercentage(record.memberSharePercentage)} · Total anggota aktif{' '}
          <span className="font-semibold">{record.totalActiveMembers.toLocaleString('id-ID')}</span>
        </p> */}
      </div>
      <div className="relative h-stack justify-between pt-3 border-t border-white/15">
        <div className="h-stack gap-2 text-[12px] text-white/85">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDateLongId(record.periodStartDateIso)} – {formatDateLongId(record.periodEndDateIso)}
          </span>
        </div>
        {/* <BadgeTag tone="brand" className="!bg-white/15 !border-white/25 !text-white">
          {formatPercentage(record.memberSharePercentage)} Anggota
        </BadgeTag> */}
      </div>
    </Card>
  )
}
