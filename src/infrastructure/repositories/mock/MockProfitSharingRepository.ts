import type { ProfitSharingRepository } from '@domain/repositories/ProfitSharingRepository'
import type { ProfitSharingRecord, ProfitSharingTotalsBreakdown } from '@domain/entities/ProfitSharingRecord'
import { ErrorCode } from '@infra/errors/ErrorCode'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'
import { MOCK_PROFIT_SHARING_BREAKDOWN, MOCK_PROFIT_SHARING_RECORD } from './MockSeed'

const mockDelayMs = () => new Promise<void>((r) => setTimeout(r, 460 + Math.floor(Math.random() * 260)))

export class MockProfitSharingRepository implements ProfitSharingRepository {
  async getCurrentProfitSharingRecord(cooperativeUnitId: string): Promise<ProfitSharingRecord> {
    await mockDelayMs()
    if (MOCK_PROFIT_SHARING_RECORD.cooperativeUnitId !== cooperativeUnitId) {
      throw wrapUnknownAsAppError({ code: ErrorCode.PROFIT_SHARING_RECORD_NOT_FOUND })
    }
    return { ...MOCK_PROFIT_SHARING_RECORD }
  }

  async getYearlySummary(_fiscalYear: number, cooperativeUnitId: string): Promise<ProfitSharingTotalsBreakdown> {
    await mockDelayMs()
    if (MOCK_PROFIT_SHARING_RECORD.cooperativeUnitId !== cooperativeUnitId) {
      throw wrapUnknownAsAppError({ code: ErrorCode.PROFIT_SHARING_RECORD_NOT_FOUND })
    }
    return { ...MOCK_PROFIT_SHARING_BREAKDOWN }
  }
}
