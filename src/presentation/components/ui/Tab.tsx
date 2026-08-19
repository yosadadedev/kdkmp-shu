import { cn } from '@presentation/utils/cn'

export interface TabItem<T extends string | number> {
  id: T
  label: string
  iconLeft?: React.ReactNode
}

export interface TabSwitcherProps<T extends string | number> {
  items: Array<TabItem<T>>
  activeId: T
  onChange: (id: T) => void
  className?: string
  variant?: 'segmented' | 'underline'
  size?: 'md' | 'lg'
}

export function TabSwitcher<T extends string | number>({
  items,
  activeId,
  onChange,
  className,
  variant = 'segmented',
  size = 'md',
}: TabSwitcherProps<T>) {
  if (variant === 'underline') {
    return (
      <div role="tablist" className={cn('flex w-full items-end border-b border-border-light', className)}>
        {items.map((item) => {
          const isActive = item.id === activeId
          return (
            <button
              key={String(item.id)}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 h-12 text-sm font-semibold tap-highlight-transparent',
                isActive ? 'text-brand-600 border-b-2 border-brand-500' : 'text-text-muted border-b-2 border-transparent',
              )}
            >
              {item.iconLeft ? <span>{item.iconLeft}</span> : null}
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      role="tablist"
      className={cn(
        'grid grid-cols-2 items-stretch gap-1 bg-surface-muted rounded-xl p-1',
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId
        return (
          <button
            key={String(item.id)}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              'relative inline-flex items-center justify-center gap-2 tap-highlight-transparent transition-all duration-150 font-semibold rounded-lg',
              size === 'lg' ? 'h-11 text-sm' : 'h-10 text-sm',
              isActive
                ? 'bg-surface-raised shadow-card text-brand-700'
                : 'text-text-muted hover:text-text-body',
            )}
          >
            {item.iconLeft ? <span>{item.iconLeft}</span> : null}
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
