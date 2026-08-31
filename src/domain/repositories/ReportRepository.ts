import type { ShuReportCard } from '@domain/entities/ShuReportCard'
import type { PnlPeriod, PnlSummaryItem, PnlDetailReport } from '@domain/entities/PnlReport'
import type { ShuAllocationPeriodReport } from '@domain/entities/ShuAllocationReport'

export interface ReportRepository {
  getReportCard(): Promise<ShuReportCard>
  getPnlSummary(period: PnlPeriod): Promise<PnlSummaryItem[]>
  getPnlDetail(period: PnlPeriod, section: string): Promise<PnlDetailReport>
  getShuAllocation(period: PnlPeriod): Promise<ShuAllocationPeriodReport[]>
}
