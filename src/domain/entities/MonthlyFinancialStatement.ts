export interface RevenueBreakdown {
  retailCents: number
  clinicCents: number
  rentalCents: number
  localConsignmentCents: number
}

export interface HppBreakdown {
  costOfGoodsSoldCents: number
  overheadCents: number
  operationalCents: number
  otherHppCents: number
  localSupplierLossCents: number
  damagedGoodsLossCents: number
  lostGoodsLossCents: number
}

export interface OperationalExpenseBreakdown {
  generalAndAdministrativeCents: number
}

export interface OtherIncomeBreakdown {
  cashOverageCents: number
  otherIncomeCents: number
}

export interface OtherExpenseBreakdown {
  finalIncomeTaxCents: number
  cashShortageCents: number
}

export interface MonthlyFinancialStatement {
  id: string
  cooperativeUnitId: string
  fiscalYear: number
  monthNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  periodLabel: string
  totalSavingsInCents: number
  totalLoanDisbursementCents: number
  totalLoanRepaymentCents: number
  totalOperatingRevenueCents: number
  totalOperatingExpensesCents: number
  netProfitCents: number
  memberOutstandingLoanPrincipalCents: number
  createdAtEpochMs: number
  revenue: RevenueBreakdown
  hpp: HppBreakdown
  operationalExpenses: OperationalExpenseBreakdown
  otherIncome: OtherIncomeBreakdown
  otherExpenses: OtherExpenseBreakdown
}
