// src/contexts/AuthProvider.jsx
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import supabase from "../lib/supabase-client";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // ⬅️ BARU
  const [currentStore, setCurrentStore] = useState(null); // ⬅️ BARU
  const [loading, setLoading] = useState(true);

  // ===== Ambil profile + store berdasarkan auth user =====
  const loadUserData = async (authUser) => {
    if (!authUser) {
      setProfile(null);
      setCurrentStore(null);
      return;
    }

    // 1. Profile dari users_tb (link via auth_user_id)
    const { data: prof, error: profErr } = await supabase
      .from("users_tb")
      .select("*")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (profErr) {
      console.error("❌ Load profile error:", profErr);
      return;
    }

    console.log("✅ Profile loaded:", prof);
    setProfile(prof);

    // 2. Store dari stores (relasi 1:1 via owner_id)
    if (prof) {
      const { data: store, error: storeErr } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", prof.id)
        .maybeSingle();

      if (storeErr) {
        console.error("❌ Load store error:", storeErr);
        return;
      }

      console.log("✅ Store loaded:", store);
      setCurrentStore(store); // ⬅️ INI KUNCI PENYELESAIANNYA
    }
  };

  // ===== Bootstrap + subscribe auth changes =====
  useEffect(() => {
    // Sesi awal
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) await loadUserData(authUser);
      setLoading(false);
    });

    // Subscribe perubahan (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);

      if (authUser) {
        await loadUserData(authUser);
      } else {
        setProfile(null);
        setCurrentStore(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ===== Actions =====
  const register = async (email, password, metadata = {}) => {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
  };

  const login = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setCurrentStore(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile, // ⬅️ BARU
        currentStore, // ⬅️ BARU
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}