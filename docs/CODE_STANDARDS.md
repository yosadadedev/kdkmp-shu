# CODE STANDARDS - KDKMP SHU System
Versi: 1.1 (English Code Naming Policy + Dummy Data First)
Tanggal: 2026-08-18
Tujuan: Codebase Konsisten, Clean, Readable, Reusable, Maintainable 6 bulan ke depan tanpa developer pusing

---

## 0. ATURAN BAHASA (LANGUAGE POLICY) — MUTLAK DIPATUHI

### 🔴 RULE #1: SEMUA NAMA KODE = BAHASA INGGRIS MUDAH DIPAHAMI
Semua nama file, folder, class, function, variable, interface, type, enum, hook, store, constant — **100% BAHASA INGGRIS**, sederhana, dan deskriptif.
- Tujuan: Siapa pun developer (dari negara manapun) bisa baca code tanpa terjemah.
- Naming jangan terlalu "pintar" / pakai kata-kata jarang. Pakai kata umum yang langsung jelas maknanya.

| ❌ SALAH (Bahasa Indonesia / Campur) | ✅ BENAR (Bahasa Inggris Sederhana) |
|---|---|
| `nominalShuBulanan` | `monthlyProfitSharingAmount` |
| `anggotaAktif` | `activeMember` |
| `handlePilihSetuju` | `handleSelectAgree` |
| `daftarPnlBulanan` | `monthlyFinancialStatementList` |
| `KoperasiUnit.ts` | `CooperativeUnit.ts` |
| `Anggota.ts` | `Member.ts` |
| `PilihanVote.ts` | `VoteChoice.ts` |
| `StatusShu.ts` | `ProfitSharingStatus.ts` |
| `KirimOtpUseCase.ts` | `SendOtpUseCase.ts` |
| `maskNik(nik)` | `maskNationalId(nationalId)` |
| `useVotingStatus.ts` | `useVoteStatus.ts` |
| `OTP_RESEND_COOLDOWN` | ✅ (sudah Inggris) OK |

**Pengecualian (ACRONYM BISNIS YANG SUDAH DIKETAHUI SEMUA PIHAK, BOLEH DIPAKAI):**
- `NIK` = Nomor Induk Kependudukan (bisa dipakai dalam nama kode, contoh: `nationalIdNikHash` atau cukup `nikHash` kalau jelas konteksnya Indonesia)
- `SHU` = Sisa Hasil Usaha → **LEBIH BAIK gunakan padanan Inggris yang setara:** `ProfitSharing` atau `SurplusAllocation`. Bisa kombinasi: `profitSharingShuAmount` kalau ingin tetap menandakan istilah lokal.
- `PNL` → **LEBIH BAIK gunakan:** `FinancialStatement` (laporan keuangan) atau `MonthlySavingsLoanRecord` tergantung konteks.

---

### 🟢 RULE #2: TEKS YANG DILIHAT USER = BAHASA INDONESIA SESUAI PERSONA
HANYA di bagian **Presentation Layer** saja, string text yang muncul di layar user = WAJIB Bahasa Indonesia yang sederhana (tanpa istilah teknis). Tempatkan di file terpisah supaya mudah translation / edit:
```ts
// ✅ BENAR: disimpan di file constants khusus user-facing string
// src/presentation/utils/constants/userFacingStrings.ts
export const USER_STRINGS = {
  auth: {
    loginTitle: 'Verifikasi identitas Anda',
    loginSubtitle: 'Masukkan NIK untuk menerima kode OTP lewat SMS. Tidak perlu membuat akun.',
    nikLabel: 'Nomor Induk Kependudukan (NIK)',
    sendOtpButton: 'Kirim OTP',
  },
  vote: {
    questionText: 'Apakah Anda setuju SHU dibagikan tahun ini?',
    agreeOption: 'Setuju',
    disagreeOption: 'Tidak setuju',
  },
} as const;
```

