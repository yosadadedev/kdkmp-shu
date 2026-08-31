import { cn } from '@presentation/utils/cn'
import { formatRupiah, formatShortRupiah } from '@presentation/utils/formatters'

export interface RupiahTextProps {
  cents: number
  variant?: 'full' | 'short' | 'noSymbol'
  size?: 'xl' | 'lg' | 'md' | 'sm'
  tone?: 'default' | 'brand' | 'success' | 'danger' | 'muted'
  showZeroAsDash?: boolean
  className?: string
}

const sizeMap = {
  xl: 'text-3xl font-extrabold leading-10 tracking-tight',
  lg: 'text-2xl font-bold leading-8 tracking-tight',
  md: 'text-lg font-semibold leading-6',
  sm: 'text-sm font-medium leading-5',
}

const toneMap = {
  default: 'text-text',
  brand: 'text-brand-600',
  success: 'text-success-text',
  danger: 'text-danger-text',
  muted: 'text-text-muted',
}

export function RupiahText({
  cents,
  variant = 'full',
  size = 'md',
  tone = 'default',
  showZeroAsDash = true,
  className,
}: RupiahTextProps) {
  if (showZeroAsDash && cents === 0) {
    return <span className={cn(sizeMap[size], toneMap.muted, className)}>—</span>
  }
  const text =
    variant === 'short'
      ? formatShortRupiah(cents)
      : variant === 'noSymbol'
        ? formatRupiah(cents, { withSymbol: false })
        : formatRupiah(cents)
  return (
    <span className={cn('tabular-nums', sizeMap[size], toneMap[tone], className)}>
      {text}
    </span>
  )
}
