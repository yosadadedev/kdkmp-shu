import { useCallback, useState } from 'react'
import { getUseCases } from '@application/di/container'
import { useGateStore } from '@application/stores/GateStore'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { useToast } from '@presentation/hooks/useToast'

export type GateVerifyStatus = 'idle' | 'verifying' | 'success' | 'not-found' | 'error'

export interface UseVerifyGateAccessResult {
  status: GateVerifyStatus
  verify: (code: string) => Promise<void>
}

export function useVerifyGateAccess(): UseVerifyGateAccessResult {
  const [status, setStatus] = useState<GateVerifyStatus>('idle')
  const setCompany = useGateStore((s) => s.setCompany)
  const toast = useToast()

  const verify = useCallback(
    async (code: string) => {
      setStatus('verifying')
      try {
        const company = await getUseCases().verifyGateAccessCode.execute(code)
        if (!company) {
          setStatus('not-found')
          return
        }
        setCompany(company)
        setStatus('success')
      } catch (err) {
        if (isApplicationError(err)) {
          toast.showError(err)
        }
        setStatus('error')
      }
    },
    [setCompany, toast],
  )

  return { status, verify }
}
