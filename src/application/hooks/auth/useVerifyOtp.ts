import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUseCases } from '@application/di/container'
import { useAuthStore } from '@application/stores/AuthStore'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { ErrorCode } from '@infra/errors/ErrorCode'
import { RoutePaths } from '@presentation/constants/routePaths'
import { useToast } from '@presentation/hooks/useToast'
import type { VerifyOtpResult } from '@domain/entities/OtpSession'

export interface UseVerifyOtpResult {
  isLoading: boolean
  verifyOtp: (
    sessionId: string,
    otpCode: string,
  ) => Promise<{
    success: boolean
    failureCode: 'INVALID' | 'EXPIRED' | 'LOCKED' | 'UNKNOWN' | null
    session?: VerifyOtpResult
  }>
}

export function useVerifyOtp(): UseVerifyOtpResult {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const updateSession = useAuthStore((s) => s.updateActiveOtpSession)
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)
  const navigate = useNavigate()
  const toast = useToast()

  const verifyOtp = useCallback(
    async (
      sessionId: string,
      otpCode: string,
    ): Promise<{
      success: boolean
      failureCode: 'INVALID' | 'EXPIRED' | 'LOCKED' | 'UNKNOWN' | null
      session?: VerifyOtpResult
    }> => {
      setIsLoading(true)
      try {
        const result = await getUseCases().verifyOtp.execute(sessionId, otpCode)
        if (result.isVerified) {
          const authSession = await getUseCases().restoreSession.execute()
          if (authSession) {
            setAuthenticated(authSession)
            toast.success('Verifikasi berhasil', 'Kamu berhasil masuk akun anggota.')
          }
          navigate(RoutePaths.DASHBOARD_HOME, { replace: true })
          return { success: true, failureCode: null, session: result }
        }
        if (result.session.status === 'LOCKED') {
          updateSession(result.session)
          return { success: false, failureCode: 'LOCKED', session: result }
        }
        updateSession(result.session)
        return { success: false, failureCode: 'INVALID', session: result }
      } catch (err) {
        if (isApplicationError(err)) {
          if (err.code === ErrorCode.OTP_EXPIRED) {
            toast.showError(err)
            return { success: false, failureCode: 'EXPIRED' }
          }
          if (err.code === ErrorCode.OTP_CODE_INVALID) {
            return { success: false, failureCode: 'INVALID' }
          }
          toast.showError(err)
          return { success: false, failureCode: 'UNKNOWN' }
        }
        toast.showError(err)
        return { success: false, failureCode: 'UNKNOWN' }
      } finally {
        setIsLoading(false)
      }
    },
    [navigate, setAuthenticated, toast, updateSession],
  )

  return { isLoading, verifyOtp }
}
