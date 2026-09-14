// src/services/publicCatalogService.js
import supabase from "../lib/supabase-client";

/**
 * Ambil data toko publik + produk katalog-nya
 * Berdasarkan slug. TIDAK butuh login.
 */
export async function getPublicCatalogBySlug(slug) {
  if (!slug) throw new Error("Slug wajib diisi");

  // 1. Ambil toko
  const { data: store, error: storeErr } = await supabase
    .from("stores")
    .select("id, name, slug, category, description, address, phone, logo_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (storeErr) throw storeErr;
  if (!store) return { store: null, products: [] };

  // 2. Ambil produk katalog
  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name, description, price, stock, category, image_url")
    .eq("store_id", store.id)
    .eq("is_active", true)
    .eq("is_catalog", true)
    .order("name", { ascending: true });

  if (prodErr) throw prodErr;

  return { store, products: products || [] };
}
