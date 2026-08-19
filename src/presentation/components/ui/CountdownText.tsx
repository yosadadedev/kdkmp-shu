import { useEffect, useState } from 'react'
import { cn } from '@presentation/utils/cn'
import { formatCountdownHumanId, formatCountdownMmSs } from '@presentation/utils/formatters'

export interface CountdownTextProps {
  initialSeconds: number
  onComplete?: () => void
  format?: 'mmss' | 'human'
  paused?: boolean
  className?: string
  pulseOnFinalSeconds?: number
  size?: 'sm' | 'md' | 'lg'
}

export function CountdownText({
  initialSeconds,
  onComplete,
  format = 'human',
  paused = false,
  className,
  pulseOnFinalSeconds = 10,
  size = 'md',
}: CountdownTextProps) {
  const [remaining, setRemaining] = useState<number>(Math.max(0, Math.floor(initialSeconds)))

  useEffect(() => {
    setRemaining(Math.max(0, Math.floor(initialSeconds)))
  }, [initialSeconds])

  useEffect(() => {
    if (paused) return undefined
    if (remaining <= 0) return undefined
    const interval = window.setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        if (next <= 0) {
          window.clearInterval(interval)
          onComplete?.()
          return 0
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [remaining, paused, onComplete])

  const formatted =
    format === 'mmss' ? formatCountdownMmSs(remaining) : formatCountdownHumanId(remaining)
  const pulse = remaining > 0 && remaining <= pulseOnFinalSeconds

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        'font-semibold tabular-nums',
        size === 'lg' && 'text-base',
        size === 'md' && 'text-sm',
        size === 'sm' && 'text-xs',
        remaining === 0 ? 'text-text-muted' : 'text-brand-600',
        pulse ? 'animate-countdown-pulse' : '',
        className,
      )}
    >
      {formatted}
    </span>
  )
}
