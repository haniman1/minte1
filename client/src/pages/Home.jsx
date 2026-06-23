import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

/* ─── Google Fonts ──────────────────────────────────────────────────────── */
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');`;

/* ─── Constants ─────────────────────────────────────────────────────────── */
const heroImage =
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2400&q=90";

const fallbackWorks = [
  {
    id: "fallback-1",
    title: "Golden Hour Vows",
    category: "Wedding",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-2",
    title: "Editorial Portrait",
    category: "Portrait",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-3",
    title: "Private Celebration",
    category: "Event",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-4",
    title: "Quiet Ceremony",
    category: "Wedding",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-5",
    title: "Studio Presence",
    category: "Portrait",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "fallback-6",
    title: "Evening Reception",
    category: "Event",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
  },
];

const services = [
  {
    title: "Wedding Photography",
    num: "01",
    description:
      "Cinematic coverage for ceremonies, portraits, receptions, and the quiet moments between.",
  },
  {
    title: "Portrait Photography",
    num: "02",
    description:
      "Editorial portraits for individuals, couples, creatives, and personal branding sessions.",
  },
  {
    title: "Event Coverage",
    num: "03",
    description:
      "Clean, atmospheric storytelling for private events, launches, celebrations, and gatherings.",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Shoots Completed" },
  { value: 120, suffix: "+", label: "Weddings Covered" },
  { value: 10, suffix: "+", label: "Years of Experience" },
];

const testimonials = [
  {
    name: "Maya Chen",
    handle: "@mayachen",
    date: "Feb 2026",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    review:
      "Every frame felt intentional. The final gallery was cinematic, emotional, and beautifully edited.",
  },
  {
    name: "Daniel Brooks",
    handle: "@danielbrooks",
    date: "Jan 2026",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    review:
      "Professional, calm, and sharp. The event coverage looked like a premium editorial campaign.",
  },
  {
    name: "Amara Stone",
    handle: "@amarastone",
    date: "Dec 2025",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
    review:
      "Our wedding photos are timeless. Nothing felt staged, but everything looked elevated.",
  },
  {
    name: "Noah Ellis",
    handle: "@noahellis",
    date: "Nov 2025",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    review:
      "The portraits had depth, texture, and presence. Exactly the studio quality I wanted.",
  },
];

const translations = {
  en: {
    heroPill: "Weddings · Portraits · Events",
    heroTitle1: "Capturing",
    heroTitle2: "Timeless",
    heroTitle3: "Moments",
    heroDesc:
      "Premium photography services for weddings, portraits, events, and stories that deserve to feel cinematic.",
    viewGallery: "View Gallery",
    bookSession: "Book Session",
    portfolioLabel: "Portfolio",
    portfolio: "Selected Works",
    viewAll: "View All",
    servicesLabel: "Services",
    servicesHeading: "Photography with direction, restraint, and atmosphere.",
    bookStudioLabel: "Book The Studio",
    bookStudioHeading: "Let's Create Something Timeless",
    bookStudioDesc:
      "Tell us what you are planning. We will help shape the session, timeline, mood, and final gallery.",
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
    bookStudioDesc:
      "የሚያቅዱትን ይንገሩን። ክፍለ ጊዜውን፣ የጊዜ ሰሌዳውን፣ ስሜቱን እና የመጨረሻ ጋለሪውን እንቀርጽለታለን።",
    contact: "ፎቶግራፈርን ያግኙ",
    clientNotes: "የደንበኞች ማስታወሻዎች",
    clientHeading: "ለሚያስፈልጉ ጊዜዎች የሚታመን።",
    viewFullGallery: "ጋለሪ ይክፈቱ",
  },
};

/* ─── Utility: IntersectionObserver hook ───────────────────────────────── */
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

/* ─── Reveal ─────────────────────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0, from = "bottom" }) {
  const [ref, visible] = useInView(0.12);
  const transforms = {
    bottom: "translateY(40px)",
    left: "translateX(-32px)",
    right: "translateX(32px)",
    scale: "scale(0.94)",
  };
  const base = transforms[from] || transforms.bottom;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : base,
        transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── CountUp ────────────────────────────────────────────────────────────── */
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
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(eased * value));
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
function getPhotoImage(photo) {
  return (
    photo.image ||
    photo.url ||
    photo.src ||
    photo.photo ||
    fallbackWorks[0].image
  );
}
function getPhotoTitle(photo, index) {
  return (
    photo.title ||
    photo.name ||
    fallbackWorks[index % fallbackWorks.length].title
  );
}
function getPhotoCategory(photo, index) {
  return (
    photo.category?.name ||
    photo.category ||
    fallbackWorks[index % fallbackWorks.length].category
  );
}

