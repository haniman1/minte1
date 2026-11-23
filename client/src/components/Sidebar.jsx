import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Button from "./Button";

const GOLD = "#D4AF37";

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

function Brand({ small }) {
  return (
    <Link
      to="/"
      aria-label="Tech Photography — Home"
      className="inline-flex items-center no-underline"
    >
      <span
        className={`font-bold uppercase tracking-[0.18em] text-white ${small ? "text-xs" : "text-[13px]"}`}
      >
        TECH
      </span>
      <span
        className={`ml-1.5 font-bold uppercase tracking-[0.18em] opacity-90 ${small ? "text-xs" : "text-[13px]"}`}
        style={{ color: GOLD }}
      >
        PHOTOGRAPHY
      </span>
    </Link>
  );
}

function LangToggle({ lang, onToggle }) {
  const isEn = lang === "en";
  return (
    <button
      onClick={onToggle}
      aria-label={isEn ? "Switch to Amharic" : "Switch to English"}
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-white/60 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
    >
      <span>{isEn ? "EN" : "አማ"}</span>
      <span className="text-white/25">|</span>
      <span className="text-white/30">{isEn ? "አማ" : "EN"}</span>
    </button>
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .sidebar-root, .sidebar-root * { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-2 border-b border-white/10 bg-[rgba(4,4,4,0.96)] px-4 backdrop-blur-xl md:hidden">
        <Brand small />
        <div className="ml-auto flex items-center gap-2">
          <LangToggle lang={lang} onToggle={toggleLang} />
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="sidebar"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white"
          >
            {open ? "✕" : "☰"}
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

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[rgba(6,6,6,0.98)] p-6 transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-10 mt-1">
          <Brand />
        </div>

        <nav aria-label="Main navigation" className="flex-1">
          <ul className="space-y-1">
            {items.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `block rounded-lg border-l-2 px-4 py-2.5 text-sm tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                      isActive
                        ? "border-[#D4AF37] bg-white/5 font-medium text-white"
                        : "border-transparent text-white/55 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
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
