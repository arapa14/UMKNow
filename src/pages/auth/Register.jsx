import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createStore } from "../../services/storeService";
import Modal from "../../components/common/Modal";

const CATEGORIES = [
  { value: "kuliner", label: "Kuliner" },
  { value: "retail", label: "Retail / Toko Kelontong" },
  { value: "fashion", label: "Fashion" },
  { value: "jasa", label: "Jasa" },
  { value: "kerajinan", label: "Kerajinan" },
  { value: "pertanian", label: "Pertanian" },
  { value: "lainnya", label: "Lainnya" },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    storeCategory: "",
    storeDescription: "",
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
      const { data, error: authError } = await register(
        formData.email,
        formData.password,
        { name: formData.name, phone: formData.phone },
      );

      if (authError) throw authError;
      if (!data.user) throw new Error("Registrasi gagal. Coba lagi.");

      const { error: storeError } = await createStore({
        ownerAuthId: data.user.id,
        name: formData.storeName,
        category: formData.storeCategory,
        description: formData.storeDescription,
        phone: formData.phone,
      });

      if (storeError) throw storeError;

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen max-h-screen w-full overflow-hidden font-sans text-ink">
      {/* ── PANEL KIRI: FORM ── */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-white p-6 sm:p-8 lg:p-10">
        <div className="w-full max-w-130">
          <Link
            to="/"
            className="mb-4 inline-block font-display text-xl font-extrabold tracking-tight text-teal-900"
          >
            <span className="text-amber-500">UMK</span>Now
          </Link>

          <div className="mb-4">
            <h1 className="font-display text-xl font-extrabold tracking-tight text-teal-900 sm:text-2xl">
              Mulai Digitalisasi Toko Anda
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Daftar dalam 1 menit. Langsung pakai kasir dan atur stok dari HP, tanpa biaya setup.
            </p>
          </div>

          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-2.5" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <Field id="reg-name" name="name" label="Nama Lengkap" value={formData.name} onChange={handleChange} autoComplete="name" />
              <Field id="reg-phone" name="phone" label="Nomor WhatsApp / HP" type="tel" value={formData.phone} onChange={handleChange} autoComplete="tel" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field id="reg-email" name="email" label="Email Aktif" type="email" value={formData.email} onChange={handleChange} autoComplete="email" />
              <PasswordField id="reg-password" name="password" label="Kata Sandi" value={formData.password} onChange={handleChange} show={showPassword} onToggle={() => setShowPassword((p) => !p)} autoComplete="new-password" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PasswordField id="reg-confirm-password" name="confirmPassword" label="Konfirmasi Sandi" value={formData.confirmPassword} onChange={handleChange} show={showPassword} onToggle={() => setShowPassword((p) => !p)} autoComplete="new-password" />
              <Field id="reg-store-name" name="storeName" label="Nama Usaha" value={formData.storeName} onChange={handleChange}/>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="reg-store-category" className="text-xs font-semibold text-ink">
                Kategori Usaha
              </label>
              <select
                id="reg-store-category"
                name="storeCategory"
                value={formData.storeCategory}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-[#d3dedf] bg-white px-3 text-sm text-ink transition-colors focus:border-teal-600 focus:outline-none focus:ring-3 focus:ring-teal-600/15"
                required
              >
                <option value="">Pilih kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="reg-store-desc" className="text-xs font-semibold text-ink">
                Deskripsi Usaha <span className="font-normal text-muted">(opsional)</span>
              </label>
              <textarea
                id="reg-store-desc"
                name="storeDescription"
                rows={2}
                value={formData.storeDescription}
                onChange={handleChange}
                placeholder="Ceritakan singkat tentang usaha Anda..."
                className="w-full resize-none rounded-lg border border-[#d3dedf] px-3 py-2 text-sm text-ink transition-colors focus:border-teal-600 focus:outline-none focus:ring-3 focus:ring-teal-600/15"
              />
            </div>

            <label htmlFor="reg-terms" className="flex items-start gap-2 text-xs text-muted">
              <input
                type="checkbox"
                id="reg-terms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 shrink-0 rounded accent-teal-600"
                required
              />
              <span>
                Saya menyetujui{" "}
                <a href="#syarat" className="font-semibold text-teal-600 underline underline-offset-2">
                  Ketentuan Layanan
                </a>{" "}
                dan{" "}
                <a href="#privasi" className="font-semibold text-teal-600 underline underline-offset-2">
                  Kebijakan Privasi
                </a>{" "}
                UMKNow.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-11 w-full rounded-lg bg-amber-500 font-display text-sm font-bold text-ink transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Buat Akun Toko Gratis"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-muted">
            Sudah memiliki akun toko?{" "}
            <Link to="/login" className="ml-1 font-bold text-teal-600 hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>

      {/* ── PANEL KANAN: FOTO ── */}
      <div className="relative hidden flex-1 overflow-hidden bg-teal-900 md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-teal-900/35" />
      </div>

      <Modal
        isOpen={showSuccess}
        title="Akun berhasil dibuat"
        message="Toko Anda sudah terdaftar. Cek email untuk verifikasi akun sebelum masuk."
        actionLabel="Ke Halaman Masuk"
        onClose={() => setShowSuccess(false)}
        onAction={() => navigate("/login")}
      />
    </div>
  );
}

/* ── Reusable Field Components ── */

function Field({ id, name, label, type = "text", value, onChange, autoComplete, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-ink">
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
        className="h-10 w-full rounded-lg border border-[#d3dedf] px-3 text-sm text-ink transition-colors focus:border-teal-600 focus:outline-none focus:ring-3 focus:ring-teal-600/15"
        required
      />
    </div>
  );
}

function PasswordField({ id, name, label, value, onChange, show, onToggle, autoComplete }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-ink">
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
          className="h-10 w-full rounded-lg border border-[#d3dedf] pl-3 pr-10 text-sm text-ink transition-colors focus:border-teal-600 focus:outline-none focus:ring-3 focus:ring-teal-600/15"
          required
        />
        <button
          type="button"
          className="absolute right-2.5 p-1 text-muted transition-colors hover:text-ink"
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