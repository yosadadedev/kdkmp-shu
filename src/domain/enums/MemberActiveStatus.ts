export const MemberActiveStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const

export type MemberActiveStatus =
  (typeof MemberActiveStatus)[keyof typeof MemberActiveStatus]
