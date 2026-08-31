import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUseCases } from '@application/di/container'
import { useAuthStore } from '@application/stores/AuthStore'
import { RoutePaths } from '@presentation/constants/routePaths'
import { useToast } from '@presentation/hooks/useToast'

export function useLogout() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const clearAuthenticated = useAuthStore((s) => s.clearAuthenticated)
  const setOtpSession = useAuthStore((s) => s.setActiveOtpSession)
  const navigate = useNavigate()
  const toast = useToast()

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await getUseCases().logout.execute()
      clearAuthenticated()
      setOtpSession(null)
      toast.info('Keluar berhasil', 'Kamu sudah keluar dari akun anggota.')
      navigate(RoutePaths.NATIONAL_ID_LOGIN, { replace: true })
    } finally {
      setIsLoading(false)
    }
  }, [clearAuthenticated, navigate, setOtpSession, toast])

  return { isLoading, logout }
}
