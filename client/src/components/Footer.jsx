import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const GOLD = "#D4AF37";
const BORDER = "rgba(255,255,255,0.07)";
const RAISED = "rgba(255,255,255,0.03)";
const SURFACE = "#0D0D0D";

const spring = { type: "spring", stiffness: 400, damping: 20 };

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function SocialBtn({ href, label, children }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={spring}
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        border: `1px solid ${BORDER}`,
        background: RAISED,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        textDecoration: "none",
        flexShrink: 0,
        transition: "border-color 0.3s, color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) =>
        Object.assign(e.currentTarget.style, {
          borderColor: GOLD,
          color: GOLD,
          boxShadow: "0 0 18px rgba(212,175,55,0.2)",
        })
      }
      onMouseLeave={(e) =>
        Object.assign(e.currentTarget.style, {
          borderColor: BORDER,
          color: "#888",
          boxShadow: "none",
        })
      }
    >
      {children}
    </motion.a>
  );
}

function NavLink({ to, href, children }) {
  const props = {
    style: {
      color: "#666",
      textDecoration: "none",
      fontSize: 13,
      letterSpacing: "0.02em",
      display: "inline-block",
      position: "relative",
      transition: "color 0.3s",
      paddingBottom: 2,
    },
    onMouseEnter: (e) => {
      e.currentTarget.style.color = "#fff";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.color = "#666";
    },
  };
  const inner = (
    <>
      {children}
      <span
        className="nav-underline"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "0%",
          height: "1px",
          background: GOLD,
          transition: "width 0.35s ease",
        }}
      />
    </>
  );
  return to ? (
    <Link to={to} {...props}>
      {inner}
    </Link>
  ) : (
    <a href={href || "#"} {...props}>
      {inner}
    </a>
  );
}

