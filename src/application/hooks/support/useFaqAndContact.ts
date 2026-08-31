import { useCallback, useEffect } from 'react'
import { getUseCases } from '@application/di/container'
import { useSupportStore } from '@application/stores/SupportStore'
import type { FaqItem } from '@domain/entities/FaqItem'
import type { AdminContact } from '@domain/entities/AdminContact'
import { useToast } from '@presentation/hooks/useToast'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { ErrorCode } from '@infra/errors/ErrorCode'

export interface UseFaqAndContactResult {
  faq: FaqItem[]
  contact: AdminContact | null
  isLoading: boolean
  errorCode: ErrorCode | null
  refetch: () => Promise<void>
}

/**
 * Called independently from both FaqAccordionSection and AdminContactSection.
 * State lives in useSupportStore (a shared singleton) and refetch dedupes via
 * getState() — same reasoning as useMyProfile: both sections can mount in the
 * same commit, so a value read from this hook's own render would already be
 * stale by the time a later sibling's effect checks it.
 */
export function useFaqAndContact(): UseFaqAndContactResult {
  const faq = useSupportStore((s) => s.faq)
  const contact = useSupportStore((s) => s.contact)
  const isLoading = useSupportStore((s) => s.isLoading)
  const errorCode = useSupportStore((s) => s.errorCode)
  const toast = useToast()

  const refetch = useCallback(async () => {
    const snapshot = useSupportStore.getState()
    if (snapshot.loaded || snapshot.fetching) return

    useSupportStore.getState().startFetch()
    try {
      const bundle = await getUseCases().getFaqAndContact.execute()
      useSupportStore.getState().succeed(bundle.faq, bundle.contact)
    } catch (err) {
      useSupportStore.getState().fail(isApplicationError(err) ? err.code : ErrorCode.UNKNOWN)
      toast.showError(err)
    }
  }, [toast])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { faq, contact, isLoading, errorCode, refetch }
}
