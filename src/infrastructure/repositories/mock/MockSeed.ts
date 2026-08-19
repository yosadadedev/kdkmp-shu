import { MemberActiveStatus } from '@domain/enums/MemberActiveStatus'
import { ProfitSharingStatus } from '@domain/enums/ProfitSharingStatus'
import { VoteChoice } from '@domain/enums/VoteChoice'
import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'
import type { Member } from '@domain/entities/Member'
import type { MonthlyFinancialStatement } from '@domain/entities/MonthlyFinancialStatement'
import type { ProfitSharingRecord, ProfitSharingTotalsBreakdown } from '@domain/entities/ProfitSharingRecord'
import type { VoteSubmission } from '@domain/entities/VoteSubmission'
import { hashNationalIdDummy } from '@domain/value-objects/NationalId'

const COOP_UNIT_SUKAMAJU_ID = 'cu-0001'
const CURRENT_FISCAL_YEAR = 2025

export const MOCK_COOPERATIVE_UNITS: CooperativeUnit[] = [
  {
    id: COOP_UNIT_SUKAMAJU_ID,
    branchName: 'KDKMP Sukamaju Genteng',
    registrationNumber: '0184.02.0379.BHU.2010',
    address: 'Jl. Raya Genteng No. 42, Kelurahan Genteng Kulon',
    province: 'Jawa Timur',
    cityOrRegency: 'Kabupaten Banyuwangi',
    district: 'Genteng',
    village: 'Genteng Kulon',
    establishedAtIso: '2010-05-18',
    totalActiveMembers: 1248,
  },
]

const MEMBER_SEED: Array<Omit<Member, 'nationalIdNikHash' | 'nationalIdNikMasked'> & { nationalIdPlain: string }> = [
  {
    nationalIdPlain: '3578010000000009',
    id: 'mb-0001',
    cooperativeUnitId: COOP_UNIT_SUKAMAJU_ID,
    fullName: 'Ibu Wati Wijayanti',
    gender: 'FEMALE',
    placeOfBirth: 'Banyuwangi',
    dateOfBirthIso: '1989-03-12',
    phoneNumberMasked: '+62 813-****-5821',
    address: 'Jl. Melati No. 15 RT 03 / RW 08',
    province: 'Jawa Timur',
    cityOrRegency: 'Kabupaten Banyuwangi',
    district: 'Genteng',
    village: 'Genteng Kulon',
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
    placeOfBirth: 'Jember',
    dateOfBirthIso: '1985-11-03',
    phoneNumberMasked: '+62 857-****-3312',
    address: 'Jl. Mawar No. 8 RT 01 / RW 02',
    province: 'Jawa Timur',
    cityOrRegency: 'Kabupaten Banyuwangi',
    district: 'Genteng',
    village: 'Genteng Wetan',
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
    province: 'Jawa Timur',
    cityOrRegency: 'Kabupaten Banyuwangi',
    district: 'Genteng',
    village: 'Sukojember',
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

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const RANDOM_SEED_BASE = [
  [48_200, 32_500, 52_000, 8400, 43_600],
  [51_800, 28_000, 56_200, 11_200, 45_000],
  [49_100, 36_100, 51_500, 9_900, 41_600],
  [54_400, 40_800, 58_900, 13_100, 45_800],
  [47_750, 33_200, 50_600, 8_400, 42_200],
  [58_300, 45_700, 61_400, 14_600, 46_800],
  [55_200, 41_900, 59_300, 12_200, 47_100],
  [49_800, 35_400, 53_700, 10_100, 43_600],
  [61_400, 49_600, 64_200, 16_400, 47_800],
  [57_900, 44_200, 60_500, 13_800, 46_700],
  [63_500, 52_800, 66_900, 18_200, 48_700],
  [69_800, 61_500, 72_300, 22_400, 49_900],
]

export const MOCK_MONTHLY_STATEMENTS: MonthlyFinancialStatement[] = RANDOM_SEED_BASE.map(
  ([savings = 0, loanOut = 0, loanIn = 0, opRev = 0, opExp = 0], idx) => {
    const monthNumber = (idx + 1) as MonthlyFinancialStatement['monthNumber']
    const net = opRev - opExp
    const revenueRetailCents = opRev * 100_000
    const cogsCents = Math.round(opExp * 100_000 * 0.97)
    const generalAdminCents = Math.round(opExp * 100_000 * 0.03)
    const cashOverageCents = Math.round(5_800_000 * 100 * (0.9 + (idx % 5) * 0.08))
    return {
      id: `mfs-${CURRENT_FISCAL_YEAR}-${String(monthNumber).padStart(2, '0')}`,
      cooperativeUnitId: COOP_UNIT_SUKAMAJU_ID,
      fiscalYear: CURRENT_FISCAL_YEAR,
      monthNumber,
      periodLabel: `${MONTH_NAMES[idx]} ${CURRENT_FISCAL_YEAR}`,
      totalSavingsInCents: savings * 100_000,
      totalLoanDisbursementCents: loanOut * 100_000,
      totalLoanRepaymentCents: loanIn * 100_000,
      totalOperatingRevenueCents: opRev * 100_000,
      totalOperatingExpensesCents: opExp * 100_000,
      netProfitCents: net * 100_000,
      memberOutstandingLoanPrincipalCents: (285_000 + monthNumber * 12_000) * 100_000,
      createdAtEpochMs: new Date(`${CURRENT_FISCAL_YEAR}-${String(monthNumber).padStart(2, '0')}-28T18:00:00`).getTime(),
      revenue: {
        retailCents: revenueRetailCents,
        clinicCents: 0,
        rentalCents: 0,
        localConsignmentCents: 0,
      },
      hpp: {
        costOfGoodsSoldCents: cogsCents,
        overheadCents: 0,
        operationalCents: 0,
        otherHppCents: 0,
        localSupplierLossCents: 0,
        damagedGoodsLossCents: 0,
        lostGoodsLossCents: 0,
      },
      operationalExpenses: {
        generalAndAdministrativeCents: generalAdminCents,
      },
      otherIncome: {
        cashOverageCents,
        otherIncomeCents: 0,
      },
      otherExpenses: {
        finalIncomeTaxCents: 0,
        cashShortageCents: 0,
      },
    }
  },
)

export const MOCK_VOTING_AGGREGATE = {
  totalVoters: 1084,
  agreeCount: 968,
  disagreeCount: 87,
  abstainCount: 29,
}

export const createDummyVoteSubmission = (memberId: string, choice: VoteChoice): VoteSubmission => {
  const now = Date.now()
  return {
    id: `vote-${memberId}-${CURRENT_FISCAL_YEAR}-${Math.random().toString(36).slice(2, 10)}`,
    profitSharingRecordId: MOCK_PROFIT_SHARING_RECORD.id,
    anonymousVoteToken: `anon_${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 10)}`,
    choice,
    submittedAtEpochMs: now,
    fiscalYear: CURRENT_FISCAL_YEAR,
  }
}

export const MOCK_OTP_CODE_FOR_DEV = '123456'

export const COOPERATIVE_UNIT_ID_DEFAULT = COOP_UNIT_SUKAMAJU_ID
