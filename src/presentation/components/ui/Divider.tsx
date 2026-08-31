import { cn } from '@presentation/utils/cn'

export interface DividerProps {
  label?: string
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Divider({ label, spacing = 'md', className }: DividerProps) {
  const spacingMap = {
    sm: 'my-3',
    md: 'my-5',
    lg: 'my-7',
  }
  if (!label) {
    return <div aria-hidden className={cn('h-px w-full bg-border-light', spacingMap[spacing], className)} />
  }
  return (
    <div className={cn('flex w-full items-center gap-3', spacingMap[spacing], className)}>
      <span className="h-px flex-1 bg-border-light" aria-hidden />
      <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</span>
      <span className="h-px flex-1 bg-border-light" aria-hidden />
    </div>
  )
}
