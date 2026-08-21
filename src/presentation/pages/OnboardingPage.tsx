import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ListOrdered, ShieldAlert, ArrowRight } from 'lucide-react'
import { AuthLayout } from '@presentation/layouts/AuthLayout'
import { StepIndicator } from '@presentation/components/ui/StepIndicator'
import { Button } from '@presentation/components/ui/Button'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { RoutePaths } from '@presentation/constants/routePaths'
import { useUiStore } from '@application/stores/UiStore'
import { SecureStorage } from '@infra/storage/SecureStorage'
import { StorageKeys } from '@infra/storage/StorageKeys'
import { cn } from '@presentation/utils/cn'

type OnboardingSlideIndex = 1 | 2 | 3

const SLIDES_DEFS = [
  {
    index: 1 as const,
    Icon: ShieldCheck,
    title: USER_STRINGS.onboarding.slide1.title,
    description: USER_STRINGS.onboarding.slide1.description,
    ctaTag: USER_STRINGS.onboarding.slide1.illustrationCta,
    tone: 'from-brand-500 to-brand-700',
    glow: 'shadow-[0_20px_70px_rgba(200,16,46,0.28)]',
  },
  {
    index: 2 as const,
    Icon: ListOrdered,
    title: USER_STRINGS.onboarding.slide2.title,
    description: USER_STRINGS.onboarding.slide2.description,
    ctaTag: USER_STRINGS.onboarding.slide2.illustrationCta,
    tone: 'from-[#2E7D32] to-[#1B5E20]',
    glow: 'shadow-[0_20px_70px_rgba(46,125,50,0.28)]',
  },
  {
    index: 3 as const,
    Icon: ShieldAlert,
    title: USER_STRINGS.onboarding.slide3.title,
    description: USER_STRINGS.onboarding.slide3.description,
    ctaTag: USER_STRINGS.onboarding.slide3.illustrationCta,
    tone: 'from-[#1565C0] to-[#0D47A1]',
    glow: 'shadow-[0_20px_70px_rgba(21,101,192,0.28)]',
  },
] as const

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingSlideIndex>(1)
  const navigate = useNavigate()
  const setOnboardingSeen = useUiStore((s) => s.setOnboardingSeen)

  const slide = useMemo(() => SLIDES_DEFS[currentStep - 1]!, [currentStep])
  const isLast = currentStep === 3

  const completeFlow = useCallback(() => {
    setOnboardingSeen(true)
    SecureStorage.set(StorageKeys.ONBOARDING_COMPLETED, true)
    navigate(RoutePaths.NATIONAL_ID_LOGIN, { replace: true })
  }, [navigate, setOnboardingSeen])

  const next = useCallback(() => {
    if (!isLast) setCurrentStep((s) => (Math.min(3, s + 1) as OnboardingSlideIndex))
    else completeFlow()
  }, [completeFlow, isLast])

  useEffect(() => {
    const hasSeen = SecureStorage.get<boolean>(StorageKeys.ONBOARDING_COMPLETED)
    if (hasSeen === true) {
      navigate(RoutePaths.NATIONAL_ID_LOGIN, { replace: true })
    }
  }, [navigate])

  return (
    <AuthLayout paddingTopNarrow>
      <div className="relative flex flex-col flex-1">
        <div className="w-full flex items-center justify-between px-4 pt-3 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {USER_STRINGS.onboarding.stepIndicatorOf(currentStep, SLIDES_DEFS.length)}
          </span>
          <button
            type="button"
            onClick={completeFlow}
            className="text-xs font-bold text-brand-600 px-3 py-2 rounded-lg hover:bg-brand-50 tap-highlight-transparent transition"
          >
            {USER_STRINGS.onboarding.skipButton}
          </button>
        </div>
        <div className="px-4">
          <StepIndicator totalSteps={SLIDES_DEFS.length} currentStep={currentStep} />
        </div>
        <div
          key={currentStep}
          className="flex-1 flex flex-col px-5 pt-6 animate-slide-up"
        >
          <div className="w-full flex items-center justify-center mb-7">
            <div
              className={cn(
                'relative h-56 w-56 rounded-[32px] overflow-hidden text-white inline-flex items-center justify-center',
                slide.glow,
                'bg-gradient-to-br',
                slide.tone,
              )}
              aria-hidden
            >
              <div className="h-28 w-28 rounded-full bg-white/12 inline-flex items-center justify-center">
                <slide.Icon className="h-16 w-16" strokeWidth={1.6} />
              </div>
            </div>
          </div>
          <h2 className="text-[26px] font-extrabold leading-8 tracking-tight text-text mb-3">
            {slide.title}
          </h2>
          <p className="text-[15px] leading-7 text-text-body">{slide.description}</p>
        </div>
      </div>
      <div className="w-full px-5 pb-6 pt-5 mt-auto">
        <Button
          size="lg"
          isBlock
          onClick={next}
          rightIcon={
            <ArrowRight className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          }
        >
          {isLast ? USER_STRINGS.onboarding.finalCta : USER_STRINGS.common.next}
        </Button>
      </div>
    </AuthLayout>
  )
}
