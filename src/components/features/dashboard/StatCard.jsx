// src/components/features/dashboard/StatCard.jsx

const accentStyles = {
  green: {
    wrapper: "bg-green-50 border-green-100",
    icon: "text-green-600",
  },
  blue: {
    wrapper: "bg-blue-50 border-blue-100",
    icon: "text-blue-600",
  },
  amber: {
    wrapper: "bg-amber-50 border-amber-100",
    icon: "text-amber-600",
  },
  red: {
    wrapper: "bg-red-50 border-red-100",
    icon: "text-red-600",
  },
  purple: {
    wrapper: "bg-purple-50 border-purple-100",
    icon: "text-purple-600",
  },
};

/**
 * @param {Object} props
 * @param {React.ElementType} props.Icon  
 * @param {string}  props.label           
 * @param {string|number} props.value     
 * @param {string}  [props.sublabel]      
 * @param {'green'|'blue'|'amber'|'red'|'purple'} [props.accent]
 */
export default function StatCard({
  Icon,
  label,
  value,
  sublabel,
  accent = "green",
}) {
  const styles = accentStyles[accent] ?? accentStyles.green;

  return (
    <div className="group rounded-2xl bg-white p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        {/* Teks */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900 leading-none tabular-nums">
            {value}
          </p>
          {sublabel && (
            <p className="mt-1 text-xs text-neutral-400">{sublabel}</p>
          )}
        </div>

        {/* Ikon Lucide */}
        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${styles.wrapper} transition-transform duration-200 group-hover:scale-110`}
          >
            <Icon size={18} strokeWidth={2} className={styles.icon} />
          </div>
        )}
      </div>
    </div>
  );
}