**DILARANG KERAS:** menulis hardcoded string Indonesia di dalam Use Case / Entity domain (contoh: `throw new Error('NIK tidak terdaftar')` di dalam `SendOtpUseCase.execute()`). Gunakan error code → translate message di Presentation Layer. Contoh BENAR:
```ts
// use case (domain layer) = throw with CODE (English)
throw new ApplicationError(ERROR_CODES.NATIONAL_ID_NOT_FOUND, 404);

// presentation layer = translate code ke Bahasa Indonesia untuk user
const USER_ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.NATIONAL_ID_NOT_FOUND]:
    'NIK Anda tidak terdaftar sebagai anggota KDKMP. Silakan hubungi pengurus koperasi ya.',
};
```

---

### 🟡 RULE #3: DATA = DUMMY / MOCK SEPENUHNYA DI AWAL (MVP v0.1)
- **WAJIB** gunakan `Mock*Repository` (di `infrastructure/repositories/mock/`) di DI container untuk semua fase development awal
- JANGAN buat / integrasikan REST API sungguhan dulu sebelum UI flow + bisnis logic selesai dan diuji
- Data dummy harus realistis (sesuai konteks koperasi Indonesia, nominal Rupiah masuk akal, nama Jawa umum seperti Ibu Wati, Bapak Slamet, dst)
- Nanti backend ready: GANTI HANYA 1 BARIS di DI container `new MockAuthRepository()` → `new HttpAuthRepository()` — seluruh code lain TIDAK BOLEH berubah.

---

## 1. Prinsip Panduan (S.T.A.B.L.E.)

Setiap baris kode yang ditulis harus lulus tes S.T.A.B.L.E.:

| Huruf | Prinsip | Artinya Praktis |
|---|---|---|
| **S** | **Single Responsibility** | 1 file / 1 class / 1 fungsi = 1 pekerjaan saja |
| **T** | **Testable** | Bisa unit test tanpa mock React / DOM / browser |
| **A** | **Avoid Duplication (DRY)** | Jika logic dipakai 2x → extract ke util / use case / komponen |
| **B** | **Boundary Jelas** | Tidak ada cross-layer import yang melanggar ARCHITECTURE.md |
| **L** | **Longevity** | Nama variabel / file tidak ambigu. Dibaca 6 bulan lagi langsung paham |
| **E** | **Error Handling Eksplisit** | Tidak ada try-catch kosong, tidak ada `any`, tidak ada `!== undefined` tanpa alasan |

---

## 2. Naming Conventions (MUTLAK)

### 2.1 Files & Folders (ALL ENGLISH, Lihat Section 0!)
| Tipe | Format | Contoh BENAR | Contoh SALAH |
|---|---|---|---|
| React Component (TSX) | `PascalCase.tsx` | `OtpInputForm.tsx`, `VoteSection.tsx` | `otpInputForm.tsx`, `otp_input.tsx`, `PemilihanSuara.tsx` |
| Classes (UseCase / Repository / Entity) | `PascalCase.ts` | `SendOtpUseCase.ts`, `MockAuthRepository.ts`, `Member.ts`, `CooperativeUnit.ts` | `KirimOtp.ts`, `auth_repo.ts`, `Anggota.ts` |
| Functions (utils / validators / formatters) | `camelCase.ts` | `formatCurrencyRupiah.ts`, `validateNationalId.ts`, `maskPhoneNumber.ts` | `FormatRupiah.ts`, `format-rupiah.ts`, `validasiNik.ts` |
| Hooks | `useCamelCase.ts` | `useSendOtp.ts`, `useCountdown.ts`, `useCurrentMemberProfile.ts` | `SendOtpHook.ts`, `pakaiProfile.ts` |
| Interfaces / Types (domain entities) | `PascalCase.ts` (1 file per entity) | `Member.ts`, `CooperativeUnit.ts`, `ProfitSharingRecord.ts` | `anggota.type.ts`, `I_Anggota.ts`, `UnitKoperasi.ts` |
| Interface (kontrak / contract) | JANGAN pakai prefix `I` | `AuthRepository` | `IAuthRepository`, `AuthRepo` |
| Enum | `PascalCase` name + `UPPER_SNAKE_CASE` values | `VoteChoice.AGREE`, `ProfitSharingStatus.VOTING_OPEN` | `PilihanVote.SETUJU`, `pilihan.setuju` |
| Consts / Magic values | `UPPER_SNAKE_CASE` | `OTP_RESEND_COOLDOWN_SECONDS = 180`, `MAX_OTP_ATTEMPTS = 5` | `resendCooldown = 180`, `batasCoba` |
| Store file (Zustand) | `PascalCaseStore.ts` | `AuthStore.ts`, `UiToastStore.ts` | `auth.store.ts`, `storeToast` |
| Folder name | `kebab-case` layer + `camelCase` subfeature | `use-cases/auth/`, `repositories/mock/`, `presentation/components/dashboard` | `UseCases/AuthRepoMock/`, `komponen/halaman-utama` |

