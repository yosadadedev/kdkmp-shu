import { cn } from '@presentation/utils/cn'

export interface StepIndicatorProps {
  totalSteps: number
  currentStep: number
  className?: string
  activeClassName?: string
  inactiveClassName?: string
}

export function StepIndicator({
  totalSteps,
  currentStep,
  className,
  activeClassName,
  inactiveClassName,
}: StepIndicatorProps) {
  return (
    <div
      role="progressbar"
      aria-label="langkah ke"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep}
      className={cn('flex items-center gap-2', className)}
    >
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const index = idx + 1
        const isActive = index === currentStep
        const isPast = index < currentStep
        return (
          <span
            key={index}
            aria-hidden
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              isActive
                ? cn('w-10 bg-brand-500', activeClassName)
                : isPast
                  ? cn('w-5 bg-brand-300', activeClassName)
                  : cn('w-5 bg-border-light', inactiveClassName),
            )}
          />
        )
      })}
    </div>
  )
}
