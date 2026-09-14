// src/components/features/dashboard/SalesChart.jsx
import { formatCurrency } from "../../../utils/formatCurrency";

export default function SalesChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-neutral-400 text-sm">
        Belum ada data penjualan
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.total), 1);
  const width = 100;
  const height = 40;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - (d.total / max) * height;
    return { x, y, ...d };
  });

  const pathLine = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
    .join(" ");

  const pathArea = `${pathLine} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-48 w-full"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={pathArea} fill="url(#areaGrad)" />
        <path
          d={pathLine}
          fill="none"
          stroke="#16a34a"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="0.6" fill="#16a34a" />
        ))}
      </svg>

      <div className="mt-2 flex justify-between text-[10px] text-neutral-400">
        {data.map((d, i) => {
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

      <div className="mt-3 text-right text-xs text-neutral-500">
        Total:{" "}
        <span className="font-semibold text-neutral-700">
          {formatCurrency(data.reduce((s, d) => s + d.total, 0))}
        </span>
      </div>
    </div>
  );
}
