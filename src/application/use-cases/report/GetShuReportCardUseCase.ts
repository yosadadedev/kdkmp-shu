import type { ReportRepository } from '@domain/repositories/ReportRepository'
import type { ShuReportCard } from '@domain/entities/ShuReportCard'

export class GetShuReportCardUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(): Promise<ShuReportCard> {
    return this.reportRepository.getReportCard()
  }
}
