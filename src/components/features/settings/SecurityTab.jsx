// src/components/features/settings/SecurityTab.jsx
import { useState } from "react";
import { Lock } from "lucide-react";

export default function SecurityTab({ onChangePassword, saving }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (password.length < 6) {
      return setLocalError("Password minimal 6 karakter");
    }
    if (password !== confirm) {
      return setLocalError("Konfirmasi password tidak cocok");
    }

    const ok = await onChangePassword(password);
    if (ok) {
      setPassword("");
      setConfirm("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header Seksi */}
        <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
            <Lock size={20} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Ubah Password
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Pastikan akun Anda tetap aman dengan kata sandi yang kuat.
            </p>
          </div>
        </div>

        {/* Notifikasi Error */}
        {localError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {localError}
          </div>
        )}

        {/* Area Form Input */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Password Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all hover:border-slate-300 focus:bg-white focus:border-[#0a3d3a] focus:ring-2 focus:ring-[#0a3d3a]/15"
              placeholder="••••••••"
            />
            <p className="mt-2 text-xs text-slate-500">
              Minimal 6 karakter, kombinasikan huruf dan angka.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all hover:border-slate-300 focus:bg-white focus:border-[#0a3d3a] focus:ring-2 focus:ring-[#0a3d3a]/15"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={saving || !password || !confirm}
            className="rounded-xl bg-[#0a3d3a] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0a3d3a]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Password"}
          </button>
        </div>
      </div>
    </form>
  );
}