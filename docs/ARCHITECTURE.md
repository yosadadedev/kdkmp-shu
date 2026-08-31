# CLEAN ARCHITECTURE - KDKMP SHU System
Versi: 1.0
Tanggal: 2026-08-18
Prinsip: **Separation of Concerns, Dependency Inversion, Testable, Reusable, Sustainable**

---

## 1. Prinsip Dasar yang Diterapkan

Proyek ini mengadopsi **Clean Architecture (Robert C. Martin)** yang diadaptasi untuk aplikasi React SPA modern. Tujuan utamanya:
1. **UI Framework Agnostic** — Bisnis logic TIDAK bergantung ke React/Zustand/Router. Ganti framework tanpa rewrite bisnis logic.
2. **Data Source Agnostic** — Bisnis logic TIDAK peduli datanya dari Mock API, REST, Supabase, atau IndexedDB. Ganti data source = ganti satu file adapter.
3. **Testable** — Unit test Use Case / Domain tanpa perlu mock React / DOM / browser API.
4. **Readable** — Setiap file hanya punya 1 tanggung jawab (SRP). Developer baru langsung paham arah navigasi kode.
5. **Maintainable** — Perubahan di layer luar TIDAK memaksa perubahan di layer dalam.

---

## 2. Diagram Layers (Dependency Direction: LUAR → KE DALAM)

```
┌─────────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER  (Pages, Components, UI Kit, Hooks UI)           │
│  Hanya mengimport: Application Layer + Domain Types                  │
│  Tidak pernah: import axios/API, akses localStorage langsung         │
├─────────────────────────────────────────────────────────────────────┤
│  APPLICATION LAYER  (Use Cases + Application Hooks + Zustand Store)  │
│  Hanya mengimport: Domain Layer (Entities + Repo Interfaces)         │
│  Tidak pernah: import components, akses DOM/React Router             │
├─────────────────────────────────────────────────────────────────────┤
│  DOMAIN LAYER  (Entities / Types + Repository Interfaces)            │
│  TIDAK PERNAH import apapun dari luar dirinya                        │
│  Pure TypeScript types, tanpa framework apapun                       │
├─────────────────────────────────────────────────────────────────────┤
│  INFRASTRUCTURE LAYER  (Repository Impl + API Client + Storage)      │
│  Mengimplementasikan Interface dari DOMAIN LAYER                     │
│  Boleh import library (axios, fetch, localStorage, supabase)         │
│  Diresolve lewat Dependency Injection (DI Container sederhana)       │
└─────────────────────────────────────────────────────────────────────┘
```

**Dependency Rule = ITU MUTLAK:**
- ✅ Presentation → Application → Domain
- ✅ Infrastructure → Domain (mengimplementasi interface Domain)
- ❌ DILARANG: Domain → Application, Domain → Infrastructure, Application → Presentation

---

## 3. Struktur Folder Final (Sesuai Architecture)

