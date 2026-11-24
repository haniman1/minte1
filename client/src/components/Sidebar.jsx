import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Button from "./Button";

const GOLD = "#C9A84C";
const LOGO_SRC = "/logo.png"; // file lives in client/public/logo.png

const TRANSLATIONS = {
  en: {
    home: "Home",
    gallery: "Gallery",
    packages: "Packages",
    about: "About",
    contact: "Contact",
    inquireNow: "Inquire Now",
    admin: "Admin",
  },
  am: {
    home: "መነሻ",
    gallery: "ጋለሪ",
    packages: "ፓኬጆች",
    about: "ስለ እኛ",
    contact: "አግኙን",
    inquireNow: "ለማዘዝ ይጠይቁ",
    admin: "አስተዳዳሪ",
  },
};

const ring =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]";

/* Logo image. If the file is missing it falls back to the text brand. */
function Brand({ small }) {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      to="/"
      aria-label="Tech Photography — Home"
      className={`inline-flex min-h-11 items-center rounded-md no-underline ${ring}`}
    >
      {failed ? (
        <>
          <span
            className={`font-bold uppercase tracking-[0.18em] text-white ${small ? "text-xs" : "text-[13px]"}`}
          >
            TECH
          </span>
          <span
            className={`ml-1.5 font-bold uppercase tracking-[0.18em] ${small ? "text-xs" : "text-[13px]"}`}
            style={{ color: GOLD }}
          >
            PHOTOGRAPHY
          </span>
        </>
      ) : (
        <img
          src={LOGO_SRC}
          alt="Tech Photography"
          onError={() => setFailed(true)}
          className={small ? "h-9 w-auto" : "h-auto w-full max-w-[190px]"}
        />
      )}
    </Link>
  );
}

function LangToggle({ lang, onToggle }) {
  const isEn = lang === "en";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isEn ? "Switch to Amharic" : "Switch to English"}
      className={`inline-flex min-h-11 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-4 text-xs font-semibold tracking-wider transition duration-300 hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/10 ${ring}`}
    >
      <span className="text-[#C9A84C]">{isEn ? "EN" : "አማ"}</span>
      <span aria-hidden="true" className="text-white/30">|</span>
      <span className="text-white/60">{isEn ? "አማ" : "EN"}</span>
    </button>
  );
}

function MenuIcon({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { currentUser, isAdmin } = useAuth();
  const { lang, setLang } = useLanguage();
  const t = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  const toggleLang = () => setLang(lang === "en" ? "am" : "en");

  const items = [
    { to: "/", label: t.home, end: true },
    { to: "/gallery", label: t.gallery },
    { to: "/packages", label: t.packages },
    { to: "/about", label: t.about },
    { to: "/contact", label: t.contact },
    ...(currentUser && isAdmin() ? [{ to: "/admin", label: t.admin }] : []),
  ];

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sidebar-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Ethiopic:wght@400;500;600&display=swap');
        .sidebar-root, .sidebar-root * { font-family: 'Inter', 'Noto Sans Ethiopic', system-ui, sans-serif; }
        .sidebar-root .sb-num { font-family: 'Cormorant Garamond', Georgia, serif; }
        @media (prefers-reduced-motion: reduce) {
          .sidebar-root *, .sidebar-root *::before, .sidebar-root *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-2 border-b border-white/10 bg-[rgba(4,4,4,0.92)] px-4 backdrop-blur-xl md:hidden">
        <Brand small />
        <div className="ml-auto flex items-center gap-2">
          <LangToggle lang={lang} onToggle={toggleLang} />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="sidebar"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition duration-300 hover:border-[#C9A84C]/60 hover:text-[#C9A84C] ${ring}`}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* When closed on mobile the panel is also hidden from tab order and screen readers */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[rgba(6,6,6,0.98)] p-6 shadow-2xl shadow-black/60 transition-[transform,visibility] duration-300 md:visible md:translate-x-0 ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        {/* Warm gold glow at the top edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_80%_100%_at_50%_0%,rgba(201,168,76,0.12),transparent_75%)]"
        />

        {/* Logo */}
        <div className="relative mb-8 mt-1 border-b border-white/10 pb-6">
          <Brand />
        </div>

        <nav aria-label="Main navigation" className="relative flex-1">
          <ul className="space-y-1.5">
            {items.map(({ to, label, end }, index) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `group relative flex min-h-11 items-center gap-3 rounded-xl border-l-2 px-4 text-sm tracking-wide transition duration-300 ${ring} ${
                      isActive
                        ? "border-[#C9A84C] bg-gradient-to-r from-[#C9A84C]/[0.14] to-transparent font-medium text-white"
                        : "border-transparent text-white/70 hover:bg-white/[0.04] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden="true"
                        className={`sb-num w-5 text-base font-semibold tabular-nums transition-colors duration-300 ${
                          isActive ? "text-[#C9A84C]" : "text-white/35 group-hover:text-[#C9A84C]/80"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative space-y-3 border-t border-white/10 pt-5">
          <div className="hidden md:block">
            <LangToggle lang={lang} onToggle={toggleLang} />
          </div>
          <Button to="/contact" className="w-full">
            {t.inquireNow}
          </Button>
        </div>
      </aside>
    </div>
  );
}
