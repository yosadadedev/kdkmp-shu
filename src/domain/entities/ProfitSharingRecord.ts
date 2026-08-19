import type { ProfitSharingStatus } from '@domain/enums/ProfitSharingStatus'

export interface ShuAllocation {
  revenueCents: number
  operatingExpenseCents: number
  netProfitCents: number
  apnManagementFeeCents: number
  hoMarginCents: number
  regencyManagerCents: number
  boardCents: number
  membersCents: number
}

export interface ProfitSharingRecord {
  id: string
  cooperativeUnitId: string
  fiscalYear: number
  totalProfitSharingCentsShu: number
  totalRevenueCents: number
  totalExpensesCents: number
  netProfitCents: number
  memberSharePercentage: number
  cooperativeSharePercentage: number
  totalActiveMembers: number
  periodStartDateIso: string
  periodEndDateIso: string
  approvedAtIso: string | null
  distributedAtIso: string | null
  votingStartEpochMs: number
  votingEndEpochMs: number
  status: ProfitSharingStatus
  shuAllocation: ShuAllocation
}

export interface ProfitSharingTotalsBreakdown {
  totalMandatorySavingsCents: number
  totalPrincipalSavingsCents: number
  totalVoluntarySavingsCents: number
  totalPatronageDividendCents: number
  totalMemberShareCents: number
}
