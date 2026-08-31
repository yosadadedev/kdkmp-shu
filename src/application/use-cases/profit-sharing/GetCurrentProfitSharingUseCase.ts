import type { ProfitSharingRepository } from '@domain/repositories/ProfitSharingRepository'
import type { ProfitSharingRecord, ProfitSharingTotalsBreakdown } from '@domain/entities/ProfitSharingRecord'

export interface CurrentProfitSharingBundle {
  record: ProfitSharingRecord
  breakdown: ProfitSharingTotalsBreakdown
}

export class GetCurrentProfitSharingUseCase {
  constructor(private readonly profitSharingRepository: ProfitSharingRepository) {}

  async execute(cooperativeUnitId: string): Promise<CurrentProfitSharingBundle> {
    const record = await this.profitSharingRepository.getCurrentProfitSharingRecord(cooperativeUnitId)
    const breakdown = await this.profitSharingRepository.getYearlySummary(record.fiscalYear, cooperativeUnitId)
    return { record, breakdown }
  }
}
