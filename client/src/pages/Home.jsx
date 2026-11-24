import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../components/Button";
import { useLanguage } from "../context/LanguageContext";

/* ─── Constants ─────────────────────────────────────────────────────────── */
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&family=Noto+Serif+Ethiopic:wght@400;600;700&family=Noto+Sans+Ethiopic:wght@300;400;500;600&display=swap');`;
// Ethiopic fallbacks so the Amharic copy renders in a matching typeface
const SERIF = "'Cormorant Garamond', 'Noto Serif Ethiopic', Georgia, serif";
const SANS = "'Inter', 'Noto Sans Ethiopic', system-ui, sans-serif";
const GOLD = "#C9A84C";
const EASE = "cubic-bezier(0.22,1,0.36,1)";

// Text tones tuned for WCAG AA contrast on black
const TXT = {
  strong: "#FFFFFF",
  body: "rgba(255,255,255,0.72)",
  muted: "rgba(255,255,255,0.58)",
};

const heroImage =
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2400&q=90";

const u = (id, w = 1200, q = 85) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

const fallbackWorks = [
  { id: "fallback-1", title: "Golden Hour Vows", category: "Wedding", image: u("photo-1519741497674-611481863552") },
  { id: "fallback-2", title: "Editorial Portrait", category: "Portrait", image: u("photo-1500648767791-00dcc994a43e") },
  { id: "fallback-3", title: "Private Celebration", category: "Event", image: u("photo-1511795409834-ef04bbd61622") },
  { id: "fallback-4", title: "Quiet Ceremony", category: "Wedding", image: u("photo-1523438885200-e635ba2c371e") },
  { id: "fallback-5", title: "Studio Presence", category: "Portrait", image: u("photo-1517841905240-472988babdf9") },
  { id: "fallback-6", title: "Evening Reception", category: "Event", image: u("photo-1464366400600-7168b8af9bc3") },
];

const services = [
  { title: "Wedding Photography", num: "01", description: "Cinematic coverage for ceremonies, portraits, receptions, and the quiet moments between." },
  { title: "Portrait Photography", num: "02", description: "Editorial portraits for individuals, couples, creatives, and personal branding sessions." },
  { title: "Event Coverage", num: "03", description: "Clean, atmospheric storytelling for private events, launches, celebrations, and gatherings." },
];

const stats = [
  { value: 500, suffix: "+", label: "Shoots Completed" },
  { value: 120, suffix: "+", label: "Weddings Covered" },
  { value: 10, suffix: "+", label: "Years of Experience" },
];

const testimonials = [
  { name: "Maya Chen", handle: "@mayachen", date: "Feb 2026", image: u("photo-1494790108377-be9c29b29330", 240, 80), review: "Every frame felt intentional. The final gallery was cinematic, emotional, and beautifully edited." },
  { name: "Daniel Brooks", handle: "@danielbrooks", date: "Jan 2026", image: u("photo-1500648767791-00dcc994a43e", 240, 80), review: "Professional, calm, and sharp. The event coverage looked like a premium editorial campaign." },
  { name: "Amara Stone", handle: "@amarastone", date: "Dec 2025", image: u("photo-1534528741775-53994a69daeb", 240, 80), review: "Our wedding photos are timeless. Nothing felt staged, but everything looked elevated." },
  { name: "Noah Ellis", handle: "@noahellis", date: "Nov 2025", image: u("photo-1506794778202-cad84cf45f1d", 240, 80), review: "The portraits had depth, texture, and presence. Exactly the studio quality I wanted." },
];

