import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Settings, LogOut } from "lucide-react";

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
 * - `actions`  -> tombol aksi khusus tiap halaman (opsional).
 * - `onLogout` -> dipanggil waktu user klik "Keluar" di dropdown.
 * - `isSidebarCollapsed` -> untuk menyesuaikan padding kiri di mobile.
 */
export function Navbar({
  storeName = "Nama Usaha",
  userInitials = "NU",
  actions = null,
  onLogout,
  // isSidebarCollapsed dapat dipakai di masa depan untuk animasi padding
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  async function handleLogout() {
    await onLogout();
    navigate("/login", { replace: true });
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Tutup dropdown kalau user klik di luar area menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-3 border-b border-black/5 bg-white pl-16 pr-4 sm:gap-6 md:pl-6 md:pr-6 lg:pl-8 lg:pr-8">
      <h1 className="text-[15px] font-semibold text-stone-900 truncate mt-1 sm:mt-0">{title}</h1>

      <div className="flex items-center gap-4 shrink-0">
        {actions && (
          <div className="hidden items-center gap-3 sm:flex">{actions}</div>
        )}

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-stone-50 transition-colors duration-150"
          >
            <div className="hidden items-center gap-1.5 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-sm text-stone-600">{storeName}</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-stone-400 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
            {/* Avatar inisial */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0a3d3a] text-xs font-semibold text-white">
              {userInitials}
            </div>
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-lg ring-1 ring-black/5">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <Settings size={15} className="text-stone-400" />
                Pengaturan
              </button>
              <div className="my-1 border-t border-stone-100" />
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;