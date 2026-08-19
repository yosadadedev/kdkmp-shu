import { useMemo, useState } from 'react'
import { CalendarCheck, BarChartBig, TrendingDown, UsersRound } from 'lucide-react'
import { TabSwitcher } from '@presentation/components/ui/Tab'
import { Card } from '@presentation/components/ui/Card'
import { SkeletonCard } from '@presentation/components/ui/Skeleton'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { useMonthlyStatements } from '@application/hooks/financial-statement/useMonthlyStatements'
import { useCurrentProfitSharing } from '@application/hooks/profit-sharing/useCurrentProfitSharing'
import { MonthlyStatementCard } from './MonthlyStatementCard'
import { YearlySummaryCard } from './YearlySummaryCard'

type TabId = 'monthly' | 'yearly'

export function FinancialStatementsSection() {
  const [activeTab, setActiveTab] = useState<TabId>('monthly')
  const { statements, isLoading: isListLoading } = useMonthlyStatements()
  const { record, breakdown, isLoading: isRecordLoading } = useCurrentProfitSharing()

  const items = useMemo(
    () => [
      {
        id: 'monthly' as const,
        label: USER_STRINGS.dashboard.infoTabMonthly,
        iconLeft: <BarChartBig className="h-[18px] w-[18px]" />,
      },
      {
        id: 'yearly' as const,
        label: USER_STRINGS.dashboard.infoTabYearly,
        iconLeft: <CalendarCheck className="h-[18px] w-[18px]" />,
      },
    ],
    [],
  )

  return (
    <Card padding="none" className="overflow-hidden animate-fade-in">
      <div className="px-4 pt-4 pb-2">
        <div className="h-stack justify-between mb-3">
          <div className="h-stack gap-2 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-surface-muted text-brand-600 inline-flex items-center justify-center shrink-0">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold leading-6 text-text">
                Laporan Keuangan Koperasi
              </h3>
              <p className="text-xs leading-5 text-text-muted">
                Data PNL unit koperasi periode berjalan.
              </p>
            </div>
          </div>
          <span className="h-stack gap-1.5 text-[11px] font-semibold text-text-muted">
            <UsersRound className="h-4 w-4" />
            {record?.totalActiveMembers?.toLocaleString('id-ID') ?? '-'} anggota
          </span>
        </div>
        <TabSwitcher<TabId>
          items={items}
          activeId={activeTab}
          onChange={setActiveTab}
          variant="segmented"
          size="md"
        />
      </div>
      <div className="px-4 pt-4 pb-4 space-y-3">
        {activeTab === 'monthly' ? (
          isListLoading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : statements.length === 0 ? (
            <div className="card-padded text-center">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-surface-muted text-text-muted inline-flex items-center justify-center mb-3">
                <BarChartBig className="h-7 w-7" />
              </div>
              <p className="text-sm font-semibold text-text mb-1">
                {USER_STRINGS.common.emptyStateDefaultTitle}
              </p>
              <p className="text-xs leading-5 text-text-muted">
                Laporan PNL bulanan sedang dalam proses finalisasi.
              </p>
            </div>
          ) : (
            statements.map((statement, idx) => (
              <MonthlyStatementCard key={statement.id} statement={statement} isFirst={idx === 0} />
            ))
          )
        ) : (
          <YearlySummaryCard record={record} breakdown={breakdown} isLoading={isRecordLoading} />
        )}
      </div>
    </Card>
  )
}
