import { cn } from '@presentation/utils/cn'

export interface InfoRowProps {
  label: string
  value: React.ReactNode
  valueMuted?: boolean
  stackOnNarrow?: boolean
  alignTop?: boolean
  className?: string
  labelClassName?: string
  valueClassName?: string
  divider?: boolean
  as?: 'div' | 'dl'
}

export function InfoRow({
  label,
  value,
  valueMuted = false,
  stackOnNarrow = false,
  alignTop = false,
  className,
  labelClassName,
  valueClassName,
  divider = true,
  as = 'div',
}: InfoRowProps) {
  const Component = as === 'dl' ? 'dl' : 'div'
  return (
    <Component
      className={cn(
        'gap-2 w-full',
        stackOnNarrow ? 'flex flex-col sm:flex-row sm:items-center' : 'flex items-center',
        alignTop ? 'items-start' : stackOnNarrow ? 'sm:items-center' : '',
        divider ? 'py-3 border-b border-border-light last:border-0' : 'py-1.5',
        className,
      )}
    >
      <dt
        className={cn(
          'text-sm text-text-muted w-[44%] min-w-[44%] sm:w-[42%] sm:min-w-[42%] leading-5',
          labelClassName,
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          'text-sm font-semibold leading-5 flex-1 min-w-0 text-right break-words',
          stackOnNarrow ? 'text-left sm:text-right' : '',
          alignTop ? 'pt-0' : '',
          valueMuted ? 'text-text-muted' : 'text-text',
          valueClassName,
        )}
      >
        {value ?? '—'}
      </dd>
    </Component>
  )
}
