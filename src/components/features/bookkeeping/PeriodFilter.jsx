// src/components/features/bookkeeping/PeriodFilter.jsx
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
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap rounded-xl border border-neutral-200 bg-white p-1 shadow-sm">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => onPresetChange(p.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              preset === p.key
                ? "bg-green-600 text-white shadow"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => onPresetChange("custom")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            isCustom
              ? "bg-green-600 text-white shadow"
              : "text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          📅 Custom
        </button>
      </div>

      {isCustom && (
        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-2 shadow-sm">
          <input
            type="date"
            value={customRange.startDate}
            onChange={(e) =>
              onCustomRangeChange({ ...customRange, startDate: e.target.value })
            }
            className="rounded-lg border border-neutral-200 px-2 py-1 text-xs"
          />
          <span className="text-neutral-400">—</span>
          <input
            type="date"
            value={customRange.endDate}
            onChange={(e) =>
              onCustomRangeChange({ ...customRange, endDate: e.target.value })
            }
            className="rounded-lg border border-neutral-200 px-2 py-1 text-xs"
          />
        </div>
      )}
    </div>
  );
}
