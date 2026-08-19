# SKILL SPEC - AI Agent KDKMP SHU System
Versi: 1.1
Tanggal: 2026-08-18
Peran: Agent Pengembangan Kode Frontend & Backend KDKMP SHU (Expert Architecture Grade)

---

## 1. Tujuan Skill ini

Memberikan panduan baku kepada AI Agent supaya:
1. **Selalu membaca SEMUA file MD terlebih dahulu** (PRD, ERD, ARCHITECTURE, CODE_STANDARDS, TASKS) sebelum menulis kode apapun
2. Menghasilkan kode **Clean Architecture** — framework agnostic, data source agnostic, testable
3. Kode 100% sesuai kebutuhan bisnis, desain merah-putih mobile-first, keamanan NIK terjaga
4. 100% reusable, maintainable, sustainable — developer baru bisa navigate kode < 30 menit
5. Konsisten stack: React + Vite + TypeScript + Bun + Zustand + React Router v6

---

## 2. Langkah Wajib Agent Sebelum Nulis Kode

### LANGKAH 1: Baca SEMUA File MD di Folder `docs/` (URUTAN WAJIB, TIDAK BOLEH DILEWATKAN)
Setiap kali agent diminta generate/edit kode apapun — **MUTLAK** jalankan urutan ini:
```
1. Read docs/PRD.md                → Fitur, UI/UX, flow, warna, persona
2. Read docs/ERD.md                → Entity domain, relasi tabel, type
3. Read docs/ARCHITECTURE.md       → Clean Architecture layers, DI container, pattern, dependency rule
4. Read docs/CODE_STANDARDS.md     → Naming convention, TS strict, component structure, error message
5. Read docs/TASKS.md              → Prioritas task, fase, DoD
6. (Opsional) Read docs/CHANGELOG.md jika ada
```

**DILARANG KERAS** menulis kode sebelum 5 file utama di atas dibaca — tidak peduli seberapa sederhana perubahan yang diminta user.
**DILARANG KERAS** cross-layer import yang melanggar aturan ARCHITECTURE.md — jika ragu, baca ulang Section 10 ARCHITECTURE.md.

---

## 2.5 LANGUAGE POLICY + DUMMY DATA FIRST (MUTLAK — BACA CODE_STANDARDS.md SECTION 0 UNTUK DETAIL)

| Area | Bahasa | Contoh |
|---|---|---|
| **SEMUA NAMA KODE** (file, folder, class, function, variable, type, interface, enum, hook, store, const) | 🇬🇧 **BAHASA INGGRIS SEDERHANA & JELAS** (mudah dipahami developer luar) | `SubmitVoteUseCase`, `activeMemberList`, `handleSelectAgree`, `monthlyProfitSharingAmount` |
| **Exception (nama kode)**: Singkatan bisnis yang all-party-tahu | Boleh pakai NIK, SHU, PNL jika dijelaskan padanan Inggris juga | `nationalIdNikHash`, `profitSharingShuTotal` |
| **Teks yang muncul di layar USER** (label, judul, tombol, toast error user, subjudul) | 🇮🇩 **BAHASA INDONESIA AWAM** (tanpa istilah teknis) | `Kirim OTP`, `NIK tidak terdaftar. Silakan hubungi pengurus ya.` |
| **User-facing strings** | ⚠️ **JANGAN HARDCODE di use case / domain.** Simpan di `presentation/utils/constants/userFacingStrings.ts` (bahasa Indo) + translate error code di Presentation Layer | ✅ `USER_STRINGS.auth.sendOtpButton` ❌ `throw new Error('NIK tidak terdaftar')` di use case |
| **SELURUH DATA DI MVP AWAL** | 🎭 **100% DUMMY / MOCK via MockRepository di DI container.** JANGAN sentuh REST API nyata dulu sebelum UI + bisnis logic stabil. | `new MockAuthRepository()` aktif. Backend ready → ganti 1 baris ke `new HttpAuthRepository()` selesai. |

