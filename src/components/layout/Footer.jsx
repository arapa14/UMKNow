export default function Footer() {
    return (
        <footer className="site-footer">
            <style>{styles}</style>
            <div className="site-footer-inner">
                <div className="site-footer-brand-col">
                    <a className="site-footer-brand" href="#top">
                        <span className="site-footer-brand-u">UMK</span>Now
                    </a>
                    <p>Alat sederhana untuk membantu UMKM Indonesia mengelola operasional toko setiap hari, dari kasir sampai laporan.</p>
                </div>

                <div className="site-footer-links-wrap">
                    <nav className="site-footer-nav-col" aria-label="Navigasi produk">
                        <p className="site-footer-nav-label">Produk</p>
                        <a href="#fitur">Fitur Utama</a>
                        <a href="#cara-kerja">Cara Kerja</a>
                    </nav>

                    <nav className="site-footer-nav-col" aria-label="Akses toko">
                        <p className="site-footer-nav-label">Akses Toko</p>
                        <a href="/login">Masuk</a>
                        <a href="/register">Daftar Gratis</a>
                    </nav>
                </div>
            </div>

            <div className="site-footer-bottom">
                <span>© 2026 UMKNow. Dibuat dengan ❤️ untuk UMKM Indonesia.</span>
                <span className="site-footer-sdgs">SDGs 9: Industry &amp; Innovation</span>
            </div>
        </footer>
    );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  .site-footer {
    background: #042528;
    color: #fff;
    padding: 60px 0 0;
  }

  .site-footer-inner,
  .site-footer-bottom {
    margin: 0 auto;
    width: min(1120px, calc(100% - 48px));
  }

  .site-footer-inner {
    display: flex;
    gap: 64px;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 44px;
  }

  .site-footer-brand-col {
    max-width: 380px;
  }

  .site-footer-brand {
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-decoration: none;
    display: inline-block;
  }

  .site-footer-brand-u {
    color: #f59e0b;
  }

  .site-footer p {
    color: rgba(255, 255, 255, 0.62);
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    line-height: 1.65;
    margin: 12px 0 0;
  }

  .site-footer-links-wrap {
    display: flex;
    gap: 56px;
  }

  .site-footer-nav-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 100px;
  }

  .site-footer-nav-label {
    color: rgba(255, 255, 255, 0.42) !important;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem !important;
    font-weight: 700 !important;
    letter-spacing: 0.08em !important;
    margin: 4px 0 6px !important;
    text-transform: uppercase;
  }

  .site-footer-nav-col a {
    color: rgba(255, 255, 255, 0.72);
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .site-footer-nav-col a:hover {
    color: #ffffff;
  }

  .site-footer-bottom {
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.4);
    display: flex;
    font-family: 'Inter', sans-serif;
    font-size: 0.82rem;
    justify-content: space-between;
    padding: 24px 0 28px;
  }

  .site-footer-sdgs {
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.22);
    border-radius: 20px;
    color: rgba(245, 158, 11, 0.85);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 12px;
  }

  @media (max-width: 720px) {
    .site-footer-inner {
      flex-direction: column;
      gap: 36px;
    }
    .site-footer-links-wrap {
      gap: 40px;
      width: 100%;
    }
    .site-footer-bottom {
      flex-direction: column;
      gap: 14px;
      text-align: center;
    }
  }
`;