/* ─── WorkCard ───────────────────────────────────────────────────────────── */
function WorkCard({ photo, index, onClick, viewFullGallery }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`${getPhotoTitle(photo, index)} — ${viewFullGallery}`}
      style={{
        position: "relative",
        height: "30rem",
        overflow: "hidden",
        borderRadius: "1.5rem",
        background: "#111",
        display: "block",
        width: "100%",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.45)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: hovered
          ? "0 0 0 1px rgba(201,168,76,0.2), 0 32px 64px -12px rgba(0,0,0,0.7)"
          : "0 16px 48px -8px rgba(0,0,0,0.5)",
        cursor: "pointer",
        outline: "none",
        transition:
          "border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Image */}
      <img
        src={getPhotoImage(photo)}
        alt={getPhotoTitle(photo, index)}
        loading="lazy"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: hovered ? "scale(1.08)" : "scale(1.01)",
          transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
          willChange: "transform",
        }}
      />

      {/* Base scrim */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
        }}
      />

      {/* Hover tint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 60%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Category badge */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          padding: "5px 14px",
          borderRadius: 999,
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {getPhotoCategory(photo, index)}
      </div>

      {/* Corner accent */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "rgba(201,168,76,0.15)",
          border: "1px solid rgba(201,168,76,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0.6)",
          transition:
            "opacity 0.3s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>

      {/* Info reveal */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "28px 24px",
          transform: hovered ? "translateY(0)" : "translateY(12px)",
          opacity: hovered ? 1 : 0,
          transition:
            "transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          {getPhotoTitle(photo, index)}
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#C9A84C",
          }}
        >
          {viewFullGallery} →
        </p>
      </div>

      {/* Bottom gold line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          width: hovered ? "100%" : "0%",
          background:
            "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.3))",
          transition: "width 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </button>
  );
}

/* ─── TestimonialCard ────────────────────────────────────────────────────── */
function TestimonialCard({ testimonial }) {
  return (
    <article
      style={{
        margin: "0 10px",
        width: 320,
        flexShrink: 0,
        borderRadius: "1.25rem",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.035)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "24px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <img
          src={testimonial.image}
          alt={testimonial.name}
          loading="lazy"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid rgba(201,168,76,0.3)",
          }}
        />
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "#fff",
              marginBottom: 2,
            }}
          >
            {testimonial.name}
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "#5A5A6A",
            }}
          >
            {testimonial.handle}
          </p>
        </div>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: "#5A5A6A",
            letterSpacing: "0.06em",
          }}
        >
          {testimonial.date}
        </span>
      </div>

      {/* Stars */}
      <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="#C9A84C"
            style={{ opacity: i < 5 ? 1 : 0.3 }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          lineHeight: 1.75,
          color: "rgba(255,255,255,0.65)",
        }}
      >
        "{testimonial.review}"
      </p>
    </article>
  );
}

