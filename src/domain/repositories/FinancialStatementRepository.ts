import type { MonthlyFinancialStatement } from '@domain/entities/MonthlyFinancialStatement'

export interface FinancialStatementRepository {
  listMonthlyStatements(
    cooperativeUnitId: string,
    fiscalYear: number,
  ): Promise<MonthlyFinancialStatement[]>
  getMonthlyStatement(
    cooperativeUnitId: string,
    fiscalYear: number,
    monthNumber: number,
  ): Promise<MonthlyFinancialStatement | null>
}
