# KDKMP SHU — Frontend

Aplikasi web anggota Koperasi KDKMP Kasihan Bantul untuk melihat transparansi Sisa Hasil Usaha (SHU), profil anggota, laporan PNL bulanan/tahunan, serta melakukan voting persetujuan pembagian SHU. Autentikasi memakai NIK + OTP tanpa perlu pembuatan akun.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — dev server & build tool
- [React Router](https://reactrouter.com/) — client-side routing
- [Zustand](https://zustand-demo.pmnd.rs/) — state management
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — form & validasi
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Bun](https://bun.sh/) — package manager

Arsitektur mengikuti **Clean Architecture** (domain → application → infrastructure → presentation). Detail lengkap ada di [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), spesifikasi produk di [docs/PRD.md](docs/PRD.md).

```
src/
├── domain/           # Entities, enums, repository interfaces (pure TypeScript, tanpa dependency luar)
├── application/       # Use cases, hooks aplikasi, Zustand stores, DI container
├── infrastructure/    # Implementasi repository (HTTP client, storage), error handling
└── presentation/      # Pages, components, layouts, router, hooks UI
```

## Prasyarat

- [Bun](https://bun.sh/) >= 1.x

## Setup

```bash
bun install
cp .env.example .env.local
```

Isi `.env.local` sesuai environment (lihat [Environment Variables](#environment-variables)).

## Menjalankan

```bash
bun run dev       # dev server, http://localhost:5173
bun run build     # type-check + build production ke dist/
bun run preview   # preview hasil build, http://localhost:4173
bun run lint      # oxlint
```

## Environment Variables

| Variable | Wajib | Default | Keterangan |
|---|---|---|---|
| `VITE_API_BASE_URL` | Ya | - | Base URL backend API (tanpa trailing slash) |
| `VITE_API_TIMEOUT_MS` | Tidak | `15000` | Timeout request API (ms) |

Semua variable berprefix `VITE_` di-inline ke bundle JS saat build — jangan taruh secret/credential di sini, nilainya bisa dilihat siapa pun lewat DevTools browser.

## Docker

Build & jalankan lewat Docker (multi-stage: build dengan Bun, serve statis dengan nginx + SPA fallback untuk React Router):

```bash
docker build --build-arg VITE_API_BASE_URL=https://your-api.example.com -t kdkmp-shu .
docker run -p 8080:80 kdkmp-shu
```

Buka `http://localhost:8080`.

## CI/CD

Pipeline GitLab CI ([.gitlab-ci.yml](.gitlab-ci.yml)) otomatis build & push image Docker ke GitLab Container Registry setiap push ke branch `main`. Perlu CI/CD variable `VITE_API_BASE_URL` (dan opsional `VITE_API_TIMEOUT_MS`) di-set lewat Settings → CI/CD → Variables.

## Struktur Dokumentasi

- [docs/PRD.md](docs/PRD.md) — Product Requirements Document
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Clean Architecture detail per layer
- [docs/ERD.md](docs/ERD.md) — Entity Relationship Diagram
- [docs/CODE_STANDARDS.md](docs/CODE_STANDARDS.md) — Konvensi kode
- [docs/TASKS.md](docs/TASKS.md) — Task breakdown
