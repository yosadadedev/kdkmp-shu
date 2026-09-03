# Test Plan - Responsive & Cross-Version Compatibility (E2E)
Versi: 1.0
Tanggal: 2026-09-02
Status: Draft

---

## 1. Latar Belakang & Tujuan

Target pengguna Sistem SHU KDKMP (lihat [PRD.md](PRD.md)) adalah anggota koperasi usia 18-45 tahun dengan kemampuan teknis dasar-menengah. Populasi ini realistis memakai HP Android kelas menengah-bawah yang sudah berumur 3-6 tahun dan jarang di-update — artinya kombinasi **Android OS lama + Chrome lama** adalah kondisi nyata di lapangan, bukan edge case teoritis.

Tujuan test plan ini:
1. Memastikan seluruh alur voting (Gate → Onboarding → Login NIK → OTP → Dasar Hukum → Dashboard → Sukses Vote) tetap tampil & berfungsi benar di rentang Android 7-12 dan versi Chrome lama.
2. Menemukan regresi CSS/JS akibat fitur modern yang dipakai di codebase tapi belum tentu didukung browser lama.
3. Menyediakan matrix konkret (bukan asumsi) mengenai kombinasi Android version x Chrome version yang benar-benar bisa ditemui di perangkat nyata.

### Temuan risiko awal (dari audit codebase)

