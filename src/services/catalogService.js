// src/services/catalogService.js
import supabase from "../lib/supabase-client";

/**
 * Ambil semua produk toko (untuk halaman kelola katalog)
 */
export async function getAllProductsForCatalog(storeId) {
  if (!storeId) return [];
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, price, stock, category, image_url, is_active, is_catalog",
    )
    .eq("store_id", storeId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Toggle 1 produk masuk/keluar katalog
 */
export async function setProductCatalogFlag(productId, isCatalog) {
  const { data, error } = await supabase
    .from("products")
    .update({ is_catalog: isCatalog, updated_at: new Date().toISOString() })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update info toko (nama, deskripsi, phone, dll) — opsional kalau mau edit
 */
export async function updateStoreInfo(storeId, payload) {
  const { data, error } = await supabase
    .from("stores")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", storeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Generate slug dari nama toko (kalau belum ada)
 */
export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);
}

/**
 * Pastikan toko punya slug. Kalau belum, buat dari nama.
 */
export async function ensureStoreSlug(storeId, storeName) {
  const base = slugify(storeName) || "toko";
  const candidate = `${base}-${Math.random().toString(36).slice(2, 6)}`;

  const { data, error } = await supabase
    .from("stores")
    .update({ slug: candidate, updated_at: new Date().toISOString() })
    .eq("id", storeId)
    .is("slug", null) // ⚠️ hanya update kalau slug masih null
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}