```
src/
├── domain/                           ← 【PURITY TERJAGA, TIDAK ADA IMPORT LUAR】
│   ├── entities/                     ← Pure TypeScript interfaces (sesuai ERD)
│   │   ├── KoperasiUnit.ts
│   │   ├── Anggota.ts
│   │   ├── OtpSession.ts
│   │   ├── ShuTahunan.ts
│   │   ├── Vote.ts
│   │   └── PnlBulanan.ts
│   ├── repositories/                 ← ABSTRACT INTERFACES (hanya method signatures)
│   │   ├── AuthRepository.ts
│   │   ├── ProfileRepository.ts
│   │   ├── ShuRepository.ts
│   │   ├── VoteRepository.ts
│   │   └── PnlRepository.ts
│   ├── enums/
│   │   ├── PilihanVote.ts
│   │   └── StatusShu.ts
│   └── value-objects/                ← Contoh: Nik.ts, Rupiah.ts (jika butuh validasi internal)
│       └── index.ts
│
├── application/                      ← 【BISNIS LOGIC HIDUP DISINI】
│   ├── use-cases/                    ← SATU FILE = SATU USE CASE (SINGLE RESPONSIBILITY)
│   │   ├── auth/
│   │   │   ├── SendOtpUseCase.ts
│   │   │   ├── VerifyOtpUseCase.ts
│   │   │   ├── ResendOtpUseCase.ts
│   │   │   └── LogoutUseCase.ts
│   │   ├── profile/
│   │   │   └── GetMyProfileUseCase.ts
│   │   ├── shu/
│   │   │   └── GetCurrentShuTahunanUseCase.ts
│   │   ├── vote/
│   │   │   ├── GetVoteStatusUseCase.ts
│   │   │   └── SubmitVoteUseCase.ts
│   │   └── pnl/
│   │       ├── GetPnlBulananUseCase.ts
│   │       └── GetPnlTahunanUseCase.ts
│   │
│   ├── stores/                       ← Zustand — GLOBAL APP STATE (hanya state yang lintas screen)
│   │   ├── AuthStore.ts              ← isAuthenticated, currentUser
│   │   └── UiStore.ts                ← toast queue, app loading global
│   │
│   ├── hooks/                        ← Application-level hooks (bukan hooks UI reusable)
│   │   ├── auth/
│   │   │   ├── useSendOtp.ts         ← Wrap SendOtpUseCase + loading/error state
│   │   │   ├── useVerifyOtp.ts
│   │   │   └── useCountdown.ts       ← Countdown 3 menit resend OTP
│   │   ├── profile/
│   │   │   └── useMyProfile.ts
│   │   ├── shu/
│   │   │   └── useCurrentShu.ts
│   │   ├── vote/
│   │   │   ├── useVoteStatus.ts
│   │   │   └── useSubmitVote.ts
│   │   └── pnl/
│   │       └── usePnlTahunanBulanan.ts
│   │
│   └── di/                           ← DEPENDENCY INJECTION CONTAINER
│       └── container.ts              ← Instance repository (mock / real) + inject ke use case
│
├── infrastructure/                   ← 【IMPLEMENTASI TEKNIS, GANTI MUDAH】
│   ├── repositories/                 ← IMPLEMENTASI interface dari domain/repositories/
│   │   ├── mock/                     ← Untuk MVP / development / unit test
│   │   │   ├── MockAuthRepository.ts
│   │   │   ├── MockProfileRepository.ts
│   │   │   ├── MockShuRepository.ts
│   │   │   ├── MockVoteRepository.ts
│   │   │   └── MockPnlRepository.ts
│   │   └── http/                     ← Nanti ganti ke real backend REST API
│   │       ├── HttpAuthRepository.ts
│   │       ├── HttpProfileRepository.ts
│   │       ├── HttpShuRepository.ts
│   │       ├── HttpVoteRepository.ts
│   │       └── HttpPnlRepository.ts
│   ├── api-clients/
│   │   └── HttpClient.ts             ← Fetch wrapper + interceptors JWT + error handling
│   ├── storage/
│   │   └── SecureStorage.ts          ← Wrapper localStorage (key prefix, JSON parse aman, expire)
│   └── mock-data/                    ← Data mock statis (sesuai ERD)
│       ├── mockUnits.ts
│       ├── mockAnggota.ts
│       ├── mockShu.ts
│       └── mockPnl.ts
│
├── presentation/                     ← 【UI/UX HIDUP DISINI, BERSIH DARI BISNIS LOGIC】
│   ├── pages/                        ← Screen-level (1 file = 1 route)
│   │   ├── OnboardingPage.tsx        ← Hanya: render layout + panggil useNavigate
│   │   ├── LoginNikPage.tsx          ← Hanya: render UI + panggil useSendOtp hook
│   │   ├── OtpPage.tsx               ← Hanya: render UI + useVerifyOtp + useCountdown
│   │   ├── DashboardPage.tsx         ← Compose semua section components
│   │   └── VoteSuccessPage.tsx
│   │
│   ├── components/
│   │   ├── ui/                       ← 【ATOMIC DESIGN - ATOMS】100% PURE REUSABLE
│   │   │   ├── Button.tsx            ← props: variant, size, loading, dll — TIDAK ADA BISNIS LOGIC
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tab.tsx
│   │   │   ├── TabButton.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── OtpInputBox.tsx       ← Satu kotak input OTP (1 digit)
│   │   │   ├── RupiahText.tsx        ← Formatter Rupiah reusable
│   │   │   └── CountdownText.tsx     ← Teks countdown reusable
│   │   │
│   │   ├── auth/                     ← 【MOLECULES / ORGANISMS KHUSUS AUTH】
│   │   │   ├── AuthHeader.tsx        ← Logo + Nama Koperasi (reusable Login & OTP page)
│   │   │   ├── NikInputForm.tsx      ← Form NIK + submit button
│   │   │   └── OtpInputForm.tsx      ← 6 digit OtpInputBox + resend link
│   │   │
│   │   ├── onboarding/
│   │   │   ├── OnboardingCarousel.tsx
│   │   │   └── OnboardingSlide.tsx
│   │   │
│   │   ├── dashboard/                ← 【ORGANISMS KHUSUS DASHBOARD】
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ShuCard.tsx
│   │   │   ├── VoteSection.tsx       ← Hanya: UI pilih setuju/tidak setuju + useSubmitVote
│   │   │   ├── VoteAlreadyDoneCard.tsx ← UI jika sudah vote (stateless)
│   │   │   ├── DetailInfoCard.tsx
│   │   │   ├── PnlSection.tsx
│   │   │   ├── PnlBulananList.tsx
│   │   │   ├── PnlBulananItem.tsx
│   │   │   └── PnlTahunanCard.tsx
│   │   │
│   │   └── layouts/
│   │       └── AppLayout.tsx         ← Max width 390px, center, padding global
│   │
│   ├── hooks/                        ← 【UI-ONLY HOOKS, reusable tanpa bisnis】
│   │   ├── useToast.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQueryMobile.ts
│   │
│   ├── theme/
│   │   ├── colors.ts                 ← THEME object (merah #C8102E dst sesuai PRD)
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   ├── routes/
│   │   ├── AppRouter.tsx             ← React Router setup
│   │   ├── ProtectedRoute.tsx        ← Cek isAuthenticated dari AuthStore
│   │   └── routePaths.ts             ← Enum string path (hindari magic string)
│   │
│   └── utils/                        ← 【PURE UTILITY FUNCTIONS TANPA SIDE EFFECT】
│       ├── formatters/
│       │   ├── formatRupiah.ts
│       │   ├── maskNik.ts
│       │   ├── maskNoHp.ts
│       │   └── formatTanggal.ts
│       └── validators/
│           ├── validateNik.ts        ← Pure fn: input string → error string | null
│           └── validateOtp.ts
│
├── App.tsx                           ← Wrap Providers (Router, AuthStore Provider, ToastContainer)
├── main.tsx                          ← Entry point, bootstrap DI container
└── index.css                         ← Reset CSS + global token
```

