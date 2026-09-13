import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ShoppingCart,
  Package,
  FileBarChart2,
  Globe,
  Settings,
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
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-[#0a3d3a]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="text-lg font-extrabold tracking-tight">
          <span className="text-white">UMK</span>
          <span className="text-amber-400">Now</span>
        </span>
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
  );
}

export default Sidebar;