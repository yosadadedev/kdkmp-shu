import type { MemberActiveStatus } from '@domain/enums/MemberActiveStatus'

export interface Member {
  id: string
  nationalIdNikHash: string
  nationalIdNikMasked: string
  cooperativeUnitId: string
  fullName: string
  gender: 'MALE' | 'FEMALE'
  placeOfBirth: string
  dateOfBirthIso: string
  phoneNumberMasked: string
  address: string
  province: string
  cityOrRegency: string
  district: string
  village: string
  joinDateIso: string
  memberRegistrationNumber: string
  totalMandatorySavingsCents: number
  totalPrincipalSavingsCents: number
  totalVoluntarySavingsCents: number
  activeStatus: MemberActiveStatus
}
