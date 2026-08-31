import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react'
import { AuthLayout } from '@presentation/layouts/AuthLayout'
import { Button } from '@presentation/components/ui/Button'
import { CountdownText } from '@presentation/components/ui/CountdownText'
import { OtpInputBox, type OtpInputHandle } from '@presentation/components/ui/OtpInputBox'
import { Divider } from '@presentation/components/ui/Divider'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { RoutePaths } from '@presentation/constants/routePaths'
import { useAuthStore } from '@application/stores/AuthStore'
import { useVerifyOtp } from '@application/hooks/auth/useVerifyOtp'
import { useResendOtp } from '@application/hooks/auth/useResendOtp'
import { cn } from '@presentation/utils/cn'
import { formatCountdownHumanId } from '@presentation/utils/formatters'

export function OtpVerificationPage() {
  const navigate = useNavigate()
  const activeSession = useAuthStore((s) => s.activeOtpSession)
  const updateSession = useAuthStore((s) => s.updateActiveOtpSession)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { isLoading: isVerifyLoading, verifyOtp } = useVerifyOtp()
  const { isLoading: isResendLoading, resendOtp } = useResendOtp()
  const otpRef = useRef<OtpInputHandle>(null)

  const [otpValue, setOtpValue] = useState<string>('')
  const [failureCount, setFailureCount] = useState<number>(0)
  const [shakeKey, setShakeKey] = useState<number>(0)
  const [, setExpireSeconds] = useState<number>(3 * 60)
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState<number>(3 * 60)

  useEffect(() => {
    if (!activeSession) return
    const expire = Math.max(0, Math.floor((activeSession.expireAtEpochMs - Date.now()) / 1000))
    setExpireSeconds(expire > 0 ? expire : 0)
    const threeMinFromCreated = activeSession.createdAtEpochMs + 3 * 60 * 1000
    const remainingResend = Math.max(0, Math.floor((threeMinFromCreated - Date.now()) / 1000))
    setResendCooldownSeconds(remainingResend > 0 ? remainingResend : 0)
  }, [activeSession])

  useEffect(() => {
    if (!activeSession) return undefined
    if (resendCooldownSeconds <= 0) return undefined
    const timer = window.setInterval(() => {
      setResendCooldownSeconds((prev) => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [activeSession, resendCooldownSeconds <= 0])

  useEffect(() => {
    if (isAuthenticated) return
    if (!activeSession) {
      navigate(RoutePaths.NATIONAL_ID_LOGIN, { replace: true })
    }
  }, [activeSession, navigate, isAuthenticated])

  const lockedUntil = activeSession?.lockedUntilEpochMs ?? null
  const lockedRemainingSeconds =
    lockedUntil && lockedUntil > Date.now()
      ? Math.ceil((lockedUntil - Date.now()) / 1000)
      : null
  const isLocked = lockedRemainingSeconds !== null

  const handleComplete = useCallback(
    async (value: string) => {
      if (!activeSession || isVerifyLoading || isLocked) return
      const result = await verifyOtp(activeSession.sessionId, value)
      if (result.success) return
      setFailureCount((c) => c + 1)
      setShakeKey((k) => k + 1)
      if (result.failureCode !== 'LOCKED') {
        otpRef.current?.clear()
        otpRef.current?.focus(0)
      }
    },
    [activeSession, isLocked, isVerifyLoading, verifyOtp],
  )

  const handleSubmitClick = async () => {
    if (!activeSession) return
    if (otpValue.length !== 6) {
      otpRef.current?.focus(otpValue.length)
      return
    }
    await handleComplete(otpValue)
  }

  const handleResend = async () => {
    if (!activeSession) return
    const result = await resendOtp(activeSession.sessionId)
    if (result.success && result.result) {
      updateSession(result.result.session)
      setResendCooldownSeconds(result.result.countdownResendSeconds)
      setExpireSeconds(result.result.countdownExpireSeconds)
      setOtpValue('')
      otpRef.current?.clear()
      otpRef.current?.focus(0)
    }
  }

  const canResend = resendCooldownSeconds <= 0 && !isResendLoading && !isLocked

  if (!activeSession) return null

  return (
    <AuthLayout
      backPath={RoutePaths.NATIONAL_ID_LOGIN}
      title={USER_STRINGS.otpVerification.pageTitle}
      subtitle={`${USER_STRINGS.otpVerification.pageSubtitlePrefix}: ${activeSession.maskDestination}.`}
    >
      <div className="px-4 pt-1 flex flex-col gap-5">
        <div
          key={shakeKey}
          className={cn('v-stack gap-4', shakeKey > 0 ? 'animate-shake-x' : '')}
        >
          <OtpInputBox
            ref={otpRef}
            length={6}
            value={otpValue}
            onChange={setOtpValue}
            onComplete={handleComplete}
            isError={failureCount >= 1 || isLocked}
            isDisabled={isLocked || isVerifyLoading}
            autoFocus
            variant="single-box"
            aria-label="Masukkan 6 digit kode OTP"
          />
          {/* <div className="flex items-center justify-between px-1 text-xs">
            <div className="h-stack gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success-text" />
              <CountdownText
                initialSeconds={expireSeconds}
                format="human"
                size="sm"
                className="text-text-muted"
                onComplete={() => setExpireSeconds(0)}
              />
            </div>
            <div className="text-text-muted">
              {USER_STRINGS.otpVerification.resendRemaining(
                expireSeconds > 0
                  ? formatCountdownHumanId(expireSeconds).replace('menit', 'mnt').replace('detik', 'dtk')
                  : '00:00',
              )}
            </div>
          </div> */}
        </div>

        {isLocked ? (
          <div className="card-padded bg-danger-soft border-danger flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-danger-text mt-0.5 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-danger-text leading-5">
                Sesi OTP diblokir sementara
              </h4>
              <p className="mt-1 text-xs leading-5 text-danger-text/90">
                {USER_STRINGS.otpVerification.wrongOtpLocked(
                  lockedRemainingSeconds ? formatCountdownHumanId(lockedRemainingSeconds) : 'beberapa saat',
                )}
              </p>
            </div>
          </div>
        ) : failureCount > 0 ? (
          <p className="text-xs font-semibold text-danger-text text-center">
            {USER_STRINGS.otpVerification.wrongOtpOnce}
          </p>
        ) : null}

        <Divider spacing="sm" />

        <div className="flex flex-col items-center gap-2">
          {/* {resendCooldownSeconds > 0 ? ( */}
            <p className="text-sm text-text-muted font-medium">
              <CountdownText
                initialSeconds={resendCooldownSeconds}
                format="mmss"
                size="md"
                className="text-text-muted"
                onComplete={() => setResendCooldownSeconds(0)}
              />
            </p>
          {/* ) : null} */}
          <Button
            type="button"
            variant={canResend ? 'outline' : 'ghost'}
            size="md"
            onClick={handleResend}
            isLoading={isResendLoading}
            disabled={!canResend}
            isBlock
            leftIcon={<RefreshCw className="h-[18px] w-[18px]" strokeWidth={2} />}
          >
            {USER_STRINGS.otpVerification.resendAvailable}
          </Button>
        </div>

        <div className="flex-1" />

        <Button
          size="lg"
          isBlock
          onClick={handleSubmitClick}
          isLoading={isVerifyLoading}
          loadingText={USER_STRINGS.otpVerification.ctaSubmitLoading}
          disabled={isLocked || otpValue.length < 6}
          rightIcon={!isVerifyLoading ? <ArrowRight className="h-5 w-5" /> : undefined}
        >
          {USER_STRINGS.otpVerification.ctaSubmit}
        </Button>
      </div>
    </AuthLayout>
  )
}
