import { useState } from "react";
import "../index.css";

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const GOLD = "#D4AF37";
const BORDER = "rgba(255,255,255,0.07)";
const SURFACE = "rgba(255,255,255,0.03)";

/* ─── Lucide-style inline SVG icons ─────────────────────────────────────── */
const MapPinIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const InstagramIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const TikTokIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c1 2.5 3 4 6 4" />
  </svg>
);
const FacebookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.5 2.5L2.9 9.7c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.3l-9 8.1-.3 4.8c.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.2-15.1c.3-1.2-.4-1.8-1.2-1.2z" />
  </svg>
);

/* ─── Hover social button ────────────────────────────────────────────────── */
function SocialBtn({ href, label, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: `1px solid ${hov ? GOLD : BORDER}`,
        background: hov ? `rgba(212,175,55,0.08)` : SURFACE,
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hov ? GOLD : "rgba(255,255,255,0.45)",
        textDecoration: "none",
        transform: hov
          ? "scale(1.1) translateY(-2px)"
          : "scale(1) translateY(0)",
        boxShadow: hov ? `0 0 20px rgba(212,175,55,0.18)` : "none",
        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}

/* ─── Info block (label + content) ──────────────────────────────────────── */
function InfoBlock({ icon, label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: GOLD, display: "flex" }}>{icon}</span>
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Contact = () => {
  return (
    <>
      <div className="contact-root">
        <div className="contact-inner">
          {/* ── 1. HERO ──────────────────────────────────────────────── */}
          <section className="hero-section">
            <span className="hero-eyebrow">Tech Photography Studio</span>
            <div className="gold-rule" />
            <h1 className="hero-heading">
              Let's <em>Connect</em>
            </h1>
            <p className="hero-sub">
              Serious inquiries welcome. Every great story starts with a single
              conversation.
            </p>
          </section>

          {/* ── 2. CONTACT INFO GRID ─────────────────────────────────── */}
          <section className="contact-grid">
            {/* LEFT — contact details */}
            <div className="contact-left">
              {/* Phone — visually dominant */}
              <InfoBlock icon={<PhoneIcon />} label="Direct Line">
                <div className="phone-display">
                  <a href="tel: +251 96 710 6705" className="phone-number">
                    +251 96 710 6705
                  </a>
                </div>
              </InfoBlock>

              {/* Email */}
              <InfoBlock icon={<MailIcon />} label="Email">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <a
                    href="mailto:hello@alexrivera.photo"
                    className="email-link"
                  >
                    hello@alexrivera.photo
                  </a>
                  <a
                    href="mailto:inquiries@alexrivera.photo"
                    className="email-link"
                  >
                    inquiries@alexrivera.photo
                  </a>
                </div>
              </InfoBlock>

              {/* Location */}
              <InfoBlock icon={<MapPinIcon />} label="Studio">
                <div>
                  <p className="location-text">New York, NY</p>
                  <p className="location-sub">Available for travel worldwide</p>
                </div>
              </InfoBlock>

              {/* Response note */}
              <p className="response-note">
                Response within 24–48 hours for serious inquiries.
              </p>
            </div>

            {/* RIGHT — brand card + social */}
            <div className="contact-right">
              {/* Glassmorphism brand card */}
              <div className="brand-card">
                <span className="brand-wordmark">
                  <span className="tech">TECH</span>
                  <span className="photo">PHOTOGRAPHY</span>
                </span>

                <h2 className="brand-card-title">
                  Luxury cinematic photography for moments that endure.
                </h2>

                <p className="brand-card-desc">
                  A luxury cinematic photography studio specializing in
                  editorial, weddings, and commercial work. Based in New York.
                  Available everywhere.
                </p>

                <span className="brand-card-sub">
                  Select bookings only · Global availability
                </span>

                <div className="brand-card-rule" />
              </div>

              {/* Social media */}
              <div className="social-panel">
                <span className="social-label">Follow</span>
                <div className="social-icons">
                  <SocialBtn href="https://instagram.com" label="Instagram">
                    <InstagramIcon />
                  </SocialBtn>
                  <SocialBtn href="https://www.tiktok.com/en/" label="Tiktok ">
                    <TikTokIcon />
                  </SocialBtn>
                  <SocialBtn href="https://facebook.com" label="Facebook">
                    <FacebookIcon />
                  </SocialBtn>
                  <SocialBtn href="https://web.telegram.org/" label="Telegram">
                    <TelegramIcon />
                  </SocialBtn>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. EDITORIAL CTA ─────────────────────────────────────── */}
          <section className="cta-section">
            <div
              style={{
                width: "100%",
                height: 1,
                background:
                  "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)",
                marginBottom: 80,
              }}
            />
            <span className="cta-eyebrow">Available Now</span>
            <h2 className="cta-title">
              Let's build something <em>timeless.</em>
            </h2>
            <p className="cta-tags">
              Weddings · Editorial · Commercial · Travel
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Contact;
