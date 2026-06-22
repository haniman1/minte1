import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

/* ─── Token constants ────────────────────────────────────────────────────── */
const GOLD = "#D4AF37";
const BORDER_IDLE = "rgba(255,255,255,0.06)";
const BORDER_SCROLLED = "rgba(255,255,255,0.1)";

/* ─── Translations ───────────────────────────────────────────────────────── */
const TRANSLATIONS = {
  en: {
    home: "Home",
    gallery: "Gallery",
    packages: "Packages",
    about: "About",
    contact: "Contact",
    inquireNow: "Inquire Now",
  },
  am: {
    home: "መነሻ",
    gallery: "ጋለሪ",
    packages: "ፓኬጆች",
    about: "ስለ እኛ",
    contact: "አግኙን",
    inquireNow: "ለማዘዝ ይጠይቁ",
  },
};

/* ─── Nav links factory (language-aware) ─────────────────────────────────── */
const getNavLinks = (t) => [
  { label: t.home, to: "/" },
  { label: t.gallery, to: "/gallery" },
  { label: t.packages, to: "/packages" },
  { label: t.about, to: "/about" },
];

/* ─── Language Toggle Button ─────────────────────────────────────────────── */
function LangToggle({ lang, onToggle }) {
  const isEn = lang === "en";
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      title={isEn ? "Switch to Amharic" : "Switch to English"}
      aria-label={isEn ? "Switch to Amharic" : "Switch to English"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "6px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        color: "rgba(255,255,255,0.6)",
        fontFamily: "inherit",
        transition: "border-color 0.25s, color 0.25s, background 0.25s",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
    >
      <motion.span
        key={lang}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {isEn ? "EN" : "አማ"}
      </motion.span>
      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>|</span>
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
        {isEn ? "አማ" : "EN"}
      </span>
    </motion.button>
  );
}

/* ─── Desktop link with rising underline ────────────────────────────────── */
function DesktopLink({ to, label, isActive }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        color: isActive ? "#fff" : "rgba(255,255,255,0.55)",
        textDecoration: "none",
        fontSize: 13,
        letterSpacing: "0.04em",
        fontWeight: isActive ? 500 : 400,
        transition: "color 0.25s ease",
        paddingBottom: 2,
      }}
      aria-current={isActive ? "page" : undefined}
    >
      <motion.span
        animate={{
          color: hovered || isActive ? "#fff" : "rgba(255,255,255,0.55)",
        }}
        transition={{ duration: 0.2 }}
        style={{ display: "block" }}
      >
        {label}
      </motion.span>

      {/* Gold underline */}
      <motion.span
        initial={false}
        animate={{ scaleX: hovered || isActive ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          bottom: -2,
          left: 0,
          right: 0,
          height: 1,
          background: isActive
            ? `linear-gradient(to right, transparent, ${GOLD}, transparent)`
            : `linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)`,
          transformOrigin: "center",
          borderRadius: 2,
        }}
      />
    </Link>
  );
}

