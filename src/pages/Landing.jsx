import { useEffect, useRef } from "react";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

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
        <rect x="3" y="5" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 14h12M8 18h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 10h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="19" cy="10" r="2.5" fill="currentColor" opacity=".3" />
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
        <rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="15" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="4" y="15" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M15 19.5h9M19.5 15v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8" />
        <path d="M14 4c-3 4-3 16 0 20M14 4c3 4 3 16 0 20M4 14h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
        <rect x="4" y="3" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 9h8M8 13h6M8 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="21" cy="21" r="5" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="1.8" />
        <path d="M19.5 21h3M21 19.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

const pillModules = [
  { label: "Kasir Pintar", icon: <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="2" /><path d="M8 14h12M8 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
  { label: "Manajemen Stok", icon: <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2" /><rect x="15" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2" /><rect x="4" y="15" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M15 19.5h9M19.5 15v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
  { label: "Katalog Online", icon: <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" /><path d="M4 14h20M14 4c-3 4-3 16 0 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
  { label: "Pembukuan", icon: <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="16" height="22" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M8 9h8M8 13h6M8 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg> },
];

const steps = [
  { n: "01", title: "Daftarkan toko", desc: "Buat akun dan isi profil toko dalam satu menit." },
  { n: "02", title: "Masukkan produk", desc: "Tambah daftar produk beserta harga dan stok awal." },
  { n: "03", title: "Mulai transaksi", desc: "Langsung proses penjualan via kasir di HP manapun." },
  { n: "04", title: "Pantau laporan", desc: "Lihat ringkasan omzet dan stok kapan pun kamu mau." },
];

const stats = [
  { value: "64 Juta", label: "UMKM aktif di Indonesia" },
  { value: "< 2 menit", label: "Waktu setup awal" },
  { value: "100%", label: "Berbasis web, cukup HP" },
];

const revealState = "opacity-0 translate-y-6 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100";
const reveal = `${revealState} transition-[opacity,translate] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]`;
const revealDelays = ["", "delay-100", "delay-200"];
const container = "mx-auto w-[min(1120px,calc(100%_-_48px))] max-[600px]:w-[min(1120px,calc(100%_-_32px))]";
const heading = "m-0 max-w-[820px] font-display font-extrabold leading-[1.06] tracking-[-0.03em]";
const button = "inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-[10px] border-0 px-[22px] font-display text-[0.95rem] font-bold whitespace-nowrap no-underline transition-[translate,box-shadow,background] duration-[180ms] ease-[ease] hover:-translate-y-0.5 active:translate-y-0";
const amberButton = "bg-amber-500 text-[#0f2526] shadow-[0_2px_16px_rgba(245,158,11,0.3)] hover:bg-amber-400 hover:shadow-[0_4px_24px_rgba(245,158,11,0.4)]";

export default function Landing() {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.visible = "true";
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll("[data-reveal]").forEach((element) =>
      observerRef.current.observe(element)
    );

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="bg-white font-sans text-[#0f2526] antialiased" id="top">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(145deg,_#042528_0%,_#073b3f_55%,_#0b5d61_100%)] after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_60%_50%_at_85%_40%,_rgba(245,158,11,0.06)_0%,_transparent_70%),radial-gradient(ellipse_50%_60%_at_10%_80%,_rgba(11,93,97,0.35)_0%,_transparent_70%)] after:content-[''] max-[600px]:min-h-[480px]">
          <div className={`${container} relative z-[1] flex min-h-[600px] items-center pt-[120px] pb-[72px] max-[600px]:min-h-[420px] max-[600px]:pt-[100px] max-[600px]:pb-0`}>
            <div className="max-w-[640px]">
              <p className={`mb-4 block font-sans text-[0.72rem] font-bold uppercase tracking-[0.14em] text-amber-500 ${reveal}`} data-reveal>
                Platform digitalisasi UMKM Indonesia
              </p>
              <h1 className={`${heading} text-[clamp(2.6rem,6vw,4.5rem)] text-white ${reveal} delay-100`} data-reveal>
                Dari warung ke digital,<br />
                <em className="italic text-amber-500">tanpa perlu ribet.</em>
              </h1>
              <p className={`mt-5 max-w-[560px] text-[1.1rem] leading-[1.72] text-white/[0.78] ${reveal} delay-200`} data-reveal>
                UMKNow menyatukan kasir, stok, katalog online, dan pembukuan dalam satu aplikasi.
                Cukup pakai HP, langsung pakai hari ini.
              </p>
              <div className={`mt-8 flex flex-wrap items-center gap-3 max-[600px]:flex-col ${reveal} delay-300`} data-reveal>
                <a className={`${button} ${amberButton} max-[600px]:w-full`} href="/register" id="hero-cta-primary">
                  Mulai gratis sekarang
                </a>
                <a className={`${button} border border-white/[0.3] bg-white/[0.12] text-white hover:bg-white/[0.2] max-[600px]:w-full`} href="#cara-kerja" id="hero-cta-secondary">
                  Lihat cara kerja ↓
                </a>
              </div>
            </div>
          </div>

          <div className="relative z-[2] border-t border-white/[0.07] bg-black/[0.18] p-0 backdrop-blur-[8px]" aria-label="Modul UMKNow">
            <div className={container}>
              <div className="grid grid-cols-4 items-stretch max-[720px]:grid-cols-2">
                {pillModules.map((module, index) => (
                  <div
                    className={`flex items-center justify-center gap-2.5 border-r border-white/[0.07] px-4 py-[18px] font-sans text-[0.84rem] font-medium text-white/[0.72] transition-[background,color] duration-200 ease-[ease] hover:bg-white/[0.06] hover:text-white ${index === 3 ? "border-r-0" : ""} ${index === 1 ? "max-[720px]:border-r-0" : ""} ${index > 1 ? "max-[720px]:border-t max-[720px]:border-white/[0.07]" : ""}`}
                    key={module.label}
                  >
                    <span className="flex shrink-0 items-center text-amber-500 opacity-90">{module.icon}</span>
                    <span>{module.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#dae6e7] bg-[#edf6f6] py-[42px]" aria-label="Statistik">
          <div className={`${container} grid grid-cols-3 gap-px max-[768px]:grid-cols-1`}>
            {stats.map((stat, index) => (
              <div
                className={`px-6 py-2 text-center ${reveal} ${index ? "border-l border-[#dae6e7] max-[768px]:border-t max-[768px]:border-l-0" : ""}`}
                data-reveal
                key={stat.label}
              >
                <strong className="block font-display text-[clamp(1.8rem,3vw,2.4rem)] font-extrabold tracking-[-0.03em] text-[#0b5d61]">
                  {stat.value}
                </strong>
                <span className="mt-1 block text-[0.85rem] text-[#4b6568]">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 max-[600px]:py-16" id="fitur" aria-labelledby="fitur-heading">
          <div className={container}>
            <div className={`mb-14 max-w-[660px] ${reveal}`} data-reveal>
              <p className="mb-4 block font-sans text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#0b5d61]">
                Fitur inti
              </p>
              <h2 className={`${heading} text-[clamp(2rem,4.5vw,3.2rem)]`} id="fitur-heading">
                Semua yang dibutuhkan toko,<br />
                dalam satu tempat.
              </h2>
              <p className="mt-[18px] max-w-[560px] text-[1.05rem] leading-[1.7] text-[#4b6568]">
                Tidak perlu banyak aplikasi berbeda. UMKNow menangani operasional toko dari depan sampai laporan.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-5 max-[1024px]:grid-cols-2 max-[600px]:grid-cols-1 max-[600px]:gap-[14px]">
              {features.map((feature, index) => (
                <article
                  className={`cursor-default rounded-2xl border border-[#dae6e7] bg-white px-6 py-7 transition-[translate,box-shadow,border-color] duration-[250ms] ease-[ease] hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] data-[visible=true]:hover:-translate-y-1 ${revealState} ${revealDelays[index % 3]}`}
                  data-reveal
                  key={feature.id}
                  style={{ "--accent": feature.accent, "--accent-light": feature.accentLight }}
                >
                  <div className="mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-[var(--accent-light)] text-[var(--accent)]">
                    {feature.icon}
                  </div>
                  <div className="mb-2.5 inline-block rounded bg-[var(--accent-light)] px-2 py-[3px] font-sans text-[0.67rem] font-bold uppercase tracking-[0.1em] text-[var(--accent)]">
                    {feature.tag}
                  </div>
                  <h3 className="m-0 mb-2.5 font-display text-[1rem] font-extrabold leading-[1.35] tracking-[-0.03em] text-[#0f2526]">
                    {feature.headline}
                  </h3>
                  <p className="m-0 text-[0.875rem] leading-[1.68] text-[#4b6568]">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(160deg,_#052e31_0%,_#073b3f_100%)] py-24 text-white max-[600px]:py-16" id="cara-kerja" aria-labelledby="cara-kerja-heading">
          <div className={`${container} grid grid-cols-2 items-start gap-16 py-24 max-[1024px]:grid-cols-1 max-[1024px]:gap-10 max-[600px]:py-16`}>
            <div className={`flex flex-col ${reveal}`} data-reveal>
              <p className="mb-4 block font-sans text-[0.72rem] font-bold uppercase tracking-[0.14em] text-amber-500">
                Cara kerja
              </p>
              <h2 className={`${heading} text-[clamp(2rem,4.5vw,3.2rem)] text-white`} id="cara-kerja-heading">
                Mulai dari toko pertama<br />
                tanpa proses yang rumit.
              </h2>
              <p className="mt-[18px] max-w-[400px] text-[1rem] leading-[1.72] text-white/[0.68]">
                Setup UMKNow tidak memerlukan pengetahuan teknis. Cukup siapkan data toko dan produk, sisanya kami yang urus.
              </p>
              <a className={`${button} ${amberButton} mt-7 self-start`} href="/register" id="steps-cta">
                Daftar dan coba sekarang
              </a>
            </div>

            <ol className="m-0 grid list-none gap-[14px] p-0">
              {steps.map((step, index) => (
                <li
                  className={`flex items-start gap-5 rounded-[14px] border border-white/[0.1] bg-white/[0.05] px-[22px] py-5 transition-[background,border-color] duration-[220ms] ease-[ease] hover:border-amber-500/[0.35] hover:bg-white/[0.09] ${revealState} ${revealDelays[index % 3]}`}
                  data-reveal
                  key={step.n}
                >
                  <span className="mt-0.5 shrink-0 font-display text-[0.8rem] font-extrabold tracking-[0.04em] text-amber-500">
                    {step.n}
                  </span>
                  <div>
                    <strong className="mb-1 block font-display text-[0.98rem] font-bold text-white">{step.title}</strong>
                    <p className="m-0 text-[0.85rem] leading-[1.6] text-white/[0.6]">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-[#dae6e7] bg-[#f5f8f8] py-24 max-[600px]:py-16" aria-label="Call to action">
          <div className={`${container} flex items-center justify-between gap-12 max-[768px]:items-start max-[768px]:flex-col`}>
            <div className={reveal} data-reveal>
              <p className="mb-4 block font-sans text-[0.72rem] font-bold uppercase tracking-[0.14em] text-amber-500">
                Siap digitalisasi?
              </p>
              <h2 className={`${heading} mt-3 text-[clamp(2rem,4.5vw,3.2rem)] text-[#0f2526]`}>
                Rapikan operasional toko<br />
                mulai hari ini.
              </h2>
              <p className="mt-4 text-[1rem] leading-[1.7] text-[#4b6568]">
                Ribuan UMKM sudah mulai. Tidak ada biaya tersembunyi,<br />
                tidak ada setup yang rumit.
              </p>
            </div>
            <div className={`flex shrink-0 flex-col items-center gap-3 ${reveal} delay-100 max-[768px]:w-full`} data-reveal>
              <a className={`${button} ${amberButton} min-h-[54px] px-[30px] text-[1.05rem] max-[768px]:w-full`} href="/register" id="cta-final">
                Buat akun toko gratis
              </a>
              <p className="m-0 text-center text-[0.82rem] text-[#748c8f]">Cukup pakai HP, langsung bisa dipakai.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
