# TASK BREAKDOWN & CHECKLIST - KDKMP SHU System
Versi: 1.1 (Clean Architecture Upgrade)
Tanggal: 2026-08-18
Urutan Pengerjaan: Fase 0 → Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5
Pedoman: Setiap mengerjakan task — **WAJIB BACA 5 MD: PRD, ERD, ARCHITECTURE, CODE_STANDARDS, TASKS** terlebih dahulu.

---

## Ringkasan Fase (Sesuai Clean Architecture Layers)

| Fase | Nama | Target | Prioritas | Layer yang Dibangun |
|---|---|---|---|---|
| 0 | **Architecture Boilerplate Setup** | ½ hari | ⭐⭐ Tertinggi | Domain + Infrastructure wrapper + DI Container |
| 1 | Design System + UI Kit Reusable | 1 hari | ⭐ Tinggi | Presentation (theme + components/ui + utils/validators) |
| 2 | Auth Flow Lengkap | 2 hari | ⭐ Tinggi | Domain → Application Use Cases → Infrastructure Mock Repo → Presentation Pages |
| 3 | Dashboard + Voting + Profil + PNL | 2-3 hari | ⭐ Tinggi | Semua 4 Layers (Domain entities baru → Use Case → Mock → UI) |
| 4 | Integration Polish + Protected Route + Error Class | 1 hari | ⭐ Menengah | Cross layer (DI, error translator, boundary checks) |
| 5 | UX Polish + Animasi + Build Release | 1 hari | ⭐ Menengah | Presentation + Build Pipeline |

---

## FASE 0 - ARCHITECTURE BOILERPLATE (KERANGKA BANGUNAN)
❕ Dikerjakan **PALING AWAL** sebelum bikin UI apapun. Jangan skip ini = bangunan akan runtuh nanti.

### 0.1 Inisialisasi Project & Dependencies
- [ ] Install dependencies via bun:
  - `bun add react-router-dom` (navigasi)
  - `bun add react-hook-form zod @hookform/resolvers` (form + validasi)
  - `bun add zustand` (global state)
  - `bun add lucide-react` (icons)
  - `bun add clsx tailwind-merge` (gabungan class dinamis)
  - Opsional: Tailwind `bun add -D tailwindcss postcss autoprefixer`
- [ ] Konfigurasi path alias `@/*` di `tsconfig.json` + `vite.config.ts` (wajib, supaya tidak ada `../../../../`)
- [ ] Update `index.html`:
  - Title: `KDKMP Kasihan Bantul - Sistem SHU`
  - `<html lang="id">`
  - Viewport mobile yang benar (width=device-width, initial-scale=1.0, viewport-fit=cover)
- [ ] Konfigurasi TypeScript strict mode di `tsconfig.json`:
  ```json
  "strict": true,
  "noImplicitAny": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": false,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  ```

### 0.2 DOMAIN LAYER (Entities + Repository Interfaces)
❕ **DILARANG IMPORT LUAR.** Pure TypeScript interfaces saja.

- [ ] Buat `src/domain/enums/PilihanVote.ts` → `'SETUJU' | 'TIDAK_SETUJU'`
- [ ] Buat `src/domain/enums/StatusShu.ts` → `'DRAFT' | 'VOTING' | 'DISETUJUI' | 'DIBAGIKAN'`
- [ ] Buat **1 file per entity** di `src/domain/entities/` sesuai ERD.md:
  - `KoperasiUnit.ts` (id, namaUnit, kodeUnit, alamat, provinsi, kabKota)
  - `Anggota.ts` (id, nikHash, nikMasked, unitId, namaLengkap, noHpMasked, provinsi, kabKota, tanggalGabung, isAktif)
  - `OtpSession.ts` (id, anggotaId, expireAt, isTerpakai, attemptCount, resendCount, createdAt, verifiedAt)
  - `ShuTahunan.ts` (id, unitId, tahun, nominalTotalShu, nominalPerAnggota, statusPembagian, catatan)
  - `Vote.ts` (id, anggotaId, shuTahunanId, pilihan, tokenAnonim, votedAt) + interface `VoteState` (sudahVote, pilihan?, votedAt?)
  - `PnlBulanan.ts` (id, anggotaId, shuTahunanId, bulan, tahun, simpananPokok, simpananWajib, simpananSukarela, pinjamanBerjalan, bagianShuBulanan)
