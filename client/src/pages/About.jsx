import { useState, useEffect, useRef } from "react";
import "../index.css";

/* ─── Animated Counter Hook ─────────────────────────────────────────────── */
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const numeric = parseInt(target.replace(/\D/g, ""), 10);
    const suffix = target.replace(/[0-9]/g, "");
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numeric) + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count || "0";
}

/* ─── Intersection Observer Hook ────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
function StatCard({ number, label, delay = 0 }) {
  const [ref, inView] = useInView(0.3);
  const count = useCountUp(number, 1800, inView);
  return (
    <div
      ref={ref}
      className="text-center group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      <div
        className="text-5xl md:text-6xl font-bold mb-2 tracking-tight serif"
        style={{ color: "#D4AF37" }}
      >
        {inView ? count : "0"}
      </div>
      <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium">
        {label}
      </div>
    </div>
  );
}

/* ─── Section Reveal Wrapper ────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Timeline Item ─────────────────────────────────────────────────────── */
function TimelineItem({ year, title, description, align = "left", delay = 0 }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`flex gap-6 md:gap-12 ${align === "right" ? "md:flex-row-reverse" : ""}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateX(0)"
          : `translateX(${align === "right" ? "40px" : "-40px"})`,
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      {/* Year */}
      <div
        className={`flex-shrink-0 w-20 md:w-28 ${align === "right" ? "md:text-left" : "md:text-right"}`}
      >
        <span className="text-2xl font-bold serif" style={{ color: "#D4AF37" }}>
          {year}
        </span>
      </div>

      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <div
          className="w-3 h-3 rounded-full mt-1 flex-shrink-0 ring-2 ring-offset-2 ring-offset-black"
          style={{ backgroundColor: "#D4AF37" }}
        />
        <div
          className="w-px flex-1 mt-2"
          style={{ backgroundColor: "#1C1C1C" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <h4 className="text-white text-lg font-semibold mb-2">{title}</h4>
        <p className="text-neutral-500 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
const About = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { number: "12+", label: "Years Experience" },
    { number: "850+", label: "Weddings Captured" },
    { number: "1200+", label: "Happy Clients" },
    { number: "50+", label: "Cities" },
  ];

  const timeline = [
    {
      year: "2012",
      title: "The First Frame",
      description:
        "Shot my first wedding with a borrowed Canon and a borrowed confidence. The couple still have that photo on their wall.",
    },
    {
      year: "2015",
      title: "Going Full-Time",
      description:
        "Left a career in graphic design to pursue photography exclusively. Booked 40 weddings in year one.",
    },
    {
      year: "2018",
      title: "International Recognition",
      description:
        "Featured in Vogue Weddings and won the International Photography Award for documentary portraiture.",
    },
    {
      year: "2021",
      title: "Studio Expansion",
      description:
        "Opened a flagship studio in Manhattan. Expanded into editorial and fashion work alongside weddings.",
    },
    {
      year: "2024",
      title: "850+ Weddings",
      description:
        "Crossed 850 weddings captured across 50+ cities worldwide. Every one still feels like the first.",
    },
  ];

  const achievements = [
    { icon: "◈", title: "Vogue Weddings", sub: "Featured Photographer" },
    { icon: "◉", title: "IPA Gold Award", sub: "Documentary Portraiture" },
    {
      icon: "◈",
      title: "Harper's Bazaar",
      sub: "Top 10 Wedding Photographers",
    },
    { icon: "◉", title: "WPPI Finalist", sub: "Best Storytelling Series" },
    { icon: "◈", title: "Martha Stewart", sub: "Preferred Vendor" },
    { icon: "◉", title: "The Knot Pro", sub: "Best of Weddings 2024" },
  ];

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ height: "100svh", minHeight: "640px" }}
      >
        {/* Parallax image */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            willChange: "transform",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=2000&q=80"
            alt="Alex Rivera — Wedding Photographer"
            className="w-full h-full object-cover"
            style={{ transform: "scale(1.15)", transformOrigin: "center top" }}
            onLoad={() => setHeroLoaded(true)}
          />
        </div>

        {/* Multi-layer gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.95) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)",
          }}
        />

        {/* Top bar */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-14 py-8"
          style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 1s ease 0.4s, transform 1s ease 0.4s",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="gold text-lg">✦</span>
            <span
              className="text-xs uppercase text-neutral-400"
              style={{ letterSpacing: "0.28em" }}
            >
              Alex Rivera
            </span>
          </div>
          <div className="flex gap-3">
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
            >
              𝕏
            </a>

            <a
              href="https://instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
            >
              ◎
            </a>

            <a
              href="https://facebook.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
            >
              f
            </a>
          </div>
        </div>

        {/* Hero copy */}
        <div
          className="absolute bottom-0 left-0 px-8 md:px-14 pb-20 md:pb-24"
          style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 1s ease 0.6s, transform 1s ease 0.6s",
          }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 mb-4">
            Fine Art Wedding Photography
          </p>
          <h1
            className="serif font-bold leading-none mb-4"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              letterSpacing: "-0.02em",
              textShadow: "0 0 80px rgba(0,0,0,0.8)",
            }}
          >
            ALEX
            <br />
            <span style={{ color: "#D4AF37", fontStyle: "italic" }}>
              RIVERA
            </span>
          </h1>
          <p className="text-neutral-300 text-lg md:text-xl font-light mb-10 max-w-md">
            Storyteller through light
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/contact" className="cta-btn">
              Book a Session →
            </a>
            <a href="/gallery" className="outline-btn">
              View Portfolio →
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 right-10 flex flex-col items-center gap-2"
          style={{ opacity: 0.4 }}
        >
          <span
            className="text-xs uppercase tracking-[0.25em] text-neutral-500"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
          <div
            className="w-px bg-neutral-600"
            style={{
              height: "56px",
              background: "linear-gradient(to bottom, transparent, #D4AF37)",
            }}
          />
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────────────────────── */}
      <div
        className="overflow-hidden py-4 border-y"
        style={{ borderColor: "#1A1A1A", backgroundColor: "#050505" }}
      >
        <div className="ticker-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {[
                "Fine Art Photography",
                "◆",
                "Wedding Stories",
                "◆",
                "850+ Couples",
                "◆",
                "New York",
                "◆",
                "Available Worldwide",
                "◆",
                "12 Years of Light",
                "◆",
                "Editorial & Fashion",
                "◆",
                "Vogue Featured",
                "◆",
              ].map((item, j) => (
                <span
                  key={j}
                  className="px-6 text-xs uppercase tracking-[0.2em]"
                  style={{ color: item === "◆" ? "#D4AF37" : "#555" }}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT / EDITORIAL SPLIT ───────────────────────────────────── */}
      <section className="px-8 md:px-14 py-24 md:py-36" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-16 items-start">
            {/* Left column */}
            <div className="md:col-span-7">
              <Reveal>
                <p className="text-xs uppercase tracking-[0.3em] gold mb-6">
                  The Photographer
                </p>
                <h2
                  className="serif font-bold leading-tight mb-10"
                  style={{
                    fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Capturing moments
                  <br />
                  <span
                    className="gold-line"
                    style={{ fontStyle: "italic", fontWeight: 400 }}
                  >
                    that matter most.
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={150}>
                <div
                  className="space-y-6 text-neutral-400 leading-[1.9] max-w-xl"
                  style={{ fontSize: "17px" }}
                >
                  <p>
                    With over 12 years behind the lens, I specialize in turning
                    fleeting moments into timeless stories. My approach combines
                    technical precision with emotional depth.
                  </p>
                  <p>
                    Whether it's the quiet tears during vows, the pure joy of a
                    graduation, or the raw energy of an event — I believe every
                    photograph should feel alive.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={250}>
                <div className="mt-12 flex flex-wrap gap-4">
                  <a href="/contact" className="cta-btn">
                    Work With Me →
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right: portrait + glass card */}
            <div className="md:col-span-5 space-y-6">
              <Reveal delay={200}>
                <div
                  className="portrait-frame rounded-sm overflow-hidden"
                  style={{ padding: "1px" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80"
                    alt="Alex Rivera"
                    className="w-full object-cover rounded-sm"
                    style={{
                      height: "420px",
                      filter: "grayscale(20%) contrast(1.05)",
                    }}
                  />
                </div>
              </Reveal>

              <Reveal delay={350}>
                <div className="glass rounded-2xl p-7">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-600 mb-3">
                    Based in
                  </p>
                  <p className="serif text-2xl text-white mb-5">
                    New York · Available Worldwide
                  </p>
                  <div
                    className="pt-5 border-t"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-neutral-500 text-sm leading-relaxed mb-5">
                      Ready to create something beautiful together?
                    </p>
                    <a
                      href="#contact"
                      className="outline-btn"
                      style={{ fontSize: "12px", padding: "10px 22px" }}
                    >
                      Get in Touch →
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section
        className="py-20 md:py-28 px-8 md:px-14 border-y"
        style={{ borderColor: "#111", backgroundColor: "#030303" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
            {stats.map((s, i) => (
              <StatCard
                key={i}
                number={s.number}
                label={s.label}
                delay={i * 120}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── MY JOURNEY ────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-24 md:py-36" id="journey">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-16 md:mb-24 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] gold mb-5">
                My Journey
              </p>
              <h2
                className="serif font-bold leading-tight"
                style={{
                  fontSize: "clamp(2rem, 4.5vw, 4rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Every story begins
                <br />
                <em className="font-normal" style={{ color: "#D4AF37" }}>
                  with a single frame.
                </em>
              </h2>
            </div>
          </Reveal>

          {/* Editorial 3-image grid */}
          <Reveal delay={100}>
            <div
              className="grid grid-cols-3 gap-3 md:gap-4 mb-24"
              style={{ height: "360px" }}
            >
              <div className="col-span-2 overflow-hidden rounded-sm">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"
                  alt="In the field"
                  className="w-full h-full object-cover"
                  style={{
                    filter: "grayscale(15%) contrast(1.08)",
                    transition: "transform 0.8s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.04)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                />
              </div>
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex-1 overflow-hidden rounded-sm">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                    alt="Studio work"
                    className="w-full h-full object-cover"
                    style={{
                      filter: "grayscale(15%) contrast(1.05)",
                      transition: "transform 0.8s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </div>
                <div className="flex-1 overflow-hidden rounded-sm">
                  <img
                    src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80"
                    alt="On location"
                    className="w-full h-full object-cover"
                    style={{
                      filter: "grayscale(15%) contrast(1.05)",
                      transition: "transform 0.8s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Story text */}
          <Reveal delay={200}>
            <div
              className="grid md:grid-cols-2 gap-10 md:gap-16 text-neutral-400 leading-[1.9]"
              style={{ fontSize: "16px" }}
            >
              <p>
                I didn't plan to become a wedding photographer. I planned to be
                a graphic designer. But one afternoon in 2012, a colleague asked
                me to shoot her sister's wedding as a favor. I borrowed a
                camera. I borrowed a lens. I forgot to eat.
              </p>
              <p>
                Twelve years and 850 weddings later, I still feel that same
                electricity when the ceremony doors open. Photography taught me
                that moments don't repeat. Every frame is a decision about
                what's worth remembering.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────── */}
      <section
        className="py-24 md:py-36 px-8 md:px-14 border-t"
        style={{ borderColor: "#111", backgroundColor: "#030303" }}
      >
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="mb-16">
              <p className="text-xs uppercase tracking-[0.3em] gold mb-5">
                Timeline
              </p>
              <h2
                className="serif font-bold"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                A decade of light.
              </h2>
            </div>
          </Reveal>

          <div>
            {timeline.map((item, i) => (
              <TimelineItem
                key={i}
                year={item.year}
                title={item.title}
                description={item.description}
                align="left"
                delay={i * 80}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-8 md:px-14">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] gold mb-4">
                  Recognition
                </p>
                <h2
                  className="serif font-bold"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Industry honours.
                </h2>
              </div>
              <p className="text-neutral-600 text-sm max-w-xs leading-relaxed">
                A selection of recognitions earned over twelve years of quiet,
                relentless work.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((a, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="achievement-card rounded-2xl p-7">
                  <div className="gold text-2xl mb-5">{a.icon}</div>
                  <div className="text-white font-semibold text-base mb-1">
                    {a.title}
                  </div>
                  <div className="text-neutral-600 text-sm">{a.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-24 md:py-32 px-8 md:px-14 border-t"
        style={{ borderColor: "#111", backgroundColor: "#050505" }}
        id="contact"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <Reveal>
            <span className="gold text-3xl">✦</span>
            <h2
              className="serif font-bold my-6 leading-tight"
              style={{
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Let's create something
              <br />
              <em className="font-normal" style={{ color: "#D4AF37" }}>
                unforgettable.
              </em>
            </h2>
            <p className="text-neutral-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              New York · Available worldwide · Booking 2025–2026
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:hello@alexrivera.com" className="cta-btn">
                hello@alexrivera.com →
              </a>
              <div className="flex gap-3 items-center">
                <a href="#" className="social-btn">
                  𝕏
                </a>
                <a href="#" className="social-btn">
                  ◎
                </a>
                <a href="#" className="social-btn">
                  f
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer
        className="px-8 md:px-14 py-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t"
        style={{ borderColor: "#111" }}
      >
        <div className="flex items-center gap-2">
          <span className="gold text-sm">✦</span>
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-700">
            Alex Rivera
          </span>
        </div>
        <p className="text-xs text-neutral-800">
          © {new Date().getFullYear()} · Storyteller through light
        </p>
      </footer>
    </div>
  );
};

export default About;
