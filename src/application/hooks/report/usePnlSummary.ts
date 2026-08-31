import { useCallback, useEffect, useState } from 'react'
import { getUseCases } from '@application/di/container'
import type { PnlPeriod, PnlSummaryItem } from '@domain/entities/PnlReport'
import { useToast } from '@presentation/hooks/useToast'
import { isApplicationError } from '@infra/errors/ApplicationError'
import type { ErrorCode } from '@infra/errors/ErrorCode'

export interface UsePnlSummaryResult {
  items: PnlSummaryItem[]
  isLoading: boolean
  errorCode: ErrorCode | null
  refetch: () => Promise<void>
}

export function usePnlSummary(period: PnlPeriod): UsePnlSummaryResult {
  const [items, setItems] = useState<PnlSummaryItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const toast = useToast()

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setErrorCode(null)
    try {
      const list = await getUseCases().getPnlSummary.execute(period)
      setItems(list)
    } catch (err) {
      if (isApplicationError(err)) {
        setErrorCode(err.code)
      }
      toast.showError(err)
    } finally {
      setIsLoading(false)
    }
  }, [period])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { items, isLoading, errorCode, refetch }
}
