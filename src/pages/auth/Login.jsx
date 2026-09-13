import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

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

    if (!formData.email.trim()) return setError("Email wajib diisi.");
    if (!formData.password) return setError("Kata sandi wajib diisi.");

    setLoading(true);

    try {
      const { data, error: authError } = await login(formData.email, formData.password);

      if (authError) throw authError;
      if (!data?.user) throw new Error("Login gagal. Coba lagi.");

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
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
    <div className="flex h-screen max-h-screen w-full overflow-hidden font-sans text-ink">
      {/* ── PANEL KIRI: FOTO ── */}
      <div className="relative hidden flex-1 overflow-hidden bg-teal-900 md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-teal-900/35" />
      </div>

      {/* ── PANEL KANAN: FORM ── */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-surface p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-125">
          <Link
            to="/"
            className="mb-10 inline-block font-display text-2xl font-extrabold tracking-tight text-teal-900"
          >
            <span className="text-amber-500">UMK</span>Now
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-teal-900 sm:text-3xl">
              Masuk ke Toko
            </h1>
            <p className="mt-2 text-sm text-muted">
              Masukkan email dan kata sandi akun tokomu.
            </p>
          </div>

          {successMessage && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className="text-sm font-semibold text-ink">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                className="h-12 w-full rounded-lg border border-[#d8e2e2] px-4 text-base text-ink transition-colors focus:border-teal-600 focus:outline-none focus:ring-3 focus:ring-teal-600/15"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-sm font-semibold text-ink">
                  Kata Sandi
                </label>
                <Link to="/not-found" className="text-xs font-medium text-teal-600 hover:underline">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative flex items-center">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="h-12 w-full rounded-lg border border-[#d8e2e2] pl-4 pr-12 text-base text-ink transition-colors focus:border-teal-600 focus:outline-none focus:ring-3 focus:ring-teal-600/15"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 p-1 text-muted transition-colors hover:text-ink"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-amber-500 font-display font-bold text-ink transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              id="btn-login"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted">
            Belum punya akun?{" "}
            <Link to="/register" className="ml-1 font-bold text-teal-600 hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}