Contoh nama translate Indo → Inggris yang WAJIB diterapkan:
- `Anggota` → **`Member`** (Entity, Repository, Semua variabel)
- `KoperasiUnit / Unit Koperasi` → **`CooperativeUnit`**
- `PNL (Profil/Laporan Keuangan)` → **`MonthlyFinancialStatement`** / `MonthlySavingsLoanRecord`
- `PilihanVote` → **`VoteChoice`** (enum `AGREE` / `DISAGREE`, bukan `SETUJU` / `TIDAK_SETUJU` untuk kode)
- `StatusShu` → **`ProfitSharingStatus`** (value: `DRAFT`, `VOTING_OPEN`, `APPROVED`, `DISTRIBUTED`)

---

## 3. Aturan Stack Teknologi Wajib

| Layer | Stack | Catatan |
|---|---|---|
| Package Manager | Bun | JANGAN pakai npm/yarn/pnpm |
| Frontend Framework | React 18+ + TypeScript | Strict mode |
| Build Tool | Vite | Sesuai project existing |
| Styling | Tailwind CSS (jika ada) / CSS Modules | Ikuti yang sudah di project |
| State Management | Zustand / React Context | Hindari Redux (overkill untuk MVP) |
| Router | React Router v6 | Untuk navigasi antar screen |
| Form Handling | React Hook Form + Zod | Validasi client-side |
| HTTP Client | Fetch API / Axios | Pilih salah satu, konsisten |
| Icons | Lucide React / SVG lokal | Ikuti yang existing |
| Format Rupiah | `Intl.NumberFormat('id-ID')` | JANGAN buat manual |
| Date | date-fns / Intl.DateTimeFormat | Hindari moment.js |
| Testing (jika butuh) | Vitest | |

---

## 4. Aturan Desain UI/UX Wajib (Dari PRD Section 6)

### 4.1 Palet Warna WAJIB (HARUS di tokens/constants)
Buat file `src/constants/theme.ts` atau `tailwind.config.js` dengan value:
```ts
export const THEME = {
  PRIMARY: '#C8102E',       // Merah solid tombol CTA
  PRIMARY_LIGHT: '#FFEBEE', // Background hover
  BACKGROUND: '#FAFAFA',    // Putih krem background
  WHITE: '#FFFFFF',
  TEXT: '#212121',          // Teks utama
  TEXT_MUTED: '#757575',    // Teks abu
  BORDER: '#E0E0E0',        // Border input abu
  SUCCESS: '#4CAF50',       // Hijau centang
  LINK_BLUE: '#1976D2',     // Border OTP aktif
} as const;
```

### 4.2 Typography
- Buat kelas utilitas: `.h1` (24-28px bold), `.h2` (20px semibold), `.body` (14px), `.caption` (12px abu)
- Default font: `Inter` atau `system-ui, sans-serif`

### 4.3 Layout Mobile First
- Container max-width: `390px` (mobile), `480px` (tablet kecil), center align
- Padding horizontal: `16px` - `24px`
- Min tinggi tombol: `48px` (tekanan jari nyaman)
- Radius tombol/card: `12px` - `16px`
- Layout RAPAT (compact), JANGAN kasih whitespace berlebih antar section

### 4.4 UX Pattern Wajib
1. **Loading State**: Semua tombol CTA (Kirim OTP, Verifikasi, Vote) harus punya state loading (spinner + disabled)
2. **Toast / Snackbar**: Error dan sukses pakai toast warna (hijau sukses, merah error)
3. **Validasi Real-time**: Input NIK cek panjang digit saat mengetik; input OTP auto-pindah kolom
4. **Countdown Timer**: Link "Kirim ulang kode" countdown 3 menit, disabled state abu
5. **Skeleton Loader**: Data PNL dan profil pakai skeleton saat loading

---

## 5. Aturan Struktur Folder Wajib (Clean Architecture 4 Layers)

