import { useCallback, useEffect, useState } from 'react'
import { getUseCases } from '@application/di/container'
import type { PnlPeriod } from '@domain/entities/PnlReport'
import type { ShuAllocationPeriodReport } from '@domain/entities/ShuAllocationReport'
import { useToast } from '@presentation/hooks/useToast'
import { isApplicationError } from '@infra/errors/ApplicationError'
import type { ErrorCode } from '@infra/errors/ErrorCode'

export interface UseShuAllocationResult {
  periods: ShuAllocationPeriodReport[]
  isLoading: boolean
  errorCode: ErrorCode | null
  refetch: () => Promise<void>
}

export function useShuAllocation(period: PnlPeriod): UseShuAllocationResult {
  const [periods, setPeriods] = useState<ShuAllocationPeriodReport[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const toast = useToast()

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setErrorCode(null)
    try {
      const list = await getUseCases().getShuAllocation.execute(period)
      setPeriods(list)
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

  return { periods, isLoading, errorCode, refetch }
}