### 2.2 Variables di Dalam Kode (ALL ENGLISH)
| Tipe | Format | Contoh BENAR (INGGRIS MUDAH) | Contoh SALAH (Indo / Campur) |
|---|---|---|---|
| Regular variable | `camelCase` | `monthlyProfitSharingAmount`, `activeMember`, `totalSurplusThisYear` | `nominalShuBulanan`, `anggotaAktif`, `nshub` |
| Boolean flag | Prefix `is / has / can / should` (HANYA ini, JANGAN buat variasi lain) | `isAuthenticated`, `canResendOtpCode`, `hasUserVotedThisSession`, `shouldShowVotingForm` | `auth`, `resend`, `vote`, `sudahPilih` |
| Async fn result | Deskriptif atau suffix `Response/Result` | `const sendOtpResponse = await sendOtpUseCase.execute(req)` | `const res = await do()`, `const hasil = await aksi()` |
| Array list | Plural + suffix `List / Collection` | `memberList`, `monthlyStatementList`, `cooperativeUnitsCollection` | `anggotas`, `pnl1`, `daftarNya` |
| Map / Record | Suffix `ById / ByKey` | `membersById = Record<MemberId, Member>`, `memberByNikHash = Record<NikHash, Member>` | `anggotaMap`, `mapNya` |
| Event handler | Prefix `handle` + aksi Inggris | `handleSubmitNationalId`, `handleSelectAgree`, `handleClickResendOtp`, `handleTabChange` | `submit`, `clickBtn`, `pilihSetuju` |
| Event prop di komponen | Prefix `on` | `<OtpInputForm onSubmit={handleSubmitOtpCode} onResend={handleClickResendOtp} />` | `<Form submit={...} ulangKirim={...} />` |
| Ref DOM | Suffix `Ref` | `firstOtpInputRef = useRef<HTMLInputElement>(null)`, `nationalIdInputRef` | `inp`, `refNik` |

### 2.3 Prohibited Names (WAJIB DIHINDARI)
❌ **Delete on sight** kalau ketemu nama-nama di bawah ini:
- **Cryptic 1-3 huruf / kependekan parah:** `res`, `resp`, `req`, `val`, `x`, `y`, `tmp`, `arr`, `obj`, `usr`, `pwd`, `cfg`, `ctx` → kecuali scope ≤ 10 baris dan maknanya SUPER jelas dari konteks.
- **Nomor tanpa arti / copy-paste malas:** `value2`, `LoginPage2`, `NewButton`, `Utils3` → Ganti dengan deskriptif: `discountedValue`, `BiometricLoginPage`, `SecondaryOutlineButton`, `DateFormatterUtils`
- **Bahasa Indonesia di nama kode:** `anggota`, `koperasi`, `pemilu`, `transaksi` (kecuali user-facing string di Presentation Layer). Exception: NIK, SHU, PNL boleh jika dijelaskan lewat Inggris juga.
- **Komen sampah tanpa aksi:** `// TODO: fix later` tanpa nama owner + tanggal + link ticket. Format WAJIB: `// TODO(ABC/18-08-2026): Deskripsi jelas, link JIRA/Trello jika ada`
- **Nama boolean tanpa prefix is/has/can/should:** `auth`, `voteStatus`, `loading` → ganti: `isAuthenticated`, `hasUserCastVote`, `isSubmitting`

