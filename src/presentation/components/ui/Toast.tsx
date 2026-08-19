import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react'
import { cn } from '@presentation/utils/cn'
import { useUiStore, type AppToastItem } from '@application/stores/UiStore'
import { USER_ERROR_MESSAGES } from '@presentation/constants/userErrorMessages'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'

const variantConfig = {
  success: {
    wrapper: 'border-success bg-success-soft text-success-text',
    icon: <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />,
  },
  error: {
    wrapper: 'border-danger bg-danger-soft text-danger-text',
    icon: <XCircle className="h-5 w-5 shrink-0" aria-hidden />,
  },
  warning: {
    wrapper: 'border-warning bg-warning-soft text-warning-text',
    icon: <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />,
  },
  info: {
    wrapper: 'border-link bg-blue-50 text-link',
    icon: <Info className="h-5 w-5 shrink-0" aria-hidden />,
  },
} as const

function resolveToastTitle(toast: AppToastItem): string {
  if (toast.variant === 'error' && toast.errorCode) {
    const resolved = USER_ERROR_MESSAGES[toast.errorCode]
    if (resolved) return resolved.title
  }
  if (toast.titleId.length > 0) return toast.titleId
  return USER_STRINGS.common.somethingWrongTitle
}

function resolveToastDescription(toast: AppToastItem): string | undefined {
  if (toast.messageId) return toast.messageId
  if (toast.variant === 'error' && toast.errorCode) {
    return USER_ERROR_MESSAGES[toast.errorCode]?.description
  }
  return undefined
}

export function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts)
  const dismiss = useUiStore((state) => state.dismissToast)
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex w-full max-w-[390px] mx-auto px-4 flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const cfg = variantConfig[toast.variant]
        const title = resolveToastTitle(toast)
        const desc = resolveToastDescription(toast)
        return (
          <div
            key={toast.id}
            role={toast.variant === 'error' ? 'alert' : 'status'}
            className={cn(
              'pointer-events-auto animate-slide-up shadow-pop rounded-xl border backdrop-blur-sm p-3.5 pr-9 flex items-start gap-3',
              cfg.wrapper,
            )}
          >
            <span className="pt-0.5">{cfg.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-5 break-words">{title}</p>
              {desc ? (
                <p className="mt-1 text-xs leading-4 opacity-90 break-words">{desc}</p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label={USER_STRINGS.common.close}
              onClick={() => dismiss(toast.id)}
              className="absolute top-2 right-2 h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-black/5 transition tap-highlight-transparent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
