// src/components/features/settings/UserProfileTab.jsx
import { useState } from "react";

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
      <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl font-bold text-green-700">
            {(form.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800">
              {form.name || "Pengguna"}
            </h2>
            <p className="text-sm text-neutral-500">{form.email || "—"}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                profile?.is_verified
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {profile?.is_verified
                ? "✅ Terverifikasi"
                : "⏳ Belum verifikasi"}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-neutral-800">
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

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e5e5e5;
          background: #fff;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: #262626;
          outline: none;
        }
        .input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.15);
        }
      `}</style>
    </form>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-600">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[10px] text-amber-600">{hint}</span>
      )}
    </label>
  );
}