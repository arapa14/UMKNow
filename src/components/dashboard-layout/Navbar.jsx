import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

// Cocokkan tiap path route dengan judul halamannya.
// Tambahin baris baru di sini setiap kali ada halaman baru.
const PAGE_TITLES = {
  "/dashboard": "Ringkasan",
  "/pos": "Kasir / POS",
  "/inventory": "Produk & Stok",
  "/bookkeeping": "Laporan Keuangan",
  "/catalog": "Katalog Online",
  "/settings": "Pengaturan",
};

/**
 * Navbar generik yang dipakai di semua halaman dashboard.
 * - Judul halaman otomatis mengikuti URL aktif (lihat PAGE_TITLES di atas).
 * - `actions` -> tombol aksi khusus tiap halaman (opsional), dikirim dari
 *                masing-masing page lewat props, bukan di-hardcode di sini.
 */
export function Navbar({
  storeName = "Nama Usaha",
  userInitials = "NU",
  actions = null,
}) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex h-16 w-full items-center justify-between gap-6 border-b border-black/5 bg-white px-8">
      <h1 className="text-[15px] font-semibold text-stone-900">{title}</h1>

      <div className="flex items-center gap-6">
        {actions && (
          <div className="hidden items-center gap-3 sm:flex">{actions}</div>
        )}

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm text-stone-600">{storeName}</span>
          <ChevronDown size={14} className="text-stone-400" />
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a3d3a] text-xs font-medium text-white">
          {userInitials}
        </div>
      </div>
    </header>
  );
}

export default Navbar;