---

## 3. TypeScript Strict Standards (NO `any` POLICY)

### 3.1 Larangan Mutlak
| ❌ DILARANG | ✅ GANTI DENGAN | Catatan |
|---|---|---|
| `any` | Generic type `T`, `unknown`, atau interface konkret | 1 `any` = 1 bug potensial tak terdeteksi |
| `!== undefined` tanpa narrowing | Type guard, optional chaining, atau z.infer Zod | |
| `ts-ignore` / `ts-expect-error` | Perbaiki type-nya. Kalau terpaksa, WAJIB komentar 1 baris ALASAN kenapa | `// @ts-expect-error: Library X type bug |
| `as` casting sembarangan | `satisfies` operator terlebih dahulu, atau type assertion yang dibuktikan | |
| Implicit `any` di param function | Tuliskan type-nya eksplisit | |

### 3.2 Type yang Wajib di Domain
Semua tipe data bisnis **HARUS** didefinisikan SEKALI di `domain/entities/`. Jangan pernah buat interface `Anggota` terpisah di komponen UI.
- Jika UI butuh bentuk data berbeda → buat adapter / mapper di Application Layer. Jangan ubah entity domain.

Contoh:
```ts
// domain/entities/ShuTahunan.ts ← HANYA DISINI definisi
export interface ShuTahunan {
  id: string;
  unitId: string;
  tahun: number;
  nominalTotalShu: number;      // Rupiah integer, simpan sebagai number SENARAI KECIL? Atau Rupiah utuh? JELAS.
  statusPembagian: StatusShu;
}

// JANGAN DUPLIKAT di presentation/components/dashboard/ShuCard.tsx:
// interface Shu { /* copy paste dari atas */ } ❌ REJECT
```

---

## 4. Aturan Fungsi & Clean Code

### 4.1 Fungsi = Pendek & Satu Tujuan
| Aturan | Target | Contoh |
|---|---|---|
| Panjang fungsi | ≤ 40 baris | Jika lebih → extract helper fn / pecah |
| Parameter fungsi | ≤ 3 positional | Jika ≥ 4 → wrap jadi object opsi |
| Fungsi tanpa nama | Hanya di `.map()/.filter()` 1 baris | Selain itu, kasih nama agar stack trace jelas |

Contoh BENAR:
```ts
// ✅ 1 fungsi = 1 pekerjaan. Naming jelas. <10 baris.
export function maskNik(nik: string): string {
  if (nik.length < 16) return nik.replace(/./g, '*');
  const maskedPart = '*'.repeat(12);
  const visiblePart = nik.slice(-4);
  return maskedPart + visiblePart;
}
```

Contoh SALAH:
```ts
// ❌ Campur 3 hal: masking, validasi, update DOM. Panjang 100 baris. Nama "helper" doang.
function helper(a: any, b: any): any { /* ... */ }
```

### 4.2 Early Return & Guard Clauses
Gunakan **early return** untuk hindari if-else bersarang (callback hell / arrow anti pattern).

✅ **BENAR:**
```ts
async function submitVote(pilihan: PilihanVote) {
  if (isLoading) return;                          // guard 1
  if (sudahVote) throw new Error('Sudah vote');    // guard 2
  if (!pilihan) throw new ValidationError('Pilih salah satu'); // guard 3
  // logic utama tanpa nesting:
  await di.useCases.vote.submitVote.execute({ pilihan, shuTahunanId });
  toast.success('Suara tercatat');
}
```

❌ **SALAH:**
```ts
function submitVote() {
  if (!isLoading) {
    if (!sudahVote) {
      if (pilihan) {
        // 4 level nesting, pusing dibaca
      }
    }
  }
}
```

---

## 5. Komponen React Standards

### 5.1 Struktur Satu Komponen (1 File)
Urutannya **WAJIB KONSISTEN** agar developer tidak loncat-loncat:
```tsx
// 1. IMPORTS (urut: external → internal → relative)
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmitVote } from '@/application/hooks/vote/useSubmitVote';
import { Button } from '@/presentation/components/ui/Button';

