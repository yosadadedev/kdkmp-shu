import type { ErrorCode } from '@infra/errors/ErrorCode'

export const USER_ERROR_MESSAGES: Readonly<Record<ErrorCode, { title: string; description: string }>> = {
  NATIONAL_ID_NOT_REGISTERED: {
    title: 'NIK tidak terdaftar',
    description:
      'NIK yang kamu masukkan belum terdaftar sebagai anggota. Silakan hubungi pengurus unit koperasi untuk pendaftaran ya.',
  },
  NATIONAL_ID_INVALID_FORMAT: {
    title: 'Format NIK kurang tepat',
    description: 'NIK harus berisi 16 digit angka tanpa spasi atau karakter lain.',
  },
  OTP_SESSION_NOT_FOUND: {
    title: 'Sesi OTP tidak ditemukan',
    description: 'Sesi verifikasi sudah habis atau belum dibuat. Silakan kirim ulang NIK untuk dapat kode baru.',
  },
  OTP_CODE_INVALID: {
    title: 'Kode OTP salah',
    description: 'Cek lagi kode yang kamu terima. Batas percobaan 5 kali sebelum diblokir sementara.',
  },
  OTP_ATTEMPTS_EXCEEDED: {
    title: 'Batas percobaan OTP terlampaui',
    description: 'Terlalu banyak memasukkan kode salah. Silakan tunggu beberapa saat sebelum coba lagi.',
  },
  OTP_EXPIRED: {
    title: 'Kode OTP sudah kadaluarsa',
    description: 'Masa berlaku OTP sudah habis. Silakan kirim ulang kode OTP ya.',
  },
  OTP_RESEND_LIMIT_EXCEEDED: {
    title: 'Batas kirim ulang terlampaui',
    description: 'Kamu sudah kirim ulang OTP beberapa kali. Silakan coba lagi 1 jam kemudian.',
  },
  OTP_LOCKED_TEMPORARILY: {
    title: 'OTP terkunci sementara',
    description: 'Akses verifikasi OTP sedang dibatasi. Silakan tunggu beberapa saat.',
  },
  AUTH_SESSION_EXPIRED: {
    title: 'Sesi kamu habis',
    description: 'Silakan masuk kembali dengan NIK & kode OTP ya.',
  },
  AUTH_SESSION_NOT_FOUND: {
    title: 'Kamu belum masuk',
    description: 'Silakan masuk terlebih dahulu untuk mengakses data anggota.',
  },
  MEMBER_PROFILE_NOT_FOUND: {
    title: 'Data anggota tidak ditemukan',
    description: 'Kami tidak bisa memuat profil anggota saat ini. Silakan coba beberapa saat lagi.',
  },
  VOTE_ALREADY_SUBMITTED: {
    title: 'Kamu sudah memilih',
    description: 'Setiap anggota hanya punya 1 hak suara per tahun buku. Terima kasih partisipasinya!',
  },
  VOTING_PERIOD_CLOSED: {
    title: 'Masa voting sudah berakhir',
    description: 'Masa pemilihan untuk tahun buku ini sudah ditutup. Sampai jumpa di periode berikutnya.',
  },
  PROFIT_SHARING_RECORD_NOT_FOUND: {
    title: 'Data SHU belum tersedia',
    description: 'Data Sisa Hasil Usaha untuk tahun ini sedang dalam proses finalisasi.',
  },
  NETWORK_ERROR: {
    title: 'Masalah koneksi',
    description: 'Periksa jaringan internetmu, lalu coba muat ulang ya.',
  },
  UNKNOWN: {
    title: 'Terjadi kendala',
    description: 'Kami sedang menangani masalah ini. Silakan coba beberapa saat lagi.',
  },
  VALIDATION_ERROR: {
    title: 'Data input kurang lengkap',
    description: 'Periksa kembali semua isian sebelum melanjutkan.',
  },
}

export const resolveUserError = (
  errorCode: ErrorCode,
  fallbackMessage?: string,
): { title: string; description: string } => {
  const found = USER_ERROR_MESSAGES[errorCode]
  if (found) return found
  return {
    title: USER_ERROR_MESSAGES.UNKNOWN.title,
    description: fallbackMessage ?? USER_ERROR_MESSAGES.UNKNOWN.description,
  }
}