---

## 4. Penjelasan Setiap Layer Secara Detail

### 4.1 DOMAIN LAYER — Hati dari Aplikasi (TIDAK BOLEH BERUBAH)
**Tanggung jawab:** Definisikan *APA* data bisnis itu sendiri dan *APA* operasi yang bisa dilakukan, TANPA menjelaskan *BAGAIMANA* cara melakukannya.

**Contoh `domain/repositories/AuthRepository.ts`:**
```ts
// TIDAK ADA IMPORT LUAR. HANYA INTERFACE PURE.
import type { Anggota } from '../entities/Anggota';
import type { OtpSession } from '../entities/OtpSession';

export interface SendOtpRequest { nik: string; }
export interface SendOtpResponse { sessionId: string; nikMasked: string; noHpMasked: string; }
export interface VerifyOtpRequest { sessionId: string; otpCode: string; }
export interface VerifyOtpResponse { anggota: Anggota; accessToken: string; }

export interface AuthRepository {
  sendOtp(req: SendOtpRequest): Promise<SendOtpResponse>;
  verifyOtp(req: VerifyOtpRequest): Promise<VerifyOtpResponse>;
  resendOtp(sessionId: string): Promise<SendOtpResponse>;
  logout(): Promise<void>;
}
```

**Mengapa pure interface?**
Kalau nanti ganti dari Mock → REST API → Supabase → gRPC — file ini TIDAK PERNAH diubah. Yang berubah hanya file di `infrastructure/`.

