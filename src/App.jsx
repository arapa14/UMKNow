import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/dashboard-layout/Layout";

// Pages
import Testing from "./pages/Testing";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/error/NotFound";
import POS from "./pages/Pos";
import Inventory from "./pages/Inventory";
import Catalog from "./pages/Catalog";
import Bookkeeping from "./pages/Bookkeeping";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      {/* ============ PUBLIC ROUTES ============ */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ============ TESTING ROUTE (untuk dev) ============ */}
      <Route path="/testing" element={<Testing />} />

      {/* ============ PROTECTED ROUTES ============ */}
      {/* ProtectedRoute cek auth dulu -> Layout render Sidebar+Navbar sekali
          -> halaman spesifik muncul di <Outlet /> dalam Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/bookkeeping" element={<Bookkeeping />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* ============ 404 ============ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}