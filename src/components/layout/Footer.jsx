export default function Footer() {
  return (
    <footer className="bg-teal-900 text-white pt-14 pb-0 font-sans">
      <div className="mx-auto max-w-[1120px] px-6 flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16 pb-11">
        {/* Brand Column */}
        <div className="max-w-[380px]">
          <a
            className="font-display text-2xl font-extrabold text-white tracking-tight inline-block"
            href="#top"
          >
            <span className="text-amber-500">UMK</span>Now
          </a>
          <p className="text-sm text-white/60 leading-relaxed mt-3">
            Alat sederhana untuk membantu UMKM Indonesia mengelola operasional toko setiap hari, dari kasir sampai laporan.
          </p>
        </div>

        {/* Navigation Columns (2 Kolom Seimbang) */}
        <div className="flex gap-12 sm:gap-16">
          <nav className="flex flex-col gap-2.5 min-w-[100px]" aria-label="Navigasi produk">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">
              Produk
            </p>
            <a href="#fitur" className="text-sm font-medium text-white/75 hover:text-white transition-colors">
              Fitur Utama
            </a>
            <a href="#cara-kerja" className="text-sm font-medium text-white/75 hover:text-white transition-colors">
              Cara Kerja
            </a>
          </nav>

          <nav className="flex flex-col gap-2.5 min-w-[100px]" aria-label="Akses toko">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">
              Akses Toko
            </p>
            <a href="/login" className="text-sm font-medium text-white/75 hover:text-white transition-colors">
              Masuk
            </a>
            <a href="/register" className="text-sm font-medium text-white/75 hover:text-white transition-colors">
              Daftar Gratis
            </a>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mx-auto max-w-[1120px] px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
        <span>© 2026 UMKNow. Dibuat dengan ❤️ untuk UMKM Indonesia.</span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-xs">
          SDGs 9: Industry &amp; Innovation
        </span>
      </div>
    </footer>
  );
}
