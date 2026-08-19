import { useCallback, useEffect, useState } from 'react'
import { getUseCases } from '@application/di/container'
import type { ProfitSharingRecord, ProfitSharingTotalsBreakdown } from '@domain/entities/ProfitSharingRecord'
import { useToast } from '@presentation/hooks/useToast'
import { isApplicationError } from '@infra/errors/ApplicationError'
import type { ErrorCode } from '@infra/errors/ErrorCode'
import { useMyProfile } from '../profile/useMyProfile'

export interface UseCurrentProfitSharingResult {
  record: ProfitSharingRecord | null
  breakdown: ProfitSharingTotalsBreakdown | null
  isLoading: boolean
  errorCode: ErrorCode | null
  refetch: () => Promise<void>
}

export function useCurrentProfitSharing(): UseCurrentProfitSharingResult {
  const { cooperativeUnit } = useMyProfile()
  const [record, setRecord] = useState<ProfitSharingRecord | null>(null)
  const [breakdown, setBreakdown] = useState<ProfitSharingTotalsBreakdown | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const toast = useToast()

  const refetch = useCallback(async () => {
    if (!cooperativeUnit) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setErrorCode(null)
    try {
      const bundle = await getUseCases().getCurrentProfitSharing.execute(cooperativeUnit.id)
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
  }, [cooperativeUnit])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { record, breakdown, isLoading, errorCode, refetch }
}
