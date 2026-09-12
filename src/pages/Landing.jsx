import { useEffect, useRef } from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

/* ─── Data ───────────────────────────────────────────────── */
const features = [
  {
    id: "pos",
    label: "Kasir Pintar",
    tag: "POS",
    headline: "Catat transaksi secepat pelanggan memesan.",
    body: "Pilih produk, hitung total, cetak atau kirim struk selesai dalam hitungan detik. Tidak perlu mesin kasir mahal.",
    accent: "#0b5d61",
    accentLight: "rgba(11,93,97,0.08)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 14h12M8 18h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M8 10h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="19" cy="10" r="2.5" fill="currentColor" opacity=".3"/>
      </svg>
    ),
  },
  {
    id: "inventory",
    label: "Manajemen Stok",
    tag: "IMS",
    headline: "Stok tidak akan habis tanpa kamu tahu.",
    body: "Pantau jumlah barang masuk dan keluar secara real-time. Terima notifikasi otomatis sebelum stok benar-benar menipis.",
    accent: "#7c3aed",
    accentLight: "rgba(124,58,237,0.08)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="15" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <rect x="4" y="15" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M15 19.5h9M19.5 15v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "catalog",
    label: "Katalog Online",
    tag: "Catalog",
    headline: "Toko online siap dibagikan ke pelanggan.",
    body: "Buat halaman katalog produk toko dalam satu klik. Bagikan link-nya via WhatsApp, pelanggan bisa pilih dan pesan langsung.",
    accent: "#0d9488",
    accentLight: "rgba(13,148,136,0.08)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M14 4c-3 4-3 16 0 20M14 4c3 4 3 16 0 20M4 14h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "bookkeeping",
    label: "Pembukuan Otomatis",
    tag: "Bookkeeping",
    headline: "Laporan laba-rugi tanpa perlu akuntan.",
    body: "Setiap transaksi dicatat otomatis ke pembukuan. Lihat ringkasan omzet harian, mingguan, atau bulanan kapan saja.",
    accent: "#b45309",
    accentLight: "rgba(180,83,9,0.08)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="3" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 9h8M8 13h6M8 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="21" cy="21" r="5" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M19.5 21h3M21 19.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const pillModules = [
  { label: "Kasir Pintar", icon: <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M8 14h12M8 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { label: "Manajemen Stok", icon: <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="15" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="4" y="15" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M15 19.5h9M19.5 15v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { label: "Katalog Online", icon: <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2"/><path d="M4 14h20M14 4c-3 4-3 16 0 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { label: "Pembukuan", icon: <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 9h8M8 13h6M8 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
];

const steps = [
  {
    n: "01",
    title: "Daftarkan toko",
    desc: "Buat akun dan isi profil toko dalam satu menit.",
  },
  {
    n: "02",
    title: "Masukkan produk",
    desc: "Tambah daftar produk beserta harga dan stok awal.",
  },
  {
    n: "03",
    title: "Mulai transaksi",
    desc: "Langsung proses penjualan via kasir di HP manapun.",
  },
  {
    n: "04",
    title: "Pantau laporan",
    desc: "Lihat ringkasan omzet dan stok kapan pun kamu mau.",
  },
];

const stats = [
  { value: "64 Juta", label: "UMKM aktif di Indonesia" },
  { value: "< 2 menit", label: "Waktu setup awal" },
  { value: "100%", label: "Berbasis web, cukup HP" },
];

/* ─── Component ──────────────────────────────────────────── */
export default function Landing() {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) =>
      observerRef.current.observe(el)
    );

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="lp" id="top">
      <style>{css}</style>
      <Navbar />

      <main>
        {/* ── HERO ─────────────────────────────────── */}
        <section className="lp-hero">
          <div className="lp-container lp-hero-body">
            <div className="lp-hero-text">
              <p className="lp-eyebrow reveal">Platform digitalisasi UMKM Indonesia</p>
              <h1 className="reveal reveal-delay-1">
                Dari warung ke digital,<br />
                <em>tanpa perlu ribet.</em>
              </h1>
              <p className="lp-hero-lead reveal reveal-delay-2">
                UMKNow menyatukan kasir, stok, katalog online, dan pembukuan dalam satu aplikasi.
                Cukup pakai HP, langsung pakai hari ini.
              </p>
              <div className="lp-hero-actions reveal reveal-delay-3">
                <a className="lp-btn lp-btn-amber" href="/register" id="hero-cta-primary">
                  Mulai gratis sekarang
                </a>
                <a className="lp-btn lp-btn-ghost" href="#cara-kerja" id="hero-cta-secondary">
                  Lihat cara kerja ↓
                </a>
              </div>
            </div>
          </div>

          {/* Module pills */}
          <div className="lp-hero-pills" aria-label="Modul UMKNow">
            <div className="lp-container">
              <div className="lp-pills-row">
                {pillModules.map((m) => (
                  <div className="lp-pill" key={m.label}>
                    <span className="lp-pill-icon">{m.icon}</span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────── */}
        <section className="lp-stats-bar" aria-label="Statistik">
          <div className="lp-container lp-stats-row">
            {stats.map((s) => (
              <div className="lp-stat reveal" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────── */}
        <section className="lp-section" id="fitur" aria-labelledby="fitur-heading">
          <div className="lp-container">
            <div className="lp-section-header reveal">
              <p className="lp-eyebrow lp-eyebrow-dark">Fitur inti</p>
              <h2 id="fitur-heading">
                Semua yang dibutuhkan toko,<br />
                dalam satu tempat.
              </h2>
              <p className="lp-section-lead">
                Tidak perlu banyak aplikasi berbeda. UMKNow menangani operasional toko dari depan sampai laporan.
              </p>
            </div>

            <div className="lp-feature-grid">
              {features.map((f, i) => (
                <article
                  className={`lp-feat-card reveal reveal-delay-${i % 3}`}
                  key={f.id}
                  style={{ "--accent": f.accent, "--accent-light": f.accentLight }}
                >
                  <div className="lp-feat-icon">{f.icon}</div>
                  <div className="lp-feat-tag">{f.tag}</div>
                  <h3>{f.headline}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────── */}
        <section className="lp-section lp-section-teal" id="cara-kerja" aria-labelledby="cara-kerja-heading">
          <div className="lp-container lp-howitworks">
            <div className="lp-howitworks-left reveal">
              <p className="lp-eyebrow">Cara kerja</p>
              <h2 id="cara-kerja-heading">
                Mulai dari toko pertama<br />
                tanpa proses yang rumit.
              </h2>
              <p className="lp-howitworks-copy">
                Setup UMKNow tidak memerlukan pengetahuan teknis. Cukup siapkan data toko dan produk, sisanya kami yang urus.
              </p>
              <a className="lp-btn lp-btn-amber" href="/register" id="steps-cta" style={{ marginTop: "28px", alignSelf: "flex-start" }}>
                Daftar dan coba sekarang
              </a>
            </div>

            <ol className="lp-steps">
              {steps.map((s, i) => (
                <li
                  className={`lp-step reveal reveal-delay-${i % 3}`}
                  key={s.n}
                >
                  <span className="lp-step-num">{s.n}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <p>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────── */}
        <section className="lp-cta" aria-label="Call to action">
          <div className="lp-container lp-cta-body">
            <div className="lp-cta-text reveal">
              <p className="lp-eyebrow">Siap digitalisasi?</p>
              <h2>
                Rapikan operasional toko<br />
                mulai hari ini.
              </h2>
              <p>
                Ribuan UMKM sudah mulai. Tidak ada biaya tersembunyi,<br />
                tidak ada setup yang rumit.
              </p>
            </div>
            <div className="lp-cta-actions reveal reveal-delay-1">
              <a className="lp-btn lp-btn-amber lp-btn-lg" href="/register" id="cta-final">
                Buat akun toko gratis
              </a>
              <p className="lp-cta-note">Cukup pakai HP, langsung bisa dipakai.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700;1,800&family=Inter:wght@400;500;600;700&display=swap');

  /* ── Tokens ────────────────────────────────────────── */
  .lp {
    --teal-900: #042528;
    --teal-800: #052e31;
    --teal-700: #073b3f;
    --teal-600: #0b5d61;
    --teal-500: #0d7277;
    --teal-200: #b2d8da;
    --teal-50:  #edf6f6;
    --amber:    #f59e0b;
    --amber-lt: #fbbf24;
    --ink:      #0f2526;
    --ink-2:    #2a4244;
    --muted:    #4b6568;
    --muted-lt: #748c8f;
    --line:     #dae6e7;
    --surface:  #f5f8f8;
    --white:    #ffffff;

    background: var(--white);
    color: var(--ink);
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Layout ────────────────────────────────────────── */
  .lp-container {
    margin: 0 auto;
    width: min(1120px, calc(100% - 48px));
  }

  /* ── Reveal animations ─────────────────────────────── */
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1),
                transform 0.65s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal.is-visible { opacity: 1; transform: none; }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }

  /* ── Typography ────────────────────────────────────── */
  .lp h1, .lp h2, .lp h3 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.06;
    margin: 0;
  }

  .lp h1 { font-size: clamp(2.6rem, 6vw, 4.5rem); }
  .lp h1 em { font-style: italic; color: var(--amber); }

  .lp h2 {
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    max-width: 820px;
  }

  .lp h3 { font-size: 1.1rem; margin-bottom: 10px; }

  .lp-eyebrow {
    color: var(--amber);
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    margin: 0 0 16px;
    text-transform: uppercase;
  }

  .lp-eyebrow-dark { color: var(--teal-600); }

  /* ── Buttons ───────────────────────────────────────── */
  .lp-btn {
    align-items: center;
    border-radius: 10px;
    border: none;
    display: inline-flex;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    gap: 6px;
    justify-content: center;
    min-height: 46px;
    padding: 0 22px;
    text-decoration: none;
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    white-space: nowrap;
  }

  .lp-btn:hover { transform: translateY(-2px); }
  .lp-btn:active { transform: translateY(0); }

  .lp-btn-amber {
    background: var(--amber);
    box-shadow: 0 2px 16px rgba(245,158,11,0.3);
    color: var(--ink);
  }
  .lp-btn-amber:hover {
    background: var(--amber-lt);
    box-shadow: 0 4px 24px rgba(245,158,11,0.4);
  }

  .lp-btn-ghost {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.3);
    color: #fff;
  }
  .lp-btn-ghost:hover { background: rgba(255,255,255,0.2); }

  .lp-btn-lg { font-size: 1.05rem; min-height: 54px; padding: 0 30px; }

  /* ── HERO ──────────────────────────────────────────── */
  .lp-hero {
    background: linear-gradient(
      145deg,
      #042528 0%,
      #073b3f 55%,
      #0b5d61 100%
    );
    overflow: hidden;
    position: relative;
  }

  .lp-hero::after {
    background:
      radial-gradient(ellipse 60% 50% at 85% 40%, rgba(245,158,11,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 50% 60% at 10% 80%, rgba(11,93,97,0.35) 0%, transparent 70%);
    content: '';
    inset: 0;
    pointer-events: none;
    position: absolute;
  }

  .lp-hero-body {
    align-items: center;
    display: flex;
    min-height: 600px;
    padding: 120px 0 72px;
    position: relative;
    z-index: 1;
  }

  .lp-hero-text { max-width: 640px; }
  .lp-hero-text h1 { color: #fff; }
  .lp-hero-text .lp-eyebrow { color: var(--amber); }

  .lp-hero-lead {
    color: rgba(255,255,255,0.78);
    font-size: 1.1rem;
    line-height: 1.72;
    margin: 20px 0 0;
    max-width: 560px;
  }

  .lp-hero-actions {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 32px;
  }

  /* Module pills */
  .lp-hero-pills {
    background: rgba(0,0,0,0.18);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 0;
    position: relative;
    z-index: 2;
  }

  .lp-pills-row {
    align-items: stretch;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .lp-pill {
    align-items: center;
    border-right: 1px solid rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.72);
    display: flex;
    font-family: 'Inter', sans-serif;
    font-size: 0.84rem;
    font-weight: 500;
    gap: 10px;
    justify-content: center;
    padding: 18px 16px;
    transition: background 0.2s, color 0.2s;
  }

  .lp-pill:last-child { border-right: none; }

  .lp-pill:hover {
    background: rgba(255,255,255,0.06);
    color: #fff;
  }

  .lp-pill-icon {
    align-items: center;
    color: var(--amber);
    display: flex;
    flex-shrink: 0;
    opacity: 0.9;
  }

  /* ── STATS BAR ─────────────────────────────────────── */
  .lp-stats-bar {
    background: var(--teal-50);
    border-bottom: 1px solid var(--line);
    padding: 42px 0;
  }

  .lp-stats-row {
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(3, 1fr);
  }

  .lp-stat {
    padding: 8px 24px;
    text-align: center;
  }

  .lp-stat + .lp-stat {
    border-left: 1px solid var(--line);
  }

  .lp-stat strong {
    color: var(--teal-600);
    display: block;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .lp-stat span {
    color: var(--muted);
    display: block;
    font-size: 0.85rem;
    margin-top: 4px;
  }

  /* ── SECTIONS ──────────────────────────────────────── */
  .lp-section { padding: 96px 0; }

  .lp-section-header {
    margin-bottom: 56px;
    max-width: 660px;
  }

  .lp-section-lead {
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.7;
    margin: 18px 0 0;
    max-width: 560px;
  }

  .lp-section-teal {
    background: linear-gradient(160deg, var(--teal-800) 0%, var(--teal-700) 100%);
    color: #fff;
  }

  .lp-section-teal .lp-eyebrow { color: var(--amber); }
  .lp-section-teal .lp-eyebrow::before { background: var(--amber); }

  /* ── FEATURE CARDS ─────────────────────────────────── */
  .lp-feature-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(4, 1fr);
  }

  .lp-feat-card {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: 16px;
    cursor: default;
    padding: 28px 24px;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .lp-feat-card:hover {
    border-color: var(--accent);
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
    transform: translateY(-4px);
  }

  .lp-feat-icon {
    align-items: center;
    background: var(--accent-light);
    border-radius: 12px;
    color: var(--accent);
    display: flex;
    height: 52px;
    justify-content: center;
    margin-bottom: 18px;
    width: 52px;
  }

  .lp-feat-tag {
    background: var(--accent-light);
    border-radius: 4px;
    color: var(--accent);
    display: inline-block;
    font-family: 'Inter', sans-serif;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
    padding: 3px 8px;
    text-transform: uppercase;
  }

  .lp-feat-card h3 {
    color: var(--ink);
    font-size: 1rem;
    line-height: 1.35;
    margin: 0 0 10px;
  }

  .lp-feat-card p {
    color: var(--muted);
    font-size: 0.875rem;
    line-height: 1.68;
    margin: 0;
  }

  /* ── HOW IT WORKS ──────────────────────────────────── */
  .lp-howitworks {
    align-items: start;
    display: grid;
    gap: 64px;
    grid-template-columns: 1fr 1fr;
    padding: 96px 0;
  }

  .lp-howitworks-left {
    display: flex;
    flex-direction: column;
  }

  .lp-howitworks-left h2 { color: #fff; }

  .lp-howitworks-copy {
    color: rgba(255,255,255,0.68);
    font-size: 1rem;
    line-height: 1.72;
    margin: 18px 0 0;
    max-width: 400px;
  }

  .lp-steps {
    display: grid;
    gap: 14px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .lp-step {
    align-items: flex-start;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    display: flex;
    gap: 20px;
    padding: 20px 22px;
    transition: background 0.22s ease, border-color 0.22s ease;
  }

  .lp-step:hover {
    background: rgba(255,255,255,0.09);
    border-color: rgba(245,158,11,0.35);
  }

  .lp-step-num {
    color: var(--amber);
    flex-shrink: 0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    margin-top: 2px;
  }

  .lp-step strong {
    color: #fff;
    display: block;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.98rem;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .lp-step p {
    color: rgba(255,255,255,0.6);
    font-size: 0.85rem;
    line-height: 1.6;
    margin: 0;
  }

  /* ── CTA ───────────────────────────────────────────── */
  .lp-cta {
    background: var(--surface);
    border-top: 1px solid var(--line);
    padding: 96px 0;
  }

  .lp-cta-body {
    align-items: center;
    display: flex;
    gap: 48px;
    justify-content: space-between;
  }

  .lp-cta-text h2 {
    color: var(--ink);
    margin-top: 12px;
  }

  .lp-cta-text p {
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.7;
    margin: 16px 0 0;
  }

  .lp-cta-actions {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 12px;
  }

  .lp-cta-note {
    color: var(--muted-lt);
    font-size: 0.82rem;
    margin: 0;
    text-align: center;
  }

  /* ── Responsive ────────────────────────────────────── */
  @media (max-width: 1024px) {
    .lp-feature-grid { grid-template-columns: repeat(2, 1fr); }
    .lp-howitworks { grid-template-columns: 1fr; gap: 40px; }
  }

  @media (max-width: 768px) {
    .lp-stats-row { grid-template-columns: 1fr; }
    .lp-stat + .lp-stat { border-left: none; border-top: 1px solid var(--line); }
    .lp-cta-body { flex-direction: column; align-items: flex-start; }
    .lp-cta-actions { width: 100%; }
    .lp-btn-lg { width: 100%; }
  }

  @media (max-width: 720px) {
    .lp-pills-row { grid-template-columns: repeat(2, 1fr); }
    .lp-pill:nth-child(2) { border-right: none; }
    .lp-pill:nth-child(3),
    .lp-pill:nth-child(4) { border-top: 1px solid rgba(255,255,255,0.07); }
  }

  @media (max-width: 600px) {
    .lp-hero { min-height: 480px; }
    .lp-hero-body { padding: 100px 0 0; min-height: 420px; }
    .lp-section { padding: 64px 0; }
    .lp-howitworks { padding: 64px 0; }
    .lp-cta { padding: 64px 0; }
    .lp-feature-grid { grid-template-columns: 1fr; gap: 14px; }
    .lp-hero-actions { flex-direction: column; }
    .lp-hero-actions .lp-btn { width: 100%; }
    .lp-container { width: min(100% - 32px, 1120px); }
  }
`;
