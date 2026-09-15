// src/services/productService.js
import supabase from "../lib/supabase-client";

/**
 * Ambil semua produk dari sebuah toko
 */
export async function getProducts(
  storeId,
  { search = "", category = "", onlyActive = true } = {},
) {
  if (!storeId) return [];

  let query = supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });

  if (onlyActive) query = query.eq("is_active", true);
  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Ambil 1 produk by id
 */
export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Buat produk baru
 */
export async function createProduct(payload) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      store_id: payload.store_id,
      name: payload.name,
      description: payload.description || null,
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      min_stock: Number(payload.min_stock) || 5,
      category: payload.category || null,
      image_url: payload.image_url || null,
      is_active: payload.is_active ?? true,
      is_catalog: payload.is_catalog ?? false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update produk
 */
export async function updateProduct(id, payload) {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: payload.name,
      description: payload.description || null,
      price: Number(payload.price) || 0,
      stock: Number(payload.stock) || 0,
      min_stock: Number(payload.min_stock) || 5,
      category: payload.category || null,
      image_url: payload.image_url || null,
      is_active: payload.is_active ?? true,
      is_catalog: payload.is_catalog ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Hapus produk
 */
export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}

/**
 * Quick stock adjustment (tambah/kurang stok)
 * @param {number} id
 * @param {number} delta - nilai positif (masuk) atau negatif (keluar)
 */
export async function adjustStock(id, delta) {
  // Ambil stok dulu
  const { data: product, error: getErr } = await supabase
    .from("products")
    .select("stock")
    .eq("id", id)
    .maybeSingle();

  if (getErr) throw getErr;
  if (!product) throw new Error("Produk tidak ditemukan");

  const newStock = Math.max(0, (Number(product.stock) || 0) + delta);

  const { data, error } = await supabase
    .from("products")
    .update({
      stock: newStock,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Ambil daftar kategori unik dari produk di toko ini
 * (untuk dropdown filter)
 */
export async function getProductCategories(storeId) {
  if (!storeId) return [];
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("store_id", storeId)
    .not("category", "is", null);

  if (error) throw error;

  const unique = [
    ...new Set((data || []).map((p) => p.category).filter(Boolean)),
  ];
  return unique.sort();
}
