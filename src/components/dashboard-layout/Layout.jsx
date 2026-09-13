// src/components/dashboard-layout/Layout.jsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-[#f7f5ef]">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar storeName="Toko Kelontong Berkah" userInitials="KB" />
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}