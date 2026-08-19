import type { MemberRepository } from '@domain/repositories/MemberRepository'
import type { Member } from '@domain/entities/Member'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'
import { ErrorCode } from '@infra/errors/ErrorCode'
import { wrapUnknownAsAppError } from '@infra/errors/errorFactory'
import { hashNationalIdDummy, isNationalIdWellFormed, normalizeNationalId } from '@domain/value-objects/NationalId'
import { MOCK_COOPERATIVE_UNITS, MOCK_MEMBERS } from './MockSeed'

const mockDelayMs = () => new Promise<void>((r) => setTimeout(r, 480 + Math.floor(Math.random() * 260)))

export class MockMemberRepository implements MemberRepository {
  async getMemberByNationalId(nationalIdNikPlain: string): Promise<Member | null> {
    await mockDelayMs()
    try {
      const normalized = normalizeNationalId(nationalIdNikPlain)
      if (!isNationalIdWellFormed(normalized)) return null
      const hash = hashNationalIdDummy(normalized)
      return MOCK_MEMBERS.find((m) => m.nationalIdNikHash === hash) ?? null
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }

  async getMemberById(memberId: string): Promise<Member | null> {
    await mockDelayMs()
    return MOCK_MEMBERS.find((m) => m.id === memberId) ?? null
  }

  async getMyProfile(_authToken: string): Promise<Member> {
    await mockDelayMs()
    const member = MOCK_MEMBERS[0]
    if (!member) {
      throw wrapUnknownAsAppError({ code: ErrorCode.MEMBER_PROFILE_NOT_FOUND })
    }
    return member
  }

  async getCooperativeUnitById(cooperativeUnitId: string): Promise<CooperativeUnit> {
    await mockDelayMs()
    const unit = MOCK_COOPERATIVE_UNITS.find((c) => c.id === cooperativeUnitId)
    if (!unit) {
      throw wrapUnknownAsAppError({ code: ErrorCode.MEMBER_PROFILE_NOT_FOUND })
    }
    return unit
  }
}
