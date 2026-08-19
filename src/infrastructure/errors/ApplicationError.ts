import type { ErrorCode } from './ErrorCode'

export class ApplicationError extends Error {
  public readonly code: ErrorCode
  public readonly meta?: Record<string, unknown>

  constructor(
    code: ErrorCode,
    message: string,
    options?: { cause?: unknown; meta?: Record<string, unknown> },
  ) {
    super(message, { cause: options?.cause })
    this.name = 'ApplicationError'
    this.code = code
    this.meta = options?.meta
    Object.setPrototypeOf(this, ApplicationError.prototype)
  }

  toPlainObject(): { code: ErrorCode; message: string; meta?: Record<string, unknown> } {
    return {
      code: this.code,
      message: this.message,
      meta: this.meta,
    }
  }
}

export const isApplicationError = (err: unknown): err is ApplicationError => {
  return err instanceof ApplicationError
}
