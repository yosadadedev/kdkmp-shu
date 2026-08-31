import { MemberActiveStatus } from '@domain/enums/MemberActiveStatus'
import { ProfitSharingStatus } from '@domain/enums/ProfitSharingStatus'
import type { Member } from '@domain/entities/Member'
import type { ProfitSharingRecord, ProfitSharingTotalsBreakdown } from '@domain/entities/ProfitSharingRecord'
import { hashNationalIdDummy } from '@domain/value-objects/NationalId'

const COOP_UNIT_SUKAMAJU_ID = 'cu-0001'
const CURRENT_FISCAL_YEAR = 2025

const MEMBER_SEED: Array<Omit<Member, 'nationalIdNikHash' | 'nationalIdNikMasked'> & { nationalIdPlain: string }> = [
  {
    nationalIdPlain: '3578010000000009',
    id: 'mb-0001',
    cooperativeUnitId: COOP_UNIT_SUKAMAJU_ID,
    fullName: 'Ibu Wati Wijayanti',
    gender: 'FEMALE',
    placeOfBirth: 'Yogyakarta',
    dateOfBirthIso: '1989-03-12',
    phoneNumberMasked: '+62 813-****-5821',
    address: 'Jl. Melati No. 15 RT 03 / RW 08',
    province: 'Yogyakarta',
    cityOrRegency: 'Kabupaten Bantul',
    district: 'Banguntapan',
    village: 'Baturetno',
    joinDateIso: '2015-07-20',
    memberRegistrationNumber: 'KDKMP-SMJ-2015-0720-0081',
    totalMandatorySavingsCents: 1_850_000 * 100,
    totalPrincipalSavingsCents: 5_000_000 * 100,
    totalVoluntarySavingsCents: 2_125_000 * 100,
    activeStatus: MemberActiveStatus.ACTIVE,
  },
  {
    nationalIdPlain: '3578021111111112',
    id: 'mb-0002',
    cooperativeUnitId: COOP_UNIT_SUKAMAJU_ID,
    fullName: 'Bapak Sutrisno',
    gender: 'MALE',
    placeOfBirth: 'Yogyakarta',
    dateOfBirthIso: '1985-11-03',
    phoneNumberMasked: '+62 857-****-3312',
    address: 'Jl. Mawar No. 8 RT 01 / RW 02',
    province: 'Yogyakarta',
    cityOrRegency: 'Kabupaten Bantul',
    district: 'Banguntapan',
    village: 'Baturetno',
    joinDateIso: '2018-02-14',
    memberRegistrationNumber: 'KDKMP-SMJ-2018-0214-0022',
    totalMandatorySavingsCents: 950_000 * 100,
    totalPrincipalSavingsCents: 3_000_000 * 100,
    totalVoluntarySavingsCents: 820_000 * 100,
    activeStatus: MemberActiveStatus.ACTIVE,
  },
  {
    nationalIdPlain: '3578032222222223',
    id: 'mb-0003',
    cooperativeUnitId: COOP_UNIT_SUKAMAJU_ID,
    fullName: 'Ibu Siti Rahmawati',
    gender: 'FEMALE',
    placeOfBirth: 'Surabaya',
    dateOfBirthIso: '1992-09-27',
    phoneNumberMasked: '+62 821-****-0918',
    address: 'Jl. Kenanga No. 22 RT 05 / RW 06',
    province: 'Yogyakarta',
    cityOrRegency: 'Kabupaten Bantul',
    district: 'Banguntapan',
    village: 'Baturetno',
    joinDateIso: '2020-10-05',
    memberRegistrationNumber: 'KDKMP-SMJ-2020-1005-0123',
    totalMandatorySavingsCents: 575_000 * 100,
    totalPrincipalSavingsCents: 2_000_000 * 100,
    totalVoluntarySavingsCents: 315_000 * 100,
    activeStatus: MemberActiveStatus.ACTIVE,
  },
]

export const MOCK_MEMBERS: Member[] = MEMBER_SEED.map((m) => ({
  id: m.id,
  nationalIdNikHash: hashNationalIdDummy(m.nationalIdPlain),
  nationalIdNikMasked: '************' + m.nationalIdPlain.slice(-4),
  cooperativeUnitId: m.cooperativeUnitId,
  fullName: m.fullName,
  gender: m.gender,
  placeOfBirth: m.placeOfBirth,
  dateOfBirthIso: m.dateOfBirthIso,
  phoneNumberMasked: m.phoneNumberMasked,
  address: m.address,
  province: m.province,
  cityOrRegency: m.cityOrRegency,
  district: m.district,
  village: m.village,
  joinDateIso: m.joinDateIso,
  memberRegistrationNumber: m.memberRegistrationNumber,
  totalMandatorySavingsCents: m.totalMandatorySavingsCents,
  totalPrincipalSavingsCents: m.totalPrincipalSavingsCents,
  totalVoluntarySavingsCents: m.totalVoluntarySavingsCents,
  activeStatus: m.activeStatus,
}))

export const MOCK_MEMBER_NIK_PLAIN_BY_MEMBER_ID: Record<string, string> = Object.fromEntries(
  MEMBER_SEED.map((m) => [m.id, m.nationalIdPlain]),
)

export const MOCK_PROFIT_SHARING_RECORD: ProfitSharingRecord = {
  id: 'psr-2025-sukamaju',
  cooperativeUnitId: COOP_UNIT_SUKAMAJU_ID,
  fiscalYear: CURRENT_FISCAL_YEAR,
  totalProfitSharingCentsShu: 43_500_000 * 100,
  totalRevenueCents: 1_250_000_000 * 100,
  totalExpensesCents: 982_300_000 * 100,
  netProfitCents: 267_700_000 * 100,
  memberSharePercentage: 60,
  cooperativeSharePercentage: 40,
  totalActiveMembers: 1248,
  periodStartDateIso: '2025-01-01',
  periodEndDateIso: '2025-12-31',
  approvedAtIso: null,
  distributedAtIso: null,
  votingStartEpochMs: new Date('2026-01-15T08:00:00').getTime(),
  votingEndEpochMs: new Date('2026-08-30T23:59:59').getTime(),
  status: ProfitSharingStatus.VOTING_OPEN,
  shuAllocation: {
    revenueCents: 8_525_829_480_98,
    operatingExpenseCents: 7_096_673_087_06,
    netProfitCents: 1_429_156_393_92,
    apnManagementFeeCents: 426_291_474_05,
    hoMarginCents: 1_002_864_919_87,
    regencyManagerCents: 30_085_947_60,
    boardCents: 150_429_737_98,
    membersCents: 822_349_234_29,
  },
}

export const MOCK_PROFIT_SHARING_BREAKDOWN: ProfitSharingTotalsBreakdown = {
  totalMandatorySavingsCents: 9_500_000 * 100,
  totalPrincipalSavingsCents: 14_800_000 * 100,
  totalVoluntarySavingsCents: 5_200_000 * 100,
  totalPatronageDividendCents: 14_000_000 * 100,
  totalMemberShareCents: 43_500_000 * 100,
}

export const MOCK_OTP_CODE_FOR_DEV = '123456'
