import { create } from 'zustand'
import type { ErrorCode } from '@infra/errors/ErrorCode'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface AppToastItem {
  id: string
  variant: ToastVariant
  titleId: string
  messageId?: string
  durationMs: number
  errorCode?: ErrorCode
}

interface UiState {
  toasts: AppToastItem[]
  pushToast: (toast: Omit<AppToastItem, 'id'>) => string
  dismissToast: (id: string) => void
  clearToasts: () => void
  isOnboardingSeen: boolean
  setOnboardingSeen: (flag: boolean) => void
}

const generateToastId = () => `toast_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  isOnboardingSeen: false,

  pushToast: (toast) => {
    const id = generateToastId()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    if (toast.durationMs > 0) {
      window.setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
      }, toast.durationMs)
    }
    return id
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),

  setOnboardingSeen: (flag) => set({ isOnboardingSeen: flag }),
}))