// 2. TYPES / INTERFACE PROPS (jika tidak di file terpisah)
export interface VoteSectionProps {
  shuTahunanId: string;
  sudahVote: boolean;
  pilihanSaya?: PilihanVote;
  onVoteSuccess?: () => void;
}

// 3. CONSTANTS LOKAL (hanya dipakai komponen ini, huruf besar)
const PILIHAN_LABEL: Record<PilihanVote, string> = {
  SETUJU: 'Setuju',
  TIDAK_SETUJU: 'Tidak setuju',
};

// 4. COMPONENT FUNCTION (DEFAULT EXPORT atau named export, KONSISTEN)
export function VoteSection(props: VoteSectionProps) {
  // 4a. DESTRUCTURE PROPS DI ATAS
  const { shuTahunanId, sudahVote, pilihanSaya, onVoteSuccess } = props;

  // 4b. HOOKS HANYA DISINI (useState, useMemo, useCallback, custom hooks)
  const navigate = useNavigate();
  const [pilihanDipilih, setPilihanDipilih] = useState<PilihanVote | null>(null);
  const { submitVote, isLoading } = useSubmitVote();

  // 4c. DERIVED VALUES (useMemo / computed)
  const tombolSubmitDisabled = useMemo(
    () => !pilihanDipilih || isLoading || sudahVote,
    [pilihanDipilih, isLoading, sudahVote]
  );

  // 4d. EVENT HANDLERS (prefix handle)
  const handlePilih = (p: PilihanVote) => {
    if (sudahVote) return;
    setPilihanDipilih(p);
  };

  const handleSubmit = async () => {
    if (!pilihanDipilih) return;
    await submitVote(shuTahunanId, pilihanDipilih);
    onVoteSuccess?.();
    navigate('/vote-success');
  };

  // 4e. RENDER (JSX) - urut elemen sesuai tampilan atas ke bawah
  if (sudahVote) {
    return <VoteAlreadyDoneCard pilihan={pilihanSaya!} />;
  }

  return (
    <section className="space-y-3">
      <h2>Apakah Anda setuju SHU dibagikan tahun ini?</h2>
      {Object.entries(PILIHAN_LABEL).map(([value, label]) => (
        <Button
          key={value}
          variant={pilihanDipilih === value ? 'primary' : 'secondary'}
          onPress={() => handlePilih(value as PilihanVote)}
        >
          {label}
        </Button>
      ))}
      <Button
        variant="primary"
        loading={isLoading}
        disabled={tombolSubmitDisabled}
        onPress={handleSubmit}
      >
        Kirim Suara
      </Button>
    </section>
  );
}

// 5. JANGAN ADA FUNCTION DI BAWAH return JSX.
```

### 5.2 Aturan Props Komponen
- **Minimal 1 Props = 1 Tanggung Jawab.** Jangan buat props `mode: string` yang isinya `'vote' | 'view' | 'edit'` — pecah jadi 3 komponen berbeda atau minimal union type yang eksplisit.
- Props boolean: JANGAN `variant="red" / variant="blue"` → pakai `variant: 'primary' | 'secondary'` enum yang jelas.
- Hindari props drilling > 3 level. Kalau melebihi → naikkan state ke Context/Zustand, atau pakai composition (children slot pattern).

### 5.3 Aturan useEffect
✅ **KAPAN BOLEH useEffect?**
- Sync state ke external non-react (localStorage, title document, analytics event)
- Subscribe event listener (resize, scroll) + cleanup function

❌ **JANGAN PAKAI useEffect JIKA:**
- Hitung derived value → pakai `useMemo` / variable biasa saja
- Trigger action setelah user klik → taruh di `handleClick`
- Fetch data on mount → pakai Application Hooks (useMyProfile dll) yang di dalamnya mungkin boleh useEffect, tapi UI TIDAK USAH useEffect sendiri.

---

## 6. Comment Standard

**JANGAN komentari APA yang kode lakukan.** Komentari MENGAPA jika tidak jelas.
- ✅ Bagus: `// Rate limit max 3x/jam sesuai aturan OJK koperasi no. XX/2024`
- ❌ Buruk: `// Increment counter` (kode sudah jelas: `counter += 1`)

