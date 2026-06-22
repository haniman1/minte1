import { useState } from "react";

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
const TwitterIcon = () => (
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
    <path d="M4 4l16 16M4 20L20 4" />
    <path d="M20 4h-5L4 20h5L20 4z" />
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .contact-root {
          background: #000;
          color: #fff;
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient background glows */
        .contact-root::before {
          content: '';
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .contact-root::after {
          content: '';
          position: fixed;
          bottom: 0;
          right: -10%;
          width: 500px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .contact-inner {
          position: relative;
          z-index: 1;
          max-width: 1140px;
          margin: 0 auto;
          padding: 140px 40px 100px;
        }

        /* ── Hero ── */
        .hero-section {
          text-align: center;
          margin-bottom: 96px;
        }
        .hero-eyebrow {
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: ${GOLD};
          margin-bottom: 20px;
          display: block;
          opacity: 0.8;
        }
        .hero-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(3.5rem, 9vw, 8rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
          margin: 0 0 24px;
          color: #fff;
        }
        .hero-heading em {
          font-style: italic;
          font-weight: 400;
          color: ${GOLD};
          opacity: 0.9;
        }
        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
          letter-spacing: 0.02em;
          max-width: 360px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* ── Gold hairline divider ── */
        .gold-rule {
          width: 48px;
          height: 1px;
          background: linear-gradient(to right, transparent, ${GOLD}, transparent);
          margin: 0 auto 28px;
        }

        /* ── Main grid ── */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }

        /* ── Left: contact details ── */
        .contact-left {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        /* Phone — dominant display treatment */
        .phone-display {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .phone-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.4rem, 5vw, 4.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1;
          color: #fff;
          text-decoration: none;
          display: inline-block;
          position: relative;
          transition: color 0.3s ease;
          text-shadow: 0 0 60px rgba(212,175,55,0.15);
        }
        .phone-number:hover {
          color: ${GOLD};
          text-shadow: 0 0 40px rgba(212,175,55,0.3);
        }

        /* Email links */
        .email-link {
          display: block;
          font-size: 15px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          letter-spacing: 0.01em;
          font-weight: 400;
          transition: color 0.25s;
          padding: 3px 0;
        }
        .email-link:hover { color: #fff; }

        /* Location text */
        .location-text {
          font-size: 15px;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
        }
        .location-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
        }

        /* Response note */
        .response-note {
          font-size: 12px;
          color: rgba(255,255,255,0.22);
          letter-spacing: 0.04em;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
          line-height: 1.7;
        }

        /* ── Right: brand card + social ── */
        .contact-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: sticky;
          top: 100px;
        }

        /* Glass brand card */
        .brand-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 24px;
          padding: 44px 40px;
          position: relative;
          overflow: hidden;
        }
        .brand-card::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .brand-wordmark {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 24px;
          display: block;
        }
        .brand-wordmark .tech  { color: #fff; }
        .brand-wordmark .photo { color: ${GOLD}; opacity: 0.8; margin-left: 5px; }

        .brand-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(20px, 2.5vw, 28px);
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #fff;
          margin-bottom: 14px;
          line-height: 1.2;
        }
        .brand-card-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.42);
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .brand-card-sub {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${GOLD};
          opacity: 0.6;
        }
        .brand-card-rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, ${GOLD}30, transparent);
          margin: 28px 0 0;
        }

        /* Social panel */
        .social-panel {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .social-label {
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          font-weight: 500;
          flex-shrink: 0;
        }
        .social-icons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* ── CTA section ── */
        .cta-section {
          text-align: center;
          padding: 100px 20px 0;
        }
        .cta-eyebrow {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin-bottom: 24px;
          display: block;
        }
        .cta-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .cta-title em {
          font-style: italic;
          font-weight: 400;
          color: ${GOLD};
        }
        .cta-tags {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .contact-inner { padding: 120px 24px 80px; }
          .hero-section { margin-bottom: 64px; }
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
          .contact-right { position: static; }
          .brand-card { padding: 32px 28px; }
          .social-panel { flex-direction: column; align-items: flex-start; }
          .cta-section { padding: 72px 0 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>

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
                  <a href="tel:+15551234567" className="phone-number">
                    +1 (555) 123-4567
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
                  <SocialBtn href="https://twitter.com" label="Twitter / X">
                    <TwitterIcon />
                  </SocialBtn>
                  <SocialBtn href="https://facebook.com" label="Facebook">
                    <FacebookIcon />
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
