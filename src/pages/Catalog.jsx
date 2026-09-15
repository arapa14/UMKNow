// src/pages/Catalog.jsx
import { useState } from "react";
import { 
  Search, 
  Store, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink, 
  Package, 
  Globe, 
  EyeOff,
  Image as ImageIcon
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCatalog } from "../hooks/useCatalog";
import { formatCurrency } from "../utils/formatCurrency";
import toast from "react-hot-toast";

export default function Catalog() {
  const { currentStore } = useAuth();
  const {
    products,
    loading,
    error,
    search,
    setSearch,
    stats,
    publicUrl,
    toggleCatalog,
  } = useCatalog(currentStore);

  const [copied, setCopied] = useState(false);

  // ===== Empty state: belum pilih toko =====
  if (!currentStore?.id) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
          <Store size={32} />
        </div>
        <h2 className="font-semibold text-amber-800">Belum ada toko aktif</h2>
        <p className="mt-1 text-sm text-amber-700">Pilih atau buat toko terlebih dahulu di menu pengaturan.</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal copy. Copy manual: " + publicUrl);
    }
  };

  const handleShareWA = () => {
    const text = `Halo! Cek katalog ${currentStore.name} di sini ya 👇\n${publicUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleOpen = () => {
    window.open(publicUrl, "_blank");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Katalog Online</h1>
        <p className="text-sm text-gray-500 mt-1">
          Atur produk yang tampil untuk publik. Bagikan tautan agar pelanggan bisa memesan langsung.
        </p>
      </div>

      {/* Public link card */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <LinkIcon size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-emerald-800">
              Tautan Katalog Publik
            </p>
            <a 
              href={publicUrl} 
              target="_blank" 
              rel="noreferrer"
              className="mt-0.5 inline-block break-all text-sm font-medium text-gray-600 hover:text-emerald-600 hover:underline transition-colors"
            >
              {publicUrl || "Memuat tautan..."}
            </a>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                onClick={handleCopy}
                disabled={!publicUrl}
                className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                {copied ? "Tersalin" : "Salin Link"}
              </button>
              <button
                onClick={handleShareWA}
                disabled={!publicUrl}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <MessageCircle size={14} />
                Bagikan ke WA
              </button>
              <button
                onClick={handleOpen}
                disabled={!publicUrl}
                className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <ExternalLink size={14} />
                Lihat Katalog
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MiniStat label="Total Produk" value={stats.total} Icon={Package} />
        <MiniStat
          label="Tampil di Katalog"
          value={stats.shown}
          Icon={Globe}
          accent="emerald"
        />
        <MiniStat
          label="Sembunyi"
          value={stats.total - stats.shown}
          Icon={EyeOff}
          accent="amber"
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm text-gray-800 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <span className="ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
          {products.length} produk
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <SkeletonList />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center">
          <Package size={40} className="text-gray-300 mb-3" strokeWidth={1.5} />
          <h3 className="font-semibold text-gray-700">Belum ada produk</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tambah produk di halaman Produk & Stok terlebih dahulu.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {products.map((p) => (
            <ProductCatalogRow
              key={p.id}
              product={p}
              onToggle={toggleCatalog}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Sub-components =====

function MiniStat({ label, value, Icon, accent = "neutral" }) {
  const colors = {
    neutral: "bg-gray-100 text-gray-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colors[accent]}`}
      >
        <Icon size={18} strokeWidth={2} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function ProductCatalogRow({ product, onToggle }) {
  const [busy, setBusy] = useState(false);

  const handleToggle = async () => {
    setBusy(true);
    try {
      await onToggle(product.id, !product.is_catalog);
    } catch (err) {
      toast.error("Gagal update: " + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:shadow-md">
      {/* Image */}
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <ImageIcon size={20} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-gray-800">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {formatCurrency(product.price)}
          {product.category && <span className="text-gray-300 mx-1.5">•</span>}
          {product.category}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[10px]">
          <span
            className={`rounded-md px-1.5 py-0.5 font-medium ${
              product.is_active
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20"
                : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
            }`}
          >
            {product.is_active ? "Produk Aktif" : "Nonaktif"}
          </span>
          <span className="text-gray-400 font-medium">Stok: {product.stock}</span>
        </div>
      </div>

      {/* Toggle */}
      <div className="pr-2">
        <button
          onClick={handleToggle}
          disabled={busy || !product.is_active}
          title={
            !product.is_active
              ? "Aktifkan produk dulu di Inventory"
              : product.is_catalog
                ? "Sembunyikan dari katalog"
                : "Tampilkan di katalog"
          }
          className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors disabled:opacity-50 ${
            product.is_catalog ? "bg-[#0a3d3a]" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
              product.is_catalog ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-[88px] w-full animate-pulse rounded-2xl bg-gray-100"
        />
      ))}
    </div>
  );
}