import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@presentation/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'brand' | 'success' | 'warning'
  padding?: 'lg' | 'md' | 'sm' | 'none'
  clickable?: boolean
}

const variantClass = {
  default: 'bg-surface-raised border-border-light shadow-card',
  muted: 'bg-surface-muted border-border-light',
  brand: 'bg-brand-500 text-text-inverted shadow-[0_10px_30px_rgba(200,16,46,0.28)] border-brand-600',
  success: 'bg-success-soft border-success shadow-card',
  warning: 'bg-warning-soft border-warning shadow-card',
}

const paddingClass = {
  lg: 'p-5',
  md: 'p-4',
  sm: 'p-3',
  none: 'p-0',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', padding = 'md', clickable = false, className, children, ...rest },
    ref,
  ) => (
    <div
      ref={ref}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={cn(
        'rounded-2xl border transition-all duration-150',
        variantClass[variant],
        paddingClass[padding],
        clickable
          ? 'tap-highlight-transparent cursor-pointer active:scale-[0.992] hover:shadow-pop focus-visible:ring-[3px] focus-visible:ring-brand-500/20'
          : '',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  ),
)

Card.displayName = 'Card'

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...rest}>
      {children}
    </div>
  ),
)
CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...rest }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-bold leading-6', className)} {...rest}>
      {children}
    </h3>
  ),
)
CardTitle.displayName = 'CardTitle'

export interface CardSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {}
export const CardSubtitle = forwardRef<HTMLParagraphElement, CardSubtitleProps>(
  ({ className, children, ...rest }, ref) => (
    <p ref={ref} className={cn('text-sm leading-5 text-text-muted', className)} {...rest}>
      {children}
    </p>
  ),
)
CardSubtitle.displayName = 'CardSubtitle'
