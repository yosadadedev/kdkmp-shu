import { useCallback, useEffect, useState } from 'react'
import { getUseCases } from '@application/di/container'
import type { MonthlyFinancialStatement } from '@domain/entities/MonthlyFinancialStatement'
import { isApplicationError } from '@infra/errors/ApplicationError'
import type { ErrorCode } from '@infra/errors/ErrorCode'
import { useToast } from '@presentation/hooks/useToast'
import { useMyProfile } from '../profile/useMyProfile'
import { useCurrentProfitSharing } from '../profit-sharing/useCurrentProfitSharing'

export interface UseMonthlyStatementsResult {
  statements: MonthlyFinancialStatement[]
  isLoading: boolean
  errorCode: ErrorCode | null
  refetch: () => Promise<void>
}

export function useMonthlyStatements(): UseMonthlyStatementsResult {
  const { cooperativeUnit } = useMyProfile()
  const { record } = useCurrentProfitSharing()
  const [statements, setStatements] = useState<MonthlyFinancialStatement[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const toast = useToast()

  const refetch = useCallback(async () => {
    if (!cooperativeUnit || !record) return
    setIsLoading(true)
    setErrorCode(null)
    try {
      const list = await getUseCases().listMonthlyFinancialStatements.execute(
        cooperativeUnit.id,
        record.fiscalYear,
      )
      setStatements(list)
    } catch (err) {
      if (isApplicationError(err)) setErrorCode(err.code)
      toast.showError(err)
    } finally {
      setIsLoading(false)
    }
  }, [cooperativeUnit?.id ?? '', record?.id ?? '', record?.fiscalYear ?? 0])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { statements, isLoading, errorCode, refetch }
}