```
src/
├── domain/                              ← 【PURITY TIDAK BOLEH DIKOMBINASI DENGAN LUAR】
│   ├── entities/                        ← 1 file = 1 entity sesuai ERD
│   │   ├── KoperasiUnit.ts
│   │   ├── Anggota.ts
│   │   ├── OtpSession.ts
│   │   ├── ShuTahunan.ts
│   │   ├── Vote.ts
│   │   └── PnlBulanan.ts
│   ├── repositories/                    ← ABSTRACT INTERFACES (hanya method signature, TANPA IMPLEMENTASI)
│   │   ├── AuthRepository.ts
│   │   ├── ProfileRepository.ts
│   │   ├── ShuRepository.ts
│   │   ├── VoteRepository.ts
│   │   └── PnlRepository.ts
│   └── enums/
│       ├── PilihanVote.ts
│       └── StatusShu.ts
│
├── application/                         ← 【BISNIS LOGIC HIDUP DISINI】
│   ├── use-cases/                       ← 1 file = 1 Use Case = 1 Class = 1 Tugas (SRP)
│   │   ├── auth/
│   │   │   ├── SendOtpUseCase.ts
│   │   │   ├── VerifyOtpUseCase.ts
│   │   │   ├── ResendOtpUseCase.ts
│   │   │   └── LogoutUseCase.ts
│   │   ├── profile/GetMyProfileUseCase.ts
│   │   ├── shu/GetCurrentShuTahunanUseCase.ts
│   │   ├── vote/{GetVoteStatusUseCase,SubmitVoteUseCase}.ts
│   │   └── pnl/{GetPnlBulananUseCase,GetPnlTahunanUseCase}.ts
│   ├── stores/                          ← Zustand global store (AuthStore, UiStore)
│   ├── hooks/                           ← Application-level hooks (wrap use case + loading/error)
│   │   ├── auth/{useSendOtp,useVerifyOtp,useCountdown}.ts
│   │   ├── profile/useMyProfile.ts
│   │   ├── shu/useCurrentShu.ts
│   │   ├── vote/{useVoteStatus,useSubmitVote}.ts
│   │   └── pnl/usePnlTahunanBulanan.ts
│   └── di/container.ts                  ← Dependency Injection Container (instance repo + use case)
│
├── infrastructure/                      ← 【IMPLEMENTASI TEKNIS, MUDAH DIGANTI】
│   ├── repositories/
│   │   ├── mock/                        ← MVP/development (bisa pindah ke http/ tinggal ganti DI)
│   │   │   ├── MockAuthRepository.ts
│   │   │   ├── MockProfileRepository.ts
│   │   │   ├── MockShuRepository.ts
│   │   │   ├── MockVoteRepository.ts
│   │   │   └── MockPnlRepository.ts
│   │   └── http/                        ← Nanti real backend REST API (ganti 1 baris di DI container)
│   ├── api-clients/HttpClient.ts        ← Fetch wrapper + JWT interceptor + error translator
│   ├── storage/SecureStorage.ts         ← localStorage wrapper (key prefix, JSON safe, expire)
│   └── mock-data/                       ← data mock sesuai ERD (Ibu Wati + NIK 3578010000000009)
│
└── presentation/                        ← 【MURNI UI/UX, TIDAK ADA BISNIS LOGIC】
    ├── pages/                           ← Screen level
    │   ├── OnboardingPage.tsx
    │   ├── LoginNikPage.tsx
    │   ├── OtpPage.tsx
    │   ├── DashboardPage.tsx
    │   └── VoteSuccessPage.tsx
    ├── components/
    │   ├── ui/                          ←【ATOMIC, 100% REUSABLE — DILARANG ADA BISNIS NAMA/KATA KDKMP, NIK, SHU HARDCODE】
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Card.tsx
    │   │   ├── Toast.tsx
    │   │   ├── Tab.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── OtpInputBox.tsx
    │   │   ├── RupiahText.tsx
    │   │   └── CountdownText.tsx
    │   ├── auth/{AuthHeader, NikInputForm, OtpInputForm}.tsx
    │   ├── onboarding/{OnboardingCarousel, OnboardingSlide}.tsx
    │   ├── dashboard/{ProfileHeader,ShuCard,VoteSection,VoteAlreadyDoneCard,DetailInfoCard,PnlSection,PnlBulananList,PnlTahunanCard}.tsx
    │   └── layouts/AppLayout.tsx        ← Max width 390px center + padding global
    ├── hooks/                           ← UI hooks reusable (useToast, useMediaQueryMobile)
    ├── theme/{colors,typography,spacing,index}.ts
    ├── routes/{AppRouter,ProtectedRoute,routePaths}.ts
    └── utils/
        ├── formatters/{formatRupiah,maskNik,maskNoHp,formatTanggal}.ts
        └── validators/{validateNik,validateOtp}.ts
```

