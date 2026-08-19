export const RoutePaths = {
  HOME: '/',
  ONBOARDING: '/onboarding',
  NATIONAL_ID_LOGIN: '/login/national-id',
  OTP_VERIFICATION: '/login/otp',
  DASHBOARD_HOME: '/dashboard',
  VOTE_SUCCESS: '/dashboard/vote/success',
  NOT_FOUND: '/404',
} as const

export type RoutePath = (typeof RoutePaths)[keyof typeof RoutePaths]

export const buildOtpPath = () => RoutePaths.OTP_VERIFICATION
export const buildLoginPath = () => RoutePaths.NATIONAL_ID_LOGIN