**Format komentar yang diwajibkan:**
1. **JSDoc di semua Use Case Class, Repository Interface, dan UI komponen kompleks:**
```ts
/**
 * Use case verifikasi kode OTP dari anggota.
 * @throws {OtpExpiredError} Jika OTP sudah lewat 5 menit dari created_at
 * @throws {TooManyAttemptsError} Jika attempt_count > 5, blokir 15 menit
 * @throws {InvalidOtpError} Jika hash OTP tidak cocok
 */
export class VerifyOtpUseCase { /* ... */ }
```

2. **TODO harus ada format:**
   `// TODO(inisial/DD-MM-YYYY): [Deskripsi jelas] → Link ticket jika ada`
   Contoh: `// TODO(ARS/18-08-2026): Ganti MockAuthRepository ke HttpAuthRepository setelah endpoint backend siap`

3. **FIXME (kritis, tidak boleh ke production):**
   `// FIXME(ARS/18-08-2026): OTP hardcode 123456, hapus sebelum go-live`

---

## 7. Error & Toast Messaging Standards

Semua pesan error di UI **WAJIB BAHASA INDONESIA SEDERHANA**, sesuai persona anggota usia 18-45 tahun. **TIDAK BOLEH ISITILAH TEKNIS.**

| Scenario | ❌ SALAH (teknis) | ✅ BENAR (bahasa awam, menenangkan) |
|---|---|---|
| Nik tidak terdaftar | `404 Resource Not Found - NIK invalid` | `NIK Anda tidak terdaftar sebagai anggota KDKMP. Silakan hubungi pengurus koperasi ya.` |
| Salah OTP | `OTP mismatch error, attempts 2/5` | `Kode OTP salah lho. Sisa kesempatan coba lagi: 3x. Cek kembali SMS Anda ya.` |
| Sudah vote | `409 Conflict - UNIQUE constraint violation` | `Anda sudah memberikan suara untuk SHU tahun ini. Satu NIK hanya bisa satu suara ya, terima kasih.` |
| Koneksi mati | `Network error axios code ECONNABORTED` | `Koneksi internet kurang lancar. Silakan coba beberapa saat lagi ya.` |

**Klasifikasi Error Code (Semua error lewat class turunan ApplicationError):**
```ts
// presentation/utils/errors.ts
export abstract class ApplicationError extends Error {
  abstract code: ErrorCode;
  abstract httpStatus: number;
  abstract userMessage: string;     ← ini yang ditampilkan ke user
  abstract logMessage?: string;     ← ini yang dicatat ke logger/monitoring (boleh teknis)
}

// Contoh anaknya:
export class InvalidNikError extends ApplicationError {
  code = ErrorCode.INVALID_NIK;
  httpStatus = 400;
  userMessage = 'Format NIK harus 16 digit angka ya.';
}
```

---

## 8. Import Order Standard (Setiap File)

