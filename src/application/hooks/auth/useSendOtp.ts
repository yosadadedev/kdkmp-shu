import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUseCases } from '@application/di/container'
import { useAuthStore } from '@application/stores/AuthStore'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { ErrorCode } from '@infra/errors/ErrorCode'
import { RoutePaths } from '@presentation/constants/routePaths'
import { useToast } from '@presentation/hooks/useToast'
import { maskNationalId } from '@presentation/utils/formatters'

export interface UseSendOtpResult {
  isLoading: boolean
  sendOtp: (nationalIdPlain: string) => Promise<{ success: boolean; errorCode?: ErrorCode }>
}

export function useSendOtp(): UseSendOtpResult {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const setOtpSession = useAuthStore((s) => s.setActiveOtpSession)
  const setLastNationalIdMasked = useAuthStore((s) => s.setLastNationalIdMasked)
  const navigate = useNavigate()
  const toast = useToast()

  const sendOtp = useCallback(
    async (nationalIdPlain: string): Promise<{ success: boolean; errorCode?: ErrorCode }> => {
      setIsLoading(true)
      try {
        const result = await getUseCases().sendOtp.execute(nationalIdPlain)
        setOtpSession(result.session)
        setLastNationalIdMasked(maskNationalId(nationalIdPlain))
        toast.info('Kode OTP terkirim', `Kode OTP dikirim ke ${result.session.maskDestination}`)
        navigate(RoutePaths.OTP_VERIFICATION, { replace: true })
        return { success: true }
      } catch (err) {
        toast.showError(err)
        if (isApplicationError(err)) return { success: false, errorCode: err.code }
        return { success: false, errorCode: ErrorCode.UNKNOWN }
      } finally {
        setIsLoading(false)
      }
    },
    [navigate, setLastNationalIdMasked, setOtpSession, toast],
  )

  return { isLoading, sendOtp }
}