const translations = {
  en: {
    heroPill: "Weddings · Portraits · Events",
    heroTitle1: "Capturing",
    heroTitle2: "Timeless",
    heroTitle3: "Moments",
    heroDesc: "Premium photography services for weddings, portraits, events, and stories that deserve to feel cinematic.",
    viewGallery: "View Gallery",
    bookSession: "Book Session",
    portfolioLabel: "Portfolio",
    portfolio: "Selected Works",
    viewAll: "View All",
    servicesLabel: "Services",
    servicesHeading: "Photography with direction, restraint, and atmosphere.",
    bookStudioLabel: "Book The Studio",
    bookStudioHeading: "Let's Create Something Timeless",
    bookStudioDesc: "Tell us what you are planning. We will help shape the session, timeline, mood, and final gallery.",
    contact: "Contact Photographer",
    clientNotes: "Client Notes",
    clientHeading: "Trusted for moments that matter.",
    viewFullGallery: "Open in Gallery",
  },
  am: {
    heroPill: "ሰርግ · ፎቶ ስዕሎች · ዝግጅቶች",
    heroTitle1: "የሚያስታውሱ",
    heroTitle2: "ጊዜዎችን",
    heroTitle3: "መያዝ",
    heroDesc: "ለሰርግ፣ ፎቶ ስዕል፣ ዝግጅቶች እና ታሪኮች ፕሪሚየም የፎቶግራፊ አገልግሎት",
    viewGallery: "ጋለሪ ይመልከቱ",
    bookSession: "ቀጠሮ ይያዙ",
    portfolioLabel: "ፖርትፎሊዮ",
    portfolio: "የተመረጡ ስራዎች",
    viewAll: "ሁሉንም ይመልከቱ",
    servicesLabel: "አገልግሎቶች",
    servicesHeading: "አቅጣጫ፣ ብቃት እና ድባብ ያለው ፎቶግራፊ።",
    bookStudioLabel: "ስቱዲዮ ይያዙ",
    bookStudioHeading: "ዘላቂ ነገር እንፍጠር",
    bookStudioDesc: "የሚያቅዱትን ይንገሩን። ክፍለ ጊዜውን፣ የጊዜ ሰሌዳውን፣ ስሜቱን እና የመጨረሻ ጋለሪውን እንቀርጽለታለን።",
    contact: "ፎቶግራፈርን ያግኙ",
    clientNotes: "የደንበኞች ማስታወሻዎች",
    clientHeading: "ለሚያስፈልጉ ጊዜዎች የሚታመን።",
    viewFullGallery: "ጋለሪ ይክፈቱ",
  },
};

/* ─── Global styles (responsive layout, focus rings, reduced motion) ───── */
const GLOBAL_CSS = `
${FONT_LINK}
@keyframes heroZoom { from { transform: scale(1.04); } to { transform: scale(1.12); } }
@keyframes breathe { 0%,100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.55; transform: scale(1.08); } }
@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes lineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes marqueeRev { from { transform: translateX(-50%); } to { transform: translateX(0); } }

.hp a:focus-visible, .hp button:focus-visible {
  outline: 2px solid ${GOLD};
  outline-offset: 4px;
}
.hp ::selection { background: rgba(201,168,76,0.35); color: #fff; }

/* Portfolio: editorial asymmetric grid on tablet+, single column on phones */
.hp-works { display: grid; gap: 20px; grid-template-columns: 1fr; }
.hp-work-cell { height: 100%; min-height: clamp(22rem, 70vw, 30rem); }
@media (min-width: 720px) {
  .hp-works { grid-template-columns: repeat(12, 1fr); gap: 24px; }
  .hp-work-cell { min-height: clamp(24rem, 36vw, 33rem); }
  .hp-w0 { grid-column: span 7; } .hp-w1 { grid-column: span 5; }
  .hp-w2 { grid-column: span 5; } .hp-w3 { grid-column: span 7; }
  .hp-w4 { grid-column: span 6; } .hp-w5 { grid-column: span 6; }
}

/* Header row wraps cleanly on small screens */
.hp-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px 24px; flex-wrap: wrap; margin-bottom: 52px; }

.hp-link {
  display: inline-flex; align-items: center; min-height: 44px;
  font-family: ${SANS}; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
  color: ${TXT.body}; text-decoration: none; white-space: nowrap;
  border-bottom: 1px solid rgba(255,255,255,0.25);
  transition: color 0.3s ease, border-color 0.3s ease;
}
.hp-link:hover { color: ${GOLD}; border-color: ${GOLD}; }

.hp-cta {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  min-height: 52px; padding: 14px 36px; border-radius: 999px;
  background: ${GOLD}; color: #000; font-family: ${SANS}; font-size: 12px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase; text-decoration: none; cursor: pointer;
  box-shadow: 0 0 40px rgba(201,168,76,0.3);
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.hp-cta:hover { background: #DFC060; box-shadow: 0 0 60px rgba(201,168,76,0.5); transform: translateY(-2px); }
.hp-cta svg { transition: transform 0.3s ease; }
.hp-cta:hover svg { transform: translateX(4px); }

/* Stats: 1px gaps act as dividers at any column count */
.hp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1px; background: rgba(255,255,255,0.09); }
.hp-stat { background: #0a0a0a; position: relative; padding: 48px 32px; text-align: center; }

.hp-marquee-track { display: flex; width: max-content; }
.hp-marquee-scroll { display: flex; flex-direction: column; gap: 16px; }

@media (prefers-reduced-motion: reduce) {
  .hp *, .hp *::before, .hp *::after {
    animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important;
  }
  /* Marquee becomes a swipeable row instead of a frozen mid-scroll frame */
  .hp-marquee-scroll { overflow-x: auto; padding-bottom: 8px; }
  .hp-marquee-track { animation: none !important; }
}
`;

