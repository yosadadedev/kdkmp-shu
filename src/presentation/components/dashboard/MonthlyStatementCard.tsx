import { useState, type ReactNode } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  PiggyBank,
  TrendingUp,
  Coins,
  FileSpreadsheet,
  X,
} from 'lucide-react'
import type { MonthlyFinancialStatement } from '@domain/entities/MonthlyFinancialStatement'
import { Card } from '@presentation/components/ui/Card'
import { RupiahText } from '@presentation/components/ui/RupiahText'
import { Button } from '@presentation/components/ui/Button'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { cn } from '@presentation/utils/cn'
import { formatRupiah } from '@presentation/utils/formatters'

export interface MonthlyStatementCardProps {
  statement: MonthlyFinancialStatement
  isFirst?: boolean
}

interface PnlRowType {
  label: string
  cents: number
  negate?: boolean
  indent?: boolean
  total?: boolean
}

interface PnlSection {
  title: string
  rows: PnlRowType[]
  totalCents: number
  totalLabel: string
  negateTotal?: boolean
}

function buildPnlSections(statement: MonthlyFinancialStatement): PnlSection[] {
  const revenueTotal =
    statement.revenue.retailCents +
    statement.revenue.clinicCents +
    statement.revenue.rentalCents +
    statement.revenue.localConsignmentCents

  const hppTotal =
    statement.hpp.costOfGoodsSoldCents +
    statement.hpp.overheadCents +
    statement.hpp.operationalCents +
    statement.hpp.otherHppCents +
    statement.hpp.localSupplierLossCents +
    statement.hpp.damagedGoodsLossCents +
    statement.hpp.lostGoodsLossCents

  const opExpTotal = statement.operationalExpenses.generalAndAdministrativeCents

  const otherIncomeTotal = statement.otherIncome.cashOverageCents + statement.otherIncome.otherIncomeCents

  const otherExpTotal = statement.otherExpenses.finalIncomeTaxCents + statement.otherExpenses.cashShortageCents

  return [
    {
      title: USER_STRINGS.dashboard.pnlSectionRevenue,
      totalLabel: USER_STRINGS.dashboard.pnlRevenueTotal,
      totalCents: revenueTotal,
      rows: [
        { label: USER_STRINGS.dashboard.pnlRevenueRetail, cents: statement.revenue.retailCents, indent: true },
        { label: USER_STRINGS.dashboard.pnlRevenueClinic, cents: statement.revenue.clinicCents, indent: true },
        { label: USER_STRINGS.dashboard.pnlRevenueRental, cents: statement.revenue.rentalCents, indent: true },
        { label: USER_STRINGS.dashboard.pnlRevenueConsignment, cents: statement.revenue.localConsignmentCents, indent: true },
      ],
    },
    {
      title: USER_STRINGS.dashboard.pnlSectionHpp,
      totalLabel: USER_STRINGS.dashboard.pnlHppTotal,
      totalCents: hppTotal,
      negateTotal: true,
      rows: [
        { label: USER_STRINGS.dashboard.pnlHppCogs, cents: statement.hpp.costOfGoodsSoldCents, indent: true, negate: true },
        { label: USER_STRINGS.dashboard.pnlHppOverhead, cents: statement.hpp.overheadCents, indent: true, negate: true },
        { label: USER_STRINGS.dashboard.pnlHppOperational, cents: statement.hpp.operationalCents, indent: true, negate: true },
        { label: USER_STRINGS.dashboard.pnlHppOther, cents: statement.hpp.otherHppCents, indent: true, negate: true },
        { label: USER_STRINGS.dashboard.pnlHppLocalSupplierLoss, cents: statement.hpp.localSupplierLossCents, indent: true, negate: true },
        { label: USER_STRINGS.dashboard.pnlHppDamagedLoss, cents: statement.hpp.damagedGoodsLossCents, indent: true, negate: true },
        { label: USER_STRINGS.dashboard.pnlHppLostLoss, cents: statement.hpp.lostGoodsLossCents, indent: true, negate: true },
      ],
    },
    {
      title: USER_STRINGS.dashboard.pnlSectionOperatingExpenses,
      totalLabel: USER_STRINGS.dashboard.pnlOpExpTotal,
      totalCents: opExpTotal,
      negateTotal: true,
      rows: [
        { label: USER_STRINGS.dashboard.pnlOpExpGeneralAdmin, cents: statement.operationalExpenses.generalAndAdministrativeCents, indent: true, negate: true },
      ],
    },
    {
      title: USER_STRINGS.dashboard.pnlSectionOtherIncome,
      totalLabel: USER_STRINGS.dashboard.pnlOtherIncomeTotal,
      totalCents: otherIncomeTotal,
      rows: [
        { label: USER_STRINGS.dashboard.pnlOtherIncomeCashOverage, cents: statement.otherIncome.cashOverageCents, indent: true },
        { label: USER_STRINGS.dashboard.pnlOtherIncomeMisc, cents: statement.otherIncome.otherIncomeCents, indent: true },
      ],
    },
    {
      title: USER_STRINGS.dashboard.pnlSectionOtherExpenses,
      totalLabel: USER_STRINGS.dashboard.pnlOtherExpTotal,
      totalCents: otherExpTotal,
      negateTotal: true,
      rows: [
        { label: USER_STRINGS.dashboard.pnlOtherExpIncomeTax, cents: statement.otherExpenses.finalIncomeTaxCents, indent: true, negate: true },
        { label: USER_STRINGS.dashboard.pnlOtherExpCashShortage, cents: statement.otherExpenses.cashShortageCents, indent: true, negate: true },
      ],
    },
  ]
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

export function MonthlyStatementCard({ statement, isFirst = false }: MonthlyStatementCardProps) {
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const isNetProfit = statement.netProfitCents >= 0

  const sections = buildPnlSections(statement)

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
          <div
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-xl border text-xs font-semibold',
              isNetProfit
                ? 'bg-success-soft border-success text-success-text'
                : 'bg-warning-soft border-warning text-warning-text',
            )}
          >
            {isNetProfit ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {isNetProfit ? 'Laba' : 'Rugi'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="rounded-xl bg-surface-muted p-3 space-y-1">
            <div className="h-stack gap-1 text-[11px] text-text-muted">
              <PiggyBank className="h-3.5 w-3.5" />
              {USER_STRINGS.dashboard.monthlySavingsIn}
            </div>
            <RupiahText cents={statement.totalSavingsInCents} size="sm" />
          </div>
          <div className="rounded-xl bg-surface-muted p-3 space-y-1">
            <div className="h-stack gap-1 text-[11px] text-text-muted">
              <ArrowDownRight className="h-3.5 w-3.5 text-link" />
              {USER_STRINGS.dashboard.monthlyLoanOut}
            </div>
            <RupiahText cents={statement.totalLoanDisbursementCents} size="sm" />
          </div>
          <div className="rounded-xl bg-surface-muted p-3 space-y-1">
            <div className="h-stack gap-1 text-[11px] text-text-muted">
              <ArrowUpRight className="h-3.5 w-3.5 text-success-text" />
              {USER_STRINGS.dashboard.monthlyLoanIn}
            </div>
            <RupiahText cents={statement.totalLoanRepaymentCents} size="sm" />
          </div>
          <div className="rounded-xl bg-surface-muted p-3 space-y-1">
            <div className="h-stack gap-1 text-[11px] text-text-muted">
              <Coins className="h-3.5 w-3.5 text-brand-600" />
              {USER_STRINGS.dashboard.monthlyNetProfit}
            </div>
            <RupiahText
              cents={statement.netProfitCents}
              size="sm"
              tone={isNetProfit ? 'success' : 'danger'}
              showZeroAsDash={false}
            />
          </div>
        </div>

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
      </Card>

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
                      'tabular-nums text-right pl-3 shrink-0',
                      isNetProfit ? 'text-success-text' : 'text-danger-text',
                    )}
                  >
                    {nominal(statement.netProfitCents)}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-border/60">
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