- [ ] Buat **1 file per interface repository** di `src/domain/repositories/` (abstract saja, TIDAK ADA IMPLEMENTASI):
  - `AuthRepository.ts` — methods: `sendOtp(req)`, `verifyOtp(req)`, `resendOtp(sessionId)`, `logout()`
  - `ProfileRepository.ts` — `getMyProfile(): Promise<Anggota>`
  - `ShuRepository.ts` — `getShuByTahun(tahun): Promise<ShuTahunan>`
  - `VoteRepository.ts` — `getStatus(shuTahunanId, anggotaId)`, `submitVote(shuTahunanId, pilihan)`
  - `PnlRepository.ts` — `getBulanan(tahun, anggotaId)`, `getTahunanAggregate(tahun, anggotaId)`
- [ ] ⚡ VALIDASI: `rgrep 'from.*(react|axios|zustand|lucide)' src/domain/` — hasilnya **KOSONG** = domain murni ✅

### 0.3 INFRASTRUCTURE LAYER BOILERPLATE (Wrapper Teknis)
- [ ] Buat `src/infrastructure/storage/SecureStorage.ts`:
  - Wrapper localStorage dengan prefix key `kdkmp.shu.v1.`
  - Method `get<T>(key)`, `set<T>(key, val)`, `remove(key)`, `clearAll()`
  - JSON.parse try/catch aman (tidak throw error jika parse gagal)
- [ ] Buat `src/infrastructure/storage/storageKeys.ts` (UPPER_SNAKE_CASE, terversioning):
  ```ts
  export const STORAGE_KEYS = {
    AUTH_ACCESS_TOKEN: 'kdkmp.shu.v1.auth.token',
    AUTH_CURRENT_ANGGOTA: 'kdkmp.shu.v1.auth.anggota',
  } as const;
  ```
- [ ] Buat `src/infrastructure/api-clients/HttpClient.ts`:
  - Fetch wrapper dengan base URL
  - Interceptor request (masukin Authorization Bearer token jika ada)
  - Interceptor response: translate 401 → `UnauthorizedError`, 404 → `NotFoundError`, 5xx → `ServerError`
  - Untuk dev (mock repo aktif): class tetap ada tapi tidak dipakai dulu.

### 0.4 DEPENDENCY INJECTION CONTAINER (Pusat Perakitan)
- [ ] Buat `src/application/di/container.ts`:
  - Instance semua repository (awalnya `Mock*Repository`, nanti ganti satu baris ke `Http*Repository`)
  - Instance semua use case dengan inject repository yang sesuai
  - Export `const di = { useCases: { auth: {...}, vote: {...} }, repositories: {...} }`
  - ❕ Jangan lupa semua instance singleton dibuat di luar fungsi agar tidak dibuat ulang tiap render.
- [ ] Buat class dasar error di `src/presentation/utils/errors/ApplicationError.ts` + turunannya:
  - `InvalidNikError`, `InvalidOtpError`, `OtpExpiredError`, `TooManyAttemptsError`, `AlreadyVotedError`, `NotFoundError`, `ForbiddenError`, `UnauthorizedError`, `ServerError`
  - Setiap error punya `code`, `httpStatus`, `userMessage` (Bahasa Indonesia, untuk user), `logMessage` (teknis, untuk logger)

✅ **DoD Fase 0:**
- `bun run typecheck` tanpa error
- Bisa import semua entity & repo interface dari `@/domain/...` tanpa circular dependency

---

## FASE 1 - DESIGN SYSTEM + UI KIT REUSABLE (PRESENTATION LAYER)

### 1.1 Theme Tokens
- [ ] Buat `src/presentation/theme/colors.ts` sesuai PRD:
  ```ts
  PRIMARY: '#C8102E', PRIMARY_LIGHT: '#FFEBEE', BACKGROUND: '#FAFAFA',
  WHITE: '#FFFFFF', TEXT: '#212121', TEXT_MUTED: '#757575',
  BORDER: '#E0E0E0', SUCCESS: '#4CAF50', LINK_BLUE: '#1976D2', DANGER: '#D32F2F'
  ```
- [ ] Buat `src/presentation/theme/typography.ts` (font size: h1 28 bold, h2 24 semibold, body 14, caption 12)
- [ ] Buat `src/presentation/theme/spacing.ts` (unit 4px: xs=4, sm=8, md=16, lg=24, xl=32)
- [ ] Buat `src/presentation/theme/index.ts` (re-export semua)
- [ ] Setup global CSS `src/index.css`:
  - Reset CSS (margin padding 0)
  - `box-sizing: border-box;`
  - `body { background: #FAFAFA; color: #212121; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }`
  - `.container-mobile { max-width: 390px; margin: 0 auto; padding: 16px; }`

