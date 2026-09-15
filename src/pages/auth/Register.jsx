import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, Store, Tag, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { createStore } from "../../services/storeService";
import Modal from "../../components/common/Modal";
import AuthPhotoPanel from "../../components/auth/AuthPhotoPanel";

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
  const [step, setStep] = useState(1);
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

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [showSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    setError(null);
    if (!formData.name.trim()) return setError("Nama lengkap wajib diisi.");
    if (!formData.email.trim()) return setError("Email wajib diisi.");
    if (formData.password.length < 6)
      return setError("Kata sandi minimal 6 karakter.");
    if (formData.password !== formData.confirmPassword)
      return setError("Konfirmasi kata sandi tidak cocok.");

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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
      {/* ── FOTO ── */}
      <AuthPhotoPanel imageUrl="https://images.pexels.com/photos/37851028/pexels-photo-37851028.jpeg?auto=compress&cs=tinysrgb&w=1920" />

      {/* ── FORM (hijau) ── */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[linear-gradient(160deg,#073b3f_0%,#0b5d61_100%)] p-6 sm:p-8 lg:p-10">
        <div className="w-full max-w-110">
          <Link
            to="/"
            className="mb-6 inline-block font-display text-xl font-extrabold tracking-tight text-white"
          >
            <span className="text-amber-500">UMK</span>Now
          </Link>

          <h1 className="mb-1 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Daftar Akun Baru
          </h1>

          <div className="mb-6 mt-4 flex gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-amber-500" : "bg-white/15"
                  }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 p-2.5 text-xs text-red-200">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
            {step === 1 && (
              <>
                <Field id="reg-name" name="name" label="Nama Lengkap" value={formData.name} onChange={handleChange} autoComplete="name" icon={User} />
                <Field id="reg-email" name="email" label="Email Aktif" type="email" value={formData.email} onChange={handleChange} autoComplete="email" icon={Mail} />
                <Field id="reg-phone" name="phone" label="Nomor WhatsApp / HP" type="tel" value={formData.phone} onChange={handleChange} autoComplete="tel" icon={Phone} />

                <div className="grid grid-cols-2 gap-3">
                  <PasswordField id="reg-password" name="password" label="Kata Sandi" value={formData.password} onChange={handleChange} show={showPassword} onToggle={() => setShowPassword((p) => !p)} autoComplete="new-password" />
                  <PasswordField id="reg-confirm-password" name="confirmPassword" label="Konfirmasi Sandi" value={formData.confirmPassword} onChange={handleChange} show={showPassword} onToggle={() => setShowPassword((p) => !p)} autoComplete="new-password" />
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-2 h-11 w-full rounded-lg bg-amber-500 font-display text-sm font-bold text-ink transition-all hover:bg-amber-400"
                >
                  Lanjutkan
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <Field id="reg-store-name" name="storeName" label="Nama Usaha" value={formData.storeName} onChange={handleChange} icon={Store} />

                <div className="flex flex-col gap-1">
                  <label htmlFor="reg-store-category" className="text-xs font-semibold text-white">
                    Kategori Usaha
                  </label>
                  <div className="relative flex items-center">
                    <Tag size={17} strokeWidth={1.75} className="pointer-events-none absolute left-3 text-muted" />
                    <select
                      id="reg-store-category"
                      name="storeCategory"
                      value={formData.storeCategory}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-white/10 bg-white pl-9 pr-3 text-sm text-ink transition-all focus:border-[#2dd4bf] focus:outline-none focus:ring-3 focus:ring-[#2dd4bf]/25"
                      required
                    >
                      <option value="">Pilih kategori</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="reg-store-desc" className="text-xs font-semibold text-white">
                    Deskripsi Usaha <span className="font-normal text-white/50">(opsional)</span>
                  </label>
                  <textarea
                    id="reg-store-desc"
                    name="storeDescription"
                    rows={3}
                    value={formData.storeDescription}
                    onChange={handleChange}
                    placeholder="Ceritakan singkat tentang usaha Anda..."
                    className="w-full resize-none rounded-lg border border-white/10 bg-white px-3 py-2 text-sm text-ink transition-all focus:border-[#2dd4bf] focus:outline-none focus:ring-3 focus:ring-[#2dd4bf]/25"
                  />
                </div>

                <label htmlFor="reg-terms" className="flex items-center gap-2 text-xs text-white/70">
                  <input
                    type="checkbox"
                    id="reg-terms"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 shrink-0 rounded accent-amber-500"
                    required
                  />
                  <span>
                    Saya menyetujui{" "}
                    <a href="#syarat" className="font-semibold text-amber-400 underline underline-offset-2">
                      Ketentuan Layanan
                    </a>{" "}
                    dan{" "}
                    <a href="#privasi" className="font-semibold text-amber-400 underline underline-offset-2">
                      Kebijakan Privasi
                    </a>{" "}
                    UMKNow.
                  </span>
                </label>

                <div className="mt-1 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-11 flex-1 rounded-lg border border-white/15 font-display text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 flex-2 rounded-lg bg-amber-500 font-display text-sm font-bold text-ink transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Memproses..." : "Buat Akun Toko Gratis"}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-5 text-center text-xs text-white/70">
            Sudah memiliki akun toko?{" "}
            <Link to="/login" className="ml-1 font-bold text-amber-400 hover:underline">
              Masuk di sini
            </Link>
          </div>
        </div>
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

function Field({ id, name, label, type = "text", value, onChange, autoComplete, placeholder, icon: Icon }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-white">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon size={17} strokeWidth={1.75} className="pointer-events-none absolute left-3 text-muted" />
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-10 w-full rounded-lg border border-white/10 bg-white pl-9 pr-3 text-sm text-ink transition-all focus:border-[#2dd4bf] focus:outline-none focus:ring-3 focus:ring-[#2dd4bf]/25"
          required
        />
      </div>
    </div>
  );
}

function PasswordField({ id, name, label, value, onChange, show, onToggle, autoComplete }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-white">
        {label}
      </label>
      <div className="relative flex items-center">
        <Lock size={17} strokeWidth={1.75} className="pointer-events-none absolute left-3 text-muted" />
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="h-10 w-full rounded-lg border border-white/10 bg-white pl-9 pr-10 text-sm text-ink transition-all focus:border-[#2dd4bf] focus:outline-none focus:ring-3 focus:ring-[#2dd4bf]/25"
          required
        />
        <button
          type="button"
          className="absolute right-2.5 p-1 text-muted transition-colors hover:text-ink"
          onClick={onToggle}
          aria-label={show ? "Sembunyikan sandi" : "Tampilkan sandi"}
          tabIndex={-1}
        >
          {show ? <EyeOff size={17} strokeWidth={1.75} /> : <Eye size={17} strokeWidth={1.75} />}
        </button>
      </div>
    </div>
  );
}