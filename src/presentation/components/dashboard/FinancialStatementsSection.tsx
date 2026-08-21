import { useMemo, useState } from 'react'
import { CalendarCheck, BarChartBig, TrendingDown } from 'lucide-react'
import { TabSwitcher } from '@presentation/components/ui/Tab'
import { Card } from '@presentation/components/ui/Card'
import { SkeletonCard } from '@presentation/components/ui/Skeleton'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { useMonthlyStatements } from '@application/hooks/financial-statement/useMonthlyStatements'
import { useCurrentProfitSharing } from '@application/hooks/profit-sharing/useCurrentProfitSharing'
import { MonthlyStatementCard } from './MonthlyStatementCard'
import type { MonthlyFinancialStatement } from '@domain/entities/MonthlyFinancialStatement'
import type { ProfitSharingRecord } from '@domain/entities/ProfitSharingRecord'

type TabId = 'monthly' | 'yearly'

function adaptRecordToYearlyStatement(
  record: ProfitSharingRecord,
): MonthlyFinancialStatement {
  const zeroBreakdown = (obj: Record<string, number>, count: number) =>
    Object.fromEntries(Object.keys(obj).slice(0, count).map((k) => [k, 0])) as never

  return {
    id: `yearly-${record.fiscalYear}`,
    cooperativeUnitId: record.cooperativeUnitId,
    fiscalYear: record.fiscalYear,
    monthNumber: 12,
    periodLabel: `${USER_STRINGS.dashboard.infoTabYearly} ${record.fiscalYear}`,
    totalSavingsInCents: 0,
    totalLoanDisbursementCents: 0,
    totalLoanRepaymentCents: 0,
    totalOperatingRevenueCents: record.shuAllocation?.revenueCents ?? record.totalRevenueCents ?? 0,
    totalOperatingExpensesCents:
      record.shuAllocation?.operatingExpenseCents ?? record.totalExpensesCents ?? 0,
    netProfitCents: record.shuAllocation?.netProfitCents ?? record.netProfitCents ?? 0,
    memberOutstandingLoanPrincipalCents: 0,
    createdAtEpochMs: Date.now(),
    revenue: zeroBreakdown(
      { retailCents: 0, clinicCents: 0, rentalCents: 0, localConsignmentCents: 0 },
      4,
    ),
    hpp: zeroBreakdown(
      {
        costOfGoodsSoldCents: 0,
        overheadCents: 0,
        operationalCents: 0,
        otherHppCents: 0,
        localSupplierLossCents: 0,
        damagedGoodsLossCents: 0,
        lostGoodsLossCents: 0,
      },
      7,
    ),
    operationalExpenses: zeroBreakdown({ generalAndAdministrativeCents: 0 }, 1),
    otherIncome: zeroBreakdown({ cashOverageCents: 0, otherIncomeCents: 0 }, 2),
    otherExpenses: zeroBreakdown({ finalIncomeTaxCents: 0, cashShortageCents: 0 }, 2),
  }
}

export function FinancialStatementsSection() {
  const [activeTab, setActiveTab] = useState<TabId>('monthly')
  const { statements, cooperativeUnitName, isLoading: isListLoading } = useMonthlyStatements()
  const { record, isLoading: isRecordLoading } = useCurrentProfitSharing()

  const yearlyStatements = useMemo<MonthlyFinancialStatement[]>(() => {
    if (!record) return []
    return [adaptRecordToYearlyStatement(record)]
  }, [record])

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
              <MonthlyStatementCard
                key={statement.id}
                statement={statement}
                cooperativeUnitName={cooperativeUnitName}
                isFirst={idx === 0}
              />
            ))
          )
        ) : isRecordLoading ? (
          <div className="space-y-3">
            <SkeletonCard />
          </div>
        ) : yearlyStatements.length === 0 ? (
          <div className="card-padded text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-surface-muted text-text-muted inline-flex items-center justify-center mb-3">
              <CalendarCheck className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-text mb-1">
              {USER_STRINGS.common.emptyStateDefaultTitle}
            </p>
            <p className="text-xs leading-5 text-text-muted">
              Laporan PNL tahunan belum tersedia untuk periode ini.
            </p>
          </div>
        ) : (
          yearlyStatements.map((statement, idx) => (
            <MonthlyStatementCard
              key={statement.id}
              statement={statement}
              cooperativeUnitName={cooperativeUnitName}
              isFirst={idx === 0}
            />
          ))
        )}
      </div>
    </Card>
  )
}
