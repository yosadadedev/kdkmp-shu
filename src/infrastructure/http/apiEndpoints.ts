export const ApiEndpoints = {
  auth: {
    validateNik: '/api/v1/auth/validate-nik',
    validateOtp: '/api/v1/auth/validate-otp',
    refresh: '/api/v1/auth/refresh',
  },
  kdkmp: {
    getById: (id: number | string): string => `/api/kdkmp/${id}`,
  },
  gate: {
    verifyAccessCode: (code: string): string => `/api/v1/gate/${code}`,
  },
  profile: {
    getMyProfile: '/api/v1/profile/self',
    getFaqAndContact: '/api/v1/profile/faq-and-contact',
  },
  voting: {
    vote: '/api/v1/voting/vote',
  },
  report: {
    getCard: '/api/v1/report/card',
    getPnlSummary: '/api/v1/report/pnl',
    getPnlDetail: '/api/v1/report/pnl-detail',
    getShuAllocation: '/api/v1/report/shu-allocation',
  },
} as const
