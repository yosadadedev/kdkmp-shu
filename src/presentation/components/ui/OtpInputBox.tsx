import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { cn } from '@presentation/utils/cn'

export type OtpInputBoxVariant = 'split-boxes' | 'single-box'

export interface OtpInputBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  isError?: boolean
  isDisabled?: boolean
  autoFocus?: boolean
  inputMode?: 'numeric' | 'text'
  containerClassName?: string
  digitClassName?: string
  variant?: OtpInputBoxVariant
}

export interface OtpInputHandle {
  clear: () => void
  focus: (index?: number) => void
}

const DIGIT_LENGTH_DEFAULT = 6

export const OtpInputBox = forwardRef<OtpInputHandle, OtpInputBoxProps>(
  (
    {
      length = DIGIT_LENGTH_DEFAULT,
      value,
      onChange,
      onComplete,
      isError = false,
      isDisabled = false,
      autoFocus = true,
      inputMode = 'numeric',
      containerClassName,
      digitClassName,
      variant = 'split-boxes',
      disabled,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const effectiveDisabled = isDisabled || disabled
    const inputsRef = useRef<Array<HTMLInputElement | null>>([])
    const [activeIndex, setActiveIndex] = useState<number>(0)

    const digits = useMemo(() => {
      const normalized = (value ?? '').slice(0, length)
      return Array.from({ length }, (_, i) => normalized[i] ?? '')
    }, [value, length])

    const setDigits = useCallback(
      (nextFull: string) => {
        const sliced = nextFull.slice(0, length)
        onChange(sliced)
        if (sliced.length === length) {
          onComplete?.(sliced)
        }
      },
      [length, onChange, onComplete],
    )

    const focusIndex = useCallback((index: number) => {
      const clamped = Math.max(0, Math.min(length - 1, index))
      const el = inputsRef.current[clamped]
      if (el) {
        el.focus()
        setActiveIndex(clamped)
      }
    }, [length])

    useImperativeHandle(
      ref,
      () => ({
        clear: () => setDigits(''),
        focus: (index) => focusIndex(index ?? 0),
      }),
      [focusIndex, setDigits],
    )

    useEffect(() => {
      if (autoFocus) {
        const timer = window.setTimeout(() => focusIndex(Math.min(value.length, length - 1)), 150)
        return () => window.clearTimeout(timer)
      }
      return undefined
    }, [autoFocus, focusIndex, value.length, length])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
      if (effectiveDisabled) return
      if (e.key === 'Backspace') {
        if (digits[idx] === '' && idx > 0) {
          e.preventDefault()
          const next = value.slice(0, idx - 1) + value.slice(idx)
          setDigits(next)
          focusIndex(idx - 1)
          return
        }
      }
      if (e.key === 'ArrowLeft' && idx > 0) {
        e.preventDefault()
        focusIndex(idx - 1)
      } else if (e.key === 'ArrowRight' && idx < length - 1) {
        e.preventDefault()
        focusIndex(idx + 1)
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      if (effectiveDisabled) return
      const raw = e.target.value ?? ''
      const accepted = inputMode === 'numeric' ? raw.replace(/\D+/g, '') : raw
      const charCount = accepted.length
      if (charCount === 0) {
        const next = value.slice(0, idx) + value.slice(idx + 1)
        setDigits(next)
        return
      }
      if (charCount === 1) {
        const next = (value.slice(0, idx) + accepted + value.slice(idx)).slice(0, length)
        setDigits(next)
        if (idx < length - 1) {
          focusIndex(idx + 1)
        }
        return
      }
      const combined = (value.slice(0, idx) + accepted + value.slice(idx)).slice(0, length)
      setDigits(combined)
      focusIndex(Math.min(combined.length, length - 1))
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      if (effectiveDisabled) return
      const pasted = e.clipboardData?.getData('text') ?? ''
      const sanitized = inputMode === 'numeric' ? pasted.replace(/\D+/g, '') : pasted
      if (!sanitized) return
      e.preventDefault()
      const next = sanitized.slice(0, length)
      setDigits(next)
      focusIndex(Math.min(next.length, length - 1))
    }

    const combinedId = id ?? 'kdkmp-otp'
    const isSingle = variant === 'single-box'

    if (isSingle) {
      return (
        <div
          role="group"
          aria-label="Kode OTP 6 digit"
          className={cn('relative w-full', containerClassName)}
        >
          <div
            className={cn(
              'relative w-full h-14 rounded-xl border bg-surface-raised transition-all duration-150',
              'flex items-center justify-between px-2.5',
              isError
                ? 'border-danger focus-within:border-danger focus-within:shadow-[0_0_0_3px_rgba(211,47,47,0.18)]'
                : activeIndex >= 0
                  ? 'border-link shadow-focus'
                  : 'border-border focus-within:border-link focus-within:shadow-focus',
              effectiveDisabled ? 'bg-surface-muted cursor-not-allowed' : '',
            )}
          >
            {digits.map((digit, idx) => {
              const filled = digit.length > 0
              const focusState = activeIndex === idx
              return (
                <div
                  key={`${combinedId}-cell-${idx}`}
                  className={cn(
                    'relative flex-1 h-10 mx-0.5 flex items-center justify-center rounded-md transition-all duration-100',
                    focusState ? 'bg-brand-50/60 ring-1 ring-brand-100' : '',
                    filled && !focusState ? 'text-brand-600' : '',
                  )}
                >
                  <span
                    aria-hidden={false}
                    className={cn(
                      'text-2xl font-extrabold tabular-nums select-none pointer-events-none transition-colors duration-100',
                      isError
                        ? 'text-danger-text'
                        : filled
                          ? 'text-text'
                          : focusState
                            ? 'text-text-muted/30'
                            : 'text-text-muted/20',
                      effectiveDisabled ? 'text-text-muted' : '',
                    )}
                  >
                    {filled ? digit : idx < value.length ? digits[idx] : ''}
                  </span>
                  {!filled ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-0 flex items-center justify-center text-2xl font-extrabold tabular-nums pointer-events-none',
                        focusState ? 'text-text-muted/25' : 'text-text-muted/15',
                      )}
                    >
                      •
                    </span>
                  ) : null}
                  <input
                    key={`${combinedId}-${idx}`}
                    ref={(el) => {
                      inputsRef.current[idx] = el
                    }}
                    id={`${combinedId}-${idx}`}
                    type={inputMode === 'numeric' ? 'tel' : 'text'}
                    inputMode={inputMode}
                    autoComplete="one-time-code"
                    disabled={effectiveDisabled}
                    aria-label={`Digit OTP ke-${idx + 1}`}
                    aria-invalid={isError}
                    onChange={(e) => handleInputChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={handlePaste}
                    onFocus={() => setActiveIndex(idx)}
                    onBlur={() =>
                      setActiveIndex((cur) => (cur === idx ? Math.max(0, value.length - 1) : cur))
                    }
                    value={digit}
                    maxLength={length}
                    className={cn(
                      'absolute inset-0 w-full h-full opacity-0 z-10 cursor-text outline-none bg-transparent',
                      digitClassName,
                    )}
                    {...rest}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <div
        role="group"
        aria-label="Kode OTP 6 digit"
        className={cn(
          'flex w-full items-center justify-between gap-2',
          containerClassName,
        )}
      >
        {digits.map((digit, idx) => {
          const filled = digit.length > 0
          const focusState = activeIndex === idx
          return (
            <input
              key={`${combinedId}-${idx}`}
              ref={(el) => {
                inputsRef.current[idx] = el
              }}
              id={`${combinedId}-${idx}`}
              type={inputMode === 'numeric' ? 'tel' : 'text'}
              inputMode={inputMode}
              autoComplete="one-time-code"
              disabled={effectiveDisabled}
              aria-label={`Digit OTP ke-${idx + 1}`}
              aria-invalid={isError}
              onChange={(e) => handleInputChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              onFocus={() => setActiveIndex(idx)}
              onBlur={() => setActiveIndex((cur) => (cur === idx ? Math.max(0, value.length - 1) : cur))}
              value={digit}
              maxLength={length}
              className={cn(
                'relative aspect-square w-full h-14 rounded-xl text-center text-2xl font-extrabold tabular-nums transition-all duration-150 tap-highlight-transparent outline-none',
                'bg-surface-raised border',
                isError
                  ? 'border-danger text-danger-text focus:border-danger focus:shadow-[0_0_0_3px_rgba(211,47,47,0.18)]'
                  : filled
                    ? 'border-brand-500 text-text focus:border-link focus:shadow-focus'
                    : focusState
                      ? 'border-link shadow-focus text-text'
                      : 'border-border text-text focus:border-link focus:shadow-focus',
                effectiveDisabled ? 'bg-surface-muted text-text-muted cursor-not-allowed' : '',
                digitClassName,
              )}
              {...rest}
            />
          )
        })}
      </div>
    )
  },
)

OtpInputBox.displayName = 'OtpInputBox'
