import { useCallback, useEffect, useState } from 'react'
import { getUseCases } from '@application/di/container'
import type { MemberVoteStatus } from '@domain/entities/MemberVoteStatus'
import { isApplicationError } from '@infra/errors/ApplicationError'
import type { ErrorCode } from '@infra/errors/ErrorCode'
import { useToast } from '@presentation/hooks/useToast'
import { useMyProfile } from '../profile/useMyProfile'
import { useCurrentProfitSharing } from '../profit-sharing/useCurrentProfitSharing'

export interface UseMemberVoteStatusResult {
  voteStatus: MemberVoteStatus | null
  isLoading: boolean
  errorCode: ErrorCode | null
  refetch: () => Promise<void>
}

export function useMemberVoteStatus(): UseMemberVoteStatusResult {
  const { member } = useMyProfile()
  const { record } = useCurrentProfitSharing()
  const [voteStatus, setVoteStatus] = useState<MemberVoteStatus | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const toast = useToast()

  const refetch = useCallback(async () => {
    if (!member || !record) return
    setIsLoading(true)
    setErrorCode(null)
    try {
      const status = await getUseCases().getMemberVoteStatus.execute(member.id, record.id)
      setVoteStatus(status)
    } catch (err) {
      if (isApplicationError(err)) {
        setErrorCode(err.code)
      }
      toast.showError(err)
    } finally {
      setIsLoading(false)
    }
  }, [member, record, toast])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { voteStatus, isLoading, errorCode, refetch }
}
