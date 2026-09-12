import supabase from "../lib/supabase-client";

/**
 * Service untuk operasi CRUD tabel `users_tb`.
 * Semua query Supabase terpusat di sini.
 */

const TABLE = "users_tb";
const SELECT_COLUMNS = "id, name, email, phone, is_verified, created_at";

/**
 * Ambil semua user.
 * @returns {Promise<{data: Array|null, error: string|null}>}
 */
export async function getAllUsers() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(SELECT_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[testingService] getAllUsers error:", error.message);
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

/**
 * Tambah user baru.
 * @param {{name: string, email: string, phone?: string}} payload
 */
export async function createUser(payload) {
  const { name, email, phone } = payload;

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        password_hash: "temp_hash_" + Date.now(), // ⚠️ sementara
        is_verified: false,
      },
    ])
    .select(SELECT_COLUMNS)
    .single();

  if (error) {
    console.error("[testingService] createUser error:", error.message);
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

/**
 * Toggle status verifikasi user.
 * @param {number} id
 * @param {boolean} currentStatus
 */
export async function updateUserVerify(id, currentStatus) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ is_verified: !currentStatus })
    .eq("id", id)
    .select(SELECT_COLUMNS)
    .single();

  if (error) {
    console.error("[testingService] updateUserVerify error:", error.message);
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

/**
 * Hapus user berdasarkan id.
 * @param {number} id
 */
export async function deleteUser(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    console.error("[testingService] deleteUser error:", error.message);
    return { error: error.message };
  }
  return { error: null };
}
