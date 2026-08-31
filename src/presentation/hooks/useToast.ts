import { useCallback, useMemo } from 'react'
import { useUiStore, type ToastVariant } from '@application/stores/UiStore'
import { isApplicationError } from '@infra/errors/ApplicationError'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'
import type { ErrorCode } from '@infra/errors/ErrorCode'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'

export interface PushToastOptions {
  variant: ToastVariant
  titleId?: string
  messageId?: string
  durationMs?: number
  errorCode?: ErrorCode
}

export const useToast = () => {
  const push = useUiStore((state) => state.pushToast)
  const dismiss = useUiStore((state) => state.dismissToast)
  const clearAll = useUiStore((state) => state.clearToasts)

  const pushToast = useCallback(
    (opts: PushToastOptions) => {
      return push({
        variant: opts.variant,
        titleId: opts.titleId ?? '',
        messageId: opts.messageId,
        durationMs: opts.durationMs ?? 3200,
        errorCode: opts.errorCode,
      })
    },
    [push],
  )

  const success = useCallback(
    (titleId: string, messageId?: string) => {
      return pushToast({ variant: 'success', titleId, messageId, durationMs: 2600 })
    },
    [pushToast],
  )

  const info = useCallback(
    (titleId: string, messageId?: string) => {
      return pushToast({ variant: 'info', titleId, messageId, durationMs: 2600 })
    },
    [pushToast],
  )

  const warning = useCallback(
    (titleId: string, messageId?: string) => {
      return pushToast({ variant: 'warning', titleId, messageId, durationMs: 3200 })
    },
    [pushToast],
  )

  const showError = useCallback(
    (errOrCode: unknown, fallbackMessageId?: string) => {
      if (isApplicationError(errOrCode)) {
        return pushToast({
          variant: 'error',
          errorCode: errOrCode.code,
          messageId: fallbackMessageId,
          durationMs: 4400,
        })
      }
      const appErr = wrapUnknownAsAppError(errOrCode)
      return pushToast({
        variant: 'error',
        errorCode: appErr.code,
        titleId: fallbackMessageId ?? USER_STRINGS.common.somethingWrongTitle,
        durationMs: 4400,
      })
    },
    [pushToast],
  )

  return useMemo(
    () => ({
      pushToast,
      success,
      info,
      warning,
      showError,
      dismissToast: dismiss,
      clearAllToasts: clearAll,
    }),
    [pushToast, success, info, warning, showError, dismiss, clearAll],
  )
}
