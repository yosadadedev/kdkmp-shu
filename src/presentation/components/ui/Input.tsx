import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@presentation/utils/cn'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  errorMessage?: string
  isError?: boolean
  leftAddon?: ReactNode
  rightAddon?: ReactNode
  inputSize?: 'lg' | 'md'
  hideLabel?: boolean
  prefixLabel?: string
}

const sizeClass = {
  lg: 'h-14 text-base',
  md: 'h-12 text-base',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      isError = false,
      leftAddon,
      rightAddon,
      inputSize = 'lg',
      hideLabel = false,
      prefixLabel,
      className,
      id,
      disabled,
      'aria-invalid': ariaInvalidProp,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId()
    const inputId = id ?? autoId
    const helperId = `${inputId}-helper`
    const errorId = `${inputId}-error`
    const hasError = isError || Boolean(errorMessage)
    const describedBy =
      hasError && errorMessage ? errorId : helperText ? helperId : undefined
    return (
      <div className={cn('w-full flex flex-col gap-1.5', className)}>
        {label ? (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-semibold text-text',
              hideLabel && 'sr-only',
            )}
          >
            {label}
          </label>
        ) : null}
        <div
          className={cn(
            'relative flex items-center w-full rounded-xl border bg-surface-raised transition-all focus-within:shadow-brandFocus',
            hasError
              ? 'border-danger focus-within:border-danger focus-within:ring-0'
              : 'border-border focus-within:border-link',
            disabled ? 'bg-surface-muted text-text-muted cursor-not-allowed' : '',
          )}
        >
          {prefixLabel ? (
            <span className="pl-4 pr-2 text-base font-semibold text-text-muted select-none">
              {prefixLabel}
            </span>
          ) : null}
          {leftAddon ? (
            <span className="pl-4 pr-2 text-text-muted shrink-0">{leftAddon}</span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            aria-describedby={describedBy}
            aria-invalid={ariaInvalidProp ?? hasError}
            disabled={disabled}
            className={cn(
              'min-w-0 flex-1 bg-transparent py-2 pr-4 outline-none placeholder:text-text-muted text-text disabled:cursor-not-allowed',
              sizeClass[inputSize],
              !prefixLabel && !leftAddon ? 'pl-4' : '',
            )}
            {...rest}
          />
          {rightAddon ? (
            <span className="pr-4 pl-2 text-text-muted shrink-0">{rightAddon}</span>
          ) : null}
        </div>
        {hasError && errorMessage ? (
          <p id={errorId} className="text-xs font-medium text-danger-text leading-4">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs leading-4 text-text-muted">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