### 5.1 Dependency Rule Check (WAJIB DIPATUHI)
| Import dari \ ke | domain | application | infrastructure | presentation |
|---|---|---|---|---|
| **domain** | ✅ Boleh internal | ❌ DILARANG | ❌ DILARANG | ❌ DILARANG |
| **application** | ✅ WAJIB hanya import domain | ✅ Boleh internal | ❌ DILARANG (hanya via interface domain + DI) | ❌ DILARANG |
| **infrastructure** | ✅ WAJIB implement interface domain | ❌ DILARANG | ✅ Boleh internal | ❌ DILARANG |
| **presentation** | ❌ DILARANG (hanya type entities saja jika benar-benar butuh) | ✅ WAJIB hanya pakai Application Hooks/Store | ❌ DILARANG JANGAN PERNAH | ✅ Boleh internal |

**Kalau kamu bingung mau taruh kode dimana:**
- Kalau bicara "APA" data = domain
- Kalau bicara "BAGAIMANA ALUR BISNIS" = application
- Kalau bicara "BAGAIMANA TEKNIS SIMPAN/FETCH" = infrastructure
- Kalau bicara "TAMPILKAN DIMANA & WARNA APA" = presentation

---

## 6. Aturan Type Wajib (Dari ERD.md → domain/entities/) — ALL ENGLISH TYPE NAMES

Semua type ENTITAS BISNIS **HARUS** didefinisikan SEKALI di `domain/entities/` (satu per file, nama Inggris). **DILARANG DUPLIKAT** interface terpisah di presentation. Jika UI butuh bentuk berbeda → buat mapper di Application Layer, JANGAN ubah entity domain.

Contoh `domain/enums/VoteChoice.ts` & `domain/entities/ProfitSharingRecord.ts`:
```ts
// domain/enums/VoteChoice.ts  ← 100% INGGRIS di nama type & value
export type VoteChoice = 'AGREE' | 'DISAGREE';

// domain/enums/ProfitSharingStatus.ts
export type ProfitSharingStatus = 'DRAFT' | 'VOTING_OPEN' | 'APPROVED' | 'DISTRIBUTED';

// domain/entities/Member.ts  ← DULU "Anggota" → SEKARANG Member (INGGRIS)
export interface Member {
  id: string;
  nationalIdNikHash: string;            // dulunya nikHash — tambah Inggris padanan
  nationalIdNikMasked: string;          // dulunya nikMasked
  cooperativeUnitId: string;            // dulunya unitId
  fullName: string;                     // dulunya namaLengkap
  phoneNumberMasked: string;            // dulunya noHpMasked
  province: string;                     // dulunya provinsi
  cityOrRegency: string;                // dulunya kabKota
  joinDateIso: string;                  // dulunya tanggalGabung (ISO string yyyy-mm-dd)
  isActive: boolean;                    // dulunya isAktif
}

// domain/entities/CooperativeUnit.ts  ← DULU KoperasiUnit
export interface CooperativeUnit {
  id: string;
  unitName: string;
  unitCode: string;
  address: string;
  province: string;
  cityOrRegency: string;
  createdAtIso: string;
  updatedAtIso: string;
}

// domain/entities/ProfitSharingRecord.ts  ← DULU ShuTahunan
export interface ProfitSharingRecord {
  id: string;
  cooperativeUnitId: string;
  fiscalYear: number;                   // dulunya tahun (tahun buku / fiscal year)
  totalSurplusAmountIdr: number;        // dulunya nominalTotalShu (dalam Rupiah integer)
  estimatedPerMemberAmountIdr: number;  // dulunya nominalPerAnggota
  status: ProfitSharingStatus;
  notes?: string;                       // dulunya catatan
}

// domain/entities/VoteSubmission.ts  ← DULU Vote.ts
export interface MemberVoteStatus {     // DULU VoteState.sudahVote
  hasMemberVoted: boolean;              // DULU sudahVote → hasMemberVoted
  memberChoice?: VoteChoice;            // DULU pilihan → memberChoice (value AGREE/DISAGREE Inggris di kode, Indo di UI: Setuju/Tidak setuju)
  submittedAtIso?: string;              // DULU votedAt
}
```

