import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, MotionConfig } from "framer-motion";

const G = "#C9A84C";
const sp = { type: "spring", stiffness: 400, damping: 20 };
const YEAR = new Date().getFullYear();

const ring =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]";

/* ─── Social links — change addresses here only ─────────────────────────── */
const iconProps = {
  width: 24,
  height: 24,
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

/* ─── Pieces ─────────────────────────────────────────────────────────────── */
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
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.12, y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={sp}
      className={`flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 no-underline backdrop-blur-md transition-[border-color,color,box-shadow,background] duration-300 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:shadow-[0_0_28px_rgba(201,168,76,0.28)] ${ring}`}
    >
      {children}
    </motion.a>
  );
}

function NavLink({ to, href, children }) {
  const cls = `ft-link group/link relative inline-flex min-h-11 items-center text-sm tracking-wide text-neutral-300 no-underline transition-colors duration-300 hover:text-white focus-visible:text-white ${ring} rounded-sm`;
  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-0 h-px w-0 bg-[#C9A84C] transition-[width] duration-300 group-hover/link:w-full group-focus-visible/link:w-full"
      />
    </>
  );
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {inner}
    </a>
  );
}

// Internal links use <Link> so navigation doesn't reload the page
function CtaButton({ children, variant = "primary", to = "/" }) {
  const p = variant === "primary";
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="shrink-0"
    >
      <Link
        to={to}
        className={`inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-7 text-xs font-bold uppercase tracking-[0.14em] no-underline transition duration-300 ${ring} ${
          p
            ? "bg-[#C9A84C] text-black shadow-[0_0_32px_rgba(201,168,76,0.25)] hover:bg-[#DFC060] hover:shadow-[0_0_48px_rgba(201,168,76,0.4)]"
            : "border border-[#C9A84C]/50 bg-transparent text-[#C9A84C] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10"
        }`}
      >
        {children}
      </Link>
    </motion.div>
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
  { label: "About Me", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Journal", to: "/contact" },
  { label: "Privacy", to: "/contact" },
];

function NavCard({ title, items }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-300 hover:border-[#C9A84C]/30">
      <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.26em] text-[#C9A84C]">
        <span aria-hidden="true" className="h-px w-5 bg-[#C9A84C]/70" />
        {title}
      </p>
      <ul className="m-0 flex list-none flex-col p-0">
        {items.map(({ label, to, href, name }) => (
          <li key={label ?? name} className="relative">
            <NavLink to={to} href={href}>
              {label ?? name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
const Footer = () => (
  <MotionConfig reducedMotion="user">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
      .ft-root { font-family: 'Inter', system-ui, sans-serif; }
      .ft-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
      .ft-root ::selection { background: rgba(201,168,76,0.35); color: #fff; }
      @media (prefers-reduced-motion: reduce) {
        .ft-root, .ft-root * { animation: none !important; transition-duration: 0.01ms !important; }
      }
    `}</style>

    <div className="ft-root bg-black px-4 pt-20">
      <footer className="relative mx-auto w-full max-w-[1350px] overflow-hidden rounded-t-3xl bg-[#0D0D0D] text-white">
        {/* Film grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Gold glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 z-0 h-[300px] w-[600px] max-w-full -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(201,168,76,0.09)_0%,transparent_70%)]"
        />

        <div className="relative z-10">
          {/* Brand */}
          <div className="border-b border-white/10 px-6 pb-10 pt-12 md:px-12 md:pb-12 md:pt-14">
            <FadeUp>
              <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:gap-12">
                <div className="w-full max-w-[440px] shrink-0 rounded-3xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur-xl md:p-10">
                  <Link
                    to="/"
                    aria-label="Tech Photography — Home"
                    className={`mb-6 inline-flex items-center gap-4 rounded-md no-underline ${ring}`}
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
                        aria-hidden="true"
                      >
                        {[
                          [4.706, 16],
                          [16.001, 4.706],
                          [16.001, 27.294],
                          [27.294, 16],
                        ].map(([cx, cy], i) => (
                          <circle key={i} cx={cx} cy={cy} r="4.706" fill={G} />
                        ))}
                      </svg>
                    </motion.div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">
                      <span className="text-white">TECH</span>{" "}
                      <span className="text-[#C9A84C]">PHOTOGRAPHY</span>
                    </span>
                  </Link>

                  <p className="ft-serif mb-4 text-2xl italic leading-snug tracking-tight text-white md:text-[1.7rem]">
                    Capturing timeless stories through light, emotion and
                    atmosphere.
                  </p>
                  <p className="max-w-xs text-sm leading-7 text-neutral-400">
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
                    className="mt-7 h-px origin-left bg-gradient-to-r from-[#C9A84C] to-transparent"
                  />
                </div>

                <div className="pt-2">
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">
                    Follow the work
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {SOCIALS.map(({ label, href, icon }) => (
                      <SocialBtn key={label} href={href} label={label}>
                        {icon}
                      </SocialBtn>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Nav grid */}
          <div className="border-b border-white/10 px-6 py-10 md:px-12 md:py-12">
            <FadeUp delay={0.05}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
                <NavCard title="Navigate" items={NAV_LINKS} />
                <NavCard
                  title="Services"
                  items={SERVICES.map((name) => ({ name, to: "/gallery" }))}
                />
                <NavCard title="Company" items={COMPANY} />
              </div>
            </FadeUp>
          </div>

          {/* CTA */}
          <FadeUp delay={0.1}>
            <div className="relative mx-6 mt-10 overflow-hidden rounded-3xl border border-[#C9A84C]/25 bg-gradient-to-br from-[#C9A84C]/[0.09] via-white/[0.02] to-[#C9A84C]/[0.05] px-7 py-10 md:mx-12 md:px-12 md:py-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 bg-[radial-gradient(circle,rgba(201,168,76,0.16)_0%,transparent_70%)]"
              />
              <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <p className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.26em] text-[#C9A84C]">
                    <span aria-hidden="true" className="h-px w-6 bg-[#C9A84C]/70" />
                    Let's work together
                  </p>
                  <h3 className="ft-serif mb-3 text-3xl font-semibold leading-[1.1] tracking-tight text-white md:text-5xl">
                    Ready to create something timeless?
                  </h3>
                  <p className="max-w-lg text-sm leading-7 text-neutral-300">
                    Available for weddings, portraits, destination sessions and
                    private events worldwide.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <CtaButton to="/packages">Book a Session →</CtaButton>
                  <CtaButton to="/gallery" variant="outline">
                    View Gallery →
                  </CtaButton>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Copyright */}
          <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 bg-black/25 px-6 py-5 text-center md:flex-row md:px-12 md:text-left">
            <p className="text-xs tracking-wide text-neutral-400">
              © {YEAR} Tech Photography. All Rights Reserved.
            </p>
            <p className="text-xs tracking-wide text-neutral-400">
              Crafted with passion for moments that matter.
            </p>
          </div>
        </div>
      </footer>
    </div>
  </MotionConfig>
);

export default Footer;
