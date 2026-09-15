import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  ShoppingCart,
  Package,
  FileBarChart2,
  Globe,
  Settings,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Ringkasan", icon: LayoutGrid },
  { path: "/pos", label: "POS", icon: ShoppingCart },
  { path: "/inventory", label: "Produk & Stok", icon: Package },
  { path: "/bookkeeping", label: "Laporan Keuangan", icon: FileBarChart2 },
  { path: "/catalog", label: "Katalog Online", icon: Globe },
  { path: "/settings", label: "Pengaturan", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  // Tutup drawer otomatis tiap kali pindah halaman (khusus mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Tombol hamburger, cuma muncul di layar kecil */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a3d3a] text-white shadow-md lg:hidden"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay gelap di belakang drawer, cuma muncul waktu drawer terbuka */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-64 shrink-0 flex-col bg-[#0a3d3a] transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:w-60 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-white">UMK</span>
            <span className="text-amber-400">Now</span>
          </span>

          {/* Tombol tutup, cuma muncul di layar kecil */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-teal-100/60 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? "border-amber-400 bg-white/10 font-medium text-white"
                    : "border-transparent text-teal-100/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className={isActive ? "text-amber-400" : "text-teal-100/50"}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;