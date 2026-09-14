// src/services/settingsService.js
import supabase from "../lib/supabase-client";

// ============ USER PROFILE ============

/**
 * Update profil user di users_tb
 */
export async function updateUserProfile(userId, payload) {
  const { data, error } = await supabase
    .from("users_tb")
    .update({
      name: payload.name?.trim() || null,
      phone: payload.phone?.trim() || null,
      // email TIDAK diupdate di sini — email terikat ke auth.users
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============ STORE PROFILE ============

/**
 * Update profil toko di stores
 */
export async function updateStoreProfile(storeId, payload) {
  const { data, error } = await supabase
    .from("stores")
    .update({
      name: payload.name?.trim() || null,
      slug: payload.slug?.trim() || null,
      category: payload.category?.trim() || null,
      description: payload.description?.trim() || null,
      address: payload.address?.trim() || null,
      phone: payload.phone?.trim() || null,
      logo_url: payload.logo_url?.trim() || null,
      nib_number: payload.nib_number?.trim() || null,
      employee_count: payload.employee_count
        ? Number(payload.employee_count)
        : null,
      founded_year: payload.founded_year ? Number(payload.founded_year) : null,
      monthly_revenue: payload.monthly_revenue
        ? Number(payload.monthly_revenue)
        : null,
      is_active: payload.is_active ?? true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", storeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Cek apakah slug sudah dipakai toko lain
 */
export async function isSlugAvailable(slug, excludeStoreId) {
  if (!slug) return false;
  let q = supabase.from("stores").select("id").eq("slug", slug);
  if (excludeStoreId) q = q.neq("id", excludeStoreId);

  const { data, error } = await q.maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return !data; // available kalau tidak ketemu
}

/**
 * Update email user (di auth.users) — ini trigger email konfirmasi
 */
export async function updateUserEmail(newEmail) {
  const { data, error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw error;
  return data;
}

/**
 * Update password user
 */
export async function updateUserPassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
}

/**
 * Daftar kategori usaha (dari master store_categories)
 */
export async function getStoreCategories() {
  const { data, error } = await supabase
    .from("store_categories")
    .select("id, value, label")
    .order("label", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Slugify helper
 */
export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
}
