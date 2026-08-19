import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@presentation/utils/cn'
import { Button } from './Button'

export interface DialogAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  isLoading?: boolean
}

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  actions?: DialogAction[]
  dismissOnBackdrop?: boolean
  dismissOnEsc?: boolean
  closeLabel?: string
  children?: ReactNode
  className?: string
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  description,
  icon,
  actions = [],
  dismissOnBackdrop = true,
  dismissOnEsc = true,
  closeLabel,
  children,
  className,
}: DialogProps) {
  useEffect(() => {
    if (!isOpen || !dismissOnEsc) return undefined
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, dismissOnEsc, onClose])

  useEffect(() => {
    if (!isOpen) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-end md:items-center justify-center animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={dismissOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative w-full max-w-[390px] mx-auto bg-surface-raised rounded-t-3xl md:rounded-3xl shadow-pop animate-slide-up p-5 max-h-[82vh] overflow-y-auto',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {icon ? (
              <span className="h-11 w-11 rounded-xl bg-brand-50 text-brand-600 inline-flex items-center justify-center shrink-0">
                {icon}
              </span>
            ) : null}
            <div className="flex-1 min-w-0">
              {typeof title === 'string' ? (
                <h3 className="text-lg font-bold leading-6 text-text">{title}</h3>
              ) : (
                title
              )}
              {description ? (
                typeof description === 'string' ? (
                  <p className="mt-1 text-sm leading-5 text-text-body">{description}</p>
                ) : (
                  description
                )
              ) : null}
            </div>
          </div>
          <button
            type="button"
            aria-label={closeLabel ?? 'Tutup'}
            onClick={onClose}
            className="h-9 w-9 inline-flex items-center justify-center rounded-xl hover:bg-surface-muted transition tap-highlight-transparent shrink-0"
          >
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>
        {children ? <div className="mt-4">{children}</div> : null}
        {actions.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {actions.map((action, idx) => (
              <Button
                key={`action-${idx}`}
                variant={action.variant ?? (idx === actions.length - 1 ? 'primary' : 'ghost')}
                onClick={action.onClick}
                isBlock
                isLoading={action.isLoading}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
