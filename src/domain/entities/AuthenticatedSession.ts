export interface AuthenticatedSession {
  authToken: string
  memberId: string
  refreshToken: string
  issuedAtEpochMs: number
  expireAtEpochMs: number
  userNik: string
  companyNik: string
}
