import Button from "../components/Button";
import { usePackages } from "../context/PackageContext";

const fallbackFeatures = [
  "Professional editing included",
  "High-resolution online gallery",
  "Private consultation before shoot",
  "Print-ready image delivery",
  "Flexible scheduling support",
];

const defaultPackages = [
  {
    id: "essential",
    name: "Essential",
    price: 75,
    description:
      "A refined session for intimate portraits, engagements, and smaller moments with lasting value.",
    features: [
      "Up to 2 hours coverage",
      "60+ edited high-resolution images",
      "Private online gallery",
      "One location",
      "Delivery within 10 business days",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    price: 80,
    popular: true,
    description:
      "Our recommended package for weddings and full storytelling with elegant, editorial coverage.",
    features: [
      "Up to 8 hours coverage",
      "350+ edited high-resolution images",
      "Engagement or pre-event session",
      "Online gallery and download access",
      "Priority editing queue",
      "Print release included",
    ],
  },
  {
    id: "legacy",
    name: "Legacy",
    price: 99,
    description:
      "A complete luxury experience for multi-day events, destination weddings, and premium coverage.",
    features: [
      "Full-day or multi-day coverage",
      "700+ edited high-resolution images",
      "Second photographer included",
      "Custom timeline planning",
      "Luxury album consultation",
      "Fast preview gallery",
    ],
  },
];

function formatPrice(price) {
  if (price === undefined || price === null || price === "") return "Custom";

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) return price;

  return `$${numericPrice.toLocaleString()}`;
}

function getFeatures(pkg) {
  return Array.isArray(pkg.features) && pkg.features.length > 0
    ? pkg.features.slice(0, 7)
    : fallbackFeatures;
}

/* ─── Presentational helpers (no state, no logic) ───────────────────────── */
function Check({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function Eyebrow({ children }) {
  return (
    <p className="flex items-center justify-center gap-4 text-xs font-medium uppercase tracking-[0.34em] text-[#C9A84C]">
      <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A84C]/70" />
      {children}
      <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A84C]/70" />
    </p>
  );
}

function PackageCard({ pkg, index }) {
  const popular = Boolean(pkg.popular);
  const features = getFeatures(pkg);

  return (
    <article
      className={`group relative flex min-h-[600px] flex-col rounded-[2rem] border p-7 transition duration-500 hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-9 ${
        popular
          ? "border-[#C9A84C]/60 bg-gradient-to-b from-[#C9A84C]/[0.12] to-white/[0.04] shadow-[0_0_80px_rgba(201,168,76,0.16)] lg:-mt-6 lg:min-h-[650px]"
          : "border-white/10 bg-white/[0.04] hover:border-[#C9A84C]/40 hover:shadow-2xl hover:shadow-black/50"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#C9A84C] px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[0_8px_30px_rgba(201,168,76,0.4)]">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <div className="mb-8 flex items-center justify-between">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black tabular-nums ${
              popular ? "bg-[#C9A84C] text-black" : "bg-white/10 text-[#C9A84C]"
            }`}
          >
            0{index + 1}
          </span>

          {popular && (
            <span className="rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#C9A84C]">
              Recommended
            </span>
          )}
        </div>

        <h2 className="p-serif text-4xl font-semibold tracking-tight text-white">
          {pkg.name || "Photography Package"}
        </h2>

        <span
          aria-hidden="true"
          className={`mt-5 block h-0.5 bg-[#C9A84C] transition-all duration-500 ${
            popular ? "w-14" : "w-7 group-hover:w-14"
          }`}
        />

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
          Starting from
        </p>

        <p className="p-serif mt-2 text-7xl font-bold leading-none tracking-[-0.03em] text-[#C9A84C]">
          {formatPrice(pkg.price)}
        </p>

        <p className="mt-6 min-h-20 text-base leading-7 text-neutral-300">
          {pkg.description ||
            "A premium photography experience designed around meaningful moments and refined visual storytelling."}
        </p>
      </div>

      <div aria-hidden="true" className="mb-7 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <ul className="mb-9 space-y-4">
        {features.map((feature, featureIndex) => (
          <li key={`${feature}-${featureIndex}`} className="flex gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                popular ? "bg-[#C9A84C] text-black" : "bg-[#C9A84C]/15 text-[#C9A84C]"
              }`}
            >
              <Check size={11} />
            </span>
            <span className="text-sm leading-6 text-neutral-200">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        to="/contact"
        variant={popular ? "primary" : "outline"}
        className="mt-auto w-full"
      >
        Inquire Now
      </Button>
    </article>
  );
}

const Packages = () => {
  const { packages = [] } = usePackages();
  const sourcePackages = packages.length > 0 ? packages : defaultPackages;

  return (
    <div className="p-root min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      {/* Atmosphere: fine dot grid + warm gold glow (matches Home and Gallery) */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(201,168,76,0.13),transparent_70%),radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(201,168,76,0.07),transparent_70%)]" />

      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-6 pb-10 pt-24 text-center md:pb-14 md:pt-28">
          <div className="animate-[fadeUp_700ms_ease-out_both] motion-reduce:animate-none">
            <Eyebrow>Studio Pricing</Eyebrow>

            <h1 className="p-serif mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-7xl">
              Photography <span className="italic font-light text-[#C9A84C]">Packages</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-neutral-300 md:text-lg">
              Choose the perfect package for your timeless moments. Each
              experience is shaped around polished direction, intentional
              coverage, and premium delivery.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          {packages.length === 0 && defaultPackages.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-20 text-center">
              <p className="text-lg text-neutral-300">
                No packages available yet.
              </p>
            </div>
          ) : (
            <div className="grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:pt-8">
              {sourcePackages.map((pkg, index) => {
                const id = pkg._id || pkg.id || `${pkg.name}-${index}`;

                return <PackageCard key={id} pkg={pkg} index={index} />;
              })}
            </div>
          )}
        </section>

        {/* Trust strip */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="border-y border-white/10 py-7">
            <div className="grid gap-5 text-sm text-neutral-200 md:grid-cols-3">
              {[
                "Professional editing included",
                "High-resolution delivery",
                "Fast turnaround time",
              ].map((item) => (
                <div key={item} className="flex items-center justify-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A84C]/15 text-[#C9A84C]">
                    <Check size={12} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom coverage CTA */}
        <section className="px-6 pb-28">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[#C9A84C]/25 bg-gradient-to-br from-[#C9A84C]/[0.09] via-white/[0.03] to-[#C9A84C]/[0.05] p-8 text-center shadow-2xl shadow-black/40 md:p-16">
            <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[30rem] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(201,168,76,0.14),transparent_70%)] blur-3xl" />

            <div className="relative">
              <Eyebrow>Custom Coverage</Eyebrow>

              <h2 className="p-serif mt-5 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                Need a custom package?
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-300">
                For destination weddings, multi-day events, commercial projects,
                or private commissions, we can design a tailored photography
                experience.
              </p>

              <Button to="/contact" className="mt-10">
                Contact Photographer
              </Button>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&family=Inter:wght@300;400;500;600;700;900&display=swap');

        .p-root { font-family: 'Inter', system-ui, sans-serif; }
        .p-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .p-root ::selection { background: rgba(201,168,76,0.35); color: #fff; }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .p-root *, .p-root *::before, .p-root *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Packages;
