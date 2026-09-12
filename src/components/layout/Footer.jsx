export default function Footer() {
    return (
        <footer className="site-footer">
            <style>{styles}</style>
            <div className="site-footer-inner">
                <div className="site-footer-brand-col">
                    <a className="site-footer-brand" href="#top">
                        <span className="site-footer-brand-u">UMK</span>Now
                    </a>
                    <p>Alat sederhana untuk membantu UMKM Indonesia mengelola operasional toko setiap hari — dari kasir sampai laporan.</p>
                </div>
                <nav aria-label="Navigasi footer">
                    <p className="site-footer-nav-label">Produk</p>
                    <a href="#fitur">Fitur</a>
                    <a href="#cara-kerja">Cara kerja</a>
                    <a href="/login">Masuk</a>
                    <a href="/login">Daftar gratis</a>
                </nav>
            </div>
            <div className="site-footer-bottom">
                <span>© 2026 UMKNow. Dibuat dengan ❤️ untuk UMKM Indonesia.</span>
                <span className="site-footer-sdgs">SDGs 9 — Industry &amp; Innovation</span>
            </div>
        </footer>
    );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  .site-footer {
    background: #042528;
    color: #fff;
    padding: 56px 0 0;
  }

  .site-footer-inner,
  .site-footer-bottom {
    margin: 0 auto;
    width: min(1120px, calc(100% - 48px));
  }

  .site-footer-inner {
    display: flex;
    gap: 48px;
    justify-content: space-between;
    padding-bottom: 48px;
  }

  .site-footer-brand-col {
    max-width: 380px;
  }

  .site-footer-brand {
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    text-decoration: none;
  }

  .site-footer-brand-u {
    color: #f59e0b;
  }

  .site-footer p {
    color: rgba(255, 255, 255, 0.56);
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    line-height: 1.7;
    margin: 14px 0 0;
  }

  .site-footer nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 120px;
  }

  .site-footer-nav-label {
    color: rgba(255,255,255,0.38) !important;
    font-size: 0.72rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.1em !important;
    margin: 0 0 4px !important;
    text-transform: uppercase;
  }

  .site-footer nav a {
    color: rgba(255, 255, 255, 0.72);
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s;
  }

  .site-footer nav a:hover { color: #fff; }

  .site-footer-bottom {
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.38);
    display: flex;
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    justify-content: space-between;
    padding: 20px 0;
  }

  .site-footer-sdgs {
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.22);
    border-radius: 20px;
    color: rgba(245, 158, 11, 0.8);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 12px;
  }

  @media (max-width: 640px) {
    .site-footer-inner { flex-direction: column; gap: 32px; }
    .site-footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
  }
`;