---

### 7.1 Flow Login (Layered Correct)
Presentation Page TIDAK BOLEH panggil `fetch/axios` langsung. Harus lewat:
```
LoginNikPage.tsx
  ↓ panggil
useSendOtp.ts (Application Hook, wrap loading/error)
  ↓ panggil
new SendOtpUseCase(AuthRepo).execute() (Application Layer, validasi bisnis)
  ↓ lewat DI container
MockAuthRepository.sendOtp() / HttpAuthRepository.sendOtp() (Infrastructure Layer)
  ↓ return
Navigate ke OtpPage.tsx
```
Simpan token via SecureStorage wrapper (JANGAN akses localStorage langsung di page).

### 7.2 Validasi Input NIK & OTP
Validator diletakkan di `presentation/utils/validators/` (pure function, reusable):
```ts
export const NIK_REGEX = /^[0-9]{16}$/;
export const OTP_REGEX = /^[0-9]{6}$/;
export function validateNik(v: string): string | null {
  if (!v) return 'NIK tidak boleh kosong ya';
  if (!NIK_REGEX.test(v)) return 'NIK harus 16 digit angka';
  return null;
}
```
- NIK = PERSIS 16 digit angka, tombol disabled sambil belum 16 digit
- OTP = PERSIS 6 digit angka
- Validasi client-side di input, validasi bisnis yang sama dijalankan ulang di **Use Case** (double guard).

### 7.3 Countdown Resend OTP (3 Menit)
- `useCountdown(totalSeconds: 180)` → reusable application hook, **BUKAN** inline di OTP page
- Countdown > 0: link abu disabled, teks `Kirim ulang kode (02:45)` (format MM:SS)
- Countdown = 0: link merah aktif, teks `Kirim ulang kode`
- Maks 3x resend per NIK per jam → dicek di **UseCase**, BUKAN cuma state UI.

### 7.4 Voting Rules (Anonimisasi Terjaga)
- VoteSection component pertama-tama panggil `useVoteStatus(shuTahunanId)` di mount
- Jika `sudahVote = true` → RENDER komponen `VoteAlreadyDoneCard` statis. **TIDAK BOLEH** tombol setuju/tidak setuju masih tampil.
- Setelah pilih → Submit via `useSubmitVote.execute()` → Success page
- Rule `1 NIK = 1 vote/tahun` di-enforce DUA KALI:
  1. UI guard (hide tombol jika sudah vote)
  2. Use case guard (throw AlreadyVotedError jika sudah ada data Vote di repo)

---

## 8. Aturan Mock Data (Infrastructure Layer)

Buat di `infrastructure/mock-data/` (bukan di presentation/services). SEMUA data mock HARUS sesuai tabel dan kolom ERD.md.
- `mockUnits.ts`: 3 unit (KDKMP Sukamaju, KDKMP Genteng, KDKMP Contoh Lain)
- `mockAnggota.ts`: 5-10 anggota, WAJIB ADA:
  - **Nama**: `Ibu Wati`
  - **NIK mock valid** (hash mock dari `3578010000000009`)
  - Unit: KDKMP Genteng / Sukamaju
  - Provinsi: Jawa Timur, Kab: Kota Surabaya
- `mockShu.ts`: SHU tahun 2025, `nominalTotalShu = 43_500_000` (Rp 43,5 JT)
- `mockPnl.ts`: 12 baris PNL 2025 untuk Ibu Wati
- OTP mock hardcode `123456` di MockAuthRepository dengan komentar `// FIXME: Hapus sebelum go-live — OTP dev mode`

---

## 9. Aturan Konsistensi Kode (Sesuai CODE_STANDARDS.md)

