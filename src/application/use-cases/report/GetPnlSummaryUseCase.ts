import type { ReportRepository } from '@domain/repositories/ReportRepository'
import type { PnlPeriod, PnlSummaryItem } from '@domain/entities/PnlReport'

export class GetPnlSummaryUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(period: PnlPeriod): Promise<PnlSummaryItem[]> {
    return this.reportRepository.getPnlSummary(period)
  }
}
