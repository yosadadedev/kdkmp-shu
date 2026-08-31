import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useGateStore } from '@application/stores/GateStore'
import { RoutePaths } from '@presentation/constants/routePaths'

export interface GateProtectedRouteProps {
  children: ReactNode
}

/**
 * Gate status is hydrated synchronously from localStorage at store creation
 * (see GateStore.ts), so unlike ProtectedRoute there's no async check/loading
 * state to gate on here — just an immediate redirect when not verified.
 */
export function GateProtectedRoute({ children }: GateProtectedRouteProps) {
  const isVerified = useGateStore((s) => s.isVerified)

  if (!isVerified) return <Navigate to={RoutePaths.NOT_FOUND} replace />
  return <>{children}</>
}
