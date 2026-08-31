import { create } from 'zustand'
import type { Member } from '@domain/entities/Member'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'
import type { ErrorCode } from '@infra/errors/ErrorCode'

interface ProfileState {
  member: Member | null
  cooperativeUnit: CooperativeUnit | null
  isLoading: boolean
  errorCode: ErrorCode | null
  loadedForToken: string | null
  fetchingToken: string | null
  startFetch: (token: string) => void
  succeed: (member: Member, cooperativeUnit: CooperativeUnit, token: string) => void
  fail: (errorCode: ErrorCode) => void
  reset: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  member: null,
  cooperativeUnit: null,
  isLoading: false,
  errorCode: null,
  loadedForToken: null,
  fetchingToken: null,
  startFetch: (token) => set({ isLoading: true, errorCode: null, fetchingToken: token }),
  succeed: (member, cooperativeUnit, token) =>
    set({ member, cooperativeUnit, isLoading: false, errorCode: null, loadedForToken: token, fetchingToken: null }),
  fail: (errorCode) => set({ isLoading: false, errorCode, fetchingToken: null }),
  reset: () =>
    set({ member: null, cooperativeUnit: null, isLoading: false, errorCode: null, loadedForToken: null, fetchingToken: null }),
}))
