// src/pages/Settings.jsx
import { useEffect, useState } from "react";
import { useSettings } from "../hooks/useSettings";
import UserProfileTab from "../components/features/settings/UserProfileTab";
import StoreProfileTab from "../components/features/settings/StoreProfileTab";
import SecurityTab from "../components/features/settings/SecurityTab";

const TABS = [
  { key: "user", label: "👤 Profil Pengguna" },
  { key: "store", label: "🏪 Profil Usaha" },
  { key: "security", label: "🔒 Keamanan" },
];

export default function Settings() {
  const [tab, setTab] = useState("user");
  const {
    profile,
    currentStore,
    categories,
    saving,
    error,
    success,
    resetMessages,
    saveUserProfile,
    saveStoreProfile,
    changePassword,
  } = useSettings();

  // Auto-hide success message
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => resetMessages(), 3000);
    return () => clearTimeout(t);
  }, [success, resetMessages]);

  const handleTabChange = (key) => {
    setTab(key);
    resetMessages();
  };

  if (!profile || !currentStore) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
        <p className="text-3xl">⏳</p>
        <h2 className="mt-2 font-semibold text-amber-800">Memuat data...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">Pengaturan</h1>
        <p className="text-sm text-neutral-500">
          Kelola profil pengguna dan informasi usaha kamu
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-2xl border border-neutral-100 bg-white p-1.5 shadow-sm">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "bg-green-600 text-white shadow"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
          ✅ {success}
        </div>
      )}

      {/* Tab Content */}
      {tab === "user" && (
        <UserProfileTab
          profile={profile}
          onSave={saveUserProfile}
          saving={saving}
        />
      )}

      {tab === "store" && (
        <StoreProfileTab
          store={currentStore}
          categories={categories}
          onSave={saveStoreProfile}
          saving={saving}
        />
      )}

      {tab === "security" && (
        <SecurityTab onChangePassword={changePassword} saving={saving} />
      )}
    </div>
  );
}