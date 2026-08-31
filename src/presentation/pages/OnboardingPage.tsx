import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, ListOrdered, ShieldAlert, ArrowRight } from 'lucide-react'
import { AuthLayout } from '@presentation/layouts/AuthLayout'
import { StepIndicator } from '@presentation/components/ui/StepIndicator'
import { Button } from '@presentation/components/ui/Button'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { RoutePaths } from '@presentation/constants/routePaths'

type OnboardingSlideIndex = 1 | 2 | 3

const SLIDES_DEFS = [
  {
    index: 1 as const,
    Icon: ShieldCheck,
    title: USER_STRINGS.onboarding.slide1.title,
    description: USER_STRINGS.onboarding.slide1.description,
    ctaTag: USER_STRINGS.onboarding.slide1.illustrationCta,
  },
  {
    index: 2 as const,
    Icon: ListOrdered,
    title: USER_STRINGS.onboarding.slide2.title,
    description: USER_STRINGS.onboarding.slide2.description,
    ctaTag: USER_STRINGS.onboarding.slide2.illustrationCta,
  },
  {
    index: 3 as const,
    Icon: ShieldAlert,
    title: USER_STRINGS.onboarding.slide3.title,
    description: USER_STRINGS.onboarding.slide3.description,
    ctaTag: USER_STRINGS.onboarding.slide3.illustrationCta,
  },
] as const

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingSlideIndex>(1)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const dragStartX = useRef<number | null>(null)
  const navigate = useNavigate()

  const slide = useMemo(() => SLIDES_DEFS[currentStep - 1]!, [currentStep])
  const isLast = currentStep === 3

  const completeFlow = useCallback(() => {
    navigate(RoutePaths.NATIONAL_ID_LOGIN, { replace: true })
  }, [navigate])

  const goPrev = useCallback(() => {
    setDirection('prev')
    setCurrentStep((s) => (Math.max(1, s - 1) as OnboardingSlideIndex))
  }, [])

  const goNextSlide = useCallback(() => {
    setDirection('next')
    setCurrentStep((s) => (Math.min(3, s + 1) as OnboardingSlideIndex))
  }, [])

  const next = useCallback(() => {
    if (!isLast) goNextSlide()
    else completeFlow()
  }, [completeFlow, goNextSlide, isLast])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragStartX.current === null) return
      const delta = e.clientX - dragStartX.current
      dragStartX.current = null
      if (Math.abs(delta) < 60) return
      if (delta < 0) goNextSlide()
      else goPrev()
    },
    [goNextSlide, goPrev],
  )

  const onPointerCancel = useCallback(() => {
    dragStartX.current = null
  }, [])

  return (
    <AuthLayout
      paddingTopNarrow
      headerAction={
        <button
          type="button"
          onClick={completeFlow}
          className="text-xs font-bold text-brand-600 px-3 py-2 rounded-lg hover:bg-brand-50 tap-highlight-transparent transition"
        >
          {USER_STRINGS.onboarding.skipButton}
        </button>
      }
      bottomSlot={
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <StepIndicator totalSteps={SLIDES_DEFS.length} currentStep={currentStep} />
          </div>
          <Button
            size="lg"
            isBlock
            onClick={next}
            rightIcon={<ArrowRight className="h-5 w-5" strokeWidth={2.25} aria-hidden />}
          >
            {isLast ? USER_STRINGS.onboarding.finalCta : USER_STRINGS.common.next}
          </Button>
        </div>
      }
    >
      <div
        className="flex-1 flex items-center justify-center px-6 select-none cursor-grab active:cursor-grabbing touch-pan-y mt-16"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div
          key={currentStep}
          className={`flex flex-col items-center justify-center w-full text-center ${
            direction === 'next' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          }`}
        >
          <div
            className="h-24 w-24 rounded-full bg-brand-50 text-brand-600 inline-flex items-center justify-center"
            aria-hidden
          >
            <slide.Icon className="h-12 w-12" strokeWidth={1.6} />
          </div>

          <span className="mt-7 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600">
            {slide.ctaTag}
          </span>

          <h2 className="mt-3 text-[26px] font-extrabold leading-9 tracking-tight text-text">
            {slide.title}
          </h2>

          <p className="mt-3 text-[15px] leading-7 text-text-body">{slide.description}</p>
        </div>
      </div>
    </AuthLayout>
  )
}
