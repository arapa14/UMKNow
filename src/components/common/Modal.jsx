import { useEffect } from "react";

export default function Modal({
    isOpen,
    onClose,
    title,
    message,
    actionLabel = "Oke",
    onAction,
    variant = "success",
}) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-75 rounded-2xl bg-white p-5 text-center shadow-xl"
                style={{ maxWidth: "300px" }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup"
                    className="absolute right-2.5 top-2.5 rounded-md p-1 text-muted transition-colors hover:text-ink"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div
                    className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full ${variant === "error" ? "bg-red-50 text-red-600" : "bg-teal-50 text-teal-600"
                        }`}
                >
                    {variant === "error" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <line x1="12" y1="8" x2="12" y2="13" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                    )}
                </div>

                <h2 className="font-display text-base font-bold text-ink">{title}</h2>
                {message && (
                    <p className="mt-1 text-xs leading-relaxed text-muted">{message}</p>
                )}

                <button
                    type="button"
                    onClick={onAction ?? onClose}
                    className="mt-4 h-10 w-full rounded-lg bg-amber-500 font-display text-xs font-bold text-ink transition-colors hover:bg-amber-400"
                >
                    {actionLabel}
                </button>
            </div>
        </div>
    );
}