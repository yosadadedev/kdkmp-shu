# PRD - Sistem Sisa Hasil Usaha (SHU) Koperasi KDKMP Kasihan Bantul
Versi: 1.0
Tanggal: 2026-08-18
Status: Draft

---

## 1. Ringkasan Eksekutif

Sistem ini dirancang untuk memudahkan anggota Koperasi KDKMP Kasihan Bantul dalam mengelola proses voting pembagian Sisa Hasil Usaha (SHU), melihat data profil anggota (PNL bulanan/tahunan, dan melakukan voting secara aman melalui autentikasi NIK + OTP tanpa perlu pembuatan akun terlebih dahulu.
Target pengguna: anggota koperasi usia 18-45 tahun, dengan kebutuhan UI/UX yang sederhana dan mudah dipahami.

---

## 2. Tujuan Produk

- Memberikan akses informasi transparan kepada anggota terkait SHU koperasi
- Mempermudah proses voting persetujuan pembagian SHU
- Menjamin keamanan suara dengan autentikasi NIK + OTP SMS
- Memberikan data profil anggota dan laporan PNL yang lengkap

---

## 3. Persona Pengguna

| Field | Deskripsi |
|---|---|
| Rentang usia | 18 - 45 tahun |
| Latar belakang | Anggota koperasi (Ibu Wati dll) |
| Kemampuan teknis | Dasar - menengah (pengguna awam aplikasi mobile) |
| Kebutuhan utama | Lihat SHU, vote setuju/tidak setuju, lihat profil dan PNL |
| Pain point | Takut ribet buat akun, butuh informasi jelas dan cepat |

---

## 4. Fitur Utama (MVP)

### 4.1 Onboarding (3 Slides)
- Slide 1: Selamat Datang di KDKMP (gambar logo, tagline koperasi)
- Slide 2: Transparansi SHU & Voting Aman (NIK + OTP, tanpa buat akun)
- Slide 3: Lihat Profil & PNL Lengkap (data PNL bulanan/tahunan)
- Tombol: **Mulai Sekarang**

### 4.2 Login NIK
- Header: Logo KDKMP + Nama Koperasi
- Judul: "Verifikasi identitas Anda"
- Subjudul: "Masukkan NIK untuk menerima kode OTP lewat SMS. Tidak perlu membuat akun."
- Input: NIK (16 digit, hanya angka)
- Validasi:
  - Harus 16 digit angka
  - NIK harus terdaftar di database anggota
  - Jika tidak terdaftar: toast error "NIK tidak terdaftar sebagai anggota koperasi"
- Tombol: **Kirim OTP** (warna merah solid)
- Loading state: Saat kirim OTP

### 4.3 Masukkan OTP
- Judul: "Masukkan kode OTP"
- Subjudul: "Kode telah dikirim ke nomor terdaftar untuk NIK *******3821." (masking 12 digit awal)
- Input: 6 digit OTP (input terpisah per digit, auto-focus)
- Fitur Kirim Ulang Kode:
  - Cooldown 3 menit (tampilkan countdown)
  - Setelah 3 menit, link aktif kembali
  - Maksimal 3x resend per NIK
- Tombol: **Verifikasi**
- Validasi:
  - OTP expired setelah 5 menit
  - Salah OTP: maks 5x percobaan → blokir 15 menit

### 4.4 Halaman Utama (Dashboard)
Komponen (berurutan dari atas ke bawah:

#### 4.4.1 Header Profil Singkat
- Salam: "Halo, [Nama Anggota]"
- Sub: "KDKMP [Nama Unit]"

#### 4.4.2 Card SHU (Fokus Utama)
- Label: "SHU yang akan dibagikan tahun ini"
- Nominal: **Rp 43.500.000** (format Rupiah, besar, bold)
- Source: Data dari laporan tahunan

#### 4.4.3 Section Voting
- Pertanyaan: "Apakah Anda setuju SHU dibagikan tahun ini?"
- 2 Pilihan (radio button style pill):
  - **Setuju** (border merah, merah tebal jika dipilih)
  - **Tidak setuju** (border abu, biasa jika tidak dipilih)
- Disclaimer: "Suara Anda rahasia — sistem hanya mencatat bahwa NIK ini sudah memilih, bukan pilihan yang terhubung ke identitas pada laporan publik."
- Setelah vote: tampil sukses screen "Suara Anda sudah tercatat" + pilihan
- Rule: 1 NIK = 1 suara per sesi voting (tidak bisa vote ulang di tahun yang sama)

#### 4.4.4 Card Informasi Detail
Judul: **Informasi Detail**
Kolom 2 sisi kiri-kanan:
| Kiri | Kanan |
|---|---|
| KDKMP: KDKMP Genteng | Provinsi: Jawa Timur |
| NIK: 3578010000000009 | Kab/Kota: Kota Surabaya |
| (arrow left/right navigasi antar unit jika ada) | |

#### 4.4.5 Section PNL (Bulanan / Tahunan)
- Tab Toggle: **Bulanan** | **Tahunan**
- Bulanan: List card per bulan (Jan - Des) dengan total PNL
- Tahunan: Total tahun berjalan + grafik mini
- Format angka Rupiah, visual warna merah/putih

### 4.5 Success Screen Voting
- Icon centang hijau besar
- Judul: "Suara Anda sudah tercatat"
- Sub: "Pilihan: Setuju / Tidak Setuju"
- Paragraf: "Satu NIK hanya dapat memberikan satu suara per sesi. Terima kasih atas partisipasi Anda."
- Tombol Kembali ke Dashboard

---

## 5. Alur Pengguna (User Flow)

```
Onboarding (3 slides)
  ↓ klik "Mulai Sekarang"
Login NIK (input 16 digit NIK)
  ↓ klik "Kirim OTP"
  ↓ validasi NIK terdaftar
  ↓ kirim SMS OTP ke nomor anggota
Masukkan OTP (6 digit + countdown resend 3 menit)
  ↓ klik "Verifikasi"
  ↓ validasi OTP benar
Dashboard Utama
  ├─ Lihat SHU tahun ini
  ├─ Vote Setuju / Tidak Setuju
  │   ↓ submit vote
  │   Success Screen Voting
  │   ↓ kembali
  ├─ Lihat Informasi Detail Profil
  └─ Lihat PNL Bulanan / Tahunan
```

---

## 6. Desain UI/UX

### 6.1 Palet Warna (Brand Merah Putih Koperasi)
| Nama | Hex | Penggunaan |
|---|---|---|
| Merah Utama (Primary) | `#C8102E` atau `#D32F2F` | Tombol CTA, border aktif, teks link |
| Merah Muda (Light Red) | `#FFEBEE` | Hover state, background aktif |
| Putih Background | `#FAFAFA` / `#FFFFFF` | Background utama, card |
| Teks Hitam | `#212121` | Judul, teks utama |
| Teks Abu | `#757575` | Subjudul, label, placeholder |
| Border Abu | `#E0E0E0` | Garis pemisah, border input |
| Hijau Sukses | `#4CAF50` | Icon centang, success state |
| Biru Link | `#1976D2` | Border input OTP aktif |

### 6.2 Typography
- Judul Besar: `24px - 28px, Bold
- Subjudul: `14px - 16px, Regular (abu)
- Label Input: `14px`, Semibold
- Isi: `14px`, Regular
- Nominal Rupiah: `32px - 36px`, Extra Bold

### 6.3 Spacing & Layout (Mobile First)
- Max container: 390px (mobile) / 480px (tablet kecil)
- Padding horizontal: `16px - 24px`
- Padding vertikal section: `24px`
- Radius card/button: `12px - 16px`
- Tinggi tombol CTA: min `48px`
- Rapat (compact), hindari whitespace berlebih

### 6.4 Prinsip UX untuk Pengguna Awam
1. **Satu aksi per screen** - tidak terlalu banyak pilihan sekaligus
2. **Feedback jelas** - loading, toast error/sukses berwarna
3. **Bahasa sederhana** - istilah koperasi dijelaskan singkat
4. **Tombol besar** - mudah ditekan jari
5. **Validasi real-time** - input NIK/OTP cek saat mengetik

---

## 7. Non Functional Requirements

### 7.1 Keamanan
- OTP expired dalam 5 menit
- Enkripsi NIK di database (hash + salt)
- Suara vote disimpan tanpa hubungan langsung dengan NIK (anonimisasi laporan publik)
- Rate limiting: 5x salah OTP → blokir 15 menit
- Rate limiting SMS: maks 3x resend per NIK per jam

### 7.2 Performa
- Load screen < 2 detik (3G)
- Optimasi gambar mobile
- Lazy load data PNL

### 7.3 Kompatibilitas
- Mobile first: iOS 13+, Android 8+
- Browser: Chrome, Safari, Firefox versi 2 tahun terakhir
- Viewport 320px - 480px (target utama)

---

## 8. Integrasi Eksternal (MVP Future)
- SMS Gateway untuk kirim OTP
- Database anggota koperasi (import CSV / API)
- Export laporan voting & SHU (PDF/Excel)

---

## 9. KPI Sukses
- Voting completion rate > 80% anggota
- Waktu rata-rata vote < 2 menit dari buka app
- Error rate OTP < 5%
- CSAT > 4.2/5