### 1.2 Pure UI Components Reusable 100% (Tidak Ada Nama Bisnis Keras)
❕ **PENTING:** Di dalam folder `presentation/components/ui/` — **DILARANG KERAS** ada kata KDKMP/NIK/SHU/OTP/Anggota yang hardcoded. Semua lewat props. Setiap komponen harus extend native attributes.

- [ ] `presentation/components/ui/Button.tsx` → extends `ButtonHTMLAttributes`:
  - Props: variant (`primary|secondary|ghost|outline|danger`), size (`sm|md|lg|full`), `loading`, `loadingText`, `leftIcon`, `rightIcon`, `error`, `data-testid`
  - Loading = tombol disabled + spinner lucide `Loader2` animasi
  - Class digabung pakai `clsx + tailwind-merge`
- [ ] `presentation/components/ui/Input.tsx` → extends `InputHTMLAttributes`:
  - Props: `label`, `errorMessage`, `hint`, `inputMode`, `leftIcon`, `rightIcon`, `prefixText`, `suffixText`
  - Jika `errorMessage` ada → border merah
- [ ] `presentation/components/ui/Card.tsx`:
  - Props: `header?`, `footer?`, children, `bordered?`, `padded?`, `variant` (default/primary-red-top)
  - Rounded 16px, shadow-sm
- [ ] `presentation/components/ui/Toast.tsx` + hook `presentation/hooks/useToast.ts`:
  - Provider ToastContainer di root App
  - Variant: success (hijau), error (merah), info (biru abu)
  - Methods: `toast.success(msg)`, `toast.error(msg)`
  - Auto dismiss 3 detik, bisa ditutup manual
- [ ] `presentation/components/ui/Tab.tsx` + `TabButton.tsx`:
  - Tab group underline merah aktif
  - Props: `tabs: { key, label }[]`, `activeKey`, `onChange`
- [ ] `presentation/components/ui/Skeleton.tsx`:
  - Props: `width`, `height`, `rounded`, `count` (array skeleton)
  - Animasi shimmer abu ke abu muda
- [ ] `presentation/components/ui/OtpInputBox.tsx`:
  - Satu kotak input OTP (hanya 1 digit)
  - Props: value, onChange, onBackspace, onPaste, ref forward, isActive, isError
  - Auto select isi saat fokus, border biru aktif, border merah error
- [ ] `presentation/components/ui/RupiahText.tsx`:
  - Props: `value: number`, `size?`, `weight?`, `prefix?`
  - Langsung panggil `formatRupiah()` internal
- [ ] `presentation/components/ui/CountdownText.tsx`:
  - Props: `totalSeconds`, `onComplete`, `format?: 'MM:SS'`
  - Render teks `02:45` yang update tiap detik

### 1.3 Presentation Utils Pure (Tanpa Side Effect, Reusable)
- [ ] `presentation/utils/formatters/formatRupiah.ts` → `Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:0 })`
- [ ] `presentation/utils/formatters/maskNik.ts` → slice 4 digit akhir + 12 karakter `*`
- [ ] `presentation/utils/formatters/maskNoHp.ts`
- [ ] `presentation/utils/formatters/formatTanggal.ts` → `Intl.DateTimeFormat('id-ID', options)`
- [ ] `presentation/utils/validators/validateNik.ts`
- [ ] `presentation/utils/validators/validateOtp.ts`
- [ ] `presentation/utils/constants/messages.ts` → semua pesan error/sukses user (Bahasa Indonesia, tidak teknis):
  ```ts
  export const MESSAGES = {
    auth: {
      nikNotRegistered: 'NIK Anda tidak terdaftar sebagai anggota KDKMP. Silakan hubungi pengurus koperasi ya.',
      otpWrong: (n) => `Kode OTP salah lho. Sisa kesempatan coba lagi: ${n}x. Cek kembali SMS Anda ya.`,
      otpExpired: 'Kode OTP sudah kadaluarsa. Silakan kirim ulang kode ya.',
    },
    vote: {
      alreadyVoted: 'Anda sudah memberikan suara untuk SHU tahun ini. Satu NIK hanya bisa satu suara ya, terima kasih.',
      success: 'Suara Anda sudah tercatat! Terima kasih partisipasinya.',
    },
  } as const;
  ```
- [ ] `presentation/routes/routePaths.ts` (enum path, hindari magic string):
  ```ts
  export const ROUTE_PATHS = {
    ONBOARDING: '/onboarding',
    LOGIN: '/login',
    OTP: '/otp',
    DASHBOARD: '/',
    VOTE_SUCCESS: '/vote-success',
  } as const;
  ```