/* ─── Hooks ──────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Small shared pieces ────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, from = "bottom", className, fill: fillHeight = false }) {
  const [ref, visible] = useInView(0.12);
  const transforms = {
    bottom: "translateY(40px)",
    left: "translateX(-32px)",
    right: "translateX(32px)",
    scale: "scale(0.94)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        height: fillHeight ? "100%" : undefined,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : transforms[from] || transforms.bottom,
        transition: `opacity 0.85s ${EASE} ${delay}ms, transform 0.85s ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, spacing = "0.3em", color = GOLD, mb = 14, center = false }) {
  return (
    <p
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: center ? "center" : "flex-start",
        gap: 14,
        fontFamily: SANS,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: spacing,
        textTransform: "uppercase",
        color,
        marginBottom: mb,
      }}
    >
      <span aria-hidden="true" style={{ width: 28, height: 1, background: color, opacity: 0.7, flexShrink: 0 }} />
      {children}
    </p>
  );
}

function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let frame;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 4)) * value));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Photo helpers ──────────────────────────────────────────────────────── */
const fb = (i) => fallbackWorks[i % fallbackWorks.length];
// Admin uploads are saved with an `imageUrl` field, so it is checked first
const getPhotoImage = (p) => p.imageUrl || p.image || p.url || p.src || p.photo || fallbackWorks[0].image;
const getPhotoTitle = (p, i) => p.title || p.name || fb(i).title;
const getPhotoCategory = (p, i) => p.category?.name || p.category || fb(i).category;

/* ─── WorkCard ───────────────────────────────────────────────────────────── */
const abs = { position: "absolute" };
const fill = { ...abs, inset: 0 };

