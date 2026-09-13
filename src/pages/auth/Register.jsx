import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createStore } from "../../services/storeService";

const CATEGORIES = [
  { value: "kuliner", label: "🍜 Kuliner" },
  { value: "retail", label: "🏪 Retail / Toko Kelontong" },
  { value: "fashion", label: "👕 Fashion" },
  { value: "jasa", label: "💼 Jasa" },
  { value: "kerajinan", label: "🎨 Kerajinan" },
  { value: "pertanian", label: "🌾 Pertanian" },
  { value: "lainnya", label: "📦 Lainnya" },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // Data akun
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Data usaha
    storeName: "",
    storeCategory: "",
    storeDescription: "",
    // Persetujuan
    agreedToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validasi
    if (!formData.name.trim()) return setError("Nama lengkap wajib diisi.");
    if (!formData.email.trim()) return setError("Email wajib diisi.");
    if (formData.password.length < 6)
      return setError("Kata sandi minimal 6 karakter.");
    if (formData.password !== formData.confirmPassword)
      return setError("Konfirmasi kata sandi tidak cocok.");
    if (!formData.storeName.trim()) return setError("Nama usaha wajib diisi.");
    if (!formData.storeCategory)
      return setError("Pilih kategori usaha terlebih dahulu.");
    if (!formData.agreedToTerms)
      return setError("Anda harus menyetujui Syarat & Ketentuan.");

    setLoading(true);

    try {
      // 1. Register auth + users_tb (via trigger)
      const { data, error: authError } = await register(
        formData.email,
        formData.password,
        {
          name: formData.name,
          phone: formData.phone,
        },
      );

      if (authError) throw authError;
      if (!data.user) throw new Error("Registrasi gagal. Coba lagi.");

      // 2. Buat store untuk user ini
      //    (butuh user id dari users_tb — bisa via RPC atau select)
      const { error: storeError } = await createStore({
        ownerAuthId: data.user.id,
        name: formData.storeName,
        category: formData.storeCategory,
        description: formData.storeDescription,
        phone: formData.phone,
      });

      if (storeError) throw storeError;

      // 3. Sukses → redirect
      alert("Akun & toko berhasil dibuat! Silakan cek email untuk verifikasi.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen w-full font-sans text-ink bg-white overflow-hidden">
      {/* ── PANEL KIRI: FORM ── */}
      <div className="flex-1 md:flex-[1.25] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-white h-full overflow-y-auto">
        <div className="w-full max-w-[520px]">
          {/* Brand */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-block font-display text-2xl font-extrabold text-teal-900 tracking-tight"
            >
              <span className="text-amber-500">UMK</span>Now
            </Link>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-teal-900 mb-1.5">
              Mulai Digitalisasi Toko Anda
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Daftar dalam 1 menit. Langsung pakai kasir dan atur stok dari HP,
              tanpa biaya setup.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* === SECTION: DATA AKUN === */}
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
              Data Akun
            </div>

            {/* Nama + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="reg-name"
                name="name"
                label="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
              <Field
                id="reg-phone"
                name="phone"
                label="Nomor WhatsApp / HP"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>

            {/* Email */}
            <Field
              id="reg-email"
              name="email"
              label="Email Aktif"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

            {/* Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordField
                id="reg-password"
                name="password"
                label="Kata Sandi"
                value={formData.password}
                onChange={handleChange}
                show={showPassword}
                onToggle={() => setShowPassword((p) => !p)}
                autoComplete="new-password"
              />
              <PasswordField
                id="reg-confirm-password"
                name="confirmPassword"
                label="Konfirmasi Kata Sandi"
                value={formData.confirmPassword}
                onChange={handleChange}
                show={showPassword}
                onToggle={() => setShowPassword((p) => !p)}
                autoComplete="new-password"
              />
            </div>

            {/* === SECTION: DATA USAHA === */}
            <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mt-2 mb-1">
              Data Usaha
            </div>

            {/* Nama Usaha */}
            <Field
              id="reg-store-name"
              name="storeName"
              label="Nama Usaha"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Contoh: Warung Berkah"
            />

            {/* Kategori Usaha */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reg-store-category"
                className="text-xs sm:text-sm font-semibold text-ink"
              >
                Kategori Usaha
              </label>
              <select
                id="reg-store-category"
                name="storeCategory"
                value={formData.storeCategory}
                onChange={handleChange}
                className="w-full h-11 px-3.5 text-sm text-ink bg-white border border-[#d3dedf] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
                required
              >
                <option value="">Pilih Kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Deskripsi Usaha */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reg-store-desc"
                className="text-xs sm:text-sm font-semibold text-ink"
              >
                Deskripsi Usaha{" "}
                <span className="text-muted font-normal">(opsional)</span>
              </label>
              <textarea
                id="reg-store-desc"
                name="storeDescription"
                rows={3}
                value={formData.storeDescription}
                onChange={handleChange}
                placeholder="Ceritakan tentang usaha Anda..."
                className="w-full px-3.5 py-2.5 text-sm text-ink bg-white border border-[#d3dedf] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15 resize-none"
              />
            </div>

            {/* Checkbox Persetujuan */}
            <div className="flex items-start gap-2 mt-1">
              <input
                type="checkbox"
                id="reg-terms"
                name="agreedToTerms"
                className="w-4 h-4 mt-0.5 rounded text-teal-600 accent-teal-600 cursor-pointer shrink-0"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                required
              />
              <label
                htmlFor="reg-terms"
                className="text-xs text-muted cursor-pointer select-none"
              >
                Saya menyetujui{" "}
                <a
                  href="#syarat"
                  className="text-teal-600 font-semibold underline underline-offset-2"
                >
                  Ketentuan Layanan
                </a>{" "}
                dan{" "}
                <a
                  href="#privasi"
                  className="text-teal-600 font-semibold underline underline-offset-2"
                >
                  Kebijakan Privasi
                </a>{" "}
                UMKNow.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-ink font-display font-bold text-sm sm:text-base rounded-lg transition-all duration-150 active:scale-[0.99] mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{loading ? "Memproses..." : "Buat Akun Toko Gratis"}</span>
              {!loading && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </form>

          {/* Switch ke Login */}
          <div className="mt-6 text-center text-xs sm:text-sm text-muted">
            Sudah memiliki akun toko?{" "}
            <Link
              to="/login"
              className="text-teal-600 font-bold hover:underline ml-1"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>

      {/* ── PANEL KANAN: BRANDING ── */}
      <div className="relative hidden md:flex flex-1 flex-col justify-center p-12 lg:p-16 bg-teal-900 text-white h-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-teal-900/90 to-teal-900/95" />

        <div className="relative z-10 max-w-[440px]">
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Usaha mandiri,
            <br />
            kelola rapi.
          </h2>
          <p className="text-base lg:text-lg text-white/80 leading-relaxed">
            Sistem kasir dan catatan operasional toko yang siap digunakan
            langsung dari ponselmu.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable Field Components ── */

function Field({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-11 px-3.5 text-sm text-ink bg-white border border-[#d3dedf] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
        required
      />
    </div>
  );
}

function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full h-11 pl-3.5 pr-10 text-sm text-ink bg-white border border-[#d3dedf] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
          required
        />
        <button
          type="button"
          className="absolute right-2.5 text-muted hover:text-ink transition-colors p-1"
          onClick={onToggle}
          aria-label={show ? "Sembunyikan sandi" : "Tampilkan sandi"}
          tabIndex={-1}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
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
  );
}

function EyeOffIcon() {
  return (
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
  );
}
