import { useCallback, useState } from 'react'
import { getUseCases } from '@application/di/container'
import type { PnlPeriod, PnlDetailReport } from '@domain/entities/PnlReport'
import { useToast } from '@presentation/hooks/useToast'
import { isApplicationError } from '@infra/errors/ApplicationError'
import type { ErrorCode } from '@infra/errors/ErrorCode'

export interface UsePnlDetailResult {
  detail: PnlDetailReport | null
  isLoading: boolean
  errorCode: ErrorCode | null
  fetchDetail: (period: PnlPeriod, section: string) => Promise<PnlDetailReport | null>
}

/**
 * Detail is fetched on demand (when a card's "Lihat Detail"/"Unduh PDF" is
 * used), not eagerly — one hook instance per MonthlyStatementCard, always
 * scoped to that card's own section, so the fetched detail never needs a
 * section check before reuse.
 */
export function usePnlDetail(): UsePnlDetailResult {
  const [detail, setDetail] = useState<PnlDetailReport | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const toast = useToast()

  const fetchDetail = useCallback(async (period: PnlPeriod, section: string) => {
    setIsLoading(true)
    setErrorCode(null)
    try {
      const result = await getUseCases().getPnlDetail.execute(period, section)
      setDetail(result)
      return result
    } catch (err) {
      if (isApplicationError(err)) {
        setErrorCode(err.code)
      }
      toast.showError(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { detail, isLoading, errorCode, fetchDetail }
}
