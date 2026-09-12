import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="nf-page">
      <style>{notFoundStyles}</style>

      <div className="nf-card">
        {/* Brand Logo */}
        <Link to="/" className="nf-brand" title="Kembali ke Beranda">
          <span className="nf-brand-u">UMK</span>Now
        </Link>

        {/* 404 Code & Heading */}
        <div className="nf-code">404</div>
        <h1 className="nf-title">Halaman Belum Tersedia</h1>
        <p className="nf-desc">
          Halaman yang Anda tuju sedang dalam tahap pengembangan atau URL tidak ditemukan. Silakan kembali ke beranda atau masuk ke akun Anda.
        </p>

        {/* Action Buttons */}
        <div className="nf-actions">
          <Link to="/" className="nf-btn nf-btn-primary">
            Kembali ke Beranda
          </Link>
          <Link to="/login" className="nf-btn nf-btn-secondary">
            Ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}

const notFoundStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .nf-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #042528;
    padding: 24px;
    font-family: 'Inter', sans-serif;
    color: #ffffff;
  }

  .nf-card {
    max-width: 480px;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nf-brand {
    text-decoration: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    margin-bottom: 40px;
    display: inline-block;
  }

  .nf-brand-u {
    color: #f59e0b;
  }

  .nf-code {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 5rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
    color: #f59e0b;
    margin-bottom: 16px;
  }

  .nf-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 12px 0;
    color: #ffffff;
  }

  .nf-desc {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.6;
    margin: 0 0 32px 0;
  }

  .nf-actions {
    display: flex;
    gap: 12px;
    width: 100%;
    justify-content: center;
  }

  .nf-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 22px;
    border-radius: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .nf-btn-primary {
    background-color: #f59e0b;
    color: #042528;
  }

  .nf-btn-primary:hover {
    background-color: #fbbf24;
    transform: translateY(-1px);
  }

  .nf-btn-secondary {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .nf-btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.14);
  }

  @media (max-width: 480px) {
    .nf-actions {
      flex-direction: column;
    }
    .nf-btn {
      width: 100%;
    }
  }
`;
