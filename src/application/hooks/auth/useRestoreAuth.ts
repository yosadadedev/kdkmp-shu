import { useCallback, useEffect, useState } from 'react'
import { getUseCases } from '@application/di/container'
import { useAuthStore } from '@application/stores/AuthStore'
import { SecureStorage } from '@infra/storage/SecureStorage'
import { StorageKeys } from '@infra/storage/StorageKeys'

export interface UseRestoreAuthResult {
  isInitializing: boolean
  isAuthenticated: boolean
  refreshFromStorage: () => Promise<void>
}

export function useRestoreAuth(): UseRestoreAuthResult {
  const setInit = useAuthStore((s) => s.setInitializing)
  const setAuth = useAuthStore((s) => s.setAuthenticated)
  const clearAuth = useAuthStore((s) => s.clearAuthenticated)
  const isStoreInit = useAuthStore((s) => s.isInitializing)
  const isStoreAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [isInitializing, setIsInitializing] = useState<boolean>(true)

  const refreshFromStorage = useCallback(async () => {
    setInit(true)
    setIsInitializing(true)
    const session = await getUseCases().restoreSession.execute()
    if (session) {
      setAuth(session)
    } else {
      clearAuth()
      SecureStorage.remove(StorageKeys.AUTHENTICATED_SESSION)
    }
    setInit(false)
    setIsInitializing(false)
  }, [clearAuth, setAuth, setInit])

  useEffect(() => {
    void refreshFromStorage()
  }, [refreshFromStorage])

  return { isInitializing: isInitializing || isStoreInit, isAuthenticated: isStoreAuthenticated, refreshFromStorage }
}
