import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Pesan sukses dari halaman register (kalau ada)
  const successMessage = location.state?.message;
  const prefillEmail = location.state?.email || "";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: prefillEmail,
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validasi dasar
    if (!formData.email.trim()) return setError("Email wajib diisi.");
    if (!formData.password) return setError("Kata sandi wajib diisi.");

    setLoading(true);

    try {
      // Panggil fungsi login dari AuthContext
      const { data, error: authError } = await login(
        formData.email,
        formData.password,
      );

      if (authError) throw authError;
      if (!data?.user) throw new Error("Login gagal. Coba lagi.");

      // Sukses → redirect ke dashboard
      // replace: true → tidak bisa "back" ke login setelah masuk
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      // Pesan error yang lebih ramah
      let message = err.message || "Terjadi kesalahan. Coba lagi.";
      if (message.toLowerCase().includes("invalid login")) {
        message = "Email atau kata sandi salah.";
      } else if (message.toLowerCase().includes("email not confirmed")) {
        message = "Email belum diverifikasi. Cek inbox email Anda.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-ink bg-surface">
      {/* ── PANEL KIRI: FOTO SUASANA TOKO ── */}
      <div className="relative hidden md:flex flex-1 flex-col justify-end p-12 lg:p-16 bg-teal-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/40 via-teal-900/80 to-teal-900/95" />

        <div className="relative z-10 max-w-[440px] text-white">
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Buka kasir,
            <br />
            mulai hari ini.
          </h2>
          <p className="text-base lg:text-lg text-white/80 leading-relaxed">
            Kelola transaksi dan pantau stok tokomu dalam satu tempat.
          </p>
        </div>
      </div>

      {/* ── PANEL KANAN: FORM LOGIN ── */}
      <div className="flex-1 md:flex-[1.15] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-surface overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Brand Mark */}
          <Link
            to="/"
            className="inline-block font-display text-2xl font-extrabold text-teal-900 tracking-tight mb-10"
            title="Kembali ke Beranda"
          >
            <span className="text-amber-500">UMK</span>Now
          </Link>

          {/* Headline Form */}
          <div className="mb-8">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-teal-900 mb-2">
              Masuk ke Toko
            </h1>
            <p className="text-sm text-muted">
              Masukkan email dan kata sandi akun tokomu.
            </p>
          </div>

          {/* Pesan sukses dari register */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              ✅ {successMessage}
            </div>
          )}

          {/* Pesan error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          {/* Form */}
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="login-email"
                className="text-sm font-semibold text-ink"
              >
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full h-12 px-4 text-base text-ink bg-white border border-[#d8e2e2] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-ink"
                >
                  Kata Sandi
                </label>
                <Link
                  to="/not-found"
                  className="text-xs font-medium text-teal-600 hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative flex items-center">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full h-12 pl-4 pr-12 text-base text-ink bg-white border border-[#d8e2e2] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 text-muted hover:text-ink transition-colors p-1"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"
                  }
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-ink font-display font-bold rounded-lg transition-all duration-150 active:scale-[0.99] mt-2 flex items-center justify-center cursor-pointer shadow-sm"
              id="btn-login"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-8 text-sm text-muted text-center">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-teal-600 font-bold hover:underline ml-1"
            >
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}