export type PnlPeriod = 'monthly' | 'yearly'

export interface PnlSummaryItem {
  periodLabel: string
  sectionKey: string
  omzetCents: number
  expenseCents: number
  netProfitCents: number
}

export interface PnlDetailAccountItem {
  code: string
  name: string
  valueCents: number
  children: PnlDetailAccountItem[]
}

export interface PnlDetailReport {
  items: PnlDetailAccountItem[]
  netProfitCents: number
}
