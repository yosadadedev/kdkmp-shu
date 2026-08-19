import type { MemberRepository } from '@domain/repositories/MemberRepository'
import type { Member } from '@domain/entities/Member'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'
import { createAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'

export interface MyProfileWithUnit {
  member: Member
  cooperativeUnit: CooperativeUnit
}

export class GetMyProfileUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(authToken: string): Promise<MyProfileWithUnit> {
    if (!authToken) {
      throw createAppError(ErrorCode.AUTH_SESSION_NOT_FOUND)
    }
    const member = await this.memberRepository.getMyProfile(authToken)
    const cooperativeUnit = await this.memberRepository.getCooperativeUnitById(member.cooperativeUnitId)
    return { member, cooperativeUnit }
  }
}