/* ─── TestimonialsMarquee ────────────────────────────────────────────────── */
function TestimonialsMarquee({ t }) {
  const [paused, setPaused] = useState(false);
  const firstRow = testimonials;
  const secondRow = [...testimonials].reverse();

  return (
    <section
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "#050505",
        padding: "80px 0",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Reveal>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            marginBottom: 48,
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(201,168,76,0.7)",
              marginBottom: 14,
            }}
          >
            {t.clientNotes}
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {t.clientHeading}
          </h2>
        </div>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[firstRow, secondRow].map((row, ri) => (
          <div
            key={ri}
            style={{
              display: "flex",
              width: "max-content",
              animation: `marquee${ri === 1 ? "Rev" : ""} ${ri === 0 ? 34 : 38}s linear infinite`,
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {[...row, ...row].map((item, i) => (
              <TestimonialCard
                key={`${item.name}-${ri}-${i}`}
                testimonial={item}
              />
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeRev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) { [style*="animation"] { animation: none !important; } }
      `}</style>
    </section>
  );
}

/* ─── Home ───────────────────────────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get("/photos");
        setPhotos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load photos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const selectedWorks = useMemo(() => {
    const featured = photos.slice(0, 6);
    return featured.length > 0 ? featured : fallbackWorks;
  }, [photos]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <style>{`
        ${FONT_LINK}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }
        @keyframes heroZoom { from { transform: scale(1.04); } to { transform: scale(1.12); } }
        @keyframes breathe { 0%,100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.55; transform: scale(1.08); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes lineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Hero image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            animation: heroLoaded
              ? "heroZoom 20s ease-in-out infinite alternate"
              : "none",
          }}
        >
          <img
            src={heroImage}
            alt="Cinematic photography hero"
            onLoad={() => setHeroLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* Layered overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.96) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Ambient light orb — signature element */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(300px, 60vw, 700px)",
            height: "clamp(200px, 40vw, 480px)",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 40%, transparent 70%)",
            filter: "blur(40px)",
            animation: "breathe 8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Lang toggle */}
        <button
          onClick={() => setLang(lang === "en" ? "am" : "en")}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 20,
            padding: "8px 18px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "rgba(255,255,255,0.75)",
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            letterSpacing: "0.08em",
            cursor: "pointer",
            transition: "background 0.3s, border-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.7)";
            e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.45)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          }}
        >
          EN / አማ
        </button>

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              animation: "fadeUp 0.8s ease forwards",
              opacity: 0,
              animationDelay: "0.2s",
              marginBottom: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: 80,
                height: 1,
                background:
                  "linear-gradient(to right, transparent, rgba(201,168,76,0.6))",
              }}
            />
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(201,168,76,0.85)",
              }}
            >
              {t.heroPill}
            </p>
            <div
              style={{
                flex: 1,
                maxWidth: 80,
                height: 1,
                background:
                  "linear-gradient(to left, transparent, rgba(201,168,76,0.6))",
              }}
            />
          </div>

          {/* Title — editorial split */}
          <div
            style={{
              animation: "fadeUp 0.9s ease forwards",
              opacity: 0,
              animationDelay: "0.4s",
              marginBottom: 28,
            }}
          >
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(3.8rem, 12vw, 9rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                {t.heroTitle1}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(4.5rem, 14vw, 11rem)",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.05em",
                }}
              >
                {t.heroTitle2}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(3.8rem, 12vw, 9rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "rgba(201,168,76,0.85)",
                }}
              >
                {t.heroTitle3}
              </span>
            </h1>
          </div>

          {/* Divider line */}
          <div
            style={{
              animation: "lineGrow 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
              opacity: 0,
              animationDelay: "0.7s",
              transformOrigin: "center",
              height: 1,
              width: "50%",
              maxWidth: 280,
              margin: "0 auto 28px",
              background:
                "linear-gradient(to right, transparent, rgba(201,168,76,0.6), transparent)",
            }}
          />

          {/* Description */}
          <div
            style={{
              animation: "fadeUp 0.9s ease forwards",
              opacity: 0,
              animationDelay: "0.75s",
              marginBottom: 40,
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.55)",
                maxWidth: 520,
                margin: "0 auto",
                fontWeight: 300,
              }}
            >
              {t.heroDesc}
            </p>
          </div>

          {/* CTAs */}
          <div
            style={{
              animation: "fadeUp 0.9s ease forwards",
              opacity: 0,
              animationDelay: "0.95s",
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <HeroButton to="/gallery" variant="primary">
              {t.viewGallery}
            </HeroButton>
            <HeroButton to="/contact" variant="outline">
              {t.bookSession}
            </HeroButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "fadeUp 1s ease forwards",
            opacity: 0,
            animationDelay: "1.4s",
          }}
        >
          <div
            style={{
              width: 1,
              height: 48,
              background:
                "linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)",
            }}
          />
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Scroll
          </p>
        </div>
      </section>

      {/* ── PORTFOLIO ──────────────────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 24px" }}
      >
        <Reveal>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              marginBottom: 52,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                width: "100%",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(201,168,76,0.7)",
                    marginBottom: 12,
                  }}
                >
                  {t.portfolioLabel}
                </p>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.0,
                    color: "#fff",
                  }}
                >
                  {t.portfolio}
                </h2>
              </div>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.06)",
                  marginLeft: 24,
                  display: "none",
                }}
                className="hidden md:block"
              />
              <Link
                to="/gallery"
                style={{
                  marginLeft: "auto",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  paddingBottom: 2,
                  whiteSpace: "nowrap",
                  transition: "color 0.3s, border-color 0.3s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#C9A84C";
                  e.currentTarget.style.borderColor = "#C9A84C";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
              >
                {t.viewAll} →
              </Link>
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: "30rem",
                  borderRadius: "1.5rem",
                  background: "rgba(255,255,255,0.04)",
                  animation: "breathe 2s ease-in-out infinite",
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
            }}
          >
            {selectedWorks.map((photo, index) => (
              <Reveal key={photo._id || photo.id || index} delay={index * 60}>
                <WorkCard
                  photo={photo}
                  index={index}
                  onClick={() => navigate("/gallery")}
                  viewFullGallery={t.viewFullGallery}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ── SERVICES ───────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#050505",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "96px 24px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal>
            <div style={{ marginBottom: 56, maxWidth: 640 }}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(201,168,76,0.7)",
                  marginBottom: 14,
                }}
              >
                {t.servicesLabel}
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {t.servicesHeading}
              </h2>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            }}
          >
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 100}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                borderRadius: "1.75rem",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                overflow: "hidden",
                boxShadow:
                  "0 32px 80px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "48px 32px",
                    textAlign: "center",
                    borderRight:
                      index < stats.length - 1
                        ? "1px solid rgba(255,255,255,0.07)"
                        : "none",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 40,
                      height: 2,
                      background:
                        "linear-gradient(to right, transparent, #C9A84C, transparent)",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "clamp(3rem, 6vw, 5rem)",
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      marginBottom: 12,
                    }}
                  >
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 400,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <TestimonialsMarquee t={t} />

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px" }}>
        <Reveal>
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              borderRadius: "2rem",
              border: "1px solid rgba(201,168,76,0.15)",
              background:
                "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(255,255,255,0.025) 50%, rgba(201,168,76,0.04) 100%)",
              padding: "clamp(48px, 8vw, 96px) clamp(28px, 6vw, 80px)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 40px 100px -20px rgba(0,0,0,0.7)",
            }}
          >
            {/* Decorative glow */}
            <div
              style={{
                position: "absolute",
                top: -100,
                left: "50%",
                transform: "translateX(-50%)",
                width: 500,
                height: 300,
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 70%)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -60,
                right: -60,
                width: 240,
                height: 240,
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)",
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative" }}>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "rgba(201,168,76,0.75)",
                  marginBottom: 20,
                }}
              >
                {t.bookStudioLabel}
              </p>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  color: "#fff",
                  lineHeight: 1.0,
                  marginBottom: 20,
                  maxWidth: 760,
                  margin: "0 auto 20px",
                }}
              >
                {t.bookStudioHeading}
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
                  lineHeight: 1.85,
                  color: "rgba(255,255,255,0.4)",
                  maxWidth: 520,
                  margin: "0 auto 40px",
                  fontWeight: 300,
                }}
              >
                {t.bookStudioDesc}
              </p>
              <Link
                to="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 36px",
                  borderRadius: 999,
                  background: "#C9A84C",
                  color: "#000",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 0 40px rgba(201,168,76,0.3)",
                  transition:
                    "background 0.3s, box-shadow 0.3s, transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#DFC060";
                  e.currentTarget.style.boxShadow =
                    "0 0 60px rgba(201,168,76,0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#C9A84C";
                  e.currentTarget.style.boxShadow =
                    "0 0 40px rgba(201,168,76,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {t.contact}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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

