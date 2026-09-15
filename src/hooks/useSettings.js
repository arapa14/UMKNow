// src/hooks/useSettings.js
import { useEffect, useState } from "react";
import {
  updateUserProfile,
  updateStoreProfile,
  isSlugAvailable,
  updateUserEmail,
  updateUserPassword,
  getStoreCategories,
} from "../services/settingsService";
import { useAuth } from "./useAuth";

export function useSettings() {
  const { user, profile, currentStore, refreshAuth } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load master categories — keep useEffect (fetch external data)
  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoadingCats(true);
      try {
        const data = await getStoreCategories();
        if (!ignore) setCategories(data);
      } catch (err) {
        console.error("Load categories error:", err);
      } finally {
        if (!ignore) setLoadingCats(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // ❌ HAPUS useCallback — biar React Compiler handle
  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const saveUserProfile = async (payload) => {
    resetMessages();
    setSaving(true);
    try {
      await updateUserProfile(profile.id, payload);

      if (payload.email && payload.email !== profile.email) {
        await updateUserEmail(payload.email);
      }

      if (refreshAuth) await refreshAuth();

      setSuccess("Profil pengguna berhasil disimpan");
      return true;
    } catch (err) {
      console.error("saveUserProfile error:", err);
      setError(err.message || "Gagal menyimpan profil pengguna");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveStoreProfile = async (payload) => {
    resetMessages();
    setSaving(true);
    try {
      if (payload.slug && payload.slug !== currentStore.slug) {
        const ok = await isSlugAvailable(payload.slug, currentStore.id);
        if (!ok) {
          throw new Error("Slug sudah dipakai toko lain. Coba yang lain.");
        }
      }

      await updateStoreProfile(currentStore.id, payload);
      if (refreshAuth) await refreshAuth();
      setSuccess("Profil usaha berhasil disimpan");
      return true;
    } catch (err) {
      console.error("saveStoreProfile error:", err);
      setError(err.message || "Gagal menyimpan profil usaha");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (newPassword) => {
    resetMessages();
    setSaving(true);
    try {
      await updateUserPassword(newPassword);
      setSuccess("Password berhasil diubah");
      return true;
    } catch (err) {
      console.error("changePassword error:", err);
      setError(err.message || "Gagal mengubah password");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    profile,
    currentStore,
    categories,
    loadingCats,
    saving,
    error,
    success,
    resetMessages,
    saveUserProfile,
    saveStoreProfile,
    changePassword,
  };
}