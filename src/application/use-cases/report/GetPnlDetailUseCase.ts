import type { ReportRepository } from '@domain/repositories/ReportRepository'
import type { PnlPeriod, PnlDetailReport } from '@domain/entities/PnlReport'

export class GetPnlDetailUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(period: PnlPeriod, section: string): Promise<PnlDetailReport> {
    return this.reportRepository.getPnlDetail(period, section)
  }
}
