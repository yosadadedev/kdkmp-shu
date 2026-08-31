import type { ReportRepository } from '@domain/repositories/ReportRepository'
import type { PnlPeriod } from '@domain/entities/PnlReport'
import type { ShuAllocationPeriodReport } from '@domain/entities/ShuAllocationReport'

export class GetShuAllocationUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(period: PnlPeriod): Promise<ShuAllocationPeriodReport[]> {
    return this.reportRepository.getShuAllocation(period)
  }
}
