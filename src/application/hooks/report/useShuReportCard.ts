import { useCallback, useEffect, useState } from 'react'
import { getUseCases } from '@application/di/container'
import type { ShuReportCard } from '@domain/entities/ShuReportCard'
import { useToast } from '@presentation/hooks/useToast'
import { isApplicationError } from '@infra/errors/ApplicationError'
import type { ErrorCode } from '@infra/errors/ErrorCode'

export interface UseShuReportCardResult {
  reportCard: ShuReportCard | null
  isLoading: boolean
  errorCode: ErrorCode | null
  refetch: () => Promise<void>
}

export function useShuReportCard(): UseShuReportCardResult {
  const [reportCard, setReportCard] = useState<ShuReportCard | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const toast = useToast()

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setErrorCode(null)
    try {
      const card = await getUseCases().getShuReportCard.execute()
      setReportCard(card)
    } catch (err) {
      if (isApplicationError(err)) {
        setErrorCode(err.code)
      }
      toast.showError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { reportCard, isLoading, errorCode, refetch }
}
