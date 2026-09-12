import { useState, useEffect } from "react";

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
    <header className={`site-navbar${scrolled ? " is-scrolled" : ""}`}>
      <style>{styles}</style>
      <a className="site-navbar-brand" href="#top" onClick={closeMenu}>
        <span className="site-navbar-brand-u">UMK</span>Now
      </a>

      <button
        aria-expanded={isOpen}
        aria-label="Buka menu navigasi"
        className="site-navbar-toggle"
        onClick={() => setIsOpen((c) => !c)}
        type="button"
      >
        <span className={`hamburger${isOpen ? " is-open" : ""}`}>
          <span /><span /><span />
        </span>
      </button>

      <nav className={`site-navbar-links${isOpen ? " is-open" : ""}`}>
        {links.map((link) => (
          <a href={link.href} key={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <a href="/login" onClick={closeMenu} className="site-navbar-signin">
          Masuk
        </a>
        <a className="site-navbar-cta" href="/login" onClick={closeMenu}>
          Mulai gratis →
        </a>
      </nav>
    </header>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

  .site-navbar {
    align-items: center;
    background: rgba(7, 59, 63, 0.96);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #fff;
    display: flex;
    gap: 24px;
    justify-content: space-between;
    min-height: 68px;
    padding: 12px max(24px, calc((100vw - 1120px) / 2));
    position: sticky;
    top: 0;
    transition: box-shadow 0.3s ease, background 0.3s ease;
    z-index: 100;
  }

  .site-navbar.is-scrolled {
    background: rgba(7, 59, 63, 0.99);
    box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.22);
  }

  .site-navbar-brand {
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    text-decoration: none;
  }

  .site-navbar-brand-u {
    color: #f59e0b;
  }

  .site-navbar-links {
    align-items: center;
    display: flex;
    gap: 4px;
  }

  .site-navbar-links a {
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.82);
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 8px 14px;
    text-decoration: none;
    transition: color 0.2s, background 0.2s;
  }

  .site-navbar-links a:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .site-navbar-signin {
    color: rgba(255,255,255,0.7) !important;
  }

  .site-navbar-cta {
    background: #f59e0b !important;
    color: #1a2e2f !important;
    font-weight: 700 !important;
    margin-left: 8px;
    transition: background 0.2s, transform 0.15s !important;
  }

  .site-navbar-cta:hover {
    background: #fbbf24 !important;
    transform: translateY(-1px);
  }

  .site-navbar-toggle {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    color: #fff;
    display: none;
    padding: 9px 12px;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 18px;
  }

  .hamburger span {
    background: #fff;
    border-radius: 2px;
    display: block;
    height: 2px;
    transition: transform 0.25s, opacity 0.25s;
    width: 100%;
  }

  .hamburger.is-open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .hamburger.is-open span:nth-child(2) { opacity: 0; }
  .hamburger.is-open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

  @media (max-width: 720px) {
    .site-navbar-toggle { display: flex; align-items: center; }

    .site-navbar-links {
      background: #052e31;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: none;
      flex-direction: column;
      left: 0;
      padding: 16px 24px 24px;
      position: absolute;
      right: 0;
      top: 68px;
    }

    .site-navbar-links.is-open { display: flex; }
    .site-navbar-links a { width: 100%; }
    .site-navbar-cta { margin-left: 0 !important; margin-top: 8px; }
  }
`;
