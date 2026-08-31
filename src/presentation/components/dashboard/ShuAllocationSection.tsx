import { useRef, useState } from 'react'
import { PieChart, Landmark, Download, CalendarCheck, BarChartBig, Wallet } from 'lucide-react'
import { Card } from '@presentation/components/ui/Card'
import { Button } from '@presentation/components/ui/Button'
import { RupiahText } from '@presentation/components/ui/RupiahText'
import { Skeleton } from '@presentation/components/ui/Skeleton'
import { TabSwitcher } from '@presentation/components/ui/Tab'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { useShuAllocation } from '@application/hooks/report/useShuAllocation'
import { DEFAULT_COOPERATIVE_UNIT } from '@application/constants/dashboardDefaults'
import { formatRupiah, formatPercentage } from '@presentation/utils/formatters'
import { generateShuAllocationPdfReport } from '@presentation/utils/pdf'
import { cn } from '@presentation/utils/cn'
import type { PnlPeriod } from '@domain/entities/PnlReport'
import type { ShuAllocationPeriodReport } from '@domain/entities/ShuAllocationReport'

const nominal = (cents: number): string => formatRupiah(cents, { withSymbol: false, fractionDigits: 2 })

function AllocationStackedBoxes({ allocations }: { allocations: ShuAllocationPeriodReport['allocations'] }) {
  return (
    <div className="grid grid-cols-1 gap-2.5">
      {allocations.map((item) => (
        <div key={item.key} className="rounded-xl p-3 space-y-1 bg-surface-muted">
          <div className="h-stack gap-1 text-[11px] text-text-muted">
            <Landmark className="h-3.5 w-3.5" />
            {item.label}
            {item.percentage > 0 ? ` (${formatPercentage(item.percentage)})` : ''}
          </div>
          <RupiahText cents={item.amountCents} size="sm" />
        </div>
      ))}
    </div>
  )
}

function ShuAllocationPdfContent({
  contentRef,
  allocations,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>
  allocations: ShuAllocationPeriodReport['allocations']
}) {
  return (
    <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
      <div ref={contentRef} className="w-[780px] bg-white p-6 font-sans">
        <div className="rounded-2xl overflow-hidden border border-[#E8E8EC]">
          {allocations.map((item, idx) => {
            const isLast = idx === allocations.length - 1
            return (
              <div
                key={`pdf-${item.key}`}
                className={cn(
                  'grid grid-cols-[1fr_auto] px-4 py-3.5 items-center',
                  idx > 0 ? 'border-t border-[#F2F2F4]' : '',
                  isLast ? 'bg-[#F9F9FB]' : 'bg-white',
                )}
              >
                <span className={cn('text-[14px]', isLast ? 'font-bold text-[#1C1C1E]' : 'text-[#525258]')}>
                  {item.label}
                  {item.percentage > 0 ? ` (${formatPercentage(item.percentage)})` : ''}
                </span>
                <span
                  className={cn(
                    'text-right tabular-nums pl-3 shrink-0 text-[14px]',
                    isLast ? 'font-bold text-[#C8102E]' : 'font-semibold text-[#1C1C1E]',
                  )}
                >
                  {nominal(item.amountCents)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface ShuAllocationCardProps {
  period: ShuAllocationPeriodReport
  cooperativeUnitName?: string | null
}

function ShuAllocationCard({ period, cooperativeUnitName }: ShuAllocationCardProps) {
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const handleExport = async () => {
    if (isExporting || !contentRef.current) return
    setIsExporting(true)
    try {
      await generateShuAllocationPdfReport({
        contentEl: contentRef.current,
        periodLabel: period.periodLabel,
        fiscalYear: period.fiscalYear,
        cooperativeUnitName,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ShuAllocationCard] Failed to generate PDF:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card padding="md">
      <div className="h-stack justify-between mb-3">
        <div className="h-stack gap-2">
          <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold leading-5 text-text">{period.periodLabel}</h4>
            <p className="text-[11px] leading-4 text-text-muted">
              {USER_STRINGS.dashboard.monthlyStatementPeriod}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-1 mb-3">
        <AllocationStackedBoxes allocations={period.allocations} />
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        isBlock
        isLoading={isExporting}
        loadingText={USER_STRINGS.dashboard.pnlCtaDownloading}
        onClick={() => void handleExport()}
        leftIcon={<Download className="h-[18px] w-[18px]" />}
      >
        {USER_STRINGS.dashboard.pnlCtaDownloadPdf}
      </Button>

      <ShuAllocationPdfContent contentRef={contentRef} allocations={period.allocations} />
    </Card>
  )
}

export function ShuAllocationSection() {
  const [activeTab, setActiveTab] = useState<PnlPeriod>('yearly')
  const { periods, isLoading } = useShuAllocation(activeTab)

  const cooperativeUnitName = DEFAULT_COOPERATIVE_UNIT.branchName

  const tabItems = [
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
  ]

  return (
    <Card padding="none" className="overflow-hidden animate-fade-in">
      <div className="px-4 pt-4 pb-2">
        <div className="h-stack justify-between mb-3">
          <div className="h-stack gap-2 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
              <PieChart className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold leading-6 text-text">
                {USER_STRINGS.dashboard.shuAllocationTitle}
              </h3>
              <p className="text-xs leading-5 text-text-muted">
                {USER_STRINGS.dashboard.shuAllocationSubtitle(periods[0]?.fiscalYear ?? new Date().getFullYear())}
              </p>
            </div>
          </div>
        </div>

        <TabSwitcher<PnlPeriod>
          items={tabItems}
          activeId={activeTab}
          onChange={setActiveTab}
          variant="segmented"
          size="md"
        />
      </div>

      <div className="px-4 pt-4 pb-4 space-y-3">
        {isLoading ? (
          <Card padding="md" aria-hidden>
            <div className="h-stack gap-2 mb-4">
              <Skeleton widthClass="w-9 h-9" rounded="rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton widthClass="w-1/2 h-5" rounded="rounded-md" />
                <Skeleton widthClass="w-2/3 h-4" rounded="rounded-md" />
              </div>
            </div>
            <Skeleton widthClass="w-full h-40" rounded="rounded-2xl" />
            <Skeleton widthClass="w-full h-9 mt-4" rounded="rounded-lg" />
          </Card>
        ) : periods.length === 0 ? (
          <div className="card-padded text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-surface-muted text-text-muted inline-flex items-center justify-center mb-3">
              <BarChartBig className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-text mb-1">{USER_STRINGS.common.emptyStateDefaultTitle}</p>
          </div>
        ) : (
          periods.map((period) => (
            <ShuAllocationCard key={period.periodLabel} period={period} cooperativeUnitName={cooperativeUnitName} />
          ))
        )}
      </div>
    </Card>
  )
}
