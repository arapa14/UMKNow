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
    <div className="reg-page">
      <style>{registerStyles}</style>

      {/* ── PANEL KIRI: FORM REGISTRASI (Rapi, Seimbang & Tanpa Scroll) ── */}
      <div className="reg-form-panel">
        <div className="reg-form-container">
          {/* Brand Header */}
          <div className="reg-brand-wrapper">
            <Link to="/" className="reg-brand-logo" title="Kembali ke Beranda">
              <span className="reg-brand-u">UMK</span>Now
            </Link>
          </div>

          {/* Header Title */}
          <div className="reg-header">
            <h1 className="reg-title">Mulai Digitalisasi Toko Anda</h1>
            <p className="reg-subtitle">
              Daftar dalam 1 menit. Langsung pakai kasir dan atur stok dari HP, tanpa biaya setup.
            </p>
          </div>

          {/* Form */}
          <form className="reg-form" onSubmit={handleSubmit} noValidate>
            {/* Grid 2 Kolom: Nama Lengkap & Nomor Telepon */}
            <div className="reg-grid-2">
              <div className="reg-field-group">
                <label htmlFor="reg-name" className="reg-label">
                  Nama Lengkap
                </label>
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="reg-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="reg-field-group">
                <label htmlFor="reg-phone" className="reg-label">
                  Nomor WhatsApp / HP
                </label>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="reg-input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Grid 2 Kolom: Email & Kata Sandi */}
            <div className="reg-grid-2">
              <div className="reg-field-group">
                <label htmlFor="reg-email" className="reg-label">
                  Email Aktif
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="reg-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="reg-field-group">
                <label htmlFor="reg-password" className="reg-label">
                  Kata Sandi
                </label>
                <div className="reg-input-wrapper">
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="reg-input reg-input-password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="reg-pw-toggle"
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
            <div className="reg-checkbox-group">
              <label className="reg-checkbox-label">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  className="reg-checkbox"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  required
                />
                <span>
                  Saya menyetujui <a href="#syarat" className="reg-inline-link">Ketentuan Layanan</a> dan <a href="#privasi" className="reg-inline-link">Kebijakan Privasi</a> UMKNow.
                </span>
              </label>
            </div>

            {/* Tombol Submit CTA */}
            <button type="submit" className="reg-submit-btn" id="btn-register-submit">
              <span>Buat Akun Toko Gratis</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>

          {/* Switch ke Login */}
          <div className="reg-switch-prompt">
            <p>
              Sudah memiliki akun toko?{" "}
              <Link to="/login" className="reg-switch-link">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── PANEL KANAN: BACKGROUND IMAGE DENGAN TEAL OVERLAY & TEKS TEGAS ── */}
      <div className="reg-visual-panel">
        <div className="reg-visual-bg" />
        <div className="reg-visual-overlay" />

        <div className="reg-visual-content">
          <h2 className="reg-visual-heading">
            Usaha mandiri,<br />
            kelola rapi.
          </h2>
          <p className="reg-visual-lead">
            Sistem kasir dan catatan operasional toko yang siap digunakan langsung dari ponselmu.
          </p>
        </div>
      </div>
    </div>
  );
}

const registerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .reg-page {
    display: flex;
    height: 100vh;
    max-height: 100vh;
    width: 100%;
    background-color: #ffffff;
    color: #0f2526;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }

  /* ── Panel Kiri (Form) ── */
  .reg-form-panel {
    flex: 1.25;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 56px;
    background-color: #ffffff;
    height: 100%;
    box-sizing: border-box;
  }

  .reg-form-container {
    width: 100%;
    max-width: 480px;
  }

  .reg-brand-wrapper {
    margin-bottom: 24px;
  }

  .reg-brand-logo {
    text-decoration: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.45rem;
    font-weight: 800;
    color: #042528;
    letter-spacing: -0.02em;
    display: inline-block;
  }

  .reg-brand-u {
    color: #f59e0b;
  }

  .reg-header {
    margin-bottom: 24px;
  }

  .reg-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.75rem;
    font-weight: 800;
    color: #042528;
    letter-spacing: -0.025em;
    margin: 0 0 6px 0;
  }

  .reg-subtitle {
    font-size: 0.9rem;
    color: #556c6e;
    line-height: 1.5;
    margin: 0;
  }

  .reg-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .reg-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .reg-field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .reg-label {
    font-size: 0.84rem;
    font-weight: 600;
    color: #0f2526;
  }

  .reg-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .reg-input {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    background-color: #ffffff;
    border: 1.5px solid #d3dedf;
    border-radius: 8px;
    font-size: 0.92rem;
    color: #0f2526;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    box-sizing: border-box;
  }

  .reg-input:focus {
    outline: none;
    border-color: #0b5d61;
    box-shadow: 0 0 0 3px rgba(11, 93, 97, 0.1);
  }

  .reg-input-password {
    padding-right: 42px;
  }

  .reg-pw-toggle {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: #748c8f;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .reg-pw-toggle:hover {
    color: #0f2526;
  }

  .reg-checkbox-group {
    margin-top: 2px;
  }

  .reg-checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    color: #556c6e;
    cursor: pointer;
    line-height: 1.4;
  }

  .reg-checkbox {
    width: 16px;
    height: 16px;
    accent-color: #0b5d61;
    cursor: pointer;
    flex-shrink: 0;
    margin: 0;
  }

  .reg-inline-link {
    color: #0b5d61;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .reg-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 48px;
    background-color: #f59e0b;
    color: #0f2526;
    border: none;
    border-radius: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.98rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 4px;
    transition: background-color 0.15s ease, transform 0.12s ease;
  }

  .reg-submit-btn:hover {
    background-color: #fbbf24;
    transform: translateY(-1px);
  }

  .reg-submit-btn:active {
    transform: translateY(0);
  }

  .reg-switch-prompt {
    margin-top: 22px;
    text-align: center;
    font-size: 0.88rem;
    color: #556c6e;
  }

  .reg-switch-prompt p {
    margin: 0;
  }

  .reg-switch-link {
    color: #0b5d61;
    font-weight: 700;
    text-decoration: none;
  }

  .reg-switch-link:hover {
    text-decoration: underline;
  }

  /* ── Panel Kanan (Visual dengan Background Image + Dark Teal Overlay) ── */
  .reg-visual-panel {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 72px 64px;
    background-color: #042528;
    color: #ffffff;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .reg-visual-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
    filter: saturate(0.9);
  }

  .reg-visual-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      140deg,
      rgba(4, 37, 40, 0.78) 0%,
      rgba(4, 37, 40, 0.88) 50%,
      rgba(4, 37, 40, 0.97) 100%
    );
  }

  .reg-visual-content {
    position: relative;
    z-index: 2;
    max-width: 440px;
  }

  .reg-visual-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2.35rem;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: #ffffff;
    margin: 0 0 16px 0;
  }

  .reg-visual-lead {
    font-size: 1.05rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.78);
    margin: 0;
  }

  /* ── Responsive Mobile ── */
  @media (max-width: 900px) {
    .reg-page {
      height: auto;
      max-height: none;
      overflow-y: auto;
    }
    .reg-visual-panel {
      display: none;
    }
    .reg-form-panel {
      padding: 40px 20px;
      height: auto;
    }
    .reg-grid-2 {
      grid-template-columns: 1fr;
      gap: 14px;
    }
  }
`;
