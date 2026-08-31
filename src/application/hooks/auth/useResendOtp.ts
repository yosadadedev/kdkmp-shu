import { useCallback, useState } from 'react'
import { getUseCases } from '@application/di/container'
import { useAuthStore } from '@application/stores/AuthStore'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { useToast } from '@presentation/hooks/useToast'
import type { ResendOtpResult } from '@domain/entities/OtpSession'

export interface UseResendOtpResult {
  isLoading: boolean
  resendOtp: (
    sessionId: string,
  ) => Promise<{
    success: boolean
    result?: ResendOtpResult
    isLimitReached?: boolean
  }>
}

export function useResendOtp(): UseResendOtpResult {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const setOtpSession = useAuthStore((s) => s.setActiveOtpSession)
  const toast = useToast()

  const resendOtp = useCallback(
    async (
      sessionId: string,
    ): Promise<{
      success: boolean
      result?: ResendOtpResult
      isLimitReached?: boolean
    }> => {
      setIsLoading(true)
      try {
        const result = await getUseCases().resendOtp.execute(sessionId)
        setOtpSession(result.session)
        toast.info('Kode OTP dikirim ulang', `Kode baru dikirim ke ${result.session.maskDestination}`)
        return { success: true, result }
      } catch (err) {
        if (isApplicationError(err)) {
          toast.showError(err)
          if (err.code === 'OTP_RESEND_LIMIT_EXCEEDED') {
            return { success: false, isLimitReached: true }
          }
        } else {
          toast.showError(err)
        }
        return { success: false }
      } finally {
        setIsLoading(false)
      }
    },
    [setOtpSession, toast],
  )

  return { isLoading, resendOtp }
}
