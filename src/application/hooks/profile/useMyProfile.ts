import { useCallback, useEffect } from 'react'
import { getUseCases } from '@application/di/container'
import { useAuthStore } from '@application/stores/AuthStore'
import { useProfileStore } from '@application/stores/ProfileStore'
import type { Member } from '@domain/entities/Member'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'
import { useToast } from '@presentation/hooks/useToast'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { ErrorCode } from '@infra/errors/ErrorCode'

export interface UseMyProfileResult {
  member: Member | null
  cooperativeUnit: CooperativeUnit | null
  isLoading: boolean
  errorCode: ErrorCode | null
  refetch: () => Promise<void>
}

/**
 * Called independently from several places in the dashboard tree (layout,
 * page, and a handful of other hooks). State lives in `useProfileStore` —
 * a shared singleton — rather than local useState, so all callers see the
 * same data instead of each firing its own `GET /api/profile`.
 *
 * `refetch` guards against duplicate fetches by reading the store's
 * *current* snapshot via `getState()` rather than this hook's own render
 * closure — several instances can mount in the same commit (e.g. React
 * StrictMode's double-invoke, or multiple consumers mounting together),
 * and their effects run one after another synchronously before any of
 * them re-renders, so a value captured at render time would already be
 * stale by the time a later sibling's effect checks it.
 */
export function useMyProfile(): UseMyProfileResult {
  const authToken = useAuthStore((s) => s.session?.authToken ?? null)
  const member = useProfileStore((s) => s.member)
  const cooperativeUnit = useProfileStore((s) => s.cooperativeUnit)
  const isLoading = useProfileStore((s) => s.isLoading)
  const errorCode = useProfileStore((s) => s.errorCode)
  const toast = useToast()

  const refetch = useCallback(async () => {
    if (!authToken) {
      useProfileStore.getState().reset()
      return
    }
    const snapshot = useProfileStore.getState()
    if (snapshot.loadedForToken === authToken || snapshot.fetchingToken === authToken) return

    useProfileStore.getState().startFetch(authToken)
    try {
      const bundle = await getUseCases().getMyProfile.execute(authToken)
      useProfileStore.getState().succeed(bundle.member, bundle.cooperativeUnit, authToken)
    } catch (err) {
      useProfileStore.getState().fail(isApplicationError(err) ? err.code : ErrorCode.UNKNOWN)
      toast.showError(err)
    }
  }, [authToken, toast])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { member, cooperativeUnit, isLoading, errorCode, refetch }
}
