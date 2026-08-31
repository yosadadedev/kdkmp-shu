import type { StorageKey } from './StorageKeys'

const isBrowserRuntime = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const encodeForStorage = <T>(value: T): string => {
  const serialized = JSON.stringify(value)
  try {
    return typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(serialized))) : serialized
  } catch {
    return serialized
  }
}

const decodeFromStorage = <T>(raw: string): T | null => {
  try {
    const decoded = typeof atob === 'function' ? decodeURIComponent(escape(atob(raw))) : raw
    return JSON.parse(decoded) as T
  } catch {
    return null
  }
}

export const SecureStorage = {
  set<T>(key: StorageKey, value: T): boolean {
    if (!isBrowserRuntime()) return false
    try {
      window.localStorage.setItem(key, encodeForStorage(value))
      return true
    } catch {
      return false
    }
  },

  get<T>(key: StorageKey): T | null {
    if (!isBrowserRuntime()) return null
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return null
      return decodeFromStorage<T>(raw)
    } catch {
      return null
    }
  },

  remove(key: StorageKey): boolean {
    if (!isBrowserRuntime()) return false
    try {
      window.localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },

  clearAllSensitive(): void {
    if (!isBrowserRuntime()) return
    this.remove('kdkmp_shu_auth_session_v1' as StorageKey)
  },
} as const
