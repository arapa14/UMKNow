// src/components/features/settings/StoreProfileTab.jsx
import { useMemo, useState } from "react";
import {
  Store,
  Link as LinkIcon,
  Copy,
  Check,
  Building2,
  BarChart3,
} from "lucide-react";
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
  const [copied, setCopied] = useState(false);

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

  // Toggle switch untuk status toko — tetap mengubah field `is_active` yang sama
  const handleToggleActive = () => {
    setForm((f) => ({ ...f, is_active: !f.is_active }));
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Gagal copy. Copy manual: " + publicUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Informasi Dasar */}
      <Section title="Informasi Dasar" Icon={Store}>
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
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <img
              src={form.logo_url}
              alt="Logo"
              className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-xs text-slate-500">Preview logo usaha</span>
          </div>
        )}

        {/* Status Toko — pindah ke dalam card yang sama, sebagai baris toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div>
            <p className="text-sm font-medium text-slate-800">Toko Aktif</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Toko nonaktif akan disembunyikan dari katalog publik
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.is_active}
            onClick={handleToggleActive}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              form.is_active ? "bg-[#0a3d3a]" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                form.is_active ? "left-5.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </Section>

      {/* Data Bisnis */}
      <Section title="Data Bisnis (Opsional)" Icon={Building2}>
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
        <Section title="Link Katalog Publik" Icon={LinkIcon} highlight>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="block flex-1 truncate rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-xs text-slate-700">
              {publicUrl}
            </code>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-600" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Link
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Link ini bisa dibuka siapa saja tanpa login. Ganti slug kalau perlu.
          </p>
        </Section>
      )}

      {/* Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#0a3d3a] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0a3d3a]/90 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Profil Usaha"}
        </button>
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

function Section({ title, Icon, children, highlight }) {
  return (
    <div
      className={`space-y-4 rounded-2xl border p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)] ${
        highlight
          ? "border-slate-200 bg-slate-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <h3 className="flex items-center gap-2 font-semibold text-slate-900">
        {Icon && <Icon size={17} className="text-slate-500" strokeWidth={2} />}
        {title}
      </h3>
      {children}
    </div>
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
        <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>
      )}
    </label>
  );
}