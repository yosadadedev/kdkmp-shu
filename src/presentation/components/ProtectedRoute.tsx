import { useEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Skeleton, SkeletonCard } from '@presentation/components/ui/Skeleton'
import { useRestoreAuth } from '@application/hooks/auth/useRestoreAuth'
import { RoutePaths } from '@presentation/constants/routePaths'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'

export interface ProtectedRouteProps {
  children: ReactNode
  redirectUnauthenticatedTo?: string
}

export function ProtectedRoute({
  children,
  redirectUnauthenticatedTo = RoutePaths.NATIONAL_ID_LOGIN,
}: ProtectedRouteProps) {
  const { isInitializing, isAuthenticated } = useRestoreAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isInitializing) return undefined
    if (!isAuthenticated) {
      navigate(redirectUnauthenticatedTo, { replace: true, state: { from: location.pathname } })
    }
  }, [isInitializing, isAuthenticated, location.pathname, navigate, redirectUnauthenticatedTo])

  if (isInitializing) {
    return (
      <div className="app-shell min-h-dvh flex flex-col">
        <div className="h-2 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" aria-hidden />
        <div className="screen-container space-y-4">
          <div className="h-stack gap-3 mb-2">
            <Skeleton widthClass="w-14 h-14" rounded="rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton widthClass="w-2/3 h-4" />
              <Skeleton widthClass="w-1/2 h-3" />
            </div>
          </div>
          <Skeleton widthClass="w-full h-36" rounded="rounded-2xl" />
          <SkeletonCard />
          <SkeletonCard />
          <div className="text-center text-sm text-text-muted">
            {USER_STRINGS.protectedRoute.redirectingLogin}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null
  return <>{children}</>
}
