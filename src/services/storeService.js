// src/services/storeService.js
import supabase from "../lib/supabase-client";

export async function createStore({
  ownerAuthId,
  name,
  category,
  description,
  phone,
}) {
// Cari users_tb.id
  const { data: user, error: userError } = await supabase
    .from("users_tb")
    .select("id")
    .eq("auth_user_id", ownerAuthId)
    .maybeSingle(); // ← GANTI!

  if (userError) {
    console.error("Error cari user:", userError);
    return { error: `Gagal cari user: ${userError.message}` };
  }

  if (!user) {
    return {
      error:
        "Profil user belum dibuat. Coba logout lalu login ulang, atau hubungi admin.",
    };
  }

  // Generate slug
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") +
    "-" +
    Date.now().toString(36);

  // Insert store
  const { data, error } = await supabase
    .from("stores")
    .insert([
      {
        owner_id: user.id,
        name: name.trim(),
        slug,
        category,
        description: description?.trim() || null,
        phone: phone?.trim() || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error buat store:", error);
    return { error: error.message };
  }

  return { data, error: null };
}
