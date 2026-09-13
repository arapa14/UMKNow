# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# 🏪 UMKNow

> **"Dari Warung ke Digital, Tanpa Ribet."**

Platform all-in-one digitalisasi UMKM Indonesia — kelola transaksi, stok, katalog, dan pembukuan dalam satu dashboard. Cukup pakai HP, tanpa ribet.

[![SDGs](https://img.shields.io/badge/SDGs-9%20Industry%20%26%20Innovation-blue)](https://sdgs.un.org/goals/goal9)
[![Made with](https://img.shields.io/badge/Made%20with-React-61DAFB)](https://react.dev)
[![Powered by](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E)](https://supabase.com)

---

## 📖 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Struktur Folder](#-struktur-folder)
- [Instalasi](#-instalasi)
- [Environment Variables](#-environment-variables)
- [Cara Menjalankan](#-cara-menjalankan)
- [Skema Database](#-skema-database)
- [Pembagian Tugas Tim](#-pembagian-tugas-tim)
- [Roadmap](#-roadmap)
- [Tim](#-tim)

---

## 🎯 Tentang Project

**UMKNow** adalah platform digitalisasi UMKM yang dibangun untuk mendukung **SDGs 9 — Industry, Innovation, and Infrastructure**, khususnya pada subtema **Sustainable Innovation**.

### Masalah
> 64 juta UMKM di Indonesia masih dikelola secara manual — pencatatan transaksi pakai buku, stok tidak terpantau, dan sulit bersaing di era digital.

### Solusi
Platform **low-touch, chat-first** yang memungkinkan UMKM:
- Mulai digitalisasi hanya dengan HP sederhana
- Kelola banyak cabang dari satu dashboard
- Dapat insight otomatis untuk pengambilan keputusan

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔐 **Autentikasi** | Register & login dengan Supabase Auth |
| 🧾 **Kasir Pintar (POS)** | Input transaksi cepat, cetak & kirim struk otomatis |
| 📦 **Inventory Management (IMS)** | CRUD produk, kategori, dan auto-stock alert |
| 🌐 **Katalog Online** | Link toko otomatis, siap dibagikan via WhatsApp |
| 📖 **Pembukuan Otomatis** | Laporan laba-rugi harian tanpa akuntan |
| 🏢 **Multi-Store** | Kelola banyak cabang dari satu akun |
| 🤖 **AI Insight** | Prediksi stok & generate caption promosi |
| 💬 **WhatsApp Integration** | Notifikasi stok & laporan via WA |

---

## 🛠 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React + Vite + Tailwind CSS |
| **Routing** | React Router DOM v6 |
| **Backend & DB** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **AI** | Gemini API / OpenAI |
| **Bot** | WhatsApp Business API (Twilio/Fonnte) |
| **Deploy** | Vercel / Netlify |

---

## 📁 Struktur Folder

```text
umknow/
├── .env                          # Environment variables (JANGAN di-commit!)
├── .env.example                  # Template .env (ini yang di-commit)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── README.md                     # Dokumentasi project
│
└── src/
    ├── main.jsx                  # Entry point
    ├── App.jsx                   # Root component + routing
    ├── index.css                 # Global styles
    │
    ├── lib/                      # 🔧 Konfigurasi & utilities
    │   ├── supabase-client.js    # Supabase client instance
    │   └── constants.js          # Konstanta (routes, roles, dll)
    │
    ├── contexts/                 # 🌐 React Context (state global)
    │   ├── AuthContext.jsx       # Login/register/session
    │   └── StoreContext.jsx      # Store aktif yang dipilih
    │
    ├── hooks/                    # 🪝 Custom hooks
    │   ├── useAuth.js
    │   ├── useStores.js
    │   ├── useProducts.js
    │   ├── useTransactions.js
    │   └── useBookkeeping.js
    │
    ├── services/                 # 📡 API layer (semua query Supabase di sini)
    │   ├── authService.js
    │   ├── storeService.js
    │   ├── productService.js
    │   ├── transactionService.js
    │   └── bookkeepingService.js
    │
    ├── components/               # 🧩 Reusable UI components
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Card.jsx
    │   │   ├── Loading.jsx
    │   │   └── EmptyState.jsx
    │   ├── layout/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Footer.jsx
    │   │   └── StoreSwitcher.jsx
    │   └── features/             # Komponen spesifik fitur
    │       ├── pos/
    │       │   ├── ProductGrid.jsx
    │       │   ├── CartItem.jsx
    │       │   ├── PaymentModal.jsx
    │       │   └── ReceiptPreview.jsx
    │       ├── inventory/
    │       │   ├── ProductTable.jsx
    │       │   ├── ProductForm.jsx
    │       │   └── StockAlert.jsx
    │       └── catalog/
    │           ├── CatalogPreview.jsx
    │           └── CatalogItemForm.jsx
    │
    ├── pages/                    # 📄 Halaman per route
    │   ├── Landing.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── POS.jsx
    │   ├── Inventory.jsx
    │   ├── Catalog.jsx
    │   ├── Bookkeeping.jsx
    │   ├── Settings.jsx
    │   └── NotFound.jsx
    │
    ├── routes/                   # 🛣️ Routing
    │   ├── AppRoutes.jsx
    │   └── ProtectedRoute.jsx    # Guard untuk halaman login-only
    │
    └── utils/                    # 🛠️ Helper functions
        ├── formatCurrency.js     # Rp 1.000.000
        ├── formatDate.js         # 12 Sep 2026
        ├── invoiceGenerator.js   # INV-20260912-001
        └── receiptPrinter.js     # Print struk
```

---

## 🚀 Instalasi

### Prasyarat
- Node.js **v18+**
- npm / yarn / pnpm
- Akun [Supabase](https://supabase.com)

### Langkah

```bash
# 1. Clone repository
git clone https://github.com/username/umknow.git
cd umknow

# 2. Install dependencies
npm install

# 3. Copy file environment
cp .env.example .env

# 4. Isi .env dengan kredensial Supabase kamu (lihat bagian di bawah)

# 5. Jalankan dev server
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

---

## 🔐 Environment Variables

Buat file `.env` di root project dan isi:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Penting:**
> - Ambil nilai dari **Supabase Dashboard → Project Settings → API**
> - **Jangan pernah commit** file `.env` ke Git
> - Setelah mengubah `.env`, **restart dev server** agar terbaca

### Template `.env.example`

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 🏃 Cara Menjalankan

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan dev server (development) |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Jalankan ESLint |

---

## 🗄 Skema Database

### Konsep Relasi

UMKNow menggunakan model **one-to-one (1:1)** antara user dan toko:
- **1 user hanya punya 1 toko**
- **1 toko hanya dimiliki 1 user**

Ini dicapai dengan constraint `UNIQUE` pada `stores.owner_id`, sehingga tidak mungkin ada 2 toko dengan owner yang sama.

### Tabel Utama

| Tabel | Deskripsi | Relasi |
|-------|-----------|--------|
| `auth.users` | User auth bawaan Supabase (email, password) | Built-in |
| `users_tb` | Profil user (nama, email, phone) | 1:1 dengan `auth.users` |
| `stores` | Data UMKM (nama usaha, kategori, deskripsi) | **1:1** dengan `users_tb` |
| `store_categories` | Master kategori usaha | Referensi dropdown |
| `products` | Master produk per toko | Nanti (fase POS) |
| `transactions` | Header transaksi penjualan | Nanti (fase POS) |
| `transaction_items` | Detail item per transaksi | Nanti (fase POS) |
| `bookkeeping` | Laporan laba-rugi otomatis | Nanti (fase POS) |

### Detail Kolom

#### `users_tb` — Profil User

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | `BIGINT` | PK, Identity | Auto increment |
| `auth_user_id` | `UUID` | UNIQUE, FK → `auth.users(id)` | Link ke auth |
| `name` | `TEXT` | NOT NULL | Nama lengkap |
| `email` | `TEXT` | UNIQUE, NOT NULL | Email |
| `phone` | `TEXT` | — | Nomor WA/HP |
| `is_verified` | `BOOLEAN` | DEFAULT FALSE | Status verifikasi |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | Waktu daftar |

#### `stores` — Data UMKM

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | `BIGINT` | PK, Identity | Auto increment |
| `owner_id` | `BIGINT` | **UNIQUE**, FK → `users_tb(id)` | **Kunci relasi 1:1** |
| `name` | `TEXT` | NOT NULL | Nama usaha |
| `slug` | `TEXT` | UNIQUE | URL katalog |
| `category` | `TEXT` | — | Kategori (kuliner, dll) |
| `description` | `TEXT` | — | Deskripsi usaha |
| `address` | `TEXT` | — | Alamat |
| `phone` | `TEXT` | — | Nomor WA toko |
| `logo_url` | `TEXT` | — | Logo toko |
| `is_active` | `BOOLEAN` | DEFAULT TRUE | Status aktif |
| `created_at` | `TIMESTAMPTZ` | DEFAULT NOW() | — |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT NOW() | — |

#### `store_categories` — Master Kategori (Opsional)

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| `id` | `BIGINT` | PK, Identity | Auto increment |
| `value` | `TEXT` | UNIQUE, NOT NULL | `kuliner`, `retail` |
| `label` | `TEXT` | NOT NULL | `🍜 Kuliner` |

### Diagram Relasi

```text
┌──────────────────┐
│   auth.users     │  (Supabase built-in)
│   - id (UUID)    │
│   - email        │
└────────┬─────────┘
         │ 1:1 (trigger otomatis)
         ▼
┌──────────────────┐
│    users_tb      │
│   - id           │
│   - auth_user_id │
│   - name, email  │
│   - phone        │
└────────┬─────────┘
         │ 1:1 (owner_id UNIQUE)
         ▼
┌──────────────────┐
│     stores       │
│   - id           │
│   - owner_id     │ ← UNIQUE = kunci 1:1
│   - name, slug   │
│   - category     │
│   - description  │
└──────────────────┘

### Tabel Utama

| Tabel | Deskripsi |
|-------|-----------|
| `users_tb` | Data pengguna (auth + profil) |
| `organizations` | Entitas bisnis (pemilik toko) |
| `stores` | Cabang/outlet dari organisasi |
| `store_members` | Relasi many-to-many user ↔ store |
| `products` | Master produk |
| `categories` | Kategori produk |
| `transactions` | Header transaksi |
| `transaction_items` | Detail item per transaksi |
| `stock_movements` | Log perubahan stok |
| `bookkeeping` | Laporan laba-rugi otomatis |
| `catalogs` | Katalog online per store |

### Relasi Kunci

```text
users_tb (N) ── (M) stores         [via store_members]
organizations (1) ── (N) stores
stores (1) ── (N) products
transactions (1) ── (N) transaction_items
transactions (1) ── (1) bookkeeping   [auto-generate]
```

---

## 👥 Pembagian Tugas Tim

### 🧑‍💼 Dev 1 — Auth, Dashboard & Layout
- Setup project & Supabase client
- Auth flow (login/register/logout)
- Layout, routing, protected routes
- Landing page & Dashboard
- Store switcher (multi-cabang)

### 🧑‍💼 Dev 2 — POS & Inventory
- Halaman POS & komponen transaksi
- CRUD produk & kategori
- Stock management & auto-alert
- Print struk
- Service POS & produk

### 🧑‍💼 Dev 3 — Catalog, Bookkeeping & AI
- Katalog online
- Pembukuan & laporan laba-rugi
- Dashboard laporan (grafik)
- Integrasi AI (caption, insight)
- Dokumentasi & utility

---

## 🗺 Roadmap

### ✅ Fase 1 — MVP (Lomba)
- [x] Auth (login/register)
- [x] POS dasar + print struk
- [x] Inventory CRUD + stock alert
- [x] Katalog online
- [x] Pembukuan otomatis

### 🚧 Fase 2 — Setelah Lomba
- [ ] Multi-outlet penuh
- [ ] WhatsApp integration
- [ ] AI insight lanjutan
- [ ] Export PDF laporan
- [ ] Realtime notification

### 🔮 Fase 3 — Scale
- [ ] SaaS subscription
- [ ] Marketplace sync (Tokopedia, Shopee)
- [ ] API publik
- [ ] Mobile app (React Native)

---

## 📝 Aturan Kontribusi

1. **Branch naming:** `feature/nama-fitur`, `fix/nama-bug`
2. **Commit message:** `feat: tambah halaman POS` / `fix: perbaiki bug login`
3. **Pull request:** minimal 1 reviewer sebelum merge ke `dev`
4. **Jangan commit:** `.env`, `node_modules`, file build
5. **Selalu pull** sebelum mulai kerja

---

## 📸 Screenshot

| Landing | Dashboard | POS |
|---------|-----------|-----|
| _coming soon_ | _coming soon_ | _coming soon_ |

---

## 📄 Lisensi

Project ini dibuat untuk keperluan **lomba** dan bersifat open-source untuk pembelajaran.

---

## 👨‍👩‍👦 Tim

| Nama | Peran | Kontak |
|------|-------|--------|
| _Nama Dev 1_ | Auth & Dashboard | @username |
| _Nama Dev 2_ | POS & Inventory | @username |
| _Nama Dev 3_ | Catalog & Bookkeeping | @username |

---

<div align="center">

**UMKNow** — *Think Smart, Innovate Fast.* 🚀

Dibuat dengan ❤️ untuk UMKM Indonesia

</div>