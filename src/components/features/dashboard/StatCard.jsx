// src/components/features/dashboard/StatCard.jsx
export default function StatCard({
  icon,
  label,
  value,
  sublabel,
  accent = "green",
}) {
  const accents = {
    green: "bg-green-50 text-green-700 border-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-neutral-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-800">{value}</p>
          {sublabel && (
            <p className="mt-1 text-xs text-neutral-400">{sublabel}</p>
          )}
        </div>
        {icon && (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${accents[accent]}`}
          >
            <span className="text-lg">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
