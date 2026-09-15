// src/components/features/settings/SecurityTab.jsx
import { useState } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h3 className="mb-1 font-semibold text-neutral-800">
          🔑 Ubah Password
        </h3>
        <p className="mb-4 text-xs text-neutral-500">
          Minimal 6 karakter. Disarankan kombinasi huruf & angka.
        </p>

        {localError && (
          <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
            {localError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">
              Password Baru
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              placeholder="••••••••"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">
              Konfirmasi Password
            </span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              placeholder="••••••••"
            />
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Ubah Password"}
          </button>
        </div>
      </div>
    </form>
  );
}
