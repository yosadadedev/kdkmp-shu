import { useCallback, useEffect, useState } from 'react'
import { getUseCases } from '@application/di/container'
import { DEFAULT_COOPERATIVE_UNIT_ID } from '@application/constants/dashboardDefaults'
import type { ProfitSharingRecord, ProfitSharingTotalsBreakdown } from '@domain/entities/ProfitSharingRecord'
import { useToast } from '@presentation/hooks/useToast'
import { isApplicationError } from '@infra/errors/ApplicationError'
import type { ErrorCode } from '@infra/errors/ErrorCode'

export interface UseCurrentProfitSharingResult {
  record: ProfitSharingRecord | null
  breakdown: ProfitSharingTotalsBreakdown | null
  isLoading: boolean
  errorCode: ErrorCode | null
  refetch: () => Promise<void>
}

export function useCurrentProfitSharing(): UseCurrentProfitSharingResult {
  const [record, setRecord] = useState<ProfitSharingRecord | null>(null)
  const [breakdown, setBreakdown] = useState<ProfitSharingTotalsBreakdown | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const toast = useToast()

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setErrorCode(null)
    try {
      const bundle = await getUseCases().getCurrentProfitSharing.execute(DEFAULT_COOPERATIVE_UNIT_ID)
      setRecord(bundle.record)
      setBreakdown(bundle.breakdown)
    } catch (err) {
      if (isApplicationError(err)) {
        setErrorCode(err.code)
        toast.showError(err)
      } else {
        toast.showError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { record, breakdown, isLoading, errorCode, refetch }
}
