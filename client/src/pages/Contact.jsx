import "../index.css";

/* ─── Shared class strings ──────────────────────────────────────────────── */
const ring =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]";

/* ─── Lucide-style inline SVG icons (decorative, hidden from screen readers) */
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

const MapPinIcon = () => (
  <svg width="18" height="18" {...svgProps}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" {...svgProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" {...svgProps}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="20" height="20" {...svgProps}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const TikTokIcon = () => (
  <svg width="22" height="22" {...svgProps} strokeWidth="2">
    <path d="M14 3v10.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c1 2.5 3 4 6 4" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" {...svgProps}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.5 2.5L2.9 9.7c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.3l-9 8.1-.3 4.8c.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.2-15.1c.3-1.2-.4-1.8-1.2-1.2z" />
  </svg>
);

/* ─── Social button (hover handled in CSS, 48px touch target) ───────────── */
function SocialBtn({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-neutral-300 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:scale-110 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:shadow-[0_0_24px_rgba(201,168,76,0.25)] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:hover:translate-y-0 ${ring}`}
    >
      {children}
    </a>
  );
}

/* ─── Info block (label + content) ──────────────────────────────────────── */
function InfoBlock({ icon, label, children }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#C9A84C]">
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.26em] text-neutral-400">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

const emailClass = `inline-flex min-h-11 w-fit max-w-full items-center break-all text-base text-neutral-100 underline decoration-white/20 underline-offset-4 transition duration-300 hover:text-[#C9A84C] hover:decoration-[#C9A84C] md:text-lg ${ring}`;

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Contact = () => {
  return (
    <>
      <div className="c-root relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
        {/* Atmosphere: fine dot grid + warm gold glow (matches the other pages) */}
        <div className="pointer-events-none fixed inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(201,168,76,0.13),transparent_70%),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(201,168,76,0.07),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          {/* ── 1. HERO ──────────────────────────────────────────────── */}
          <section className="animate-[cFadeUp_700ms_ease-out_both] pb-14 pt-24 text-center motion-reduce:animate-none md:pb-20 md:pt-32">
            <p className="flex items-center justify-center gap-4 text-xs font-medium uppercase tracking-[0.34em] text-[#C9A84C]">
              <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A84C]/70" />
              Tech Photography Studio
              <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A84C]/70" />
            </p>

            <h1 className="c-serif mt-6 text-6xl font-semibold leading-[0.98] tracking-[-0.03em] md:text-8xl">
              Let's{" "}
              <em className="font-light italic text-[#C9A84C]">Connect</em>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-neutral-300 md:text-lg">
              Serious inquiries welcome. Every great story starts with a single
              conversation.
            </p>
          </section>

          {/* ── 2. CONTACT INFO GRID ─────────────────────────────────── */}
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            {/* LEFT — contact details */}
            <div className="flex flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 shadow-2xl shadow-black/30 backdrop-blur-md md:p-10">
              {/* Phone — visually dominant */}
              <InfoBlock icon={<PhoneIcon />} label="Direct Line">
                <a
                  href="tel:+251967106705"
                  className={`c-serif inline-flex min-h-11 w-fit items-center text-4xl font-semibold tracking-tight text-[#C9A84C] transition duration-300 hover:text-[#E0C265] sm:text-5xl md:text-6xl ${ring}`}
                >
                  +251 96 710 6705
                </a>
              </InfoBlock>

              <div aria-hidden="true" className="h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

              {/* Email */}
              <InfoBlock icon={<MailIcon />} label="Email">
                <div className="flex flex-col">
                  <a href="mailto:hello@alexrivera.photo" className={emailClass}>
                    hello@alexrivera.photo
                  </a>
                  <a href="mailto:inquiries@alexrivera.photo" className={emailClass}>
                    inquiries@alexrivera.photo
                  </a>
                </div>
              </InfoBlock>

              <div aria-hidden="true" className="h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

              {/* Location */}
              <InfoBlock icon={<MapPinIcon />} label="Studio">
                <div>
                  <p className="c-serif text-3xl font-semibold tracking-tight">
                    New York, NY
                  </p>
                  <p className="mt-1 text-sm text-neutral-300">
                    Available for travel worldwide
                  </p>
                </div>
              </InfoBlock>

              {/* Response note */}
              <p className="mt-auto flex items-center gap-3 rounded-full border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] px-5 py-3 text-sm text-neutral-200">
                <span aria-hidden="true" className="c-pulse h-2 w-2 shrink-0 rounded-full bg-[#C9A84C]" />
                Response within 24–48 hours for serious inquiries.
              </p>
            </div>

            {/* RIGHT — brand card + social */}
            <div className="flex flex-col gap-6 lg:gap-8">
              {/* Glass brand card */}
              <div className="relative flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-[#C9A84C]/25 bg-gradient-to-br from-[#C9A84C]/[0.1] via-white/[0.03] to-[#C9A84C]/[0.05] p-7 shadow-2xl shadow-black/40 md:p-10">
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.16),transparent_70%)] blur-3xl" />

                <div className="relative flex flex-1 flex-col">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                    <span className="text-[#C9A84C]">TECH</span>{" "}
                    <span className="text-white">PHOTOGRAPHY</span>
                  </span>

                  <h2 className="c-serif mt-8 text-3xl font-semibold leading-[1.15] tracking-tight md:text-4xl">
                    Luxury cinematic photography for moments that endure.
                  </h2>

                  <p className="mt-5 text-base leading-8 text-neutral-300">
                    A luxury cinematic photography studio specializing in
                    editorial, weddings, and commercial work. Based in New York.
                    Available everywhere.
                  </p>

                  <span className="mt-auto pt-8 text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
                    Select bookings only · Global availability
                  </span>

                  <div aria-hidden="true" className="mt-5 h-0.5 w-14 bg-[#C9A84C]" />
                </div>
              </div>

              {/* Social media */}
              <div className="flex flex-wrap items-center justify-between gap-5 rounded-[2rem] border border-white/10 bg-white/[0.03] px-7 py-6 backdrop-blur-md md:px-10">
                <span className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">
                  Follow
                </span>
                <div className="flex gap-3">
                  <SocialBtn href="https://instagram.com" label="Instagram">
                    <InstagramIcon />
                  </SocialBtn>
                  <SocialBtn href="https://www.tiktok.com/en/" label="TikTok">
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
          <section className="pb-28 pt-24 text-center md:pt-32">
            <div aria-hidden="true" className="mx-auto mb-16 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <p className="flex items-center justify-center gap-4 text-xs font-medium uppercase tracking-[0.34em] text-[#C9A84C]">
              <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A84C]/70" />
              Available Now
              <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A84C]/70" />
            </p>

            <h2 className="c-serif mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-7xl">
              Let's build something{" "}
              <em className="font-light italic text-[#C9A84C]">timeless.</em>
            </h2>

            <p className="mt-8 text-sm font-medium uppercase tracking-[0.22em] text-neutral-300">
              Weddings · Editorial · Commercial · Travel
            </p>
          </section>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

          .c-root { font-family: 'Inter', system-ui, sans-serif; }
          .c-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
          .c-root ::selection { background: rgba(201,168,76,0.35); color: #fff; }

          @keyframes cFadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes cPulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(201,168,76,0.5); }
            50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(201,168,76,0); }
          }
          .c-pulse { animation: cPulse 2.4s ease-in-out infinite; }

          @media (prefers-reduced-motion: reduce) {
            .c-root *, .c-root *::before, .c-root *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Contact;
