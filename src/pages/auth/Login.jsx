import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /*
      ======================================================
      TODO (LOGIKA AUTENTIKASI):
      Sambungkan fungsi login di sini (Supabase Auth).
      Saat ini langsung mengarahkan ke halaman placeholder (NotFound).
      ======================================================
    */
    console.log("Submit Login Placeholder:", formData);
    navigate("/not-found");
  };

  return (
    <div className="auth-root">
      <style>{loginStyles}</style>

      {/* ── PANEL KIRI: FOTO SUASANA TOKO (Simpel & Kuat) ── */}
      <div className="auth-visual-side">
        <div className="auth-photo-bg" />
        <div className="auth-photo-overlay" />

        <div className="auth-visual-text">
          <h2 className="auth-visual-heading">
            Buka kasir,<br />
            mulai hari ini.
          </h2>
          <p className="auth-visual-lead">
            Kelola transaksi dan pantau stok tokomu dalam satu tempat.
          </p>
        </div>
      </div>

      {/* ── PANEL KANAN: FORM LOGIN DENGAN RUANG BERNAPAS ── */}
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          {/* Brand Mark */}
          <Link to="/" className="auth-brand" title="Kembali ke Beranda">
            <span className="auth-brand-u">UMK</span>Now
          </Link>

          {/* Headline Form */}
          <div className="auth-header">
            <h1 className="auth-title">Masuk ke Toko</h1>
            <p className="auth-sub">Masukkan email dan kata sandi akun tokomu.</p>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="login-email" className="auth-label">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="login-password" className="auth-label">
                  Kata Sandi
                </label>
                <Link to="/not-found" className="auth-link-forgot">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="auth-input-rel">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="auth-input auth-input-pw"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
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

            <button type="submit" className="auth-btn-submit" id="btn-login">
              Masuk
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="auth-switch">
            Belum punya akun?{" "}
            <Link to="/register" className="auth-switch-link">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .auth-root {
    display: flex;
    min-height: 100vh;
    width: 100%;
    font-family: 'Inter', sans-serif;
    color: #0f2526;
    background-color: #fbfbf9;
  }

  /* ── Panel Visual Kiri ── */
  .auth-visual-side {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 72px 64px;
    background-color: #042528;
    overflow: hidden;
  }

  .auth-photo-bg {
    position: absolute;
    inset: 0;
    background-image: url('https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1600&auto=format&fit=crop');
    background-size: cover;
    background-position: center;
  }

  .auth-photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(4, 37, 40, 0.4) 0%,
      rgba(4, 37, 40, 0.78) 50%,
      rgba(4, 37, 40, 0.96) 100%
    );
  }

  .auth-visual-text {
    position: relative;
    z-index: 2;
    max-width: 440px;
    color: #ffffff;
  }

  .auth-visual-heading {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 2.25rem;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: #ffffff;
    margin: 0 0 16px 0;
  }

  .auth-visual-lead {
    font-size: 1.05rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  /* ── Panel Form Kanan ── */
  .auth-form-side {
    flex: 1.15;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 64px 80px;
    background-color: #fbfbf9;
    overflow-y: auto;
  }

  .auth-form-wrap {
    width: 100%;
    max-width: 400px;
  }

  .auth-brand {
    display: inline-block;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #042528;
    text-decoration: none;
    letter-spacing: -0.02em;
    margin-bottom: 48px;
  }

  .auth-brand-u {
    color: #f59e0b;
  }

  .auth-header {
    margin-bottom: 36px;
  }

  .auth-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.85rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #042528;
    margin: 0 0 8px 0;
  }

  .auth-sub {
    font-size: 0.95rem;
    color: #556c6e;
    line-height: 1.5;
    margin: 0;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .auth-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .auth-label {
    font-size: 0.88rem;
    font-weight: 600;
    color: #0f2526;
  }

  .auth-link-forgot {
    font-size: 0.82rem;
    font-weight: 500;
    color: #0b5d61;
    text-decoration: none;
  }

  .auth-link-forgot:hover {
    text-decoration: underline;
  }

  .auth-input-rel {
    position: relative;
    display: flex;
    align-items: center;
  }

  .auth-input {
    width: 100%;
    height: 48px;
    padding: 0 16px;
    font-size: 0.95rem;
    color: #0f2526;
    background-color: #ffffff;
    border: 1.5px solid #d8e2e2;
    border-radius: 8px;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .auth-input::placeholder {
    color: #9cb1b3;
  }

  .auth-input:focus {
    outline: none;
    border-color: #0b5d61;
    box-shadow: 0 0 0 3.5px rgba(11, 93, 97, 0.1);
  }

  .auth-input-pw {
    padding-right: 46px;
  }

  .auth-toggle-pw {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    padding: 6px;
    color: #748c8f;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .auth-toggle-pw:hover {
    color: #0f2526;
  }

  .auth-btn-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    background-color: #f59e0b;
    color: #0f2526;
    border: none;
    border-radius: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 8px;
    transition: background-color 0.15s ease, transform 0.12s ease;
  }

  .auth-btn-submit:hover {
    background-color: #fbbf24;
    transform: translateY(-1px);
  }

  .auth-btn-submit:active {
    transform: translateY(0);
  }

  .auth-switch {
    margin-top: 28px;
    font-size: 0.9rem;
    color: #556c6e;
    text-align: center;
  }

  .auth-switch-link {
    color: #0b5d61;
    font-weight: 700;
    text-decoration: none;
  }

  .auth-switch-link:hover {
    text-decoration: underline;
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .auth-visual-side {
      display: none;
    }
    .auth-form-side {
      padding: 48px 24px;
    }
  }
`;