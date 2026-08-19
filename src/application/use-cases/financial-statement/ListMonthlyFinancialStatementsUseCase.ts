import type { FinancialStatementRepository } from '@domain/repositories/FinancialStatementRepository'
import type { MonthlyFinancialStatement } from '@domain/entities/MonthlyFinancialStatement'

export class ListMonthlyFinancialStatementsUseCase {
  constructor(private readonly financialStatementRepository: FinancialStatementRepository) {}

  async execute(cooperativeUnitId: string, fiscalYear: number): Promise<MonthlyFinancialStatement[]> {
    const list = await this.financialStatementRepository.listMonthlyStatements(cooperativeUnitId, fiscalYear)
    return list.sort((a, b) => b.monthNumber - a.monthNumber)
  }
}