/* ─── HeroButton ─────────────────────────────────────────────────────────── */
function HeroButton({ to, variant, children }) {
  const isPrimary = variant === "primary";
  return (
    <Link
      to={to}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "14px 32px",
        borderRadius: 999,
        background: isPrimary ? "#fff" : "rgba(255,255,255,0.08)",
        color: isPrimary ? "#000" : "#fff",
        border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.18)",
        backdropFilter: isPrimary ? "none" : "blur(12px)",
        WebkitBackdropFilter: isPrimary ? "none" : "blur(12px)",
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        textDecoration: "none",
        transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isPrimary
          ? "#F0EBE0"
          : "rgba(255,255,255,0.14)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isPrimary
          ? "#fff"
          : "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </Link>
  );
}

/* ─── ServiceCard ────────────────────────────────────────────────────────── */
function ServiceCard({ service }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "1.5rem",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.07)"}`,
        background: hovered
          ? "rgba(201,168,76,0.04)"
          : "rgba(255,255,255,0.03)",
        padding: "40px 36px 36px",
        transition:
          "border-color 0.4s ease, background 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 24px 56px -8px rgba(0,0,0,0.5)" : "none",
        cursor: "default",
      }}
    >
      {/* Watermark number */}
      <div
        style={{
          position: "absolute",
          top: -12,
          right: 20,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "7rem",
          fontWeight: 700,
          color: hovered ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          transition: "color 0.4s ease",
          letterSpacing: "-0.04em",
        }}
      >
        {service.num}
      </div>

      {/* Top gold accent */}
      <div
        style={{
          width: hovered ? 48 : 24,
          height: 2,
          background: "#C9A84C",
          marginBottom: 32,
          transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      <h3
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.75rem",
          fontWeight: 600,
          color: "#fff",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          marginBottom: 16,
        }}
      >
        {service.title}
      </h3>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.45)",
          fontWeight: 300,
        }}
      >
        {service.description}
      </p>
    </div>
  );
}

export default Home;
