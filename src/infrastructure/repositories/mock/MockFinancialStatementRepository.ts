import type { FinancialStatementRepository } from '@domain/repositories/FinancialStatementRepository'
import type { MonthlyFinancialStatement } from '@domain/entities/MonthlyFinancialStatement'
import { MOCK_MONTHLY_STATEMENTS } from './MockSeed'

const mockDelayMs = () => new Promise<void>((r) => setTimeout(r, 420 + Math.floor(Math.random() * 260)))

export class MockFinancialStatementRepository implements FinancialStatementRepository {
  async listMonthlyStatements(cooperativeUnitId: string, fiscalYear: number): Promise<MonthlyFinancialStatement[]> {
    await mockDelayMs()
    return MOCK_MONTHLY_STATEMENTS.filter(
      (m) => m.cooperativeUnitId === cooperativeUnitId && m.fiscalYear === fiscalYear,
    ).map((m) => ({ ...m }))
  }

  async getMonthlyStatement(
    cooperativeUnitId: string,
    fiscalYear: number,
    monthNumber: number,
  ): Promise<MonthlyFinancialStatement | null> {
    await mockDelayMs()
    return (
      MOCK_MONTHLY_STATEMENTS.find(
        (m) =>
          m.cooperativeUnitId === cooperativeUnitId &&
          m.fiscalYear === fiscalYear &&
          m.monthNumber === monthNumber,
      ) ?? null
    )
  }
}
