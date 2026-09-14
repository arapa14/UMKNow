// src/components/features/settings/StoreProfileTab.jsx
import { useMemo, useState } from "react";
import { slugify } from "../../../services/settingsService";

export default function StoreProfileTab({
  store,
  categories,
  onSave,
  saving,
}) {
  // ✅ Lazy init dari store
  const [form, setForm] = useState(() => ({
    name: store?.name ?? "",
    slug: store?.slug ?? "",
    category: store?.category ?? "",
    description: store?.description ?? "",
    address: store?.address ?? "",
    phone: store?.phone ?? "",
    logo_url: store?.logo_url ?? "",
    nib_number: store?.nib_number ?? "",
    employee_count: store?.employee_count ?? "",
    founded_year: store?.founded_year ?? "",
    monthly_revenue: store?.monthly_revenue ?? "",
    is_active: store?.is_active ?? true,
  }));
  const [slugTouched, setSlugTouched] = useState(!!store?.slug);

  // Handle semua perubahan lewat 1 fungsi
  const handleChange = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    if (key === "slug") {
      setSlugTouched(true);
      setForm((f) => ({ ...f, slug: value }));
      return;
    }

    if (key === "name") {
      // ✅ Autofill slug DI SINI, bukan di useEffect
      if (!slugTouched) {
        setForm((f) => ({ ...f, name: value, slug: slugify(value) }));
      } else {
        setForm((f) => ({ ...f, name: value }));
      }
      return;
    }

    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  const publicUrl = useMemo(() => {
    if (!form.slug) return "";
    return `${window.location.origin}/toko/${form.slug}`;
  }, [form.slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      alert("Link katalog disalin!");
    } catch {
      alert("Gagal copy. Copy manual: " + publicUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Info Dasar */}
      <Section title="Informasi Dasar" icon="🏪">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Usaha *">
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              required
              className="input"
              placeholder="Contoh: Warung Bu Ani"
            />
          </Field>

          <Field label="Kategori Usaha">
            <select
              value={form.category}
              onChange={handleChange("category")}
              className="input"
            >
              <option value="">— Pilih Kategori —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Slug URL Katalog" hint="Huruf kecil, tanpa spasi">
            <input
              type="text"
              value={form.slug}
              onChange={handleChange("slug")}
              className="input"
              placeholder="warung-bu-ani"
            />
          </Field>

          <Field label="Nomor WhatsApp Toko">
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              className="input"
              placeholder="08123456789"
            />
          </Field>
        </div>

        <Field label="Deskripsi Usaha">
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            rows={3}
            className="input"
            placeholder="Ceritakan singkat tentang usahamu..."
          />
        </Field>

        <Field label="Alamat">
          <textarea
            value={form.address}
            onChange={handleChange("address")}
            rows={2}
            className="input"
            placeholder="Jl. Merdeka No. 123, Jakarta"
          />
        </Field>

        <Field label="URL Logo">
          <input
            type="url"
            value={form.logo_url}
            onChange={handleChange("logo_url")}
            className="input"
            placeholder="https://..."
          />
        </Field>

        {form.logo_url && (
          <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
            <img
              src={form.logo_url}
              alt="Logo"
              className="h-12 w-12 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-xs text-neutral-500">Preview logo usaha</span>
          </div>
        )}
      </Section>

      {/* Data Bisnis */}
      <Section title="Data Bisnis (Opsional)" icon="📊">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="NIB (Nomor Induk Berusaha)">
            <input
              type="text"
              value={form.nib_number}
              onChange={handleChange("nib_number")}
              className="input"
              placeholder="1234567890123"
            />
          </Field>

          <Field label="Jumlah Karyawan">
            <input
              type="number"
              min="0"
              value={form.employee_count}
              onChange={handleChange("employee_count")}
              className="input"
              placeholder="5"
            />
          </Field>

          <Field label="Tahun Berdiri">
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={form.founded_year}
              onChange={handleChange("founded_year")}
              className="input"
              placeholder="2020"
            />
          </Field>

          <Field label="Estimasi Pendapatan / Bulan (Rp)">
            <input
              type="number"
              min="0"
              step="1000"
              value={form.monthly_revenue}
              onChange={handleChange("monthly_revenue")}
              className="input"
              placeholder="5000000"
            />
          </Field>
        </div>
      </Section>

      {/* Katalog Publik */}
      {publicUrl && (
        <Section title="Link Katalog Publik" icon="🔗">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-green-50 p-3">
            <span className="break-all text-xs text-green-800">
              {publicUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="ml-auto rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-green-700 shadow-sm ring-1 ring-green-200 hover:bg-green-100"
            >
              📋 Copy Link
            </button>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            Link ini bisa dibuka siapa saja tanpa login. Ganti slug kalau perlu.
          </p>
        </Section>
      )}

      {/* Status */}
      <Section title="Status Toko" icon="🟢">
        <label className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange("is_active")}
            className="h-4 w-4 rounded border-neutral-300 text-green-600"
          />
          <div>
            <p className="text-sm font-medium text-neutral-700">Toko Aktif</p>
            <p className="text-xs text-neutral-500">
              Toko nonaktif akan disembunyikan dari katalog publik
            </p>
          </div>
        </label>
      </Section>

      {/* Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Profil Usaha"}
        </button>
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

function Section({ title, icon, children }) {
  return (
    <div className="space-y-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 font-semibold text-neutral-800">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
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
        <span className="mt-1 block text-[10px] text-neutral-400">{hint}</span>
      )}
    </label>
  );
}