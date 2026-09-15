// src/components/features/bookkeeping/PeriodFilter.jsx
import { CalendarRange } from "lucide-react";

const PRESETS = [
  { key: "today", label: "Hari ini" },
  { key: "7d", label: "7 Hari" },
  { key: "30d", label: "30 Hari" },
  { key: "month", label: "Bulan ini" },
  { key: "lastMonth", label: "Bulan lalu" },
];

export default function PeriodFilter({
  preset,
  onPresetChange,
  customRange,
  onCustomRangeChange,
}) {
  const isCustom = preset === "custom";

  return (
    // Container utama: flex wrap agar otomatis turun baris jika layar HP,
    // tapi tetap sebaris penuh di Desktop.
    <div className="flex flex-wrap items-center justify-end gap-2 w-full">
      
      {/* Group Tombol Presets */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => onPresetChange(p.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              preset === p.key
                ? "bg-[#0a3d3a] text-white shadow"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => onPresetChange("custom")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            isCustom
              ? "bg-[#0a3d3a] text-white shadow"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <CalendarRange size={14} />
          Custom
        </button>
      </div>

      {/* Input Tanggal Custom (Muncul di sebelahnya jika desktop, turun ke bawah jika mobile) */}
      {isCustom && (
        <div className="flex animate-in fade-in slide-in-from-left-2 items-center gap-1.5 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
          <input
            type="date"
            value={customRange.startDate}
            onChange={(e) =>
              onCustomRangeChange({ ...customRange, startDate: e.target.value })
            }
            className="w-28.75 rounded-lg border-none bg-gray-50 px-2 py-1 text-xs text-gray-700 outline-none hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#0a3d3a]/20 cursor-pointer"
          />
          <span className="text-gray-400 font-medium">—</span>
          <input
            type="date"
            value={customRange.endDate}
            onChange={(e) =>
              onCustomRangeChange({ ...customRange, endDate: e.target.value })
            }
            className="w-28.75 rounded-lg border-none bg-gray-50 px-2 py-1 text-xs text-gray-700 outline-none hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#0a3d3a]/20 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}