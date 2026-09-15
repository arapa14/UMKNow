// src/components/features/inventory/ProductFormModal.jsx
import { useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";

export default function ProductFormModal({ onClose, onSubmit, initial }) {
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    stock: initial?.stock ?? "",
    min_stock: initial?.min_stock ?? 5,
    category: initial?.category ?? "",
    image_url: initial?.image_url ?? "",
    is_active: initial?.is_active ?? true,
    is_catalog: initial?.is_catalog ?? false,
  }));
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Nama produk wajib diisi");
    if (form.price === "" || Number(form.price) < 0)
      return setError("Harga wajib diisi (min 0)");
    if (form.stock === "" || Number(form.stock) < 0)
      return setError("Stok wajib diisi (min 0)");

    try {
      setSubmitting(true);
      await onSubmit({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        min_stock: Number(form.min_stock) || 5,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menyimpan produk");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="font-semibold text-neutral-800">
            {initial ? "Edit Produk" : "Tambah Produk"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[75vh] space-y-4 overflow-y-auto px-5 py-4"
        >
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <Field label="Nama Produk *">
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Contoh: Nasi Goreng"
              className="input"
              autoFocus
            />
          </Field>

          <Field label="Deskripsi">
            <textarea
              value={form.description}
              onChange={set("description")}
              rows={2}
              placeholder="Opsional"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga (Rp) *">
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={set("price")}
                placeholder="0"
                className="input"
              />
            </Field>
            <Field label="Kategori">
              <input
                type="text"
                value={form.category}
                onChange={set("category")}
                placeholder="Makanan / Minuman"
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Stok Saat Ini *">
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={set("stock")}
                placeholder="0"
                className="input"
              />
            </Field>
            <Field label="Stok Minimum">
              <input
                type="number"
                min="0"
                value={form.min_stock}
                onChange={set("min_stock")}
                placeholder="5"
                className="input"
              />
            </Field>
          </div>

          {/* ===== Input URL Gambar (Menggantikan Drag & Drop) ===== */}
          <Field label="URL Gambar (Opsional)">
            <input
              type="url"
              value={form.image_url}
              onChange={set("image_url")}
              placeholder="https://..."
              className="input"
            />
            {/* Image Preview / Placeholder */}
            <div className="mt-2 flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Mencegah infinite loop jika placeholder mati
                    e.target.src = "https://placehold.co/150?text=Error+Link";
                  }}
                />
              ) : (
                <ImageIcon className="text-gray-300" size={32} />
              )}
            </div>
            <p className="mt-1 text-[10px] text-gray-400">
              Masukkan link gambar. Biarkan kosong jika tidak ada.
            </p>
          </Field>

          {/* ===== Toggle Switches ===== */}
          <div className="flex flex-wrap gap-4 pt-1">
            <ToggleField
              label="Produk Aktif"
              checked={form.is_active}
              onChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
            />
            <ToggleField
              label="Tampilkan di Katalog"
              checked={form.is_catalog}
              onChange={(v) => setForm((f) => ({ ...f, is_catalog: v }))}
            />
          </div>

          {/* ===== Footer Actions ===== */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#0a3d3a] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a3d3a]/90 disabled:opacity-60 transition-colors"
              disabled={submitting}
            >
              {submitting ? "Menyimpan..." : initial ? "Simpan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
          background: #fff;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #262626;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-600">
        {label}
      </span>
      {children}
    </label>
  );
}

// ===== Toggle Switch =====
function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm text-neutral-700">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
          checked ? "bg-emerald-600" : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
      {label}
    </label>
  );
}