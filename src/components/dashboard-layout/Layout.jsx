import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "../../hooks/useAuth";

export default function Layout() {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen w-full bg-[#f7f5ef]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar storeName="Nama Usaha" userInitials="NU" onLogout={logout} />
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



