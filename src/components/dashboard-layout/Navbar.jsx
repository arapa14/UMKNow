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
 */
export function Navbar({
  storeName = "Nama Usaha",
  userInitials = "NU",
  actions = null,
  onLogout,
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
    <header className="flex h-16 w-full items-center justify-between gap-6 border-b border-black/5 bg-white px-8">
      <h1 className="text-[15px] font-semibold text-stone-900">{title}</h1>

      <div className="flex items-center gap-6">
        {actions && (
          <div className="hidden items-center gap-3 sm:flex">{actions}</div>
        )}

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-stone-50"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-stone-600">{storeName}</span>
            </div>
            <ChevronDown
              size={14}
              className={`text-stone-400 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0a3d3a] text-xs font-medium text-white">
              {userInitials}
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-lg border border-black/5 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-stone-600 hover:bg-stone-50"
              >
                <Settings size={16} className="text-stone-400" />
                Pengaturan
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
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