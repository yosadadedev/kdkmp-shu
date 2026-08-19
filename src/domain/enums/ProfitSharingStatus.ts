export const ProfitSharingStatus = {
  DRAFT: 'DRAFT',
  VOTING_OPEN: 'VOTING_OPEN',
  APPROVED: 'APPROVED',
  DISTRIBUTED: 'DISTRIBUTED',
  REJECTED: 'REJECTED',
} as const

export type ProfitSharingStatus =
  (typeof ProfitSharingStatus)[keyof typeof ProfitSharingStatus]
