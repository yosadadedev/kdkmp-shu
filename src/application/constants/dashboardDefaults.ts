import type { CooperativeUnit } from '@domain/entities/CooperativeUnit'

/**
 * Profit-sharing, voting, and financial-statement data are still fully
 * mocked on the backend and only recognize this one fixed cooperative
 * unit/member (see MockProfitSharingRepository, which rejects any other
 * cooperativeUnitId). The real value from the logged-in member's profile
 * won't match, so these fixed IDs are used directly instead of depending
 * on useMyProfile() — that keeps this part of the dashboard working even
 * when the real profile fetch fails or returns a different member.
 */
export const DEFAULT_COOPERATIVE_UNIT_ID = 'cu-0001'
export const DEFAULT_MEMBER_ID = 'mb-0001'

export const DEFAULT_COOPERATIVE_UNIT: CooperativeUnit = {
  id: DEFAULT_COOPERATIVE_UNIT_ID,
  branchName: 'kdkmp_baturetno_banguntapan',
  registrationNumber: '340.212.200.101',
  address: 'Desa Baturetno, Kecamatan Banguntapan, Kabupaten Bantul, Daerah Istimewa Yogyakarta',
  province: 'Daerah Istimewa Yogyakarta',
  cityOrRegency: 'Kabupaten Bantul',
  district: 'Banguntapan',
  village: 'Baturetno',
  establishedAtIso: '2010-05-18',
  totalActiveMembers: 1248,
}
