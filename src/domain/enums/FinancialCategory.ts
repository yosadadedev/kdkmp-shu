export const FinancialCategory = {
  SAVINGS: 'SAVINGS',
  LOAN: 'LOAN',
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
  SHU_DISTRIBUTION: 'SHU_DISTRIBUTION',
} as const

export type FinancialCategory =
  (typeof FinancialCategory)[keyof typeof FinancialCategory]