function CtaButton({ children, variant = "primary", href = "#" }) {
  const p = variant === "primary";
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "13px 28px",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        textDecoration: "none",
        borderRadius: 0,
        cursor: "pointer",
        transition: "all 0.3s ease",
        background: p ? GOLD : "transparent",
        color: p ? "#000" : GOLD,
        border: p ? "none" : "1px solid rgba(212,175,55,0.4)",
        flexShrink: 0,
      }}
      onMouseEnter={(e) =>
        p
          ? (e.currentTarget.style.background = "#F0C830")
          : Object.assign(e.currentTarget.style, {
              borderColor: GOLD,
              background: "rgba(212,175,55,0.06)",
            })
      }
      onMouseLeave={(e) =>
        p
          ? (e.currentTarget.style.background = GOLD)
          : Object.assign(e.currentTarget.style, {
              borderColor: "rgba(212,175,55,0.4)",
              background: "transparent",
            })
      }
    >
      {children}
    </motion.a>
  );
}

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Gallery", to: "/gallery" },
  { label: "Packages", to: "/packages" },
  { label: "Book Now", to: "/contact" },
];
const SERVICES = ["Weddings", "Portraits", "Events", "Graduation"];
const COMPANY = [
  { label: "About Me", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Journal", href: "/contact" },
  { label: "Privacy", href: "/contact" },
];

function NavCard({ title, items }) {
  return (
    <div
      style={{
        background: RAISED,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: "28px",
      }}
    >
      <p
        style={{
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: GOLD,
          marginBottom: 20,
          fontWeight: 500,
        }}
      >
        {title}
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {items.map(({ label, to, href, name }) => (
          <li
            key={label ?? name}
            className="nav-link-wrap"
            style={{ position: "relative" }}
          >
            <NavLink to={to} href={href}>
              {label ?? name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Inter:wght@300;400;500;600&display=swap');
      .nav-link-wrap:hover .nav-underline { width: 100% !important; }
      @media (max-width: 768px) {
        .fp { padding: 40px 24px 36px !important; }
        .fbg { flex-direction: column !important; gap: 32px !important; }
        .fng { grid-template-columns: 1fr 1fr !important; }
        .fci { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
        .fcb { flex-wrap: wrap !important; }
        .fbt { flex-direction: column !important; text-align: center !important; gap: 8px !important; }
        .fpi { margin: 0 24px !important; padding: 32px 24px !important; }
      }
      @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
    `}</style>

    <div
      style={{
        backgroundColor: "#000",
        paddingTop: 80,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <footer
        style={{
          backgroundColor: SURFACE,
          width: "100%",
          maxWidth: 1350,
          margin: "0 auto",
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
          borderRadius: "24px 24px 0 0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            pointerEvents: "none",
            zIndex: 0,
            background:
              "radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Brand */}
          <div
            className="fp"
            style={{
              padding: "56px 48px 48px",
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <FadeUp>
              <div
                className="fbg"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 48,
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${BORDER}`,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: 20,
                    padding: "36px 40px",
                    maxWidth: 420,
                    width: "100%",
                    flexShrink: 0,
                  }}
                >
                  <Link
                    to="/"
                    style={{ display: "inline-block", marginBottom: 24 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 45, scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {[
                          [4.706, 16],
                          [16.001, 4.706],
                          [16.001, 27.294],
                          [27.294, 16],
                        ].map(([cx, cy], i) => (
                          <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r="4.706"
                            fill="#D9D9D9"
                          />
                        ))}
                      </svg>
                    </motion.div>
                  </Link>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(18px,2vw,22px)",
                      fontStyle: "italic",
                      color: "#fff",
                      lineHeight: 1.5,
                      marginBottom: 16,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Capturing timeless stories through light, emotion and
                    atmosphere.
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#555",
                      lineHeight: 1.7,
                      maxWidth: 300,
                    }}
                  >
                    Specializing in weddings, portraits, and events — wherever
                    the story takes us.
                  </p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.3,
                    }}
                    style={{
                      height: 1,
                      background: `linear-gradient(to right, ${GOLD}, transparent)`,
                      transformOrigin: "left",
                      marginTop: 28,
                    }}
                  />
                </div>

                <div style={{ paddingTop: 8 }}>
                  <p
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#444",
                      marginBottom: 12,
                    }}
                  >
                    Follow the work
                  </p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <SocialBtn href="#" label="Twitter / X">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4l16 16M4 20L20 4" />
                        <path d="M20 4h-5l-11 16h5L20 4z" />
                      </svg>
                    </SocialBtn>
                    <SocialBtn href="#" label="Instagram">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="5"
                          ry="5"
                        />
                        <circle cx="12" cy="12" r="4" />
                        <circle
                          cx="17.5"
                          cy="6.5"
                          r="0.5"
                          fill="currentColor"
                        />
                      </svg>
                    </SocialBtn>
                    <SocialBtn href="#" label="Facebook">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </SocialBtn>
                    <SocialBtn href="#" label="Telegram">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M21.5 2.5L2.9 9.7c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.3l-9 8.1-.3 4.8c.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.2-15.1c.3-1.2-.4-1.8-1.2-1.2z" />
                      </svg>
                    </SocialBtn>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Nav grid */}
          <div
            className="fp"
            style={{ padding: "48px", borderBottom: `1px solid ${BORDER}` }}
          >
            <FadeUp delay={0.05}>
              <div
                className="fng"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "40px 32px",
                }}
              >
                <NavCard title="Navigate" items={NAV_LINKS} />
                <NavCard
                  title="Services"
                  items={SERVICES.map((name) => ({ name, href: "#" }))}
                />
                <NavCard title="Company" items={COMPANY} />
              </div>
            </FadeUp>
          </div>

          {/* CTA */}
          <FadeUp delay={0.1}>
            <div
              className="fpi"
              style={{
                margin: "48px 48px 0",
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(212,175,55,0.04) 100%)",
                border: "1px solid rgba(212,175,55,0.15)",
                borderRadius: 20,
                padding: "44px 48px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 200,
                  height: 200,
                  background:
                    "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                className="fci"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 32,
                  position: "relative",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: GOLD,
                      marginBottom: 12,
                      fontWeight: 500,
                    }}
                  >
                    Let's work together
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(22px,3vw,34px)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "#fff",
                      marginBottom: 10,
                      lineHeight: 1.25,
                    }}
                  >
                    Ready to create something timeless?
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#555",
                      lineHeight: 1.7,
                      maxWidth: 460,
                    }}
                  >
                    Available for weddings, portraits, destination sessions and
                    private events worldwide.
                  </p>
                </div>
                <div
                  className="fcb"
                  style={{
                    display: "flex",
                    gap: 12,
                    flexShrink: 0,
                    alignItems: "center",
                  }}
                >
                  <CtaButton href="/booking">Book a Session →</CtaButton>
                  <CtaButton href="/gallery" variant="outline">
                    View Gallery →
                  </CtaButton>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Wordmark */}
          <div
            style={{ position: "relative", marginTop: 32, overflow: "hidden" }}
          >
            {[
              {
                width: "80%",
                height: "70%",
                background:
                  "radial-gradient(ellipse at center bottom, rgba(212,175,55,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)",
              },
              {
                width: "40%",
                height: "50%",
                background:
                  "radial-gradient(ellipse, rgba(212,175,55,0.18) 0%, transparent 70%)",
                filter: "blur(30px)",
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  pointerEvents: "none",
                  ...s,
                }}
              />
            ))}
            <FadeUp delay={0.15}>
              <div
                style={{
                  position: "relative",
                  textAlign: "center",
                  lineHeight: 1,
                  userSelect: "none",
                  paddingBottom: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 900,
                    fontSize: "clamp(4.5rem,18vw,14rem)",
                    letterSpacing: "-0.03em",
                    display: "inline-block",
                    background: `linear-gradient(to right, ${GOLD} 0%, #fff 40%, #fff 60%, rgba(255,255,255,0.15) 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  MOMENTS
                </span>
              </div>
            </FadeUp>
          </div>

          {/* Copyright */}
          <div
            className="fp fbt"
            style={{
              borderTop: `1px solid ${BORDER}`,
              padding: "20px 48px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(0,0,0,0.25)",
            }}
          >
            <p
              style={{
                color: "#383838",
                fontSize: 12,
                letterSpacing: "0.04em",
              }}
            >
              © 2026 Your Name Photography. All Rights Reserved.
            </p>
            <p
              style={{
                color: "#2C2C2C",
                fontSize: 12,
                letterSpacing: "0.04em",
              }}
            >
              Crafted with passion for moments that matter.
            </p>
          </div>
        </div>
      </footer>
    </div>
  </>
);

export default Footer;
