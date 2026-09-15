import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "../../hooks/useAuth";

export default function Layout() {
  const { logout, user, currentStore } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          storeName={currentStore?.name || "Belum ada toko"}
          userInitials={initials}
          onLogout={logout}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