✅ **DoD Fase 1:**
- Semua komponen UI di atas bisa dipakai tanpa import apapun dari domain/application
- `bun run typecheck` lulus 0 error
- Bisa render showcase Button/Input/Card di halaman sementara tanpa error

---

## FASE 2 - AUTH FLOW (Onboarding → National ID Login → OTP)
⚠️ **DUMMY DATA WAJIB AKTIF:** Semua repository di DI container pakai `Mock*Repository` untuk fase ini. 100% offline dulu, tidak perlu koneksi backend.

### 2.1 Router Setup
- [ ] Buat `src/presentation/routes/AppRouter.tsx`
  - Public routes: `/onboarding`, `/login`, `/otp`
  - Protected routes: `/` (dashboard), `/vote-success` — jika `isAuthenticated = false` redirect `/login`
  - Default auto-redirect: user sudah auth → `/`, belum auth → `/onboarding`
- [ ] Buat `src/presentation/routes/ProtectedRoute.tsx` wrapper komponen untuk protected routes di atas
- [ ] Buat `src/presentation/routes/routePaths.ts` (semua rute dalam const object Inggris, contoh: `ROUTE_PATHS.ONBOARDING`, magic string DILARANG)

### 2.2 Application Layer: Auth Use Cases + AuthStore
⚠️ Nama file/class **100% INGGRIS**
- [ ] Buat use cases class di `application/use-cases/auth/` — satu file satu use case:
  - `SendOtpUseCase.ts` → validasi NIK via validator, panggil `AuthRepository.sendOtp()`
  - `VerifyOtpUseCase.ts` → cek OTP match, cek attempt count ≤ 5, cek expire_at
  - `ResendOtpUseCase.ts` → cek resend count ≤3 per jam, kirim ulang OTP
  - `LogoutUseCase.ts` → clear SecureStorage + reset AuthStore
- [ ] Buat `application/stores/AuthStore.ts` (Zustand, state ENGLISH):
  - State: `isAuthenticated`, `currentMember: Member | null`, `activeOtpSessionId: string | null`, `lastSubmittedNationalIdMasked: string | null`
  - Actions: `setNationalIdSubmittedForOtp()`, `markVerified(member)`, `clearAll()`
  - Persist `isAuthenticated` + `currentMember` via SecureStorage wrapper (JANGAN akses localStorage langsung)
- [ ] Buat Application hooks di `application/hooks/auth/` (wrap use case + loading/error):
  - `useSendOtp.ts` — return { `sendOtp(nationalId)`, `isSubmitting`, `errorCode` }
  - `useVerifyOtp.ts` — return { `verifyOtp(code)`, `isVerifying`, `errorCode`, `attemptsLeft` }
  - `useResendOtp.ts`
  - `useCountdown.ts(totalSeconds)` — reusable countdown, mode MM:SS
- [ ] Update DI container di `application/di/container.ts` untuk instance semua use case di atas beserta repository mock

### 2.3 Infrastructure Layer: Mock Auth Repository (DUMMY DATA 100%)
- [ ] Buat `infrastructure/repositories/mock/MockAuthRepository.ts` — **IMPLEMENT** interface `AuthRepository` dari domain
  - Data dummy wajib ada:
    - Anggota: `fullName = 'Ibu Wati'`, NIK valid hash: `3578010000000009` (16 digit), `cooperativeUnitName = 'KDKMP Sukamaju'`, `province = 'Jawa Timur'`, `cityOrRegency = 'Kota Surabaya'`
    - OTP code HARDCODE: `123456` (tambahkan FIXME comment hapus sebelum go-live)
    - Simulasi delay jaringan 500-800ms di setiap method → UX loading state terasa
    - Throw error sesuai kode jika NIK tidak sesuai format / NIK lain selain daftar dummy
- [ ] Buat `infrastructure/mock-data/mockMembers.ts` (5 dummy data anggota koperasi Jawa dengan nama umum: Ibu Wati, Bapak Slamet, Bu Siti, dll)
- [ ] Buat `infrastructure/mock-data/mockCooperativeUnits.ts` (3 unit: Sukamaju, Genteng, Sidomulyo)

