// src/components/features/settings/UserProfileTab.jsx
import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function UserProfileTab({ profile, onSave, saving }) {
  // ✅ Lazy init — dijalankan SEKALI saat mount
  const [form, setForm] = useState(() => ({
    name: profile?.name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
  }));
  const [dirtyEmail, setDirtyEmail] = useState(false);

  const set = (k) => (e) => {
    if (k === "email") setDirtyEmail(e.target.value !== profile.email);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-2xl font-bold text-slate-600">
            {(form.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">
              {form.name || "Pengguna"}
            </h2>
            <p className="text-sm text-slate-500">{form.email || "—"}</p>
            {profile?.is_verified ? (
              <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
                <CheckCircle2 size={12} />
                Terverifikasi
              </span>
            ) : (
              <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
                <AlertCircle size={12} />
                Belum Verifikasi
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
        <h3 className="mb-4 font-semibold text-slate-900">
          Informasi Pribadi
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Lengkap *">
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              required
              className="input"
              placeholder="Contoh: Budi Santoso"
            />
          </Field>

          <Field
            label="Email"
            hint={dirtyEmail ? "Email baru perlu dikonfirmasi ulang" : ""}
          >
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              required
              className="input"
              placeholder="email@example.com"
            />
          </Field>

          <Field label="Nomor WhatsApp / HP">
            <input
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              className="input"
              placeholder="08123456789"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#0a3d3a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0a3d3a]/90 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: rgba(248, 250, 252, 0.5);
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          transition: all 0.15s ease;
        }
        .input:hover {
          border-color: #cbd5e1;
        }
        .input:focus {
          background: #fff;
          border-color: #0a3d3a;
          box-shadow: 0 0 0 3px rgba(10,61,58,0.12);
        }
      `}</style>
    </form>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs text-amber-600">{hint}</span>
      )}
    </label>
  );
}