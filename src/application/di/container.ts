import type { AuthRepository } from '@domain/repositories/AuthRepository'
import type { MemberRepository } from '@domain/repositories/MemberRepository'
import type { ProfitSharingRepository } from '@domain/repositories/ProfitSharingRepository'
import type { VoteRepository } from '@domain/repositories/VoteRepository'
import type { FinancialStatementRepository } from '@domain/repositories/FinancialStatementRepository'

import { MockAuthRepository } from '@infra/repositories/mock/MockAuthRepository'
import { MockMemberRepository } from '@infra/repositories/mock/MockMemberRepository'
import { MockProfitSharingRepository } from '@infra/repositories/mock/MockProfitSharingRepository'
import { MockVoteRepository } from '@infra/repositories/mock/MockVoteRepository'
import { MockFinancialStatementRepository } from '@infra/repositories/mock/MockFinancialStatementRepository'
import { HttpClient } from '@infra/http/HttpClient'

import { SendOtpUseCase } from '../use-cases/auth/SendOtpUseCase'
import { VerifyOtpUseCase } from '../use-cases/auth/VerifyOtpUseCase'
import { ResendOtpUseCase } from '../use-cases/auth/ResendOtpUseCase'
import { LogoutUseCase } from '../use-cases/auth/LogoutUseCase'
import { RestoreAuthenticatedSessionUseCase } from '../use-cases/auth/RestoreAuthenticatedSessionUseCase'
import { GetMyProfileUseCase } from '../use-cases/member/GetMyProfileUseCase'
import { GetCurrentProfitSharingUseCase } from '../use-cases/profit-sharing/GetCurrentProfitSharingUseCase'
import { GetMemberVoteStatusUseCase } from '../use-cases/vote/GetMemberVoteStatusUseCase'
import { SubmitVoteChoiceUseCase } from '../use-cases/vote/SubmitVoteChoiceUseCase'
import { ListMonthlyFinancialStatementsUseCase } from '../use-cases/financial-statement/ListMonthlyFinancialStatementsUseCase'
import { useAuthStore } from '../stores/AuthStore'

export interface AppRepositories {
  authRepository: AuthRepository
  memberRepository: MemberRepository
  profitSharingRepository: ProfitSharingRepository
  voteRepository: VoteRepository
  financialStatementRepository: FinancialStatementRepository
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
  listMonthlyFinancialStatements: ListMonthlyFinancialStatementsUseCase
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
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  authTokenProvider: () => {
    try {
      return useAuthStore.getState().session?.authToken ?? null
    } catch {
      return null
    }
  },
})

const singletonAuthRepository: AuthRepository = new MockAuthRepository()
const singletonMemberRepository: MemberRepository = new MockMemberRepository()
const singletonProfitSharingRepository: ProfitSharingRepository = new MockProfitSharingRepository()
const singletonVoteRepository: VoteRepository = new MockVoteRepository()
const singletonFinancialStatementRepository: FinancialStatementRepository =
  new MockFinancialStatementRepository()

export const appContainer: AppContainer = {
  infra: {
    httpClient: singletonHttpClient,
  },
  repositories: {
    authRepository: singletonAuthRepository,
    memberRepository: singletonMemberRepository,
    profitSharingRepository: singletonProfitSharingRepository,
    voteRepository: singletonVoteRepository,
    financialStatementRepository: singletonFinancialStatementRepository,
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
    listMonthlyFinancialStatements: new ListMonthlyFinancialStatementsUseCase(
      singletonFinancialStatementRepository,
    ),
  },
} as const

export const getRepositories = (): AppRepositories => appContainer.repositories
export const getUseCases = (): AppUseCases => appContainer.useCases
export const getInfra = (): AppInfrastructure => appContainer.infra
