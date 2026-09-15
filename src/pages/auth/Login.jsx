import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import AuthPhotoPanel from "../../components/auth/AuthPhotoPanel";

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
      {/* ── FORM (hijau) ── */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[linear-gradient(160deg,#073b3f_0%,#0b5d61_100%)] p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-125">
          <Link
            to="/"
            className="mb-10 inline-block font-display text-2xl font-extrabold tracking-tight text-white"
          >
            <span className="text-amber-500">UMK</span>Now
          </Link>

          <h1 className="mb-12 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Selamat Datang
          </h1>

          {successMessage && (
            <div className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className="text-sm font-semibold text-white">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail size={18} strokeWidth={1.75} className="pointer-events-none absolute left-4 text-muted" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="h-12 w-full rounded-lg border border-white/10 bg-white pl-11 pr-4 text-base text-ink transition-all focus:border-[#2dd4bf] focus:outline-none focus:ring-3 focus:ring-[#2dd4bf]/25"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-sm font-semibold text-white">
                  Kata Sandi
                </label>
                <Link to="/not-found" className="text-xs font-medium text-amber-400 hover:underline">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock size={18} strokeWidth={1.75} className="pointer-events-none absolute left-4 text-muted" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="h-12 w-full rounded-lg border border-white/10 bg-white pl-11 pr-12 text-base text-ink transition-all focus:border-[#2dd4bf] focus:outline-none focus:ring-3 focus:ring-[#2dd4bf]/25"
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
                  {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
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

          <div className="mt-8 text-center text-sm text-white/70">
            Belum punya akun?{" "}
            <Link to="/register" className="ml-1 font-bold text-amber-400 hover:underline">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOTO ── */}
      <AuthPhotoPanel imageUrl="https://images.pexels.com/photos/37234075/pexels-photo-37234075.jpeg?auto=compress&cs=tinysrgb&w=1920" />
    </div>
  );
}