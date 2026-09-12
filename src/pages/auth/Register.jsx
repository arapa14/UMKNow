import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    agreedToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /*
      ======================================================
      TODO (LOGIKA AUTENTIKASI / REGISTER):
      Tabel: users_tb (id, name, email, phone, is_verified, created_at)
      1. Daftarkan akun auth (misal Supabase signUp dengan email & password)
      2. Simpan profil ke users_tb: { name, email, phone }
      Saat ini langsung mengarahkan ke halaman placeholder (NotFound).
      ======================================================
    */
    console.log("Submit Register Placeholder (users_tb):", formData);
    navigate("/not-found");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen w-full font-sans text-ink bg-white overflow-hidden">
      {/* ── PANEL KIRI: FORM REGISTRASI (Rapi, Seimbang, Tanpa Scroll di Desktop) ── */}
      <div className="flex-1 md:flex-[1.25] flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-white h-full box-border overflow-y-auto md:overflow-hidden">
        <div className="w-full max-w-[480px]">
          {/* Brand Header */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-block font-display text-2xl font-extrabold text-teal-900 tracking-tight"
              title="Kembali ke Beranda"
            >
              <span className="text-amber-500">UMK</span>Now
            </Link>
          </div>

          {/* Header Title */}
          <div className="mb-6">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-teal-900 mb-1.5">
              Mulai Digitalisasi Toko Anda
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Daftar dalam 1 menit. Langsung pakai kasir dan atur stok dari HP, tanpa biaya setup.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            {/* Grid 2 Kolom: Nama Lengkap & Nomor Telepon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-name" className="text-xs sm:text-sm font-semibold text-ink">
                  Nama Lengkap
                </label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="w-full h-11 px-3.5 text-sm text-ink bg-white border border-[#d3dedf] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-phone" className="text-xs sm:text-sm font-semibold text-ink">
                  Nomor WhatsApp / HP
                </label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full h-11 px-3.5 text-sm text-ink bg-white border border-[#d3dedf] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Grid 2 Kolom: Email & Kata Sandi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-email" className="text-xs sm:text-sm font-semibold text-ink">
                  Email Aktif
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full h-11 px-3.5 text-sm text-ink bg-white border border-[#d3dedf] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-password" className="text-xs sm:text-sm font-semibold text-ink">
                  Kata Sandi
                </label>
                <div className="relative flex items-center">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full h-11 pl-3.5 pr-10 text-sm text-ink bg-white border border-[#d3dedf] rounded-lg transition-colors focus:outline-none focus:border-teal-600 focus:ring-3 focus:ring-teal-600/15"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 text-muted hover:text-ink transition-colors p-1"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Persetujuan */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="reg-terms"
                name="agreedToTerms"
                className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer shrink-0"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="reg-terms" className="text-xs text-muted cursor-pointer select-none">
                Saya menyetujui{" "}
                <a href="#syarat" className="text-teal-600 font-semibold underline underline-offset-2">
                  Ketentuan Layanan
                </a>{" "}
                dan{" "}
                <a href="#privasi" className="text-teal-600 font-semibold underline underline-offset-2">
                  Kebijakan Privasi
                </a>{" "}
                UMKNow.
              </label>
            </div>

            {/* Tombol Submit CTA */}
            <button
              type="submit"
              className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-ink font-display font-bold text-sm sm:text-base rounded-lg transition-all duration-150 active:scale-[0.99] mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              id="btn-register-submit"
            >
              <span>Buat Akun Toko Gratis</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>

          {/* Switch ke Login */}
          <div className="mt-6 text-center text-xs sm:text-sm text-muted">
            Sudah memiliki akun toko?{" "}
            <Link to="/login" className="text-teal-600 font-bold hover:underline ml-1">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>

      {/* ── PANEL KANAN: BACKGROUND IMAGE DENGAN TEAL OVERLAY & TEKS TEGAS ── */}
      <div className="relative hidden md:flex flex-1 flex-col justify-center p-12 lg:p-16 bg-teal-900 text-white h-full box-border overflow-hidden">
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
            Usaha mandiri,<br />
            kelola rapi.
          </h2>
          <p className="text-base lg:text-lg text-white/80 leading-relaxed">
            Sistem kasir dan catatan operasional toko yang siap digunakan langsung dari ponselmu.
          </p>
        </div>
      </div>
    </div>
  );
}
