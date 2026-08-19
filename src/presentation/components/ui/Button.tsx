import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@presentation/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'lg' | 'md' | 'sm' | 'icon'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  loadingText?: string
  isBlock?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 text-text-inverted shadow-[0_2px_10px_rgba(200,16,46,0.25)] hover:bg-brand-600 active:bg-brand-700 disabled:bg-brand-200 disabled:text-brand-100 disabled:shadow-none',
  secondary:
    'bg-brand-50 text-brand-700 border border-brand-100 hover:bg-brand-100 active:bg-brand-200 disabled:bg-surface-muted disabled:text-text-muted disabled:border-border-light',
  ghost:
    'bg-transparent text-text hover:bg-surface-muted active:bg-border-light disabled:text-text-muted disabled:bg-transparent',
  outline:
    'bg-transparent text-text border border-border hover:bg-surface-muted active:bg-surface-disabled disabled:text-text-muted disabled:bg-surface-muted',
  danger:
    'bg-danger text-text-inverted hover:bg-[#B71C1C] active:bg-[#8B0000] disabled:bg-danger-soft disabled:text-danger-text',
}

const sizeClass: Record<ButtonSize, string> = {
  lg: 'h-12 px-5 rounded-xl text-base font-semibold gap-2',
  md: 'h-[48px] px-4 rounded-xl text-sm font-semibold gap-2',
  sm: 'h-9 px-3 rounded-lg text-xs font-semibold gap-1.5',
  icon: 'h-11 w-11 rounded-xl items-center justify-center',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      isBlock = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const showLoading = isLoading === true
    const effectivelyDisabled = showLoading || disabled === true
    return (
      <button
        ref={ref}
        type={type}
        disabled={effectivelyDisabled}
        aria-busy={showLoading}
        className={cn(
          'inline-flex items-center justify-center no-select tap-highlight-transparent transition-all duration-150 active:scale-[0.985] focus-visible:ring-[3px] focus-visible:ring-brand-500/20',
          variantClass[variant],
          sizeClass[size],
          isBlock && size !== 'icon' ? 'w-full' : '',
          effectivelyDisabled && 'cursor-not-allowed',
          className,
        )}
        {...rest}
      >
        {showLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin shrink-0" aria-hidden />
            {loadingText ? <span>{loadingText}</span> : null}
          </>
        ) : (
          <>
            {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
            {children ? <span>{children}</span> : null}
            {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
