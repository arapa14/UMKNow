// src/utils/formatDate.js
export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function formatTime(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(dateStr) {
  return `${formatDate(dateStr)} • ${formatTime(dateStr)}`;
}
