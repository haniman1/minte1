import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../index.css";

/* ─── Edit these details in one place ───────────────────────────────────── */
const PHOTOGRAPHER_NAME = "mintesnot gezahegn"; // TODO: put the real name here
const PHONE_DISPLAY = "+251 96 710 6705";
const PHONE_LINK = "tel:+251967106705";

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  "aria-hidden": "true",
};
const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const SOCIALS = [
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@mintesinot_g",
    icon: (
      <svg {...iconProps} fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.77h-3.13v13.17a2.9 2.9 0 1 1-2.9-2.9c.24 0 .47.03.69.08V9.09a6.03 6.03 0 0 0-.69-.04A6.03 6.03 0 1 0 15.82 15V8.34a8.02 8.02 0 0 0 4.69 1.5V6.69h-.92z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/minte_gett/",
    icon: (
      <svg {...iconProps} {...strokeProps}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook group",
    href: "https://www.facebook.com/groups/1183400838772325/",
    icon: (
      <svg {...iconProps} {...strokeProps}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: "https://t.me/TechStudio_WithMinte",
    icon: (
      <svg {...iconProps} fill="currentColor">
        <path d="M21.5 2.5L2.9 9.7c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.3l-9 8.1-.3 4.8c.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.2-15.1c.3-1.2-.4-1.8-1.2-1.2z" />
      </svg>
    ),
  },
];

function SocialLinks() {
  return (
    <div className="flex items-center gap-3">
      {SOCIALS.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="a-social"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}

/* Small shared presentational pieces (no state) */
function Eyebrow({ children, className = "" }) {
  return (
    <p className={`a-eyebrow ${className}`}>
      <span aria-hidden="true" className="a-eyebrow-line" />
      {children}
    </p>
  );
}

function AwardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5" />
    </svg>
  );
}

/* ─── Animated Counter Hook ─────────────────────────────────────────────── */
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState("0");
  useEffect(() => {
    if (!start) return;
    const numeric = parseInt(target.replace(/\D/g, ""), 10);
    const suffix = target.replace(/[0-9]/g, "");
    let startTime = null;
    let frame;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numeric) + suffix);
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration]);
  return count;
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
      className="text-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      <div className="a-serif mb-3 text-5xl font-bold leading-none tracking-tight text-[#C9A84C] tabular-nums md:text-7xl">
        {inView ? count : "0"}
      </div>
      <div className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
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
      className={`flex gap-5 md:gap-12 ${align === "right" ? "md:flex-row-reverse" : ""}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateX(0)"
          : `translateX(${align === "right" ? "40px" : "-40px"})`,
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
      }}
    >
      <div
        className={`w-16 flex-shrink-0 md:w-28 ${align === "right" ? "md:text-left" : "md:text-right"}`}
      >
        <span className="a-serif text-3xl font-bold leading-none text-[#C9A84C]">
          {year}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full bg-[#C9A84C] shadow-[0_0_0_4px_rgba(201,168,76,0.18)]" />
        <div className="mt-2 w-px flex-1 bg-gradient-to-b from-[#C9A84C]/40 to-white/5" />
      </div>

      <div className="flex-1 pb-12">
        <h3 className="a-serif mb-2 text-2xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-neutral-300 md:text-base">
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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // NOTE: the text below is sample content. Replace it with the photographer's real details.
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
    { title: "Vogue Weddings", sub: "Featured Photographer" },
    { title: "IPA Gold Award", sub: "Documentary Portraiture" },
    { title: "Harper's Bazaar", sub: "Top 10 Wedding Photographers" },
    { title: "WPPI Finalist", sub: "Best Storytelling Series" },
    { title: "Martha Stewart", sub: "Preferred Vendor" },
    { title: "The Knot Pro", sub: "Best of Weddings 2024" },
  ];

  const [firstName, ...rest] = PHOTOGRAPHER_NAME.toUpperCase().split(" ");
  const lastName = rest.join(" ");

  return (
    <div
      className="a-root"
      style={{
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ height: "100svh", minHeight: "640px" }}
      >
        {/* Oversized layer so the parallax shift never exposes an empty edge */}
        <div
          className="a-parallax absolute left-0 right-0"
          style={{
            top: "-35%",
            height: "135%",
            transform: `translateY(${scrollY * 0.3}px)`,
            willChange: "transform",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=2000&q=80"
            alt={`${PHOTOGRAPHER_NAME} — Photographer`}
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 35%" }}
            onLoad={() => setHeroLoaded(true)}
          />
        </div>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.6) 70%, #000 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.78) 0%, transparent 65%)",
          }}
        />

        {/* Top bar: name + social links */}
        <div
          className="absolute left-0 right-0 top-0 flex flex-wrap items-center justify-between gap-4 px-6 py-6 md:px-14 md:py-8"
          style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 1s ease 0.4s, transform 1s ease 0.4s",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg text-[#C9A84C]" aria-hidden="true">
              ✦
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-200">
              {PHOTOGRAPHER_NAME}
            </span>
          </div>
          <SocialLinks />
        </div>

        {/* Hero copy */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 pb-20 md:px-14 md:pb-24"
          style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 1s ease 0.6s, transform 1s ease 0.6s",
          }}
        >
          <Eyebrow className="mb-5">Fine Art Wedding Photography</Eyebrow>
          <h1
            className="a-serif mb-5 font-bold leading-[0.95]"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              letterSpacing: "-0.02em",
              textShadow: "0 0 80px rgba(0,0,0,0.8)",
            }}
          >
            {firstName}
            <br />
            <span style={{ color: "#C9A84C", fontStyle: "italic", fontWeight: 400 }}>
              {lastName}
            </span>
          </h1>
          <p className="mb-10 max-w-md text-lg font-light text-neutral-200 md:text-xl">
            Storyteller through light
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="a-cta">
              Book a Session →
            </Link>
            <Link to="/gallery" className="a-outline">
              View Portfolio →
            </Link>
          </div>
        </div>

        <div
          className="absolute bottom-8 right-8 hidden flex-col items-center gap-2 md:flex"
          style={{ opacity: 0.6 }}
          aria-hidden="true"
        >
          <span
            className="text-[10px] uppercase tracking-[0.25em] text-neutral-300"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
          <div
            className="w-px"
            style={{
              height: "56px",
              background: "linear-gradient(to bottom, transparent, #C9A84C)",
            }}
          />
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────────────────────── */}
      <div
        className="a-ticker overflow-hidden border-y py-4"
        style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#050505" }}
      >
        <div className="ticker-track a-ticker-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-shrink-0 items-center" aria-hidden={i === 1 ? "true" : undefined}>
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
                  className="whitespace-nowrap px-6 text-xs uppercase tracking-[0.2em]"
                  style={{ color: item === "◆" ? "#C9A84C" : "#A3A3A3" }}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT / EDITORIAL SPLIT ───────────────────────────────────── */}
      <section className="px-6 py-24 md:px-14 md:py-36" id="about">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-14 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <Reveal>
                <Eyebrow className="mb-6">The Photographer</Eyebrow>
                <h2
                  className="a-serif mb-10 font-bold leading-[1.05]"
                  style={{
                    fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Capturing moments
                  <br />
                  <span style={{ fontStyle: "italic", fontWeight: 400, color: "#C9A84C" }}>
                    that matter most.
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={150}>
                <div className="max-w-xl space-y-6 text-[17px] leading-[1.9] text-neutral-300">
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
                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <Link to="/contact" className="a-cta">
                    Work With Me →
                  </Link>
                  <SocialLinks />
                </div>
              </Reveal>
            </div>

            <div className="space-y-6 md:col-span-5">
              <Reveal delay={200}>
                <div className="a-portrait">
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80"
                    alt={PHOTOGRAPHER_NAME}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                    style={{ filter: "grayscale(20%) contrast(1.05)" }}
                  />
                </div>
              </Reveal>

              <Reveal delay={350}>
                <div className="a-glass rounded-3xl p-7">
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-neutral-400">
                    Based in
                  </p>
                  <p className="a-serif mb-5 text-3xl font-semibold text-white">
                    New York · Available Worldwide
                  </p>
                  <div
                    className="border-t pt-5"
                    style={{ borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <p className="mb-5 text-sm leading-relaxed text-neutral-300">
                      Ready to create something beautiful together?
                    </p>
                    <a href="#contact" className="a-outline a-outline-sm">
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
        className="border-y px-6 py-20 md:px-14 md:py-28"
        style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#050505" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-6">
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
      <section className="px-6 py-24 md:px-14 md:py-36" id="journey">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-16 max-w-2xl md:mb-24">
              <Eyebrow className="mb-5">My Journey</Eyebrow>
              <h2
                className="a-serif font-bold leading-[1.05]"
                style={{
                  fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Every story begins
                <br />
                <em className="font-normal" style={{ color: "#C9A84C" }}>
                  with a single frame.
                </em>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              className="mb-24 grid grid-cols-3 gap-3 md:gap-4"
              style={{ height: "clamp(260px, 42vw, 440px)" }}
            >
              <div className="a-zoom col-span-2 overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"
                  alt="In the field"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ filter: "grayscale(15%) contrast(1.08)" }}
                />
              </div>
              <div className="flex flex-col gap-3 md:gap-4">
                {[
                  ["photo-1519741497674-611481863552", "Studio work"],
                  ["photo-1465495976277-4387d4b0b4c6", "On location"],
                ].map(([id, alt]) => (
                  <div key={id} className="a-zoom flex-1 overflow-hidden rounded-2xl">
                    <img
                      src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`}
                      alt={alt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                      style={{ filter: "grayscale(15%) contrast(1.05)" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="grid gap-10 text-base leading-[1.9] text-neutral-300 md:grid-cols-2 md:gap-16">
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
        className="border-t px-6 py-24 md:px-14 md:py-36"
        style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#050505" }}
      >
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <div className="mb-16">
              <Eyebrow className="mb-5">Timeline</Eyebrow>
              <h2
                className="a-serif font-bold"
                style={{
                  fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
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
      <section className="px-6 py-24 md:px-14 md:py-36">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <Eyebrow className="mb-4">Recognition</Eyebrow>
                <h2
                  className="a-serif font-bold"
                  style={{
                    fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Industry honours.
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-neutral-300">
                A selection of recognitions earned over twelve years of quiet,
                relentless work.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {achievements.map((a, i) => (
              <Reveal key={i} delay={i * 80} className="h-full">
                <div className="a-achievement h-full rounded-3xl p-7">
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C]"
                    aria-hidden="true"
                  >
                    <AwardIcon />
                  </div>
                  <div className="a-serif mb-1 text-2xl font-semibold text-white">
                    {a.title}
                  </div>
                  <div className="text-sm text-neutral-300">{a.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP (the site footer below this comes from App.jsx) ─── */}
      <section
        className="relative overflow-hidden border-t px-6 py-24 md:px-14 md:py-32"
        style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "#050505" }}
        id="contact"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.09) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="text-3xl text-[#C9A84C]" aria-hidden="true">
              ✦
            </span>
            <h2
              className="a-serif my-6 font-bold leading-[1.05]"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              Let's create something
              <br />
              <em className="font-normal" style={{ color: "#C9A84C" }}>
                unforgettable.
              </em>
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-neutral-300">
              Available worldwide · Now booking 2026–2027
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href={PHONE_LINK} className="a-cta">
                Call {PHONE_DISPLAY} →
              </a>
              <SocialLinks />
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

        .a-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .a-root ::selection { background: rgba(201,168,76,0.35); color: #fff; }
        .a-root a:focus-visible, .a-root button:focus-visible {
          outline: 2px solid #C9A84C; outline-offset: 4px;
        }

        .a-eyebrow {
          display: flex; align-items: center; gap: 14px;
          font-size: 12px; font-weight: 500; letter-spacing: 0.3em;
          text-transform: uppercase; color: #C9A84C;
        }
        .a-eyebrow-line { width: 28px; height: 1px; background: rgba(201,168,76,0.7); flex-shrink: 0; }

        .a-cta, .a-outline {
          display: inline-flex; align-items: center; justify-content: center;
          min-height: 48px; padding: 12px 30px; border-radius: 999px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.16em;
          text-transform: uppercase; text-decoration: none; cursor: pointer;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease,
                      box-shadow 0.3s ease, transform 0.3s ease;
        }
        .a-cta { background: #C9A84C; color: #000; box-shadow: 0 0 36px rgba(201,168,76,0.28); }
        .a-cta:hover { background: #DFC060; box-shadow: 0 0 56px rgba(201,168,76,0.45); transform: translateY(-2px); }
        .a-outline { color: #fff; border: 1px solid rgba(255,255,255,0.35); background: rgba(0,0,0,0.25); backdrop-filter: blur(8px); }
        .a-outline:hover { border-color: #C9A84C; color: #C9A84C; background: rgba(201,168,76,0.08); transform: translateY(-2px); }
        .a-outline-sm { min-height: 44px; padding: 10px 24px; }

        .a-social {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          color: rgba(255,255,255,0.85); text-decoration: none;
          border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.35);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .a-social:hover {
          color: #C9A84C; border-color: #C9A84C; background: rgba(201,168,76,0.1);
          transform: translateY(-2px) scale(1.08); box-shadow: 0 0 22px rgba(201,168,76,0.22);
        }

        .a-glass {
          border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);
          backdrop-filter: blur(16px); box-shadow: 0 24px 60px -12px rgba(0,0,0,0.6);
        }
        .a-portrait {
          padding: 1px; border-radius: 1.5rem; overflow: hidden;
          background: linear-gradient(135deg, rgba(201,168,76,0.7), rgba(255,255,255,0.08) 45%, rgba(201,168,76,0.35));
          box-shadow: 0 32px 80px -16px rgba(0,0,0,0.7);
        }
        .a-portrait img { border-radius: calc(1.5rem - 1px); display: block; }

        .a-achievement {
          border: 1px solid rgba(255,255,255,0.09); background: rgba(255,255,255,0.03);
          transition: border-color 0.4s ease, background 0.4s ease, transform 0.4s ease;
        }
        .a-achievement:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.05); transform: translateY(-4px); }

        .a-zoom img { transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .a-zoom:hover img { transform: scale(1.05); }

        /* Ticker: pauses on hover; two copies, so -50% loops seamlessly */
        .a-ticker-track { display: flex; width: max-content; animation: aTicker 40s linear infinite; }
        .a-ticker:hover .a-ticker-track { animation-play-state: paused; }
        @keyframes aTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        @media (prefers-reduced-motion: reduce) {
          .a-root *, .a-root *::before, .a-root *::after {
            animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .a-parallax { transform: none !important; }
          .a-ticker { overflow-x: auto !important; }
          .a-ticker-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

export default About;
