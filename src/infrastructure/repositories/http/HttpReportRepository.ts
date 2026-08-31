import type { ReportRepository } from '@domain/repositories/ReportRepository'
import type { ShuReportCard } from '@domain/entities/ShuReportCard'
import type { PnlPeriod, PnlSummaryItem, PnlDetailReport, PnlDetailAccountItem } from '@domain/entities/PnlReport'
import type { ShuAllocationPeriodReport } from '@domain/entities/ShuAllocationReport'
import type { HttpClient } from '@infra/http/HttpClient'
import { getReportCard, getPnlSummary, getPnlDetail, getShuAllocation } from '@infra/http/api/reportApi'
import type { PnlSummaryItemDto, PnlDetailItemDto } from '@infra/http/dto/report/PnlDto'
import type { ShuAllocationPeriodDto } from '@infra/http/dto/report/ShuAllocationDto'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'

const CENTS_PER_RUPIAH = 100

const MONTH_NUMBER_TO_LABEL_ID: Record<string, string> = {
  '01': 'Januari',
  '02': 'Februari',
  '03': 'Maret',
  '04': 'April',
  '05': 'Mei',
  '06': 'Juni',
  '07': 'Juli',
  '08': 'Agustus',
  '09': 'September',
  '10': 'Oktober',
  '11': 'November',
  '12': 'Desember',
}

/**
 * `period` is "MM-YYYY" for monthly items and "YYYY" for the yearly item —
 * it doubles as the `section` query param for GET /report/pnl-detail, so it
 * stays untouched; only the human-readable label is derived from it here.
 */
const periodToLabel = (rawPeriod: PnlPeriod, dtoPeriod: string): string => {
  if (rawPeriod === 'yearly') return `Tahunan ${dtoPeriod}`
  const [monthNumber, year] = dtoPeriod.split('-')
  const labelId = monthNumber ? MONTH_NUMBER_TO_LABEL_ID[monthNumber] : undefined
  return labelId && year ? `${labelId} ${year}` : dtoPeriod
}

const periodToFiscalYear = (dtoPeriod: string): number => {
  const [, year] = dtoPeriod.split('-')
  return Number(year ?? dtoPeriod)
}

const mapSummaryItem = (dto: PnlSummaryItemDto, period: PnlPeriod): PnlSummaryItem => ({
  periodLabel: periodToLabel(period, dto.period),
  sectionKey: dto.period,
  omzetCents: dto.omzet * CENTS_PER_RUPIAH,
  expenseCents: dto.expense * CENTS_PER_RUPIAH,
  netProfitCents: dto.net_profit * CENTS_PER_RUPIAH,
})

const mapDetailItem = (dto: PnlDetailItemDto): PnlDetailAccountItem => ({
  code: dto.code,
  name: dto.name,
  valueCents: dto.value * CENTS_PER_RUPIAH,
  children: (dto.children ?? []).map(mapDetailItem),
})

const mapAllocationPeriod = (dto: ShuAllocationPeriodDto, period: PnlPeriod): ShuAllocationPeriodReport => ({
  periodLabel: period === 'yearly' ? `Tahun Buku ${dto.period}` : periodToLabel(period, dto.period),
  fiscalYear: periodToFiscalYear(dto.period),
  shuPercentage: dto.shu_percentage,
  allocations: dto.allocations.map((item) => ({
    key: item.key,
    label: item.label,
    amountCents: item.amount * CENTS_PER_RUPIAH,
    percentage: item.percentage,
  })),
})

export class HttpReportRepository implements ReportRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getReportCard(): Promise<ShuReportCard> {
    try {
      const { data } = await getReportCard(this.httpClient)
      return {
        title: data.title,
        description: data.description,
        period: data.period,
        amountCents: data.amount * CENTS_PER_RUPIAH,
      }
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }

  async getPnlSummary(period: PnlPeriod): Promise<PnlSummaryItem[]> {
    try {
      const { data } = await getPnlSummary(this.httpClient, period)
      return data.map((item) => mapSummaryItem(item, period))
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }

  async getPnlDetail(period: PnlPeriod, section: string): Promise<PnlDetailReport> {
    try {
      const { data } = await getPnlDetail(this.httpClient, period, section)
      return {
        items: data.items.map(mapDetailItem),
        netProfitCents: data.net_profit * CENTS_PER_RUPIAH,
      }
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }

  async getShuAllocation(period: PnlPeriod): Promise<ShuAllocationPeriodReport[]> {
    try {
      const { data } = await getShuAllocation(this.httpClient, period)
      const periods = Array.isArray(data) ? data : [data]
      return periods.map((item) => mapAllocationPeriod(item, period))
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }
}
