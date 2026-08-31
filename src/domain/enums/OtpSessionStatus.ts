export const OtpSessionStatus = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  EXPIRED: 'EXPIRED',
  LOCKED: 'LOCKED',
} as const

export type OtpSessionStatus =
  (typeof OtpSessionStatus)[keyof typeof OtpSessionStatus]
