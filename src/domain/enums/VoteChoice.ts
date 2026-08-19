export const VoteChoice = {
  AGREE: 'AGREE',
  DISAGREE: 'DISAGREE',
} as const

export type VoteChoice = (typeof VoteChoice)[keyof typeof VoteChoice]