---

### 4.2 APPLICATION LAYER — Otak Bisnis Logic
**Tanggung jawab:** Koordinasi alur bisnis, validasi aturan bisnis, dan menjaga konsistensi state global.

**Contoh `application/use-cases/auth/SendOtpUseCase.ts` (SATU KELAS = SATU TUGAS = SRP):**
```ts
// HANYA import dari DOMAIN. DILARANG import React / UI / axios.
import type { AuthRepository, SendOtpRequest } from '@/domain/repositories/AuthRepository';
import { validateNik } from '@/presentation/utils/validators/validateNik';

export class SendOtpUseCase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(req: SendOtpRequest) {
    // VALIDASI BISNIS DI LAYER INI, BUKAN DI UI / KOMPONEN
    const nikError = validateNik(req.nik);
    if (nikError) {
      throw new ApplicationError(nikError, ErrorCode.INVALID_NIK);
    }
    return this.authRepo.sendOtp(req);
  }
}
```

**Contoh Store `application/stores/AuthStore.ts` (Zustand):**
```ts
// Store hanya memegang state + action. Tidak panggil API langsung.
import type { Anggota } from '@/domain/entities/Anggota';

interface AuthState {
  isAuthenticated: boolean;
  currentAnggota: Anggota | null;
  activeOtpSessionId: string | null;
  lastNikMasked: string | null;
  setAuthenticated: (anggota: Anggota) => void;
  setOtpSession: (sessionId: string, nikMasked: string) => void;
  clear: () => void;
}
```

---

### 4.3 INFRASTRUCTURE LAYER — Tukang Kerja Teknis
**Tanggung jawab:** Implementasi repository interface dari Domain dengan teknologi konkret (Fetch/Axios, Mock data, localStorage). MUDAH DIGANTI.

**Contoh `infrastructure/repositories/mock/MockAuthRepository.ts`:**
```ts
import type {
  AuthRepository,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/domain/repositories/AuthRepository';
import { mockAnggotaList } from '@/infrastructure/mock-data/mockAnggota';

export class MockAuthRepository implements AuthRepository {
  async sendOtp(req: SendOtpRequest): Promise<SendOtpResponse> {
    // Simulasi delay jaringan 600ms
    await new Promise(r => setTimeout(r, 600));
    const anggota = mockAnggotaList.find(a => a.nikHash === hashNikMock(req.nik));
    if (!anggota) throw new NotFoundError('NIK tidak terdaftar sebagai anggota KDKMP');
    if (!anggota.isAktif) throw new ForbiddenError('Status anggota tidak aktif');
    return {
      sessionId: crypto.randomUUID(),
      nikMasked: anggota.nikMasked,
      noHpMasked: anggota.noHpMasked,
    };
  }
  // ... verifyOtp, resendOtp, logout
}
```

**Cara ganti ke real backend?**
1. Buat `HttpAuthRepository` di `infrastructure/repositories/http/`
2. Ubah 1 baris di `application/di/container.ts`: `AuthRepo → new HttpAuthRepository()`
3. SELESAI. Semua use case / UI TIDAK perlu diubah SATUPUN baris. Ini namanya **Open/Closed Principle**.

---

### 4.4 PRESENTATION LAYER — Murni Visual & User Interaksi
**Aturan Emas Komponen:**
| Tipe Komponen | Boleh Apa? | DILARANG KERAS |
|---|---|---|
| **UI / Atoms** (`Button.tsx`) | Render DOM, handling click, loading state | Panggil API, akses store, akses router, import use case |
| **Molecules / Organisms** (`VoteSection.tsx`) | Panggil Application Hooks (`useSubmitVote`), render layout | Import axios / repository, implementasi bisnis logic sendiri |
| **Pages** (`LoginNikPage.tsx`) | Compose components + pass props | Tulis logic bisnis panjang di dalam page body |

