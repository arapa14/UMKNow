import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-900 p-6 font-sans text-white">
      <div className="max-w-[480px] w-full text-center flex flex-col items-center">
        {/* Brand Logo */}
        <Link
          to="/"
          className="font-display text-2xl font-extrabold text-white tracking-tight mb-10 inline-block"
          title="Kembali ke Beranda"
        >
          <span className="text-amber-500">UMK</span>Now
        </Link>

        {/* 404 Code & Heading */}
        <div className="font-display text-7xl sm:text-8xl font-extrabold leading-none tracking-tighter text-amber-500 mb-4">
          404
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Halaman Belum Tersedia
        </h1>
        <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-8">
          Halaman yang Anda tuju sedang dalam tahap pengembangan atau URL tidak ditemukan. Silakan kembali ke beranda atau masuk ke akun Anda.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-display font-bold text-sm bg-amber-500 hover:bg-amber-400 text-teal-900 transition-all hover:-translate-y-0.5 shadow-sm"
          >
            Kembali ke Beranda
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-display font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors"
          >
            Ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
