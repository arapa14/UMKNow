// src/components/features/dashboard/SalesChart.jsx
import { formatCurrency } from "../../../utils/formatCurrency";

const BRAND = "#0a3d3a";
const BRAND_LIGHT = "#16a34a";

export default function SalesChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-neutral-400">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-40"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span className="text-sm">Belum ada data penjualan</span>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.total), 1);
  const W = 800;
  const H = 240;
  const PAD_X = 20;

  const points = data.map((d, i) => {
    const x = PAD_X + (i / (data.length - 1 || 1)) * (W - PAD_X * 2);
    const y = H - 20 - (d.total / max) * (H - 40);
    return { x, y, ...d };
  });

  const pathLine = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  const pathArea = `${pathLine} L ${W - PAD_X},${H} L ${PAD_X},${H} Z`;

  // Label tanggal — hanya tampilkan max 6 label agar tidak berdempetan
  const step = Math.max(1, Math.floor(data.length / 6));
  const labelIndices = new Set(
    data.map((_, i) => i).filter((i) => i % step === 0 || i === data.length - 1)
  );

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto drop-shadow-sm"
      >
        <defs>
          <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND_LIGHT} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BRAND_LIGHT} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={pathArea} fill="url(#chartAreaGrad)" />

        {/* Garis utama — lebih tebal & brand color */}
        <path
          d={pathLine}
          fill="none"
          stroke={BRAND}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Titik data */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Lingkaran luar (halo) */}
            <circle cx={p.x} cy={p.y} r="6" fill="white" />
            {/* Lingkaran dalam */}
            <circle cx={p.x} cy={p.y} r="4" fill={BRAND} />
          </g>
        ))}
      </svg>

      {/* Label tanggal */}
      <div className="mt-2 flex justify-between text-[10px] text-neutral-400">
        {data.map((d, i) => {
          if (!labelIndices.has(i)) return <span key={i} />;
          const dt = new Date(d.date);
          return (
            <span key={i}>
              {dt.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-neutral-400">
          {data.length} periode
        </span>
        <span className="text-xs text-neutral-500">
          Total:{" "}
          <span className="font-semibold text-neutral-800">
            {formatCurrency(data.reduce((s, d) => s + d.total, 0))}
          </span>
        </span>
      </div>
    </div>
  );
}