**Contoh Presentational benar (`presentation/components/ui/Button.tsx`):**
```tsx
// TIDAK ADA KETERGANTUNGAN BISNIS. Murni visual reusable.
type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'md' | 'sm';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
```
**Contoh Page benar (`LoginNikPage.tsx`):**
```tsx
export function LoginNikPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { sendOtp, isLoading } = useSendOtp(); // DARI APPLICATION HOOKS

  const onSubmit = async (data: { nik: string }) => {
    try {
      const res = await sendOtp(data.nik);
      toast.success(`OTP dikirim ke ${res.noHpMasked}`);
      navigate(ROUTE_PATHS.OTP);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal kirim OTP');
    }
  };

  return (
    <AppLayout>
      <AuthHeader />
      <NikInputForm onSubmit={onSubmit} submitLoading={isLoading} />
    </AppLayout>
  );
}
```

---

## 5. Dependency Injection (DI) Container

Semua use case dan repository didaftarkan di satu file pusat. Ini memudahkan unit test (ganti repository dengan mock fake di level test).

**`application/di/container.ts`:**
```ts
import { MockAuthRepository } from '@/infrastructure/repositories/mock/MockAuthRepository';
import { MockProfileRepository } from '@/infrastructure/repositories/mock/MockProfileRepository';
// ... semua repo

import { SendOtpUseCase } from '@/application/use-cases/auth/SendOtpUseCase';
// ... semua use case

// --- REPOSITORIES ---
const AuthRepo = new MockAuthRepository();          // Ganti baris ini ke HttpAuthRepository nanti
const ProfileRepo = new MockProfileRepository();
// ...

// --- USE CASES ---
export const di = {
  useCases: {
    auth: {
      sendOtp: new SendOtpUseCase(AuthRepo),
      verifyOtp: new VerifyOtpUseCase(AuthRepo),
      // ...
    },
    // ...
  },
  repositories: {
    auth: AuthRepo,
    profile: ProfileRepo,
  },
} as const;
```

---

## 6. Design Patterns yang Wajib Diterapkan

| Pattern | Digunakan Dimana? | Manfaat |
|---|---|---|
| **Repository Pattern** | `domain/repositories/*` + `infrastructure/repositories/*` | Ganti data source tanpa ubah bisnis |
| **UseCase / Interactor** | `application/use-cases/*` — satu kelas satu aksi | Single Responsibility, mudah unit test |
| **Dependency Injection** | `application/di/container.ts` | Loose coupling, mudah ganti impl test/prod |
| **Facade Pattern** | Application Hooks (useSendOtp, useVerifyOtp) | Sederhanakan UI — 1 hook wrap loading + error + call use case |
| **Observer Pattern** | Zustand stores | UI reactive tanpa prop drilling berantai |
| **Value Object** (opsional) | `domain/value-objects/Nik.ts` | Validasi NIK encapsulated, reusable di seluruh app |
| **Strategy Pattern** (opsional) | Resend OTP berbeda rate limit strategy | Ganti strategi tanpa ubah use case |

---

## 7. Strategi Reusability & Maintainability

### 7.1 Komponen UI = SEPENUHNYA REUSABLE
- Setiap file di `presentation/components/ui/` TIDAK BOLEH import SELAIN: `react`, `lucide-react`, `clsx/tailwind-merge`, `presentation/theme/*`
- Tidak ada satu nama bisnis ("KDKMP", "NIK", "OTP", "SHU") yang hardcoded di komponen UI. Lewatkan sebagai props.
- Test komponen UI secara terpisah di Storybook (jika nanti butuh) tanpa perlu mock data bisnis.

