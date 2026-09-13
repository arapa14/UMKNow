// src/pages/POS.jsx
import { Sidebar } from "../components/dashboard-layout/Sidebar";
import { Navbar } from "../components/dashboard-layout/Navbar"; // ← ini yang kurang

export default function POS() {
  return (
    <div className="flex h-screen w-full bg-[#f7f5ef]">
      <Sidebar active="pos" onNavigate={(key) => console.log(key)} />

      <div className="flex flex-1 flex-col">
        <Navbar
          storeName="Toko Kelontong Berkah"
          userInitials="KB"
        />

        <main className="flex-1 overflow-auto p-8">
          {/* konten dashboard */}
        </main>
      </div>
    </div>
  );
}