1. **Naming**: PascalCase untuk Component, Class (UseCase/Repo), Entity Type. camelCase untuk fungsi, hooks, variable. Daftar lengkap lihat CODE_STANDARDS.md Section 2.
2. **Imports Order**: External → Domain → Application → Infrastructure → Presentation → Lokal. PAKAI `@/` alias, DILARANG relative path naik > 2 level (`../../../../X`).
3. **Komentar**: Hanya komentari `MENGAPA`, bukan `APA`. Gunakan format TODO(inisial/tanggal): ... — lihat CODE_STANDARDS.md Section 6.
4. **Strict TypeScript 100%**: DILARANG `any`, DILARANG `ts-ignore` tanpa alasan tertulis. Semua parameter fungsi bertipe.
5. **Satu File = Satu Tanggung Jawab**: Jika file > 200 baris → wajib refactor pecah.
6. **Error Messages User**: WAJIB Bahasa Indonesia sederhana, tidak ada istilah teknis (404, network error, invalid). Contoh benar di CODE_STANDARDS.md Section 7.
7. **Accessibility**:
   - Semua tombol icon punya `aria-label`
   - Input `<label>` terhubung via `htmlFor`
   - Warna kontras WCAG AA (tes contrast ratio)
8. **Responsive**: Test manual 5 viewport: 320px SE, 375px iPhone 12, 390px iPhone 14 Pro, 430px, 480px.

---

## 10. Checklist Validasi Agent SEBELUM Claim "Selesai"

### 10.1 Architectural & Clean Code (WAJIB 100% LULUS)
- [ ] Sudah baca **SEMUA 5 MD**: PRD.md, ERD.md, ARCHITECTURE.md, CODE_STANDARDS.md, TASKS.md
- [ ] Tidak ada import yang melanggar dependency rule (presentation → infrastructure ❌, domain → luar ❌). Cek matrix di Section 5.1.
- [ ] Setiap fitur baru ada Use Case class terpisah (1 file = 1 use case)
- [ ] Semua entity dan type HIDUP di `domain/entities/`, TIDAK DUPLIKAT di presentation
- [ ] Data fetch HANYA di Infrastructure repo (Mock/Http). Presentation TIDAK PERNAH panggil `fetch` / `axios` langsung
- [ ] UI Kit components (`presentation/components/ui/`) 100% reusable: TIDAK ADA kata KDKMP/NIK/SHU yang hardcoded di sana
- [ ] Tidak ada `any`, tidak ada `ts-ignore` tanpa alasan
- [ ] Error message user Bahasa Indonesia sederhana, tidak teknis
- [ ] Naming convention sesuai CODE_STANDARDS.md (boolean prefix is/has/can, const UPPER_SNAKE_CASE, dll)

### 10.2 UI/UX (Sesuai PRD)
- [ ] Palet warna MERAH PUTIH sesuai THEME: Primary `#C8102E`, background `#FAFAFA`, teks abu `#757575`. TIDAK ADA warna ungu / sembarang.
- [ ] Mobile first: Container max-width `390px`, center. Padding `16-24px` horizontal.
- [ ] Layout COMPACT, TIDAK ada whitespace berlebih antar section.
- [ ] Semua CTA tinggi minimal `48px`, rounded `12-16px`.
- [ ] NIK validasi 16 digit angka, OTP 6 digit angka (client-side + use case double check)
- [ ] Countdown resend OTP 3 menit (180 detik) berjalan benar
- [ ] 1 NIK = 1 vote per tahun. Guard ganda di UI layer + use case. Setelah vote, tombol hilang permanen.
- [ ] Semua format Rupiah via `formatRupiah()` (Intl.NumberFormat id-ID, tanpa Rp desimal .00)

### 10.3 Build & Type Safety
- [ ] `bun install` sukses (bun.lock terupdate)
- [ ] `bun run typecheck` → 0 error TypeScript strict
- [ ] `bun run lint` (jika ada) → 0 fatal error
- [ ] `bun run build` → Production build sukses, no warning fatal
- [ ] Semua screen bisa dinavigasi tanpa error console:
  - `/onboarding` (3 slide swipe)
  - `/login` (input NIK 3578010000000009 → kirim OTP)
  - `/otp` (input 123456 → verifikasi → redirect)
  - `/` (dashboard lengkap: header, SHU 43,5 JT, Vote, Info Detail, PNL)
  - `/vote-success` (setelah submit vote, lalu kembali)
