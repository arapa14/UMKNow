import { useEffect, useState } from "react";

const links = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara kerja", href: "#cara-kerja" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[100] flex min-h-[68px] items-center justify-between gap-6 bg-[rgba(7,59,63,0.96)] px-[max(24px,calc((100vw_-_1120px)_/_2))] py-3 text-white backdrop-blur-[12px] transition-[box-shadow,background] duration-300 ease-[ease] ${
        scrolled
          ? "bg-[rgba(7,59,63,0.99)] shadow-[0_1px_0_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.22)]"
          : ""
      }`}
    >
      <a
        className="font-display text-xl font-extrabold tracking-[-0.01em] text-white no-underline"
        href="#top"
        onClick={closeMenu}
      >
        <span className="text-amber-500">UMK</span>Now
      </a>

      <button
        aria-expanded={isOpen}
        aria-label="Buka menu navigasi"
        className="hidden rounded-lg border border-white/25 bg-transparent px-3 py-[9px] text-white max-[720px]:flex max-[720px]:items-center"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="flex w-[18px] flex-col gap-1">
          <span
            className={`block h-[2px] w-full rounded-[2px] bg-white transition-[translate,rotate,opacity] duration-[250ms] ease-[ease] ${
              isOpen ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-full rounded-[2px] bg-white transition-[translate,rotate,opacity] duration-[250ms] ease-[ease] ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-full rounded-[2px] bg-white transition-[translate,rotate,opacity] duration-[250ms] ease-[ease] ${
              isOpen ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <nav
        className={`flex items-center gap-1 max-[720px]:absolute max-[720px]:top-[68px] max-[720px]:right-0 max-[720px]:left-0 max-[720px]:flex-col max-[720px]:border-t max-[720px]:border-white/[0.08] max-[720px]:bg-[#052e31] max-[720px]:px-6 max-[720px]:pt-4 max-[720px]:pb-6 ${
          isOpen ? "max-[720px]:flex" : "max-[720px]:hidden"
        }`}
      >
        {links.map((link) => (
          <a
            className="rounded-lg px-[14px] py-2 font-sans text-[0.9rem] font-medium text-white/[0.82] no-underline transition-[color,background] duration-200 ease-[ease] hover:bg-white/[0.1] hover:text-white max-[720px]:w-full"
            href={link.href}
            key={link.href}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}
        <a
          className="rounded-lg px-[14px] py-2 font-sans text-[0.9rem] font-medium text-white/[0.7] no-underline transition-[color,background] duration-200 ease-[ease] hover:bg-white/[0.1] hover:text-white max-[720px]:w-full"
          href="/login"
          onClick={closeMenu}
        >
          Masuk
        </a>
        <a
          className="ml-2 rounded-lg bg-amber-500 px-[14px] py-2 font-sans text-[0.9rem] font-bold text-[#1a2e2f] no-underline [transition:background_0.2s_ease,translate_0.15s_ease] hover:-translate-y-px hover:bg-amber-400 max-[720px]:mt-2 max-[720px]:ml-0 max-[720px]:w-full"
          href="/register"
          onClick={closeMenu}
        >
          Mulai gratis →
        </a>
      </nav>
    </header>
  );
}
