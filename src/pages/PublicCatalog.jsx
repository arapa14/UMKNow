// src/pages/PublicCatalog.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Info,
  MessageCircle,
  Package,
  CalendarDays,
  FileText,
  MapPin,
  X,
  Store,
  ShoppingBag,
  Image as ImageIcon,
  SearchX,
} from "lucide-react";
import { getPublicCatalogBySlug } from "../services/publicCatalogService";
import supabase from "../lib/supabase-client";
import { formatCurrency } from "../utils/formatCurrency";

const SOFT_SHADOW = "shadow-[0_8px_30px_rgb(0,0,0,0.04)]";

function formatJoinedAt(createdAt) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export default function PublicCatalog() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [category, setCategory] = useState("");

  useEffect(() => {
    let ignore = false;
    let catalogChannel;

    const loadCatalog = async ({ showLoading = false } = {}) => {
      if (showLoading) setLoading(true);
      setError(null);
      try {
        const { store: s, products: p } = await getPublicCatalogBySlug(slug);
        if (ignore) return;
        setStore(s);
        setProducts(p);

        // Perubahan profil atau produk di katalog langsung dimuat ulang
        // tanpa pengunjung perlu me-refresh halaman.
        if (s && !catalogChannel) {
          catalogChannel = supabase
            .channel(`public-catalog-${s.id}`)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "stores", filter: `id=eq.${s.id}` },
              () => void loadCatalog(),
            )
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "products", filter: `store_id=eq.${s.id}` },
              () => void loadCatalog(),
            )
            .subscribe();
        }
      } catch (err) {
        if (ignore) return;
        console.error("PublicCatalog error:", err);
        setError(err.message || "Gagal memuat katalog");
      } finally {
        if (!ignore && showLoading) setLoading(false);
      }
    };

    void loadCatalog({ showLoading: true });

    return () => {
      ignore = true;
      if (catalogChannel) supabase.removeChannel(catalogChannel);
    };
  }, [slug]);

  // Derived
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.category && set.add(p.category));
    return [...set].sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [products, category, search]);

  const waLink = (product) => {
    const phone = String(store?.phone || "").replace(/\D/g, "");
    const normalized = phone.startsWith("0")
      ? "62" + phone.slice(1)
      : phone.startsWith("62")
        ? phone
        : phone;
    const text = `Halo ${store?.name}, saya mau pesan:\n\n*${product.name}*\nHarga: ${formatCurrency(product.price)}\n\nApakah tersedia?`;
    return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
  };

  // ===== Loading =====
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#0a3d3a]/20 border-t-[#0a3d3a]" />
          <p className="mt-4 text-sm font-medium text-slate-400">Memuat katalog...</p>
        </div>
      </div>
    );
  }

  // ===== Not found =====
  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div
          className={`w-full max-w-sm rounded-3xl bg-white p-8 text-center ${SOFT_SHADOW} flex flex-col items-center`}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300 mb-4">
            <SearchX size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-lg font-bold text-slate-900">Toko Tidak Ditemukan</h1>
          <p className="mt-2 text-sm text-slate-500">
            Tautan katalog mungkin salah atau toko sudah tidak aktif.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ==== Hero Banner + Profile (centered inside) ==== */}
      <div className="relative bg-[#0a3d3a] px-4 pb-10 pt-10 sm:pb-12 sm:pt-14">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-28 sm:w-28">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-[#0a3d3a] sm:text-4xl">
                {store.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-xl font-bold text-white sm:text-2xl">{store.name}</h1>

          {store.category && (
            <span className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-emerald-200 ring-1 ring-white/20">
              {store.category}
            </span>
          )}

          <button
            onClick={() => setIsInfoOpen(true)}
            className="mt-5 flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <Info size={16} />
            Lihat Info Toko
          </button>
        </div>
      </div>

      {/* ==== Content ==== */}
      <div className="mx-auto max-w-4xl px-4">
        {/* Search & filter — floating over the banner edge */}
        <div className={`-mt-8 rounded-2xl bg-white p-2 ${SOFT_SHADOW} relative z-10`}>
          <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-slate-100">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl bg-transparent py-3 pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
            {categories.length > 0 && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-slate-800 outline-none sm:max-w-[190px]"
              >
                <option value="">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Products */}
        {filtered.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <ShoppingBag size={48} className="text-slate-300 mb-4" strokeWidth={1.5} />
            <p className="font-semibold text-slate-800 text-lg">
              {products.length === 0 ? "Katalog Masih Kosong" : "Produk tidak ditemukan"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {products.length === 0
                ? "Toko ini belum menambahkan produk ke etalase publik."
                : "Coba gunakan kata kunci pencarian lain."}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} waHref={waLink(p)} hasPhone={!!store.phone} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center justify-center gap-2 border-t border-slate-200 pt-8 text-xs text-slate-400">
          <p>Katalog ini dibuat dengan</p>
          <div className="flex items-center gap-1.5 font-bold text-slate-600">
            <Store size={14} className="text-[#0a3d3a]" />
            UMKNow
          </div>
        </div>
      </div>

      <StoreInfoModal
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        store={store}
        productsCount={products.length}
      />
    </div>
  );
}

