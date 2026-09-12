import { Routes, Route } from "react-router-dom";

// Pages
import Testing from "./pages/Testing";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* ============ PUBLIC ROUTES ============ */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/not-found" element={<NotFound />} />

      {/* ============ TESTING ROUTE (untuk dev) ============ */}
      <Route path="/testing" element={<Testing />} />

      {/* ============ PROTECTED ROUTES (nanti) ============ */}
      {/* Nanti tinggal dibungkus <ProtectedRoute> + <AppLayout> */}
      {/* <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pos" element={<POS />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/bookkeeping" element={<Bookkeeping />} /> */}

      {/* ============ 404 ============ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