/* ─── Ghost "Contact" button ─────────────────────────────────────────────── */
function GhostBtn({ to, children, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Link
        to={to}
        onClick={onClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 20px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(8px)",
          color: "rgba(255,255,255,0.75)",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.03em",
          textDecoration: "none",
          transition: "border-color 0.25s, color 0.25s, background 0.25s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          e.currentTarget.style.color = "rgba(255,255,255,0.75)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
      >
        {children}
      </Link>
    </motion.div>
  );
}

/* ─── Primary "Inquire Now" CTA button ──────────────────────────────────── */
function PrimaryBtn({ to, children, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -1, boxShadow: "0 0 24px 6px rgba(255,255,255,0.18)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{ borderRadius: 999, position: "relative", overflow: "hidden" }}
    >
      <Link
        to={to}
        onClick={onClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 22px",
          borderRadius: 999,
          background: "#fff",
          color: "#000",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.03em",
          textDecoration: "none",
          position: "relative",
          zIndex: 1,
          transition: "background 0.25s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f0f0f0";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff";
        }}
      >
        {/* Shine sweep */}
        <motion.span
          initial={{ x: "-120%", skewX: -20 }}
          whileHover={{ x: "220%" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "40%",
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.55), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {children}
      </Link>
    </motion.div>
  );
}

/* ─── Main Navbar ────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // ── Language support ──────────────────────────────────────────────────────
  const { lang, setLang } = useLanguage();
  const t = TRANSLATIONS[lang] ?? TRANSLATIONS.en;
  const NAV_LINKS = getNavLinks(t);

  /* Detect scroll for border reveal */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  /* Prevent body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const toggleLang = () => setLang(lang === "en" ? "am" : "en");

  return (
    <>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .navbar-root * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        @media (prefers-reduced-motion: reduce) { .navbar-root * { transition: none !important; animation: none !important; } }
      `}</style>

      {/* ── Navbar entrance animation ─────────────────────────────────── */}
      <motion.nav
        className="navbar-root"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          padding: "14px 40px",
          borderRadius: 0,
          background: scrolled ? "rgba(4,4,4,0.96)" : "rgba(4,4,4,0.82)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${scrolled ? BORDER_SCROLLED : "transparent"}`,
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
          transition:
            "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* ── Logo / Brand ─────────────────────────────────────────────── */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          style={{ flexShrink: 0 }}
        >
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
            aria-label="Tech Photography — Home"
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#fff",
                lineHeight: 1,
              }}
            >
              TECH
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD,
                lineHeight: 1,
                marginLeft: 5,
                opacity: 0.85,
              }}
            >
              PHOTOGRAPHY
            </span>
          </Link>
        </motion.div>

        {/* ── Desktop nav links ─────────────────────────────────────────── */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: 32,
            marginLeft: 40,
          }}
          className="desktop-nav"
        >
          {NAV_LINKS.map((link) => (
            <DesktopLink
              key={link.to}
              to={link.to}
              label={link.label}
              isActive={
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to)
              }
            />
          ))}
        </div>

        {/* ── Desktop CTA buttons + Language toggle ────────────────────── */}
        <div
          style={{
            marginLeft: "auto",
            display: "none",
            alignItems: "center",
            gap: 10,
          }}
          className="desktop-btns"
        >
          <LangToggle lang={lang} onToggle={toggleLang} />
          <GhostBtn to="/contact">{t.contact}</GhostBtn>
          <PrimaryBtn to="/contact">{t.inquireNow}</PrimaryBtn>
        </div>

        {/* ── Mobile hamburger ─────────────────────────────────────────── */}
        <div
          style={{
            marginLeft: "auto",
            display: "none",
            alignItems: "center",
            gap: 8,
          }}
          className="mobile-hamburger-group"
        >
          {/* Language toggle visible on mobile too */}
          <LangToggle lang={lang} onToggle={toggleLang} />

          <motion.button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            whileTap={{ scale: 0.9 }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: "#fff",
              borderRadius: 8,
            }}
            className="mobile-hamburger"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
          >
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <motion.line
                x1="3"
                y1="6"
                x2="19"
                y2="6"
                animate={
                  isMobileOpen
                    ? { x1: 4, y1: 4, x2: 18, y2: 18 }
                    : { x1: 3, y1: 6, x2: 19, y2: 6 }
                }
                transition={{ duration: 0.3 }}
              />
              <motion.line
                x1="3"
                y1="11"
                x2="19"
                y2="11"
                animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.line
                x1="3"
                y1="16"
                x2="19"
                y2="16"
                animate={
                  isMobileOpen
                    ? { x1: 4, y1: 18, x2: 18, y2: 4 }
                    : { x1: 3, y1: 16, x2: 19, y2: 16 }
                }
                transition={{ duration: 0.3 }}
              />
            </motion.svg>
          </motion.button>
        </div>

        {/* ── Responsive CSS (injected inline) ────────────────────────── */}
        <style>{`
          @media (min-width: 768px) {
            .desktop-nav             { display: flex !important; }
            .desktop-btns            { display: flex !important; }
            .mobile-hamburger-group  { display: none !important; }
          }
          @media (max-width: 767px) {
            .mobile-hamburger-group  { display: flex !important; }
          }
        `}</style>
      </motion.nav>

      {/* ── Mobile menu overlay ───────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                zIndex: 90,
              }}
              aria-hidden="true"
            />

            {/* Slide-in panel */}
            <motion.div
              key="mobile-panel"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "min(340px, 85vw)",
                background: "rgba(6,6,6,0.97)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                borderLeft: "1px solid rgba(255,255,255,0.07)",
                zIndex: 95,
                display: "flex",
                flexDirection: "column",
                padding: "80px 32px 40px",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Brand inside mobile panel */}
              <div style={{ marginBottom: 40 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    color: "#fff",
                    textTransform: "uppercase",
                  }}
                >
                  TECH
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    color: GOLD,
                    textTransform: "uppercase",
                    marginLeft: 4,
                    opacity: 0.8,
                  }}
                >
                  PHOTOGRAPHY
                </span>
              </div>

              {/* Staggered nav links */}
              <nav style={{ flex: 1 }}>
                {[...NAV_LINKS, { label: t.contact, to: "/contact" }].map(
                  (link, i) => {
                    const isActive =
                      link.to === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(link.to);
                    return (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                          delay: i * 0.06,
                        }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setIsMobileOpen(false)}
                          style={{
                            display: "block",
                            padding: "16px 0",
                            fontSize: 22,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                            textDecoration: "none",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            transition: "color 0.2s",
                            letterSpacing: "-0.01em",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#fff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = isActive
                              ? "#fff"
                              : "rgba(255,255,255,0.45)";
                          }}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {link.label}
                          {isActive && (
                            <motion.span
                              layoutId="mobile-active"
                              style={{
                                display: "inline-block",
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: GOLD,
                                marginLeft: 10,
                                verticalAlign: "middle",
                                marginBottom: 2,
                              }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  },
                )}
              </nav>

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <Link
                  to="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "14px 24px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.8)",
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    letterSpacing: "0.03em",
                  }}
                >
                  {t.contact}
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "14px 24px",
                    borderRadius: 999,
                    background: "#fff",
                    color: "#000",
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    letterSpacing: "0.03em",
                  }}
                >
                  {t.inquireNow}
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
