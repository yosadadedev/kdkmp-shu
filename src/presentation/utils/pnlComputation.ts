import type { MonthlyFinancialStatement } from '@domain/entities/MonthlyFinancialStatement'
import PNL_STANDARD_SECTIONS from '@presentation/constants/data/pnlStandardSections.json'

export interface PnlRowType {
  label: string
  cents: number
  negate?: boolean
  indent?: boolean
  total?: boolean
}

export interface PnlSection {
  title: string
  rows: PnlRowType[]
  totalCents: number
  totalLabel: string
  negateTotal?: boolean
}

interface PnlStandardSection {
  key: string
  title: string
  totalLabel: string
  accounts: Array<{
    code: string
    name: string
    value: number
  }>
}

export interface PnlDerivedSummary {
  revenueTotalCents: number
  hppTotalCents: number
  opExpTotalCents: number
  otherIncomeTotalCents: number
  otherExpTotalCents: number
  operatingRevenueTotalCents: number
  operatingExpensesTotalCents: number
  netProfitCents: number
}

export function computePnlDerivedFromJson(
  statement: MonthlyFinancialStatement,
  sections: PnlStandardSection[] = PNL_STANDARD_SECTIONS as PnlStandardSection[],
): { sections: PnlSection[]; summary: PnlDerivedSummary } {
  const revenueSection = sections.find((s) => s.key === 'pendapatan-usaha') ?? sections[0]!
  const hppSection = sections.find((s) => s.key === 'hpp') ?? sections[1]!
  const opExpSection = sections.find((s) => s.key === 'beban-operasional') ?? sections[2]!
  const otherIncomeSection = sections.find((s) => s.key === 'pendapatan-lain') ?? sections[3]!
  const otherExpSection = sections.find((s) => s.key === 'beban-lain') ?? sections[4]!

  const sumAccounts = (sec: PnlStandardSection) =>
    sec.accounts.reduce((sum, a) => sum + a.value, 0)

  const revenueTotalRaw = sumAccounts(revenueSection)
  const otherIncomeTotalRaw = sumAccounts(otherIncomeSection)
  const baseOpRevenueRaw = revenueTotalRaw + otherIncomeTotalRaw

  const opRevenueTargetCents = statement.totalOperatingRevenueCents ?? 0

  const scaleRatio =
    baseOpRevenueRaw > 0 && opRevenueTargetCents > 0
      ? opRevenueTargetCents / (baseOpRevenueRaw * 100)
      : 1

  const toCents = (rupiahValue: number) => Math.round(rupiahValue * scaleRatio * 100)

  const revenueTotalCents = toCents(revenueTotalRaw)
  const hppTotalCents = toCents(sumAccounts(hppSection))
  const opExpTotalCents = toCents(sumAccounts(opExpSection))
  const otherIncomeTotalCents = toCents(otherIncomeTotalRaw)
  const otherExpTotalCents = toCents(sumAccounts(otherExpSection))
  const operatingRevenueTotalCents = revenueTotalCents + otherIncomeTotalCents
  const operatingExpensesTotalCents =
    Math.abs(hppTotalCents) + Math.abs(opExpTotalCents) + Math.abs(otherExpTotalCents)

  return {
    sections: [
      {
        title: revenueSection.title,
        totalLabel: revenueSection.totalLabel,
        totalCents: revenueTotalCents,
        rows: revenueSection.accounts.map((a) => ({
          label: a.name,
          cents: toCents(a.value),
          indent: true,
        })),
      },
      {
        title: hppSection.title,
        totalLabel: hppSection.totalLabel,
        totalCents: Math.abs(hppTotalCents),
        negateTotal: true,
        rows: hppSection.accounts.map((a) => ({
          label: a.name,
          cents: Math.abs(toCents(a.value)),
          negate: true,
          indent: true,
        })),
      },
      {
        title: opExpSection.title,
        totalLabel: opExpSection.totalLabel,
        totalCents: Math.abs(opExpTotalCents),
        negateTotal: true,
        rows: opExpSection.accounts.map((a) => ({
          label: a.name,
          cents: Math.abs(toCents(a.value)),
          negate: true,
          indent: true,
        })),
      },
      {
        title: otherIncomeSection.title,
        totalLabel: otherIncomeSection.totalLabel,
        totalCents: otherIncomeTotalCents,
        rows: otherIncomeSection.accounts.map((a) => ({
          label: a.name,
          cents: toCents(a.value),
          indent: true,
        })),
      },
      {
        title: otherExpSection.title,
        totalLabel: otherExpSection.totalLabel,
        totalCents: Math.abs(otherExpTotalCents),
        negateTotal: true,
        rows: otherExpSection.accounts.map((a) => ({
          label: a.name,
          cents: Math.abs(toCents(a.value)),
          negate: true,
          indent: true,
        })),
      },
    ],
    summary: {
      revenueTotalCents,
      hppTotalCents,
      opExpTotalCents,
      otherIncomeTotalCents,
      otherExpTotalCents,
      operatingRevenueTotalCents,
      operatingExpensesTotalCents,
      netProfitCents: Math.max(statement.netProfitCents, 0),
    },
  }
}
