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
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-black/5 bg-white">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-sm font-semibold text-white">
          U
        </div>
        <span className="text-[15px] font-semibold text-stone-900">UMKNow</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                isActive
                  ? "bg-teal-50 font-medium text-teal-800"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  strokeWidth={2}
                  className={isActive ? "text-teal-700" : "text-stone-400"}
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