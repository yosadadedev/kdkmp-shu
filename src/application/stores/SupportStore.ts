import { create } from 'zustand'
import type { FaqItem } from '@domain/entities/FaqItem'
import type { AdminContact } from '@domain/entities/AdminContact'
import type { ErrorCode } from '@infra/errors/ErrorCode'

interface SupportState {
  faq: FaqItem[]
  contact: AdminContact | null
  isLoading: boolean
  errorCode: ErrorCode | null
  loaded: boolean
  fetching: boolean
  startFetch: () => void
  succeed: (faq: FaqItem[], contact: AdminContact) => void
  fail: (errorCode: ErrorCode) => void
}

export const useSupportStore = create<SupportState>((set) => ({
  faq: [],
  contact: null,
  isLoading: false,
  errorCode: null,
  loaded: false,
  fetching: false,
  startFetch: () => set({ isLoading: true, errorCode: null, fetching: true }),
  succeed: (faq, contact) => set({ faq, contact, isLoading: false, errorCode: null, loaded: true, fetching: false }),
  fail: (errorCode) => set({ isLoading: false, errorCode, fetching: false }),
}))
