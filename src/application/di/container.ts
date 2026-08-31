import type { AuthRepository } from '@domain/repositories/AuthRepository'
import type { MemberRepository } from '@domain/repositories/MemberRepository'
import type { ProfitSharingRepository } from '@domain/repositories/ProfitSharingRepository'
import type { VoteRepository } from '@domain/repositories/VoteRepository'
import type { SupportRepository } from '@domain/repositories/SupportRepository'
import type { ReportRepository } from '@domain/repositories/ReportRepository'
import type { GateRepository } from '@domain/repositories/GateRepository'

import { MockAuthRepository } from '@infra/repositories/mock/MockAuthRepository'
import { HttpAuthRepository } from '@infra/repositories/http/HttpAuthRepository'
import { HttpMemberRepository } from '@infra/repositories/http/HttpMemberRepository'
import { MockProfitSharingRepository } from '@infra/repositories/mock/MockProfitSharingRepository'
import { HttpVoteRepository } from '@infra/repositories/http/HttpVoteRepository'
import { HttpSupportRepository } from '@infra/repositories/http/HttpSupportRepository'
import { HttpReportRepository } from '@infra/repositories/http/HttpReportRepository'
import { HttpGateRepository } from '@infra/repositories/http/HttpGateRepository'
import { HttpClient } from '@infra/http/HttpClient'
import { env } from '@infra/config/env'

import { SendOtpUseCase } from '../use-cases/auth/SendOtpUseCase'
import { VerifyOtpUseCase } from '../use-cases/auth/VerifyOtpUseCase'
import { ResendOtpUseCase } from '../use-cases/auth/ResendOtpUseCase'
import { LogoutUseCase } from '../use-cases/auth/LogoutUseCase'
import { RestoreAuthenticatedSessionUseCase } from '../use-cases/auth/RestoreAuthenticatedSessionUseCase'
import { GetMyProfileUseCase } from '../use-cases/member/GetMyProfileUseCase'
import { GetCurrentProfitSharingUseCase } from '../use-cases/profit-sharing/GetCurrentProfitSharingUseCase'
import { GetMemberVoteStatusUseCase } from '../use-cases/vote/GetMemberVoteStatusUseCase'
import { SubmitVoteChoiceUseCase } from '../use-cases/vote/SubmitVoteChoiceUseCase'
import { GetFaqAndContactUseCase } from '../use-cases/support/GetFaqAndContactUseCase'
import { GetShuReportCardUseCase } from '../use-cases/report/GetShuReportCardUseCase'
import { GetPnlSummaryUseCase } from '../use-cases/report/GetPnlSummaryUseCase'
import { GetPnlDetailUseCase } from '../use-cases/report/GetPnlDetailUseCase'
import { GetShuAllocationUseCase } from '../use-cases/report/GetShuAllocationUseCase'
import { VerifyGateAccessCodeUseCase } from '../use-cases/gate/VerifyGateAccessCodeUseCase'
import { useAuthStore } from '../stores/AuthStore'

export interface AppRepositories {
  authRepository: AuthRepository
  memberRepository: MemberRepository
  profitSharingRepository: ProfitSharingRepository
  voteRepository: VoteRepository
  supportRepository: SupportRepository
  reportRepository: ReportRepository
  gateRepository: GateRepository
}

export interface AppUseCases {
  sendOtp: SendOtpUseCase
  verifyOtp: VerifyOtpUseCase
  resendOtp: ResendOtpUseCase
  logout: LogoutUseCase
  restoreSession: RestoreAuthenticatedSessionUseCase
  getMyProfile: GetMyProfileUseCase
  getCurrentProfitSharing: GetCurrentProfitSharingUseCase
  getMemberVoteStatus: GetMemberVoteStatusUseCase
  submitVoteChoice: SubmitVoteChoiceUseCase
  getFaqAndContact: GetFaqAndContactUseCase
  getShuReportCard: GetShuReportCardUseCase
  getPnlSummary: GetPnlSummaryUseCase
  getPnlDetail: GetPnlDetailUseCase
  getShuAllocation: GetShuAllocationUseCase
  verifyGateAccessCode: VerifyGateAccessCodeUseCase
}

export interface AppInfrastructure {
  httpClient: HttpClient
}

export interface AppContainer {
  infra: AppInfrastructure
  repositories: AppRepositories
  useCases: AppUseCases
}

const singletonHttpClient = new HttpClient({
  baseUrl: env.apiBaseUrl,
  defaultTimeoutMs: env.apiTimeoutMs,
  authTokenProvider: () => {
    try {
      return useAuthStore.getState().session?.authToken ?? null
    } catch {
      return null
    }
  },
})

const singletonAuthRepository: AuthRepository = new HttpAuthRepository(
  singletonHttpClient,
  new MockAuthRepository(),
)
const singletonMemberRepository: MemberRepository = new HttpMemberRepository(singletonHttpClient)
const singletonProfitSharingRepository: ProfitSharingRepository = new MockProfitSharingRepository()
const singletonVoteRepository: VoteRepository = new HttpVoteRepository(singletonHttpClient, () => {
  const session = useAuthStore.getState().session
  return session ? { userNik: session.userNik, companyNik: session.companyNik } : null
})
const singletonSupportRepository: SupportRepository = new HttpSupportRepository(singletonHttpClient)
const singletonReportRepository: ReportRepository = new HttpReportRepository(singletonHttpClient)
const singletonGateRepository: GateRepository = new HttpGateRepository(singletonHttpClient)

export const appContainer: AppContainer = {
  infra: {
    httpClient: singletonHttpClient,
  },
  repositories: {
    authRepository: singletonAuthRepository,
    memberRepository: singletonMemberRepository,
    profitSharingRepository: singletonProfitSharingRepository,
    voteRepository: singletonVoteRepository,
    supportRepository: singletonSupportRepository,
    reportRepository: singletonReportRepository,
    gateRepository: singletonGateRepository,
  },
  useCases: {
    sendOtp: new SendOtpUseCase(singletonAuthRepository),
    verifyOtp: new VerifyOtpUseCase(singletonAuthRepository),
    resendOtp: new ResendOtpUseCase(singletonAuthRepository),
    logout: new LogoutUseCase(singletonAuthRepository),
    restoreSession: new RestoreAuthenticatedSessionUseCase(singletonAuthRepository),
    getMyProfile: new GetMyProfileUseCase(singletonMemberRepository),
    getCurrentProfitSharing: new GetCurrentProfitSharingUseCase(singletonProfitSharingRepository),
    getMemberVoteStatus: new GetMemberVoteStatusUseCase(singletonVoteRepository),
    submitVoteChoice: new SubmitVoteChoiceUseCase(singletonVoteRepository),
    getFaqAndContact: new GetFaqAndContactUseCase(singletonSupportRepository),
    getShuReportCard: new GetShuReportCardUseCase(singletonReportRepository),
    getPnlSummary: new GetPnlSummaryUseCase(singletonReportRepository),
    getPnlDetail: new GetPnlDetailUseCase(singletonReportRepository),
    getShuAllocation: new GetShuAllocationUseCase(singletonReportRepository),
    verifyGateAccessCode: new VerifyGateAccessCodeUseCase(singletonGateRepository),
  },
} as const

export const getRepositories = (): AppRepositories => appContainer.repositories
export const getUseCases = (): AppUseCases => appContainer.useCases
export const getInfra = (): AppInfrastructure => appContainer.infra
