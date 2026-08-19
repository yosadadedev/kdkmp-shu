import { useCallback, useEffect, useState } from 'react'
import { getUseCases } from '@application/di/container'
import { useAuthStore } from '@application/stores/AuthStore'
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

export function useMyProfile(): UseMyProfileResult {
  const [member, setMember] = useState<Member | null>(null)
  const [cooperativeUnit, setCooperativeUnit] = useState<CooperativeUnit | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const authToken = useAuthStore((s) => s.session?.authToken ?? null)
  const toast = useToast()

  const refetch = useCallback(async () => {
    if (!authToken) {
      setIsLoading(false)
      setErrorCode(ErrorCode.AUTH_SESSION_NOT_FOUND)
      return
    }
    setIsLoading(true)
    setErrorCode(null)
    try {
      const bundle = await getUseCases().getMyProfile.execute(authToken)
      setMember(bundle.member)
      setCooperativeUnit(bundle.cooperativeUnit)
    } catch (err) {
      if (isApplicationError(err)) {
        setErrorCode(err.code)
        toast.showError(err)
      } else {
        setErrorCode(ErrorCode.UNKNOWN)
        toast.showError(err)
      }
    } finally {
      setIsLoading(false)
    }
  }, [authToken])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { member, cooperativeUnit, isLoading, errorCode, refetch }
}
