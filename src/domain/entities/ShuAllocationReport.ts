export interface ShuAllocationLineItem {
  key: string
  label: string
  amountCents: number
  percentage: number
}

export interface ShuAllocationPeriodReport {
  periodLabel: string
  fiscalYear: number
  shuPercentage: number
  allocations: ShuAllocationLineItem[]
}