| Risiko | Lokasi | Dampak |
|---|---|---|
| Unit `dvh` (`min-h-dvh`) baru didukung Chrome 108+ (Des 2022) | [index.css:47](../src/index.css#L47), [AppErrorBoundary.tsx](../src/presentation/components/AppErrorBoundary.tsx), [ProtectedRoute.tsx](../src/presentation/components/ProtectedRoute.tsx) | Di Chrome <108, `min-height` **diabaikan total** (bukan fallback) → container bisa collapse/height 0, konten terpotong |
| `viewport-fit=cover` + `env(safe-area-inset-bottom)` | [index.html](../index.html), `spacing.safe` di [tailwind.config.js](../tailwind.config.js) | Perlu dicek di Android lama tanpa notch — pastikan tidak menyisakan gap aneh di bawah |
| `user-scalable=no`, `maximum-scale=1.0` | [index.html](../index.html) | Sebagian Chrome/Android versi tertentu punya perilaku beda soal ini; juga isu aksesibilitas (user tak bisa pinch-zoom) |
| `backdrop-blur-sm` (backdrop-filter) di [Toast.tsx](../src/presentation/components/ui/Toast.tsx) | Didukung sejak Chrome 76+, aman untuk rentang Android 7-12 asal Chrome tidak sangat jadul (<76) | Perlu fallback visual dicek jika blur tidak render |
| `gap` di flexbox (bukan grid) dipakai luas (`flex ... gap-2`, dll) | Banyak komponen UI (`Card`, `Button`, `Dialog`, `Tab`, dll) | Baru didukung Chrome 84+ (Sept 2020). Chrome <84 → elemen akan menempel tanpa spacing |

> Catatan: temuan di atas adalah *hipotesis berbasis compat-table*, bukan hasil observasi langsung di device. Statusnya harus diverifikasi lewat eksekusi test case di bawah, lalu dipindah ke bagian "Bug Log" bila terkonfirmasi.

---

## 2. Data Fragmentasi Android ↔ Chrome (per Sept 2026)

Chrome untuk Android **tidak selalu bisa update mengikuti OS** — Google menetapkan minimum OS requirement yang naik seiring waktu, dan begitu OS suatu device di bawah minimum, device tersebut berhenti menerima update Chrome selamanya (mentok di versi terakhir yang kompatibel). Ini penting karena artinya kita bisa menentukan **versi Chrome maksimum yang realistis** untuk tiap Android version, bukan asal tebak.

| Android Version | API Level | Status dukungan Chrome (per Sept 2026) | Chrome maksimum yang bisa didapat |
|---|---|---|---|
| 7 (Nougat) | 24-25 | EOL sejak **November 2023** | ~Chrome 119 (kalau device rutin update sebelum EOL) — **realistanya banyak device mentok jauh lebih rendah** (Chrome 80-100) karena user jarang update manual |
| 8 (Oreo) | 26-27 | EOL sejak **Chrome 138** (~pertengahan 2025) | Chrome 138 |
| 9 (Pie) | 28 | EOL sejak **Chrome 138** (~pertengahan 2025) | Chrome 138 |
| 10 (Q) | 29 | Masih didukung (minimum requirement Chrome saat ini) | Chrome versi stable terbaru |
| 11 | 30 | Masih didukung | Chrome versi stable terbaru |
| 12 / 12L | 31-32 | Masih didukung | Chrome versi stable terbaru |

Sources: [9to5Google - Chrome drops Android 8/9 support](https://9to5google.com/2025/06/26/google-chrome-android-versions-no-longer-supported-2025/), [Android Central - Chrome sunsetting updates](https://www.androidcentral.com/phones/some-older-android-phones-will-no-longer-get-chrome-updates), [caniuse - dvh/viewport-unit-variants](https://caniuse.com/viewport-unit-variants)

**Implikasi untuk test matrix**: untuk Android 7/8/9, jangan hanya test dengan "Chrome terbaru yang device itu bisa punya" — device di lapangan sangat mungkin lebih jadul lagi karena tidak pernah update Chrome secara manual. Selalu sediakan 2 skenario Chrome per Android lama: **"terbaru yang tersedia"** dan **"stale/jarang update"**.

---

## 3. Dimensi Test Matrix

Selain Android version & Chrome version, dimensi berikut wajib masuk kombinasi test:

1. **Viewport / resolusi & DPR** — breakpoint proyek: `sm 390px`, `md 768px`, `lg 1024px`, `xl 1280px` ([tailwind.config.js](../tailwind.config.js)). Device Android 7-9 sering beresolusi ganjil (WVGA 480x800, qHD 540x960, HD 720x1280) — CSS width tetap perlu dites presisi di 360px/375px/390px, bukan cuma breakpoint Tailwind.
2. **Orientasi** — portrait (utama) & landscape (terutama saat keyboard OTP muncul).
3. **Render engine** — Chrome App vs **Android System WebView** (link dibuka dari WhatsApp/Instagram/SMS sering pakai WebView, versinya bisa beda dari Chrome yang terinstal) vs **Samsung Internet** (default browser di banyak device Samsung Indonesia).
4. **Font scaling OS** — Setelan Aksesibilitas → Ukuran Font besar (umum dipakai user lansia/koperasi).
5. **Kondisi jaringan** — Fast 3G / slow 4G, karena device lama dipakai user yang sering di area sinyal lemah (relevan untuk OTP timeout & loading state).
6. **Virtual keyboard** — perilaku saat fokus ke input OTP/NIK, terutama font-size input <16px yang men-trigger auto-zoom di Chrome/Android lama.
7. **Dark/Light OS theme** — proyek pakai `darkMode: 'class'`, pastikan tidak auto-terpengaruh dark mode sistem yang tidak diinginkan.
8. **Real device vs emulator** — DevTools device emulation HANYA mensimulasikan viewport, TIDAK merepresentasikan bug engine Chrome lama yang sesungguhnya. Untuk klaim "Chrome versi X", wajib device cloud (BrowserStack/LambdaTest) atau device fisik.

---

## 4. Strategi Tooling (Hybrid)

| Layer | Tool | Cakupan | Otomasi? |
|---|---|---|---|
| **Layout regression di breakpoint** | Playwright + `page.setViewportSize` / device descriptors | Cek layout di sm/md/lg/xl breakpoint, dark/light, di Chromium versi terbaru yang di-bundle Playwright | Ya, jalan di CI |
| **Compat-bug spesifik (dvh, gap, backdrop-filter)** | Playwright, disable/override CSS feature secara manual untuk simulasi "versi lama" | Cek fallback behavior kalau fitur tsb tidak didukung | Ya, bisa disimulasikan tanpa browser asli |
| **Kombinasi Chrome version x Android version asli** | BrowserStack App Live / Automate (atau LambdaTest) | Verifikasi final di engine & device sungguhan sesuai matrix Section 5 | Manual (atau scripted via BrowserStack Automate + Playwright/Selenium capability jika tersedia di paket) |
| **WebView & Samsung Internet** | Device fisik atau BrowserStack real device | Buka via in-app browser WA/IG, dan Samsung Internet | Manual |

Playwright **tidak bisa** menjalankan Chrome versi historis asli di Android — bundled Chromium-nya selalu versi baru. Playwright dipakai untuk automasi regresi layout & simulasi kegagalan fitur CSS; verifikasi "benar-benar Chrome 90 di Android 7 fisik" tetap butuh device cloud/fisik.

---

## 5. Matrix Kombinasi (jalankan di BrowserStack/device fisik)

| # | Android | Chrome | Device contoh | Kategori | Prioritas |
|---|---|---|---|---|---|
| 1 | 7.0/7.1 | Terlama yang bisa didapat (±Chrome 80-90, stale) | Samsung J2 Prime / Xiaomi Redmi 4A | Worst-case realistis | P0 |
| 2 | 7.0/7.1 | ~119 (EOL terakhir, jika sempat update) | Samsung J7 Prime | Best-case Android 7 | P1 |
| 3 | 8.0/8.1 | Stale (±Chrome 90-110) | Xiaomi Redmi 5A / Samsung J4 | Realistis lapangan | P0 |
| 4 | 8.0/8.1 | 138 (EOL terakhir) | Samsung A6 | Best-case | P1 |
| 5 | 9 (Pie) | Stale (±Chrome 100-120) | Samsung A10 / Redmi Note 7 | Realistis lapangan | P0 |
| 6 | 9 (Pie) | 138 (EOL terakhir) | Samsung A20 | Best-case | P1 |
| 7 | 10 (Q) | Stable terbaru saat test | Samsung A30/A50, Redmi 8 | Masih dapat update | P1 |
| 8 | 11 | Stable terbaru saat test | Samsung A32, Redmi Note 10 | Masih dapat update | P2 |
| 9 | 12/12L | Stable terbaru saat test | Samsung A52, Pixel 6a | Masih dapat update | P2 |
| 10 | 9-10 | Chrome versi apapun di atas | Device apapun | **Android System WebView** (buka dari link WhatsApp) | P0 |
| 11 | 10-11 | Default browser | Samsung device apapun | **Samsung Internet** | P1 |

P0 = wajib lulus sebelum rilis. P1 = penting, jadwalkan sebelum rilis besar. P2 = nice-to-have / regresi berkala.

---

## 6. Skenario Test per Halaman/Alur

Alur aplikasi: `GatePage` → `OnboardingPage` → `NationalIdLoginPage` → `OtpVerificationPage` → `VotingLegalBasisPage` → `DashboardHomePage` → (vote) → `VoteSuccessPage`.

Setiap skenario di bawah dijalankan untuk **setiap baris** di matrix Section 5 (minimal semua yang berprioritas P0, lalu sampling P1/P2).

### 6.1 Global / Cross-Page
| ID | Skenario | Expected |
|---|---|---|
| GLB-01 | Buka aplikasi pertama kali, cek tinggi container penuh 1 layar (`min-h-dvh`) | Container mengisi tinggi viewport, tidak collapse/terpotong meski address bar Chrome muncul/hilang |
| GLB-02 | Rotasi ke landscape di tiap halaman | Layout tidak overflow horizontal, konten tetap bisa di-scroll vertikal |
| GLB-03 | Cek spacing antar elemen (button icon+text, form row, dialog action) | Spacing (`gap-*`) tampil dengan jarak yang benar, tidak menempel |
| GLB-04 | Toast notification muncul (submit form / error) | Toast terbaca jelas, backdrop-blur tampil atau fallback ke background solid tanpa mengganggu keterbacaan teks |
| GLB-05 | Buka via link dari WhatsApp (in-app WebView) | Alur identik dengan Chrome biasa, tidak ada elemen terpotong oleh WebView chrome/toolbar |
| GLB-06 | Set ukuran font Android ke "Terbesar" di Settings > Aksesibilitas | Teks tidak overflow/terpotong, tombol tetap bisa ditekan penuh |
| GLB-07 | Simulasikan network Slow 3G saat transisi antar halaman | Loading state/skeleton muncul, tidak ada layout shift ekstrem saat data masuk |
| GLB-08 | Bottom nav bar (jika aktif di halaman terkait) di layar sempit (360px) | Semua item nav termuat, tidak overflow/wrap |

### 6.2 GatePage & OnboardingPage
| ID | Skenario | Expected |
|---|---|---|
| ONB-01 | Swipe antar 3 slide onboarding di viewport 360px-430px | Transisi (`slide-in-*` animation) mulus, indicator dots akurat |
| ONB-02 | Tampilan gambar/logo onboarding di device resolusi rendah (480x800) | Gambar tidak pecah/blur berlebihan, tidak memaksa horizontal scroll |

### 6.3 NationalIdLoginPage (NIK)
| ID | Skenario | Expected |
|---|---|---|
| LOGIN-01 | Fokus ke input NIK di Chrome lama + Android lama | Keyboard numerik muncul, input **tidak auto-zoom** (verifikasi font-size input ≥16px efektif) |
| LOGIN-02 | Input NIK sambil keyboard terbuka, cek tombol submit | Tombol submit tetap terlihat/reachable (tidak tertutup keyboard) |
| LOGIN-03 | Error validasi NIK tampil di layar sempit | Pesan error tidak overflow, tidak mendorong layout row lain jadi berantakan |

### 6.4 OtpVerificationPage
| ID | Skenario | Expected |
|---|---|---|
| OTP-01 | 6 box OTP ([OtpInputBox.tsx](../src/presentation/components/ui/OtpInputBox.tsx)) di layar 360px | Semua box termuat sejajar dengan `gap` yang benar, tidak wrap ke baris baru |
| OTP-02 | Autofill OTP dari SMS (Android native autofill) di Android 7 vs Android 12 | Autofill terisi ke box yang benar di kedua versi (behavior WebOTP API berbeda per versi Android/Chrome) |
| OTP-03 | Countdown resend OTP (`countdown-pulse` animation) | Animasi tampil tanpa jank di device low-end |
| OTP-04 | Landscape + keyboard terbuka | Semua 6 box + tombol verifikasi tetap dapat diakses tanpa perlu scroll berlebihan |

### 6.5 VotingLegalBasisPage
| ID | Skenario | Expected |
|---|---|---|
| LEGAL-01 | Konten teks panjang (dasar hukum) discroll di layar kecil | Scroll halus, tombol lanjut (biasanya sticky) tetap terlihat |
| LEGAL-02 | Dialog konfirmasi ([Dialog.tsx](../src/presentation/components/ui/Dialog.tsx)) muncul di layar sempit | Dialog termuat penuh, grid 2 kolom action button (`sm:grid-cols-2`) tidak overflow di <390px |

### 6.6 DashboardHomePage
| ID | Skenario | Expected |
|---|---|---|
| DASH-01 | `ShuAllocationSection` (grid alokasi SHU) di viewport 360-430px | Grid 1 kolom tampil rapi, angka besar tidak overflow container |
| DASH-02 | Tab switch ([Tab.tsx](../src/presentation/components/ui/Tab.tsx)) antar 2 tab | Highlight tab aktif akurat, transisi tanpa flicker di Chrome lama |
| DASH-03 | `AlreadyVotedStatusCard` tampil setelah vote | Card + icon sejajar rapi via `gap`, tidak menempel di Chrome <84 |
| DASH-04 | StepIndicator (jika dipakai di flow ini) di layar sempit | Step items tidak overlap/terpotong |

### 6.7 VoteSuccessPage
| ID | Skenario | Expected |
|---|---|---|
| SUCCESS-01 | Halaman sukses tampil penuh 1 layar tanpa scroll di device pendek (WVGA 480x800) | Konten & CTA utama terlihat tanpa perlu scroll, `min-h-dvh` tidak menyebabkan collapse |
| SUCCESS-02 | Safe area bawah (`spacing.safe` / `env(safe-area-inset-bottom)`) di Android tanpa gesture nav | Tidak ada gap kosong berlebih di bawah tombol |

---

## 7. Kriteria Lulus & Pelaporan Bug

**Kriteria lulus per skenario**: tidak ada elemen terpotong/overflow horizontal, semua CTA utama reachable & tappable (target ≥44x44px), tidak ada layout shift yang menyembunyikan konten penting, teks tetap terbaca (kontras & tidak overflow).

**Template laporan bug** (isi tiap temuan sebagai baris baru di bagian "Bug Log" di bawah):

| Tanggal | Android | Chrome/Engine | Device | Halaman | ID Skenario | Deskripsi | Severity | Screenshot |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

Severity: **P0 blocker** (alur voting tidak bisa diselesaikan) / **P1 major** (tampilan rusak tapi alur masih bisa diselesaikan) / **P2 minor** (kosmetik).

---

## 8. Bug Log

_(diisi saat eksekusi test)_

| Tanggal | Android | Chrome/Engine | Device | Halaman | ID Skenario | Deskripsi | Severity | Screenshot |
|---|---|---|---|---|---|---|---|---|