### 2.4 Presentation Layer: Onboarding (3 Slides)
- [ ] Buat `presentation/pages/OnboardingPage.tsx`
- [ ] Buat reusable molecules di `presentation/components/onboarding/`:
  - `OnboardingCarousel.tsx` (swipe / geser + dot indicator merah aktif + Next button)
  - `OnboardingSlide.tsx` menerima props: `illustration`, `title`, `subtitle`
  - **Isi slide (user-facing BAHASA INDONESIA, disimpan di `userFacingStrings.ts`):**
    1. Slide 1: Logo/ilustrasi merah-putih. Judul: "Selamat Datang di KDKMP Kasihan Bantul". Sub: "Sistem Informasi Transparansi & Voting SHU Anggota."
    2. Slide 2: Icon shield + centang. Judul: "Voting Aman tanpa Buat Akun". Sub: "Cukup pakai NIK + kode OTP SMS. Suara Anda 100% rahasia."
    3. Slide 3: Icon chart + profile. Judul: "Lihat Profil & Catatan Keuangan Lengkap". Sub: "Simpanan, pinjaman, dan bagian SHU Anda tiap bulan."
  - CTA di slide 3: **"Mulai Sekarang"** → navigate `/login`

### 2.5 Presentation Layer: National ID Login Page (Login NIK)
- [ ] Buat `presentation/pages/NationalIdLoginPage.tsx`
- [ ] Buat molecules di `presentation/components/auth/`:
  - `AuthPageHeader.tsx` — reusable untuk halaman login & OTP (Logo SVG + "KDKMP Kasihan Bantul")
  - `NationalIdInputForm.tsx` — menerima props: `onSubmit(nationalId: string)`, `isSubmitting`
    - Label: `"Nomor Induk Kependudukan (NIK)"` (string dari `USER_STRINGS`)
    - Placeholder: `"16 digit NIK"`
    - Input: `maxLength=16`, `inputMode="numeric"`. Auto-strip selain angka.
    - Real-time validasi client-side via `validateNationalId()`. Tombol disabled selama < 16 digit.
    - Tombol CTA: `"Kirim OTP"` (variant primary, full width, min tinggi 48px)
    - Loading state: spinner + teks `"Mengirim OTP..."`
- [ ] Page **JANGAN** implement bisnis logic sendiri → HANYA panggil `useSendOtp` hook + navigate ke OTP page jika sukses
- [ ] Error handling di page: catch error code dari use hook → translate ke Bahasa Indonesia via `USER_ERROR_MESSAGES` → tampil via `toast.error(msg)` — pesan sesuai PRD persona awam (TIDAK ADA istilah 404/network)

### 2.6 Presentation Layer: OTP Verification Page
- [ ] Buat `presentation/pages/OtpVerificationPage.tsx`
- [ ] Buat molecules di `presentation/components/auth/`:
  - `OtpCodeInputForm.tsx` — props: `onSubmit(code)`, `onClickResend()`, `isVerifying`, `canResend`, `resendCountdownSeconds`
    - Subtitle atas: `"Kode telah dikirim ke nomor terdaftar untuk NIK *******3821."` — ambil dari `lastSubmittedNationalIdMasked` di AuthStore
    - 6 digit input pakai `presentation/components/ui/OtpInputBox.tsx` (UI atom Fase 1). Susun berjajar 6 kotak, border biru aktif, auto pindah kolom, backspace pindah balik, paste 6 digit langsung isi semua.
    - Link **"Kirim ulang kode"** + pakai `CountdownText` component:
      - Countdown > 0: link abu disabled, teks `"Kirim ulang kode (02:45)"`
      - Countdown = 0: link merah aktif, teks `"Kirim ulang kode"`
      - Gunakan `useCountdown(180)` hook (3 menit). Max resend 3x (cek use case, bukan cuma state UI)
    - Tombol `"Verifikasi"` disabled sampai 6 digit terisi
- [ ] Page pakai `useVerifyOtp` dan `useResendOtp` hooks. Setelah success verify → set AuthStore authenticated → navigate `/` (dashboard).

---

## FASE 3 - DASHBOARD + VOTING + MEMBER PROFILE + FINANCIAL STATEMENTS (PNL)
⚠️ **MASIH PAKAI DUMMY DATA:** Aktifkan `MockVoteRepository`, `MockProfileRepository`, `MockShuRepository`, `MockFinancialStatementRepository` di DI container.

