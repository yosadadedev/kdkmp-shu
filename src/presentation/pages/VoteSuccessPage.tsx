import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, MapPin } from 'lucide-react'
import { Button } from '@presentation/components/ui/Button'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { RoutePaths } from '@presentation/constants/routePaths'
import { VoteChoice } from '@domain/enums/VoteChoice'
import type { VoteSubmission } from '@domain/entities/VoteSubmission'
import { useLogout } from '@application/hooks/auth/useLogout'
import { useMyProfile } from '@application/hooks/profile/useMyProfile'
import { cn } from '@presentation/utils/cn'

const PSEUDO_SUBMISSION: VoteSubmission = {
  id: 'fallback-vote',
  profitSharingRecordId: 'psr-2025-sukamaju',
  anonymousVoteToken: 'anon_mock_success_placeholder',
  choice: VoteChoice.AGREE,
  submittedAtEpochMs: Date.now(),
  fiscalYear: 2025,
}

interface ConfettiPiece {
  id: number
  left: number
  delayMs: number
  durationMs: number
  sizePx: number
  rotateDeg: number
  color: string
}

const CONFETTI_COLORS = ['#C8102E', '#FFFFFF', '#059669', '#FACC15', '#F97316']

function buildConfettiBurst(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delayMs: Math.round(Math.random() * 900),
    durationMs: 2200 + Math.round(Math.random() * 1800),
    sizePx: 6 + Math.round(Math.random() * 8),
    rotateDeg: Math.round(Math.random() * 360),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
  }))
}

function ConfettiBurst({ pieces }: { pieces: ConfettiPiece[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden>
      <style>{`
        @keyframes kdkmp-confetti-fall {
          0% {
            transform: translate3d(0, -12vh, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 112vh, 0) rotate(720deg);
            opacity: 0.2;
          }
        }
      `}</style>
      {pieces.map((p) => (
        <span
          key={p.id}
          className={cn(
            'absolute top-0 rounded-[2px]',
            p.sizePx >= 11 ? 'rounded-sm' : '',
          )}
          style={{
            left: `${p.left}%`,
            width: `${p.sizePx}px`,
            height: `${Math.max(2, Math.round(p.sizePx * 0.45))}px`,
            backgroundColor: p.color,
            boxShadow: p.color === '#FFFFFF' ? '0 0 0 1px rgba(200,16,46,0.18)' : undefined,
            animation: `kdkmp-confetti-fall ${p.durationMs}ms ease-in ${p.delayMs}ms 1 both`,
            transform: `rotate(${p.rotateDeg}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export function VoteSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { cooperativeUnit } = useMyProfile()
  const { isLoading: isLogoutLoading, logout } = useLogout()

  const submission = useMemo<VoteSubmission>(() => {
    const state = location.state as { submission?: VoteSubmission } | null
    return state?.submission ?? PSEUDO_SUBMISSION
  }, [location.state])

  void submission

  const confetti = useMemo<ConfettiPiece[]>(() => buildConfettiBurst(48), [])

  const handleBackToOnboarding = async () => {
    try {
      await logout()
    } finally {
      navigate(RoutePaths.ONBOARDING, { replace: true })
    }
  }

  const kdkmpLabel = cooperativeUnit?.branchName ?? null

  return (
    <div className="app-shell min-h-dvh bg-surface flex flex-col relative overflow-hidden">
      <ConfettiBurst pieces={confetti} />
      <main className="flex-1 w-full screen-container flex flex-col min-h-0 relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center text-center pt-10 pb-6 animate-scale-pop">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-success-soft rounded-full blur-2xl opacity-80 scale-125" aria-hidden />
            <div className="relative h-24 w-24 rounded-full bg-success text-white inline-flex items-center justify-center shadow-[0_20px_60px_rgba(76,175,80,0.35)]">
              <style>{`
                @keyframes kdkmp-check-pulse {
                  0%, 100% { transform: scale(1); }
                  30% { transform: scale(1.08) rotate(-2deg); }
                  60% { transform: scale(0.97) rotate(1deg); }
                }
              `}</style>
              <div style={{ animation: 'kdkmp-check-pulse 1.8s ease-in-out infinite' }}>
                <CheckCircle2 className="h-14 w-14" strokeWidth={1.75} />
              </div>
            </div>
          </div>
          <h2 className="text-[26px] leading-8 font-extrabold tracking-tight text-text mb-2">
            {USER_STRINGS.voteSuccess.title}
          </h2>
          {kdkmpLabel ? (
            <div className="h-stack justify-center gap-1.5 mb-2 px-2">
              <MapPin className="h-4 w-4 text-brand-600 shrink-0" />
              <p className="text-[14px] leading-5 text-text">
                Unit KDKMP{' '}
                <span className="font-bold text-brand-700">{kdkmpLabel}</span>
              </p>
            </div>
          ) : null}
          <p className="text-sm leading-6 text-text-body px-2 max-w-[320px]">
            {USER_STRINGS.voteSuccess.subtitle}
          </p>
        </div>

        <div className="pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-3 shrink-0">
          <Button
            size="lg"
            isBlock
            isLoading={isLogoutLoading}
            onClick={() => void handleBackToOnboarding()}
          >
            {USER_STRINGS.voteSuccess.ctaBackHome}
          </Button>
        </div>
      </main>
    </div>
  )
}
