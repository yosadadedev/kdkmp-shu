import type { MemberRepository } from '@domain/repositories/MemberRepository'
import type { Member } from '@domain/entities/Member'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'
import { MemberActiveStatus } from '@domain/enums/MemberActiveStatus'
import { maskNationalId } from '@domain/value-objects/NationalId'
import type { HttpClient } from '@infra/http/HttpClient'
import { getMyProfile } from '@infra/http/api/profileApi'
import type { ProfileCompanyDto, ProfileDto } from '@infra/http/dto/profile/ProfileDto'
import { createAppError, wrapUnknownAsAppError } from '@infra/errors/errorFactory'
import { ErrorCode } from '@infra/errors/ErrorCode'

const mapCooperativeUnit = (company: ProfileCompanyDto): CooperativeUnit => ({
  id: String(company.id),
  branchName: company.name,
  registrationNumber: company.nik,
  address: company.street,
  province: company.state,
  cityOrRegency: company.city,
  district: '',
  village: '',
  establishedAtIso: '',
  totalActiveMembers: 0,
})

const mapMember = (dto: ProfileDto): Member => ({
  id: String(dto.id),
  nationalIdNikHash: '',
  nationalIdNikMasked: maskNationalId(dto.nik),
  cooperativeUnitId: String(dto.company.id),
  fullName: dto.full_name,
  gender: 'FEMALE',
  placeOfBirth: '',
  dateOfBirthIso: '',
  phoneNumberMasked: '',
  address: dto.address,
  province: '',
  cityOrRegency: '',
  district: '',
  village: '',
  joinDateIso: '',
  memberRegistrationNumber: '',
  totalMandatorySavingsCents: 0,
  totalPrincipalSavingsCents: 0,
  totalVoluntarySavingsCents: 0,
  activeStatus: MemberActiveStatus.ACTIVE,
})

/**
 * The real backend only exposes the combined "my profile" endpoint, which
 * returns the member alongside its cooperative unit (`company`) in one call.
 * `getMyProfile` caches that response so `getCooperativeUnitById` — called
 * right after it by GetMyProfileUseCase — can serve off the cache instead of
 * hitting a separate endpoint, since none exists. `getMemberByNationalId`
 * and `getMemberById` have no backend counterpart yet and aren't called
 * anywhere in the app today.
 */
export class HttpMemberRepository implements MemberRepository {
  private lastProfile: { member: Member; cooperativeUnit: CooperativeUnit } | null = null

  constructor(private readonly httpClient: HttpClient) {}

  async getMemberByNationalId(_nationalIdNikPlain: string): Promise<Member | null> {
    throw createAppError(ErrorCode.MEMBER_PROFILE_NOT_FOUND)
  }

  async getMemberById(_memberId: string): Promise<Member | null> {
    throw createAppError(ErrorCode.MEMBER_PROFILE_NOT_FOUND)
  }

  async getMyProfile(_authToken: string): Promise<Member> {
    try {
      const envelope = await getMyProfile(this.httpClient)
      if (!envelope.success) {
        throw createAppError(ErrorCode.MEMBER_PROFILE_NOT_FOUND, { meta: { message: envelope.message } })
      }
      const member = mapMember(envelope.data)
      const cooperativeUnit = mapCooperativeUnit(envelope.data.company)
      this.lastProfile = { member, cooperativeUnit }
      return member
    } catch (err) {
      throw wrapUnknownAsAppError(err)
    }
  }

  async getCooperativeUnitById(cooperativeUnitId: string): Promise<CooperativeUnit> {
    if (this.lastProfile?.cooperativeUnit.id === cooperativeUnitId) {
      return this.lastProfile.cooperativeUnit
    }
    throw createAppError(ErrorCode.MEMBER_PROFILE_NOT_FOUND)
  }
}
