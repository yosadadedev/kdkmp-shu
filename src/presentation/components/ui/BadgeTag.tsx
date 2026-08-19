import { cn } from '@presentation/utils/cn'

export type BadgeTone = 'brand' | 'success' | 'warning' | 'danger' | 'muted' | 'info'

const toneMap: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-700 border-brand-100',
  success: 'bg-success-soft text-success-text border-success',
  warning: 'bg-warning-soft text-warning-text border-warning',
  danger: 'bg-danger-soft text-danger-text border-danger',
  muted: 'bg-surface-muted text-text-muted border-border',
  info: 'bg-blue-50 text-link border-blue-100',
}

export interface BadgeTagProps {
  tone?: BadgeTone
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

export function BadgeTag({ tone = 'brand', size = 'md', children, className }: BadgeTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border font-semibold leading-4',
        toneMap[tone],
        size === 'sm' ? 'text-[11px] px-2 py-0.5 rounded-lg' : 'text-xs px-2.5 py-1 rounded-xl',
        className,
      )}
    >
      {children}
    </span>
  )
}
