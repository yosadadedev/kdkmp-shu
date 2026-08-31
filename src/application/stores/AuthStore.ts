import { create } from 'zustand'
import type { AuthenticatedSession } from '@domain/entities/AuthenticatedSession'
import type { OtpSession } from '@domain/entities/OtpSession'

interface AuthState {
  isInitializing: boolean
  isAuthenticated: boolean
  session: AuthenticatedSession | null
  activeOtpSession: OtpSession | null
  lastNationalIdMasked: string | null
  setInitializing: (flag: boolean) => void
  setAuthenticated: (session: AuthenticatedSession) => void
  clearAuthenticated: () => void
  setActiveOtpSession: (session: OtpSession | null) => void
  updateActiveOtpSession: (patch: Partial<OtpSession>) => void
  setLastNationalIdMasked: (masked: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitializing: true,
  isAuthenticated: false,
  session: null,
  activeOtpSession: null,
  lastNationalIdMasked: null,

  setInitializing: (flag) => set({ isInitializing: flag }),
  setAuthenticated: (session) =>
    set({ isAuthenticated: true, session, activeOtpSession: null, isInitializing: false }),
  clearAuthenticated: () =>
    set({ isAuthenticated: false, session: null, activeOtpSession: null }),
  setActiveOtpSession: (session) => set({ activeOtpSession: session }),
  updateActiveOtpSession: (patch) =>
    set((state) => ({
      activeOtpSession:
        state.activeOtpSession === null
          ? null
          : { ...state.activeOtpSession, ...patch },
    })),
  setLastNationalIdMasked: (masked) => set({ lastNationalIdMasked: masked }),
}))
