import type { Member } from '@domain/entities/Member'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'

export interface MemberRepository {
  getMemberByNationalId(nationalIdNikPlain: string): Promise<Member | null>
  getMemberById(memberId: string): Promise<Member | null>
  getMyProfile(authToken: string): Promise<Member>
  getCooperativeUnitById(cooperativeUnitId: string): Promise<CooperativeUnit>
}