### 7.2 Magic Strings = DIHAPUS SEMUA
- Semua route paths di `routePaths.ts` (enum / const object)
- Semua error message di `presentation/utils/constants/messages.ts`
- Semua localStorage keys di `infrastructure/storage/storageKeys.ts` (contoh: `AUTH_TOKEN = 'kdkmp.auth.token.v1'` dengan versi)

### 7.3 Error Handling Berjenjang
```
Infrastructure → throw Error asli (HTTP 401 / 404 / 500)
  ↓ catch
Application UseCase → translate ke ApplicationError bertipe (INVALID_NIK / OTP_EXPIRED / ALREADY_VOTED)
  ↓ catch
Application Hook → return { error } state ke UI
  ↓
Presentation Page → terima error → panggil toast.error(message terjemahan user-friendly Indonesia)
```
**Presentation TIDAK PERNAH lihat error 500 Internal Server Error mentah.** Semua error sudah diterjemahkan ke Bahasa Indonesia yang bisa dimengerti user 18-45 tahun.

### 7.4 Konvensi File = 1 Tanggung Jawab = 1 File
- Jangan campur 2 use case di 1 file
- Jangan campur 2 entity di 1 file types
- Jangan campur UI button dengan logic submit voting di 1 komponen
- Jika file > 200 baris → **WAJIB refactor pecah** (kecuali file generated / mock data yang jelas)

---

## 8. Strategi Testing (Unit / Integration / E2E)

| Layer | Test Apa? | Tools |
|---|---|---|
| **Domain** | Test value objects & validators (pure fn) | Vitest (tanpa jsdom, cepet) |
| **Application** | Unit test tiap Use Case (inject fake repository mock) | Vitest |
| **Application Hooks** | Integration test hooks dengan zustand store | Vitest + @testing-library/react-hooks |
| **Presentation UI** | Unit test Button / Input / OtpInput | Vitest + React Testing Library |
| **Presentation Pages** | Flow Login → OTP → Dashboard (mock use case) | Playwright / RTL |
| **E2E Full Flow** | Onboarding → Login Nik 3578010000000009 → OTP 123456 → Vote Setuju → Success | Playwright |

---

## 9. Sustainability & Scale Jangka Panjang

1. **Versi API Storage & DTOs**: Setiap localStorage key, interface DTO, kasih suffix v1. Kalau breaking change → buat v2 + migration script, jangan overwrite v1. User yang cache versi lama TIDAK kehilangan data.
2. **Code Splitting per Route**: React Router + lazy import per page. User di onboarding TIDAK download bundle voting & PNL sekaligus.
3. **Bundle Analyzer**: Sebelum release, jalankan `bunx vite-bundle-analyzer` — hapus dependensi berat (contoh: tidak usah import semua icon lucide, import yang dipakai saja).
4. **Pre-commit Hooks**: Husky + lint-staged = setiap commit auto format + typecheck. Jangan biarkan code broken masuk main.
5. **Changelog Otomatis**: Conventional commits (feat/fix/chore) + `bunx changelogen`. Setiap release punya catatan riwayat jelas (bahasa awam sesuai user_profile).
6. **Feature Flags**: Untuk fitur PNL Tahunan grafik, bungkus dengan feature flag sederhana. Kalau bug live, matikan flag tanpa deploy rollback penuh.

---

## 10. Ringkasan Aturan Dependency (Checker Checklist Reviewer)

Setiap PR / file baru, reviewer cek:
- [ ] `domain/**/*.ts` → IMPORT LUAR SELAIN SESAMA `domain/**/*` → ❌ REJECT
- [ ] `application/use-cases/**` → IMPORT `react`, `components`, `axios` → ❌ REJECT
- [ ] `presentation/components/ui/**` → IMPORT `domain`, `application` → ❌ REJECT
- [ ] `presentation/pages/**` → IMPORT langsung `axios` / `repository` → ❌ REJECT (harus lewat Application Hooks)
- [ ] Semua data fetch / bisnis logic dijalankan di Use Case / Application Hook — BUKAN di body komponen / event handler inline → ❌ REJECT
