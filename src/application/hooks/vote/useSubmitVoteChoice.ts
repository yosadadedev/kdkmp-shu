import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUseCases } from '@application/di/container'
import type { VoteChoice } from '@domain/enums/VoteChoice'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { useToast } from '@presentation/hooks/useToast'
import type { SubmitVoteResult } from '@domain/entities/VoteSubmission'
import { DEFAULT_MEMBER_ID } from '@application/constants/dashboardDefaults'
import { useCurrentProfitSharing } from '../profit-sharing/useCurrentProfitSharing'
import { RoutePaths } from '@presentation/constants/routePaths'

export interface UseSubmitVoteChoiceResult {
  isLoading: boolean
  submitVote: (choice: VoteChoice) => Promise<{ success: boolean; result: SubmitVoteResult | null }>
}

export function useSubmitVoteChoice(): UseSubmitVoteChoiceResult {
  const { record } = useCurrentProfitSharing()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const toast = useToast()
  const navigate = useNavigate()

  const submitVote = useCallback(
    async (choice: VoteChoice): Promise<{ success: boolean; result: SubmitVoteResult | null }> => {
      if (!record) return { success: false, result: null }
      setIsLoading(true)
      try {
        const result = await getUseCases().submitVoteChoice.execute(DEFAULT_MEMBER_ID, record.id, choice)
        if (result.isSuccess) {
          toast.success('Suara terkirim', 'Terima kasih. Pilihanmu sudah terekam secara rahasia.')
          navigate(RoutePaths.VOTE_SUCCESS, { state: { submission: result.submittedVote }, replace: true })
          return { success: true, result }
        }
        toast.warning('Gagal mengirim suara', 'Silakan coba beberapa saat lagi.')
        return { success: false, result }
      } catch (err) {
        if (isApplicationError(err)) {
          toast.showError(err)
        } else {
          toast.showError(err)
        }
        return { success: false, result: null }
      } finally {
        setIsLoading(false)
      }
    },
    [record, navigate, toast],
  )

  return { isLoading, submitVote }
}
