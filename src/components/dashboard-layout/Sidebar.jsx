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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Ringkasan", icon: LayoutGrid },
  { path: "/pos", label: "POS", icon: ShoppingCart },
  { path: "/inventory", label: "Produk & Stok", icon: Package },
  { path: "/bookkeeping", label: "Laporan Keuangan", icon: FileBarChart2 },
  { path: "/catalog", label: "Katalog Online", icon: Globe },
  { path: "/settings", label: "Pengaturan", icon: Settings },
];

export function Sidebar({ isCollapsed, onToggleCollapse }) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  // Tutup drawer otomatis tiap kali pindah halaman (khusus mobile)
  useEffect(() => {
    setIsOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname]);

  return (
    <>
      {/* Tombol hamburger — hanya muncul di layar kecil */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a3d3a] text-white shadow-md lg:hidden"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      {/* Overlay gelap — hanya saat drawer mobile terbuka */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col bg-[#0a3d3a]",
          "transition-all duration-300 ease-in-out",
          // Mobile: slide-in drawer, lebar tetap 256px
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
          // Desktop: static, lebar berubah sesuai collapsed state
          isCollapsed
            ? "lg:static lg:z-auto lg:translate-x-0 lg:w-16"
            : "lg:static lg:z-auto lg:translate-x-0 lg:w-60",
        ].join(" ")}
      >
        {/* ── Area Logo ── */}
        <div
          className={`flex py-5 ${
            isCollapsed ? "lg:flex-col lg:items-center lg:gap-4 lg:px-0 px-6 items-center justify-between" : "items-center justify-between px-6"
          }`}
        >
          {/* Logo teks — disembunyikan saat collapsed di desktop */}
          <span
            className={`text-lg font-extrabold tracking-tight transition-all duration-300 ease-in-out ${
              isCollapsed ? "lg:hidden" : "block"
            }`}
          >
            <span className="text-white">UMK</span>
            <span className="text-amber-400">Now</span>
          </span>

          {/* Ikon kecil saat collapsed desktop */}
          <span
            className={`items-center justify-center rounded-lg bg-white/10 text-sm font-extrabold text-amber-400 h-8 w-8 transition-all duration-300 ease-in-out ${
              isCollapsed ? "lg:flex hidden" : "hidden"
            }`}
          >
            U
          </span>

          {/* Tombol tutup — hanya di mobile */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-teal-100/60 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>

          {/* Tombol collapse — hanya di desktop */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`hidden lg:flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-teal-100/50 hover:bg-white/10 hover:text-white transition-colors duration-150`}
            aria-label={isCollapsed ? "Perluas sidebar" : "Perkecil sidebar"}
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        {/* ── Divider tipis ── */}
        <div className="mx-3 mb-2 border-t border-white/10" />

        {/* ── Navigasi ── */}
        <nav className="flex flex-1 flex-col gap-0.5 px-2 pb-4">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <div key={path} className="relative group">
              <NavLink
                to={path}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg py-2.5 text-left text-sm transition-all duration-150",
                    isCollapsed ? "lg:justify-center lg:px-0 lg:border-l-0 px-3 border-l-2" : "px-3 border-l-2",
                    isActive
                      ? "border-amber-400 bg-white/10 font-medium text-white"
                      : "border-transparent text-teal-100/70 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className={`shrink-0 transition-colors duration-150 ${
                        isActive ? "text-amber-400" : "text-teal-100/50"
                      }`}
                    />
                    {/* Label — fade out saat collapsed di desktop */}
                    <span
                      className={`truncate transition-all duration-300 ease-in-out ${
                        isCollapsed ? "lg:hidden opacity-0 lg:opacity-0" : "opacity-100"
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>

              {/* Tooltip — hanya muncul saat collapsed di desktop */}
              {isCollapsed && (
                <div
                  className="pointer-events-none absolute left-full top-1/2 z-[60] ml-2.5 hidden -translate-y-1/2
                    rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg
                    opacity-0 group-hover:opacity-100 transition-opacity duration-150 lg:block whitespace-nowrap"
                >
                  {label}
                  {/* Arrow kiri */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;