### 3.1 Application Layer: Dashboard Use Cases + Hooks
- [ ] Buat `application/use-cases/profile/GetMyProfileUseCase.ts` — return current logged-in `Member`
- [ ] Buat `application/use-cases/shu/GetCurrentProfitSharingRecordUseCase.ts` — return `ProfitSharingRecord` tahun berjalan (2025) dengan `totalSurplusAmountIdr = 43_500_000`
- [ ] Buat `application/use-cases/vote/GetMemberVoteStatusUseCase.ts` — cek apakah anggota sudah vote (return `MemberVoteStatus`)
- [ ] Buat `application/use-cases/vote/SubmitVoteChoiceUseCase.ts` — input `VoteChoice.AGREE | DISAGREE`, enforce ONE VOTE PER FISCAL YEAR di level use case (bukan cuma UI). Simpan submission, return updated status.
- [ ] Buat `application/use-cases/pnl/GetMonthlyFinancialStatementsUseCase.ts` — return array 12 bulan `MonthlySavingsLoanRecord`
- [ ] Buat `application/use-cases/pnl/GetYearlyFinancialSummaryUseCase.ts` — return aggregate tahunan + list 12 bar untuk mini chart
- [ ] Buat application hooks yang sesuai di `application/hooks/profile`, `hooks/shu`, `hooks/vote`, `hooks/pnl` masing-masing wrap loading/error
- [ ] Update DI container, inject semua use case ke `di.useCases.*`

### 3.2 Infrastructure: Mock Repositories (Dummy Data)
- [ ] Buat `MockProfileRepository.ts` — return Ibu Wati sebagai current member
- [ ] Buat `MockShuRepository.ts` — return SHU 2025 sebesar **Rp 43.500.000**
- [ ] Buat `MockVoteRepository.ts` — awalnya `hasMemberVoted = false`. Setelah submit satu kali, return has voted permanen untuk sesi dummy.
- [ ] Buat `MockFinancialStatementRepository.ts` — 12 bulan data PNL 2025 dengan nilai acak wajar (simpanan pokok 100rb/bln, wajib 50rb, sukarela variatif, pinjaman berjalan turun bertahap, bagian SHU bulanan 150rb-350rb)
- [ ] Buat `infrastructure/mock-data/mockProfitSharingRecord.ts` + `mockMonthlyStatements.ts`

### 3.3 Dashboard Page + Section Components (Compact Mobile First)
- [ ] Buat `presentation/pages/DashboardHomePage.tsx` — compose semua section URUT ATAS KE BAWAH (JANGAN whitespace berlebih):
  1. `MemberProfileHeader` (Halo, Ibu Wati)
  2. `ProfitSharingAmountCard` (Rp 43,5 JT besar)
  3. `VotingChoiceSection` (Setuju/Tidak setuju + guard jika sudah vote)
  4. `MemberInformationCard` (2 kolom unit / provinsi / NIK / kota)
  5. `FinancialStatementsSection` (Tab Bulanan / Tahunan)
- [ ] Pakai Skeleton UI untuk setiap section saat data masih loading dari use case.

### 3.4 Dashboard Section Components
- [ ] `presentation/components/dashboard/MemberProfileHeader.tsx`:
  - Line 1: `"Halo, Ibu Wati"` (22px bold hitam)
  - Line 2: `"KDKMP Sukamaju"` (14px abu) — nama unit dari `Member.cooperativeUnitId` + cari nama dari CooperativeUnit dummy list
  - Opsional: tombol logout icon `LogOut` pojok kanan atas
- [ ] `presentation/components/dashboard/ProfitSharingAmountCard.tsx`:
  - Pakai variant Card dengan border atas merah tipis
  - Line 1 (center, abu 14px): `"SHU yang akan dibagikan tahun ini"`
  - Line 2 (center, 32-36px extra bold hitam): `Rp 43.500.000` — pakai atom `RupiahText` component
- [ ] `presentation/components/dashboard/VotingChoiceSection.tsx` — **PALING KRITIS:**
  - **Pertama-tama di mount:** panggil `useMemberVoteStatus()`.
  - **Guard 1 (UI):** Jika `hasMemberVoted = true` → RENDER `AlreadyVotedStatusCard` SAJA. **JANGAN pernah render tombol pilih lagi.**
  - Jika belum vote:
    - Pertanyaan (semibold 16px): `"Apakah Anda setuju SHU dibagikan tahun ini?"`
    - 2 Tombol (full width, 48px, rounded 12px, jarak 12px):
      - Tombol `"Setuju"` (pilih → bg merah muda + border merah solid + teks merah bold)
      - Tombol `"Tidak setuju"` (pilih → bg putih + border abu tebal + teks abu tua bold)
    - Disclaimer box (card abu muda, padding 12px, teks 12px abu): `"Suara Anda rahasia — sistem hanya mencatat bahwa NIK ini sudah memilih, bukan pilihan yang terhubung ke identitas pada laporan publik."`
    - Submit via `useSubmitVoteChoice` — loading di tombol. Sukses → navigate `/vote-success`.
  - **Guard 2 (UseCase):** Meskipun UI di-hack user paksa tombol muncul, use case harus throw `ALREADY_VOTED` error.