function StoreInfoModal({ open, onClose, store, productsCount }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className={`w-full max-w-md overflow-hidden rounded-3xl bg-white ${SOFT_SHADOW}`}>
        {/* Header + mini profile (tinted) */}
        <div className="bg-slate-50 px-5 pb-5 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Rincian Toko</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-[#0a3d3a]">
                  {store.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{store.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Aktif hari ini
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex flex-col">
            <div className="flex items-center border-b border-slate-100 py-3.5 text-sm">
              <MessageCircle size={18} className="mr-3 text-slate-400" />
              <span className="text-slate-500">Performa Chat</span>
              <span className="ml-auto font-semibold text-slate-800">95%</span>
            </div>

            <div className="flex items-center border-b border-slate-100 py-3.5 text-sm">
              <Package size={18} className="mr-3 text-slate-400" />
              <span className="text-slate-500">Total Produk</span>
              <span className="ml-auto font-semibold text-slate-800">{productsCount}</span>
            </div>

            <div className="flex items-center border-b border-slate-100 py-3.5 text-sm">
              <CalendarDays size={18} className="mr-3 text-slate-400" />
              <span className="text-slate-500">Bergabung</span>
              <span className="ml-auto font-semibold text-slate-800">
                {formatJoinedAt(store.created_at)}
              </span>
            </div>

            {store.description && (
              <div className="flex border-b border-slate-100 py-4 text-sm">
                <FileText size={18} className="mr-3 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <span className="mb-1.5 block font-medium text-slate-500">Deskripsi</span>
                  <p className="rounded-2xl bg-emerald-50/50 p-3 text-xs leading-relaxed text-slate-700">
                    {store.description}
                  </p>
                </div>
              </div>
            )}

            {(store.address || store.phone) && (
              <div className="flex border-slate-100 py-4 text-sm">
                <MapPin size={18} className="mr-3 shrink-0 text-slate-400" />
                <div className="flex-1">
                  <span className="mb-1.5 block font-medium text-slate-500">Lokasi / Kontak</span>
                  {store.address && (
                    <p className="mb-1.5 text-xs leading-relaxed text-slate-800">{store.address}</p>
                  )}
                  {store.phone && (
                    <p className="text-xs font-semibold tracking-wide text-emerald-600">
                      {store.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Product Card =====
function ProductCard({ product, waHref, hasPhone }) {
  const outOfStock = Number(product.stock) <= 0;

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white ${SOFT_SHADOW} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageIcon size={32} />
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="rounded-full bg-red-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <p className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#0a3d3a]">
          {product.name}
        </p>

        {product.category && (
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {product.category}
          </p>
        )}

        <p className="mt-2 text-base font-bold text-[#0a3d3a]">{formatCurrency(product.price)}</p>

        <a
          href={hasPhone ? waHref : undefined}
          target={hasPhone ? "_blank" : undefined}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!hasPhone || outOfStock) e.preventDefault();
          }}
          className={`mt-4 flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-xs font-bold transition-all ${
            outOfStock || !hasPhone
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
          }`}
        >
          {outOfStock ? (
            "Stok Habis"
          ) : hasPhone ? (
            <>
              <MessageCircle size={16} /> Pesan via WA
            </>
          ) : (
            "Toko belum ada WA"
          )}
        </a>
      </div>
    </div>
  );
}
