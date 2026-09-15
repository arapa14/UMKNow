// src/pages/Settings.jsx
import { useEffect, useState } from "react";
import { User, Store, Shield, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import UserProfileTab from "../components/features/settings/UserProfileTab";
import StoreProfileTab from "../components/features/settings/StoreProfileTab";
import SecurityTab from "../components/features/settings/SecurityTab";

const TABS = [
  { key: "user", label: "Profil Pengguna", Icon: User },
  { key: "store", label: "Profil Usaha", Icon: Store },
  { key: "security", label: "Keamanan", Icon: Shield },
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 size={28} className="animate-spin text-slate-400" />
          <p className="text-sm font-medium text-slate-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola profil pengguna dan informasi usaha kamu
        </p>
      </div>

      {/* Tabs — segmented control */}
      <div className="inline-flex w-full overflow-x-auto rounded-2xl bg-slate-100/80 p-1.5 sm:w-auto">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm transition-all ${
              tab === key
                ? "bg-white font-semibold text-[#0a3d3a] shadow-sm"
                : "font-medium text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">
          <XCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3.5 text-sm text-emerald-700">
          <CheckCircle2 size={16} className="shrink-0" />
          {success}
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