Urut imports dari PALING LUAR → PALING DALAM, dipisahkan 1 baris kosong. Pakai `@/` alias untuk project internal.
```ts
// 1. React / Framework External (WAJIB PALING ATAS)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Third party libraries (lucide, zod, clsx)
import { CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

// 3. Domain / Application Layers (PALING DALAM, sebelum presentation)
import { useMyProfile } from '@/application/hooks/profile/useMyProfile';
import type { Anggota } from '@/domain/entities/Anggota';

// 4. Presentation Components / Utils
import { AppLayout } from '@/presentation/components/layouts/AppLayout';
import { formatRupiah } from '@/presentation/utils/formatters/formatRupiah';

// 5. Lokal file (relative path ./  ../ )
import { VoteSection } from './VoteSection';
import { ShuCard } from './ShuCard';
import { ProfileHeader } from './ProfileHeader';
```

Dilarang: Relative path naik lebih dari 2 level (`../../../../components/X`). Gunakan `@/` alias.

---

## 9. Standard Reusable Components (UI Kit)

Setiap komponen di `presentation/components/ui/` **WAJIB** punya:
1. **Props type lengkap** (extends native element attributes bila memungkinkan: `InputProps extends InputHTMLAttributes<HTMLInputElement>`)
2. **Minimal 3 variant** umum: size (sm/md/lg), variant (primary/secondary/ghost), state (loading/disabled/error)
3. **Menerima `className` external** lalu digabung dengan class default pakai `clsx + tailwind-merge` → agar bisa di-override tanpa !important
4. **Menerima `testID` / `data-testid`** props → untuk Playwright / RTL testing

Contoh Button interface lengkap:
```ts
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'full';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  'data-testid'?: string;
}
```

---

## 10. Performance & Sustainability Checklist

Setiap kali buat fitur baru, cek **minimal 4 poin ini:**
- [ ] **Debounce input NIK/OTP:** Jangan trigger API per keystroke. Cukup validasi client-side per keystroke, API saat submit.
- [ ] **Image lazy load + format modern:** Semua gambar ilustrasi onboarding → `loading="lazy"`, `width/height` di-set untuk hindari CLS.
- [ ] **List virtualisasi jika >50 item:** PNL bulanan cuma 12 sih normal, tapi kalau nanti ada riwayat transaksi 1000+ baris → pakai `@tanstack/react-virtual`.
- [ ] **Avoid unnecessary re-render:** Kompleks component dibungkus `React.memo`, handler dibungkus `useCallback` jika di-pass sebagai props ke child memoized.
- [ ] **Dead code cleanup:** Setiap PR hapus variable/import/component yang tidak dipakai. Jangan simpan "barang rongsok" untuk nanti.
- [ ] **Bundle size check:** `bun run build` + perhatikan chunk size. Kalau 1 chunk >150KB → code split route lebih dalam.
- [ ] **Semantic HTML:** Gunakan `<main>`, `<section>`, `<article>`, `<nav>`. Jangan 100% `<div>` semuanya. Input wajib ada `<label>` yang terhubung (accessibility).

---

## 11. Reviewer Lint Checklist (Auto + Manual)

Sebelum merge, **SEMUA** ini harus lulus:

### ✅ Auto
- [ ] `bun run typecheck` → 0 error TypeScript strict
- [ ] `bun run lint` (ESLint + oxlint) → 0 error, 0 warning fatal
- [ ] `bun run format` (Prettier / Biome) → code terformat rapi
- [ ] `bun run test` → Unit test & integration test 100% lulus
- [ ] `bun run build` → Production build sukses tanpa warning

### ✅ Manual (Reviewer)
- [ ] Tidak ada `any` di code diff
- [ ] Tidak ada import yang melanggar layer ARCHITECTURE.md
- [ ] Satu use case = satu file = satu class = satu tanggung jawab
- [ ] Naming variabel jelas, tidak ada singkatan aneh
- [ ] Error message untuk user Bahasa Indonesia sederhana, tidak teknis
- [ ] Tidak ada useEffect abuse
- [ ] Tidak ada magic number → extract ke CONST UPPER_SNAKE_CASE
- [ ] Tidak ada komentar "diperbaiki nanti" tanpa TODO format + tanggal + owner
