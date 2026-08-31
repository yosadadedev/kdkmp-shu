import { create } from 'zustand'
import type { GateCompany } from '@domain/entities/GateCompany'
import { SecureStorage } from '@infra/storage/SecureStorage'
import { StorageKeys } from '@infra/storage/StorageKeys'

interface GateState {
  company: GateCompany | null
  isVerified: boolean
  setCompany: (company: GateCompany) => void
  clearCompany: () => void
}

const persistedCompany = SecureStorage.get<GateCompany>(StorageKeys.GATE_COMPANY)

export const useGateStore = create<GateState>((set) => ({
  company: persistedCompany,
  isVerified: persistedCompany !== null,
  setCompany: (company) => {
    SecureStorage.set(StorageKeys.GATE_COMPANY, company)
    set({ company, isVerified: true })
  },
  clearCompany: () => {
    SecureStorage.remove(StorageKeys.GATE_COMPANY)
    set({ company: null, isVerified: false })
  },
}))