- [ ] `presentation/components/dashboard/AlreadyVotedStatusCard.tsx`:
  - Icon centang hijau besar, background hijau muda
  - `"Anda sudah memberikan suara. Pilihan Anda: [Setuju / Tidak setuju]"`
  - `"Terima kasih atas partisipasi Anda."`
- [ ] `presentation/pages/VoteSuccessPage.tsx`:
  - Center layout (vertikal + horizontal):
    - Icon `CheckCircle2` besar (hijau #4CAF50)
    - Judul (24px bold): `"Suara Anda sudah tercatat"`
    - Sub: `"Pilihan: Setuju"` / `"Pilihan: Tidak setuju"` (bold pilihan)
    - Paragraf abu: `"Satu NIK hanya dapat memberikan satu suara per sesi. Terima kasih atas partisipasi Anda."`
    - Tombol kembali ke dashboard: `"Kembali ke Beranda"` (variant primary)
- [ ] `presentation/components/dashboard/MemberInformationCard.tsx` — Judul `"Informasi Detail"` (border bawah tipis):
  - Grid 2 kolom KIRI / KANAN (design dari gambar referensi):
    | Kiri | Kanan |
    |---|---|
    | Label abu: `"KDKMP"` | Label abu: `"Provinsi"` |
    | **`KDKMP Genteng`** + `ChevronLeft` circle | **`Jawa Timur`** + `ChevronRight` circle |
    | Label abu: `"NIK"` | Label abu: `"Kab / Kota"` |
    | **`3578010000000009`** (masked atau full sesuai preferensi user) | **`Kota Surabaya`** |
- [ ] `presentation/components/dashboard/FinancialStatementsSection.tsx` — Tab dengan atom Tab component:
  - Tab default aktif: `"Bulanan"`
  - Tab 2: `"Tahunan"`
  - **Tab Bulanan:**
    - List 12 card bulan (Januari - Desember 2025) via `MonthlyStatementCard.tsx`
    - Per card: Kiri = `"Januari 2025"`, Kanan = `Rp [monthlyProfitSharing]` (teks hitam bold). Expand klik → detail simpanan pokok/wajib/sukarela + pinjaman (opsional)
  - **Tab Tahunan:**
    - `YearlySummaryCard.tsx`: Total SHU tahunan (akumulasi 12 bulan), Total simpanan, Total pinjaman.
    - Opsional mini bar chart 12 bulan (div CSS lebar persentase, tanpa library, merah solid + putih background)

---

## FASE 4 - INTEGRATION POLISH + CROSS CUTTING CONCERNS

### 4.1 DI Container Final + Error Boundary
- [ ] Finalisasikan `application/di/container.ts` — pastikan SEMUA repository mengarah ke Mock (dummy) — beri komentar jelas baris mana yang nanti ganti ke Http REST API jika backend sudah ready
- [ ] Buat `presentation/components/layouts/AppErrorBoundary.tsx` — React Error Boundary wrap seluruh app. Kalau ada exception tak terduga: tampil card error ramah user Bahasa Indonesia (bukan stack trace putih merah)
- [ ] Buat `presentation/components/layouts/AppLayout.tsx` — wrapper max-width `390px`, margin 0 auto, padding 16px horizontal. Semua page WAJIB dibungkus dengan AppLayout.

### 4.2 User Facing Strings Centralized (TIDAK BOLEH HARDCODE INDONESIA DI KOMPONEN)
- [ ] Finalisasi `presentation/utils/constants/userFacingStrings.ts` — semua judul, subjudul, label, button text, question text, disclaimer text, placeholder. Hanya 1 source of truth string bahasa Indonesia.
- [ ] Finalisasi `presentation/utils/constants/userErrorMessages.ts` — map dari ErrorCode enum Inggris → pesan Bahasa Indonesia sederhana sesuai user persona 18-45 tahun (tidak ada istilah teknis). Lihat contoh di CODE_STANDARDS.md Section 0 Rule 2.

### 4.3 Protected Route + Logout Flow
- [ ] Unit test manual ProtectedRoute: kalau user belum login akses `/` → auto redirect `/onboarding`. Kalau sudah login akses `/login` → redirect `/`.
- [ ] Logout button di `MemberProfileHeader` → panggil `LogoutUseCase.execute()` → clear SecureStorage & AuthStore → navigate `/onboarding`.

---

## FASE 5 - UX POLISH, ANIMASI, FINAL BUILD

### 5.1 Animasi & Micro-interactions
- [ ] Route transition: fade-in + slide up 200ms antar page (pakai React Router transition)
- [ ] Onboarding carousel: swipe horizontal smooth, dot indicator active merah fade
- [ ] OTP input box: fokus highlight biru smooth, error state shake animasi ringkas
- [ ] Vote choice button saat click: scale down 0.98 → rebound 1, selected state border tebal transition
- [ ] Countdown text: update tanpa re-render flicker (pakai CountdownText atom)
- [ ] Toast notification: slide up dari bawah + fade in 200ms, auto dismiss 3 detik

### 5.2 Final Manual Testing Checklist (Semua Viewport Mobile)
Jalankan di browser DevTools, viewport: iPhone SE (320px), iPhone 12 (375px), iPhone 14 Pro (390px), iPhone 15 Pro Max (430px):
- [ ] Onboarding 3 slide swipe + CTA navigasi ke login
- [ ] Input NIK `3578010000000009` → submit → kirim OTP → lanjut halaman OTP
- [ ] Input OTP salah 1x → toast error "Sisa percobaan 4/5"
- [ ] Klik Kirim ulang kode → countdown 3 menit aktif, link disabled
- [ ] Input OTP `123456` → verifikasi sukses → redirect dashboard
- [ ] Dashboard tampil semua section berurutan, nominal Rp 43.500.000, nama Ibu Wati, unit KDKMP Sukamaju
- [ ] Klik Setuju → submit → vote success page
- [ ] Klik Kembali ke Beranda → VoteSection sekarang menampilkan `AlreadyVotedStatusCard`, TOMBOL SETUJU/TIDAK SETUJU SUDAH TIDAK ADA (cegah double vote).
- [ ] Test logout → kembali ke onboarding
- [ ] Semua format Rupiah TANPA desimal `.00`
- [ ] Semua text di layar = Bahasa Indonesia. Tidak ada Inggris "Submit", "Login", dll di user-facing UI.
- [ ] Warna tidak keluar dari palet merah-putih: cek tombol merah `#C8102E`, background `#FAFAFA`, teks abu `#757575`. Tidak ada warna ungu, biru sembarang (kecuali border OTP aktif biru `#1976D2` sesuai PRD).

### 5.3 Build Production & Validation
Jalankan perintah BERURUTAN, pastikan 0 error sebelum claim selesai:
1. [ ] `bun install` — dependensi terinstal, bun.lock terupdate
2. [ ] `bun run typecheck` — TypeScript strict 0 error, 0 warning tersembunyi
3. [ ] `bun run lint` (jika ESLint/OxLint terkonfig) — 0 error fatal
4. [ ] `bun run build` — Production build Vite sukses, chunk size < 200KB per route. Kalau ada chunk besar → code-split route lebih dalam.
5. [ ] `bun run preview` — Buka preview server, test end-to-end flow di HP asli / mobile emulator.
6. [ ] Console browser bersih dari error `warning`, `uncaught promise`, `React key warning`.

---

## Definition of Done (DoD) PER TASK
Setiap item checklist di atas dianggap **BENAR-BENAR SELESAI** JIKA SEMUA 6 poin terpenuhi:
1. ✅ **Architecture Boundary Aman:** Tidak ada cross-layer import yang dilarang (presentation langsung akses infrastructure, domain import luar). Cek grep / file imports.
2. ✅ **English Naming 100%:** Semua nama file, komponen, function, variable = BAHASA INGGRIS sederhana & jelas (kecuali user-facing text strings yang memang harus Indonesia).
3. ✅ **Dummy Data Aktif:** Data flow lewat Mock Repository dan hasilnya realistis sesuai konteks koperasi Indonesia. Tidak ada panggilan jaringan nyata.
4. ✅ **Strict TS 0 Error:** No `any`, no `ts-ignore` tanpa alasan, semua type sesuai domain entities Inggris.
5. ✅ **UI Sesuai PRD + Desain Gambar:** Merah-putih, mobile first ≤ 390px, layout compact minimal whitespace, tombol 48px, responsive 5 viewport.
6. ✅ **Build Lolos:** `bun run typecheck` + `bun run build` keduanya sukses 0 error.
