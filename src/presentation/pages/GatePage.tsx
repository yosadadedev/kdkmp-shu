import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RoutePaths } from '@presentation/constants/routePaths'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { useVerifyGateAccess } from '@application/hooks/gate/useVerifyGateAccess'

export function GatePage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { status, verify } = useVerifyGateAccess()
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    if (!code) {
      navigate(RoutePaths.NOT_FOUND, { replace: true })
      return
    }
    void verify(code)
  }, [code, navigate, verify])

  useEffect(() => {
    if (status === 'success') {
      navigate(RoutePaths.ONBOARDING, { replace: true })
    } else if (status === 'not-found' || status === 'error') {
      navigate(RoutePaths.NOT_FOUND, { replace: true })
    }
  }, [status, navigate])

  return (
    <div className="app-shell min-h-dvh flex flex-col">
      <div className="h-2 w-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" aria-hidden />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div
          className="h-10 w-10 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin"
          aria-hidden
        />
        <p className="text-sm text-text-muted">{USER_STRINGS.gate.verifyingTitle}</p>
      </div>
    </div>
  )
}
