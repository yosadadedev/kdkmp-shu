import type { ProfitSharingRecord, ProfitSharingTotalsBreakdown } from '@domain/entities/ProfitSharingRecord'

export interface ProfitSharingRepository {
  getCurrentProfitSharingRecord(cooperativeUnitId: string): Promise<ProfitSharingRecord>
  getYearlySummary(fiscalYear: number, cooperativeUnitId: string): Promise<ProfitSharingTotalsBreakdown>
}