function WorkCard({ photo, index, onClick, viewFullGallery }) {
  const [h, setH] = useState(false);
  const title = getPhotoTitle(photo, index);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onFocus={() => setH(true)}
      onBlur={() => setH(false)}
      aria-label={`${title} — ${viewFullGallery}`}
      style={{
        position: "relative",
        height: "100%",
        minHeight: "inherit",
        overflow: "hidden",
        borderRadius: "1.5rem",
        background: "#111",
        display: "block",
        width: "100%",
        padding: 0,
        border: `1px solid ${h ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)"}`,
        boxShadow: h
          ? "0 0 0 1px rgba(201,168,76,0.2), 0 32px 64px -12px rgba(0,0,0,0.7)"
          : "0 16px 48px -8px rgba(0,0,0,0.5)",
        cursor: "pointer",
        transition: `border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ${EASE}`,
        transform: h ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      <img
        src={getPhotoImage(photo)}
        alt={title}
        loading="lazy"
        style={{
          ...fill,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: h ? "scale(1.07)" : "scale(1.01)",
          transition: `transform 0.9s ${EASE}`,
          willChange: "transform",
        }}
      />
      {/* Always-on scrim so the title stays readable on touch screens too */}
      <div style={{ ...fill, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)" }} />
      <div
        style={{
          ...fill,
          background: "linear-gradient(135deg, rgba(201,168,76,0.1) 0%, transparent 60%)",
          opacity: h ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Category badge */}
      <div
        style={{
          ...abs,
          top: 16,
          left: 16,
          padding: "6px 14px",
          borderRadius: 999,
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.92)",
          fontFamily: SANS,
        }}
      >
        {getPhotoCategory(photo, index)}
      </div>

      {/* Corner arrow */}
      <div
        aria-hidden="true"
        style={{
          ...abs,
          top: 14,
          right: 14,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(201,168,76,0.18)",
          border: "1px solid rgba(201,168,76,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: h ? 1 : 0,
          transform: h ? "scale(1)" : "scale(0.6)",
          transition: `opacity 0.3s ease, transform 0.4s ${EASE}`,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>

      {/* Info — title always visible, call-to-action slides in */}
      <div style={{ ...abs, bottom: 0, left: 0, right: 0, padding: "28px 26px", textAlign: "left" }}>
        <p style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem, 2.4vw, 1.75rem)", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2, marginBottom: 8 }}>
          {title}
        </p>
        <p
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: GOLD,
            opacity: h ? 1 : 0.85,
            transform: h ? "translateX(4px)" : "translateX(0)",
            transition: `transform 0.45s ${EASE}, opacity 0.35s ease`,
          }}
        >
          {viewFullGallery} →
        </p>
      </div>

      {/* Gold line */}
      <div
        aria-hidden="true"
        style={{
          ...abs,
          bottom: 0,
          left: 0,
          height: 2,
          width: h ? "100%" : "0%",
          background: `linear-gradient(to right, ${GOLD}, rgba(201,168,76,0.3))`,
          transition: `width 0.55s ${EASE}`,
        }}
      />
    </button>
  );
}

/* ─── Testimonials ───────────────────────────────────────────────────────── */
function TestimonialCard({ testimonial }) {
  return (
    <article
      style={{
        margin: "0 10px",
        width: "min(320px, 80vw)",
        flexShrink: 0,
        borderRadius: "1.25rem",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: 24,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <img
          src={testimonial.image}
          alt={testimonial.name}
          loading="lazy"
          width={44}
          height={44}
          style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(201,168,76,0.4)" }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: 14, color: "#fff", marginBottom: 2 }}>{testimonial.name}</p>
          <p style={{ fontFamily: SANS, fontSize: 12, color: TXT.muted }}>{testimonial.handle}</p>
        </div>
        <span style={{ fontFamily: SANS, fontSize: 11, color: TXT.muted, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{testimonial.date}</span>
      </div>

      <div role="img" style={{ display: "flex", gap: 3, marginBottom: 12 }} aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={GOLD} aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: TXT.body }}>
        “{testimonial.review}”
      </p>
    </article>
  );
}

function TestimonialsMarquee({ t }) {
  const [paused, setPaused] = useState(false);
  const rows = [testimonials, [...testimonials].reverse()];

  return (
    <section
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "#050505",
        padding: "96px 0",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Reveal>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", marginBottom: 48 }}>
          <Eyebrow>{t.clientNotes}</Eyebrow>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.12, maxWidth: 720 }}>
            {t.clientHeading}
          </h2>
        </div>
      </Reveal>

      <div
        className="hp-marquee-scroll"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="hp-marquee-track"
            style={{
              animation: `marquee${ri === 1 ? "Rev" : ""} ${ri === 0 ? 34 : 38}s linear infinite`,
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {[...row, ...row].map((item, i) => (
              <TestimonialCard key={`${item.name}-${ri}-${i}`} testimonial={item} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── ServiceCard ────────────────────────────────────────────────────────── */
function ServiceCard({ service }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        height: "100%",
        borderRadius: "1.5rem",
        border: `1px solid ${h ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.09)"}`,
        background: h ? "rgba(201,168,76,0.05)" : "rgba(255,255,255,0.03)",
        padding: "40px 36px 36px",
        transition: `border-color 0.4s ease, background 0.4s ease, transform 0.4s ${EASE}, box-shadow 0.4s ease`,
        transform: h ? "translateY(-6px)" : "translateY(0)",
        boxShadow: h ? "0 24px 56px -8px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          ...abs,
          top: -12,
          right: 20,
          fontFamily: SERIF,
          fontSize: "7rem",
          fontWeight: 700,
          color: h ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.05)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          transition: "color 0.4s ease",
          letterSpacing: "-0.04em",
        }}
      >
        {service.num}
      </div>

      <div style={{ width: h ? 56 : 28, height: 2, background: GOLD, marginBottom: 32, transition: `width 0.4s ${EASE}` }} />

      <h3 style={{ fontFamily: SERIF, fontSize: "1.85rem", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.15, marginBottom: 16 }}>
        {service.title}
      </h3>
      <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: TXT.body, fontWeight: 300 }}>
        {service.description}
      </p>
    </div>
  );
}

/* ─── Home ───────────────────────────────────────────────────────────────── */
const grid = (min) => ({ display: "grid", gap: 20, gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))` });

const Home = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage(); // shared with the sidebar toggle
  const t = translations[lang] ?? translations.en;
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/photos");
        if (!cancelled) setPhotos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load photos", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Newest uploads first; sample photos only show while the gallery is empty
  const selectedWorks = useMemo(() => {
    const newest = [...photos].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
    const featured = newest.slice(0, 6);
    return featured.length > 0 ? featured : fallbackWorks;
  }, [photos]);

  const fade = (delay, dur = 0.9) => ({
    animation: `fadeUp ${dur}s ease forwards`,
    opacity: 0,
    animationDelay: `${delay}s`,
  });
  const rule = (dir) => ({
    flex: 1,
    maxWidth: 80,
    height: 1,
    background: `linear-gradient(to ${dir}, transparent, rgba(201,168,76,0.7))`,
  });
  const titleLine = (size, extra) => ({ display: "block", fontSize: size, ...extra });

  return (
    <div className="hp" style={{ minHeight: "100vh", background: "#000", color: "#fff", overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ ...fill, animation: heroLoaded ? "heroZoom 20s ease-in-out infinite alternate" : "none" }}>
          <img
            src={heroImage}
            alt="Cinematic photography hero"
            onLoad={() => setHeroLoaded(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Layered scrims keep headline text above 4.5:1 over any photo */}
        <div style={{ ...fill, background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 50%, #000 100%)" }} />
        <div style={{ ...fill, background: "radial-gradient(ellipse 70% 55% at 50% 48%, rgba(0,0,0,0.45) 0%, transparent 100%)" }} />
        <div style={{ ...fill, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)" }} />

        {/* Ambient light orb */}
        <div
          aria-hidden="true"
          style={{
            ...abs,
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(300px, 60vw, 700px)",
            height: "clamp(200px, 40vw, 480px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 40%, transparent 70%)",
            filter: "blur(40px)",
            animation: "breathe 8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "120px 24px 140px", textAlign: "center" }}>
          {/* Eyebrow */}
          <div style={{ ...fade(0.2, 0.8), marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={rule("right")} />
            <p style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD }}>
              {t.heroPill}
            </p>
            <div style={rule("left")} />
          </div>

          {/* Title */}
          <div style={{ ...fade(0.4), marginBottom: 28 }}>
            <h1 style={{ fontFamily: SERIF, lineHeight: 0.95, letterSpacing: "-0.03em", textShadow: "0 4px 40px rgba(0,0,0,0.5)" }}>
              <span style={titleLine("clamp(3.4rem, 12vw, 9rem)", { fontWeight: 300, fontStyle: "italic", color: "rgba(255,255,255,0.95)" })}>{t.heroTitle1}</span>
              <span style={titleLine("clamp(4rem, 14vw, 11rem)", { fontWeight: 700, color: "#fff", letterSpacing: "-0.04em" })}>{t.heroTitle2}</span>
              <span style={titleLine("clamp(3.4rem, 12vw, 9rem)", { fontWeight: 300, fontStyle: "italic", color: "#D8B95A" })}>{t.heroTitle3}</span>
            </h1>
          </div>

          {/* Divider */}
          <div
            aria-hidden="true"
            style={{
              animation: `lineGrow 0.8s ${EASE} forwards`,
              opacity: 0,
              animationDelay: "0.7s",
              transformOrigin: "center",
              height: 1,
              width: "50%",
              maxWidth: 280,
              margin: "0 auto 28px",
              background: "linear-gradient(to right, transparent, rgba(201,168,76,0.7), transparent)",
            }}
          />

          {/* Description */}
          <div style={{ ...fade(0.75), marginBottom: 44 }}>
            <p style={{ fontFamily: SANS, fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.8, color: "rgba(255,255,255,0.8)", maxWidth: 540, margin: "0 auto", fontWeight: 300 }}>
              {t.heroDesc}
            </p>
          </div>

          {/* CTAs — shared Button component */}
          <div style={{ ...fade(0.95), display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Button to="/gallery" size="lg">{t.viewGallery}</Button>
            <Button to="/contact" size="lg" variant="outline">{t.bookSession}</Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div aria-hidden="true" style={{ ...abs, bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "fadeUp 1s ease forwards", opacity: 0, animationDelay: "1.4s" }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(201,168,76,0.8), transparent)" }} />
          <p style={{ fontFamily: SANS, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Scroll</p>
        </div>
      </section>

      {/* ── PORTFOLIO ────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "112px 24px" }}>
        <Reveal>
          <div className="hp-head">
            <div>
              <Eyebrow mb={14}>{t.portfolioLabel}</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1, color: "#fff" }}>
                {t.portfolio}
              </h2>
            </div>
            <Link to="/gallery" className="hp-link">
              {t.viewAll} →
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="hp-works" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`hp-work-cell hp-w${i}`}
                style={{ borderRadius: "1.5rem", background: "rgba(255,255,255,0.05)", animation: "breathe 2s ease-in-out infinite", animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="hp-works">
            {selectedWorks.map((photo, index) => (
              <Reveal key={photo._id || photo.id || index} delay={index * 60} className={`hp-work-cell hp-w${index}`} fill>
                <WorkCard photo={photo} index={index} onClick={() => navigate("/gallery")} viewFullGallery={t.viewFullGallery} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <section style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "112px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 56, maxWidth: 680 }}>
              <Eyebrow>{t.servicesLabel}</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 400, fontStyle: "italic", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                {t.servicesHeading}
              </h2>
            </div>
          </Reveal>

          <div style={{ ...grid(300), gap: 20 }}>
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 100} fill>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                borderRadius: "1.75rem",
                border: "1px solid rgba(255,255,255,0.09)",
                overflow: "hidden",
                boxShadow: "0 32px 80px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <div className="hp-stats">
                {stats.map((stat) => (
                  <div key={stat.label} className="hp-stat">
                    <div aria-hidden="true" style={{ ...abs, top: 0, left: "50%", transform: "translateX(-50%)", width: 48, height: 2, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />
                    <p style={{ fontFamily: SERIF, fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 14, fontVariantNumeric: "tabular-nums" }}>
                      <CountUp value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: TXT.muted, fontWeight: 500 }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <TestimonialsMarquee t={t} />

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "112px 24px" }}>
        <Reveal>
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              borderRadius: "2rem",
              border: "1px solid rgba(201,168,76,0.25)",
              background: "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(255,255,255,0.025) 50%, rgba(201,168,76,0.05) 100%)",
              padding: "clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
            }}
          >
            <div aria-hidden="true" style={{ ...abs, top: -100, left: "50%", transform: "translateX(-50%)", width: 500, height: 300, maxWidth: "100%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
            <div aria-hidden="true" style={{ ...abs, bottom: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

            <div style={{ position: "relative" }}>
              <Eyebrow spacing="0.3em" mb={22} center>{t.bookStudioLabel}</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(2.4rem, 6vw, 5.5rem)", fontWeight: 600, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.02, maxWidth: 760, margin: "0 auto 22px" }}>
                {t.bookStudioHeading}
              </h2>
              <p style={{ fontFamily: SANS, fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)", lineHeight: 1.85, color: TXT.body, maxWidth: 540, margin: "0 auto 44px", fontWeight: 300 }}>
                {t.bookStudioDesc}
              </p>
              <Link to="/contact" className="hp-cta">
                {t.contact}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
