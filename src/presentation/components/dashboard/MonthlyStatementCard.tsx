import { useState, useRef, type ReactNode } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  PiggyBank,
  FileSpreadsheet,
  Download,
  X,
} from 'lucide-react'
import type { MonthlyFinancialStatement } from '@domain/entities/MonthlyFinancialStatement'
import { Card } from '@presentation/components/ui/Card'
import { RupiahText } from '@presentation/components/ui/RupiahText'
import { Button } from '@presentation/components/ui/Button'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { cn } from '@presentation/utils/cn'
import { formatRupiah } from '@presentation/utils/formatters'
import {
  generateMonthlyPdfReport,
  type GenerateMonthlyPdfParams,
} from '@presentation/utils/pdf'
import {
  computePnlDerivedFromJson,
  type PnlSection,
} from '@presentation/utils/pnlComputation'

export interface MonthlyStatementCardProps {
  statement: MonthlyFinancialStatement
  isFirst?: boolean
}

const nominal = (cents: number, negate = false): string => {
  const value = negate ? -Math.abs(cents) : cents
  return formatRupiah(value, { withSymbol: false, fractionDigits: 2 })
}

function PnlDetailTable({ sections }: { sections: PnlSection[] }): ReactNode {
  return (
    <div className="rounded-2xl overflow-hidden border border-border">
      <div className="grid grid-cols-[1fr_auto] bg-brand-600 text-white px-3 py-2.5 text-xs font-bold items-center">
        <span>{USER_STRINGS.dashboard.pnlHeaderAccountName}</span>
        <span className="text-right tabular-nums pl-3 shrink-0">{USER_STRINGS.dashboard.pnlHeaderNominal}</span>
      </div>

      <div className="divide-y divide-border/60 bg-surface-raised">
        {sections.map((section, sIdx) => (
          <div key={`section-${sIdx}`}>
            <div className="grid grid-cols-[1fr_auto] bg-surface-muted px-3 py-2 text-xs font-bold text-text items-center">
              <span>{section.title}</span>
              <span />
            </div>
            <div className="divide-y divide-border/30">
              {section.rows.map((row, rIdx) => (
                <div
                  key={`row-${sIdx}-${rIdx}`}
                  className={cn(
                    'grid grid-cols-[1fr_auto] px-3 py-2 text-[12px] leading-5 items-center',
                    row.indent ? 'pl-6' : 'pl-3',
                  )}
                >
                  <span className="text-text-body">{row.label}</span>
                  <span
                    className={cn(
                      'text-right tabular-nums pl-3 shrink-0 text-text',
                      (row.negate ? -row.cents : row.cents) < 0 ? 'text-text' : '',
                    )}
                  >
                    {nominal(row.cents, row.negate)}
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_auto] px-3 py-2.5 text-[12px] font-bold leading-5 items-center bg-surface-muted/50">
                <span className="text-text">{section.totalLabel}</span>
                <span
                  className={cn(
                    'text-right tabular-nums pl-3 shrink-0',
                    (section.negateTotal ? -section.totalCents : section.totalCents) < 0
                      ? 'text-text'
                      : 'text-text',
                  )}
                >
                  {nominal(section.totalCents, section.negateTotal)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MonthlyStatementCard({
  statement,
  cooperativeUnitName,
  isFirst = false,
}: MonthlyStatementCardProps & { cooperativeUnitName?: string | null }) {
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const { sections, summary } = computePnlDerivedFromJson(statement)
  const pdfContentRef = useRef<HTMLDivElement | null>(null)

  const handleDownloadPdf = async () => {
    if (isDownloading || !pdfContentRef.current) return
    setIsDownloading(true)
    try {
      const params: GenerateMonthlyPdfParams = {
        contentEl: pdfContentRef.current,
        periodLabel: statement.periodLabel,
        cooperativeUnitName,
        operatingRevenueCents: summary.operatingRevenueTotalCents,
        operatingExpensesCents: summary.operatingExpensesTotalCents,
        netProfitCents: Math.abs(summary.netProfitCents),
      }
      await generateMonthlyPdfReport(params)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[MonthlyStatementCard] Failed to generate PDF:', err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <Card padding="md" className={cn(isFirst ? '' : '')}>
        <div className="h-stack justify-between mb-3">
          <div className="h-stack gap-2">
            <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold leading-5 text-text">{statement.periodLabel}</h4>
              <p className="text-[11px] leading-4 text-text-muted">
                {USER_STRINGS.dashboard.monthlyStatementPeriod}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="rounded-xl bg-surface-muted p-3 space-y-1">
            <div className="h-stack gap-1 text-[11px] text-text-muted">
              <PiggyBank className="h-3.5 w-3.5" />
              {USER_STRINGS.dashboard.shuAllocationRevenue}
            </div>
            <RupiahText cents={summary.operatingRevenueTotalCents} size="sm" />
          </div>
          <div className="rounded-xl bg-surface-muted p-3 space-y-1">
            <div className="h-stack gap-1 text-[11px] text-text-muted">
              <ArrowDownRight className="h-3.5 w-3.5 text-link" />
              {USER_STRINGS.dashboard.shuAllocationOperatingExpense}
            </div>
            <RupiahText cents={summary.operatingExpensesTotalCents} size="sm" />
          </div>
          <div className="col-span-2 rounded-xl bg-surface-muted p-3 space-y-1">
            <div className="h-stack gap-1 text-[11px] text-text-muted">
              <ArrowUpRight className="h-3.5 w-3.5 text-success-text" />
              {USER_STRINGS.dashboard.shuAllocationNetProfit}
            </div>
            <RupiahText
              cents={Math.abs(summary.netProfitCents)}
              size="sm"
              tone="success"
              showZeroAsDash={false}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            isBlock
            onClick={() => setShowDetail(true)}
            leftIcon={<FileSpreadsheet className="h-[18px] w-[18px]" />}
          >
            {USER_STRINGS.dashboard.pnlCtaDetail}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            isBlock
            isLoading={isDownloading}
            loadingText={USER_STRINGS.dashboard.pnlCtaDownloading}
            onClick={handleDownloadPdf}
            leftIcon={<Download className="h-[18px] w-[18px]" />}
          >
            {USER_STRINGS.dashboard.pnlCtaDownloadPdf}
          </Button>
        </div>
      </Card>

      <div className="hidden" aria-hidden="true">
        <div ref={pdfContentRef}>
          <div className="w-[780px] bg-white p-6 font-sans">
            <div className="mb-4">
              <div className="text-[22px] font-bold text-[#1C1C1E] mb-1">
                {USER_STRINGS.dashboard.pnlDownloadTitle}
              </div>
              <div className="text-[13px] text-[#525258]">
                Periode: <span className="font-semibold">{statement.periodLabel}</span>
                {cooperativeUnitName ? (
                  <>
                    <span className="mx-2 text-[#D1D1D6]">|</span>
                    Unit: <span className="font-semibold">{cooperativeUnitName}</span>
                  </>
                ) : null}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#E8E8EC]">
              <div className="grid grid-cols-[1fr_auto] bg-[#C8102E] text-white px-4 py-3 text-[13px] font-bold items-center">
                <span>{USER_STRINGS.dashboard.pnlHeaderAccountName}</span>
                <span className="text-right tabular-nums pl-3 shrink-0">
                  {USER_STRINGS.dashboard.pnlHeaderNominal}
                </span>
              </div>
              <div className="divide-y divide-[#E8E8EC] bg-white">
                {sections.map((section, sIdx) => (
                  <div key={`pdf-section-${sIdx}`}>
                    <div className="grid grid-cols-[1fr_auto] bg-[#F4F4F5] px-4 py-2.5 text-[13px] font-bold text-[#1C1C1E] items-center">
                      <span>{section.title}</span>
                      <span />
                    </div>
                    <div className="divide-y divide-[#F2F2F4]">
                      {section.rows.map((row, rIdx) => (
                        <div
                          key={`pdf-row-${sIdx}-${rIdx}`}
                          className={cn(
                            'grid grid-cols-[1fr_auto] px-4 py-2 text-[12.5px] leading-5 items-center',
                            row.indent ? 'pl-7' : 'pl-4',
                          )}
                        >
                          <span className="text-[#2C2C2E]">{row.label}</span>
                          <span className="text-right tabular-nums pl-3 shrink-0 text-[#1C1C1E]">
                            {nominal(row.cents, row.negate)}
                          </span>
                        </div>
                      ))}
                      <div className="grid grid-cols-[1fr_auto] px-4 py-2.5 text-[13px] font-bold leading-5 items-center bg-[#F9F9FB]">
                        <span className="text-[#1C1C1E]">{section.totalLabel}</span>
                        <span className="text-right tabular-nums pl-3 shrink-0 text-[#1C1C1E]">
                          {nominal(section.totalCents, section.negateTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-[1fr_auto] px-4 py-3 rounded-xl bg-[#FEF1F3] border border-[#FCC7D2] text-[15px] font-bold items-center">
                <span className="text-[#C8102E]">
                  {USER_STRINGS.dashboard.monthlyNetProfit}
                </span>
                <span className="tabular-nums text-right pl-3 shrink-0 text-[#059669]">
                  {nominal(Math.abs(summary.netProfitCents))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDetail ? (
        <div
          className="fixed inset-0 z-40 flex items-end md:items-center justify-center animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setShowDetail(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-[390px] mx-auto bg-surface-raised rounded-t-3xl md:rounded-3xl shadow-pop animate-slide-up max-h-[88vh] overflow-hidden flex flex-col">
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3 border-b border-border/60">
              <div className="h-stack gap-3 min-w-0 flex-1">
                <span className="h-11 w-11 rounded-xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-6 text-text">
                    {USER_STRINGS.dashboard.monthlyStatementTitle}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-text-body">{statement.periodLabel}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setShowDetail(false)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-xl hover:bg-surface-muted transition tap-highlight-transparent shrink-0"
              >
                <X className="h-5 w-5 text-text-muted" />
              </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto">
              <PnlDetailTable sections={sections} />
              <div className="mt-4">
                <div className="grid grid-cols-[1fr_auto] px-3 py-2.5 rounded-xl bg-brand-50 border border-brand-100 text-sm font-bold items-center">
                  <span className="text-brand-700">
                    {USER_STRINGS.dashboard.monthlyNetProfit}
                  </span>
                  <span
                    className={cn(
                      'tabular-nums text-right pl-3 shrink-0 text-success-text',
                    )}
                  >
                    {nominal(Math.abs(summary.netProfitCents))}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-border/60 space-y-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                isBlock
                isLoading={isDownloading}
                loadingText={USER_STRINGS.dashboard.pnlCtaDownloading}
                onClick={handleDownloadPdf}
                leftIcon={<Download className="h-[18px] w-[18px]" />}
              >
                {USER_STRINGS.dashboard.pnlCtaDownloadPdf}
              </Button>
              <Button type="button" size="lg" isBlock onClick={() => setShowDetail(false)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
