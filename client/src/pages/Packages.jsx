import { Link } from "react-router-dom";
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

function PackageCard({ pkg, index }) {
  const popular = Boolean(pkg.popular);
  const features = getFeatures(pkg);

  return (
    <article
      className={`relative flex min-h-[620px] flex-col rounded-[2rem] border p-7 transition duration-300 hover:-translate-y-2 hover:scale-[1.02] md:p-8 ${
        popular
          ? "border-white/30 bg-white/[0.08] shadow-[0_0_70px_rgba(147,197,253,0.14)] lg:-mt-6 lg:min-h-[670px]"
          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:shadow-2xl hover:shadow-black/40"
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-black shadow-2xl shadow-white/10">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <div className="mb-8 flex items-center justify-between">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black ${
              popular ? "bg-white text-black" : "bg-white/10 text-white"
            }`}
          >
            0{index + 1}
          </span>

          {popular && (
            <span className="rounded-full border border-blue-200/20 bg-blue-200/10 px-3 py-1 text-xs font-semibold text-blue-100">
              Recommended
            </span>
          )}
        </div>

        <h2 className="text-3xl font-semibold tracking-tight text-white">
          {pkg.name || "Photography Package"}
        </h2>

        <p className="mt-6 text-sm uppercase tracking-[0.22em] text-neutral-500">
          Starting from
        </p>

        <p className="mt-2 text-6xl font-black tracking-[-0.07em] text-white">
          {formatPrice(pkg.price)}
        </p>

        <p className="mt-6 min-h-20 text-base leading-7 text-neutral-400">
          {pkg.description ||
            "A premium photography experience designed around meaningful moments and refined visual storytelling."}
        </p>
      </div>

      <ul className="mb-9 space-y-4">
        {features.map((feature, featureIndex) => (
          <li key={`${feature}-${featureIndex}`} className="flex gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                popular ? "bg-white text-black" : "bg-white/10 text-white"
              }`}
            >
              ✓
            </span>
            <span className="text-sm leading-6 text-neutral-300">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className={`mt-auto flex w-full items-center justify-center rounded-full px-6 py-4 text-center text-sm font-black uppercase tracking-[0.16em] transition duration-300 hover:scale-[1.02] ${
          popular
            ? "bg-white text-black shadow-[0_0_34px_rgba(255,255,255,0.2)] hover:bg-neutral-200"
            : "border border-white/15 bg-white/10 text-white hover:bg-white hover:text-black"
        }`}
      >
        Inquire About This Package
      </Link>
    </article>
  );
}

const Packages = () => {
  const { packages = [] } = usePackages();
  const sourcePackages = packages.length > 0 ? packages : defaultPackages;

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(147,197,253,0.13),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_34%)]" />

      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-6 pb-14 pt-24 text-center md:pt-32">
          <div className="animate-[fadeUp_700ms_ease-out_both]">
            <p className="text-xs font-medium uppercase tracking-[0.38em] text-blue-100/70">
              Studio Pricing
            </p>

            <h1 className="mt-5 text-5xl font-black tracking-[-0.06em] md:text-7xl">
              Photography Packages
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-400 md:text-lg">
              Choose the perfect package for your timeless moments. Each
              experience is shaped around polished direction, intentional
              coverage, and premium delivery.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          {packages.length === 0 && defaultPackages.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-20 text-center">
              <p className="text-lg text-neutral-400">
                No packages available yet.
              </p>
            </div>
          ) : (
            <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:pt-8">
              {sourcePackages.map((pkg, index) => {
                const id = pkg._id || pkg.id || `${pkg.name}-${index}`;

                return <PackageCard key={id} pkg={pkg} index={index} />;
              })}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="border-y border-white/10 py-6">
            <div className="grid gap-4 text-sm text-neutral-300 md:grid-cols-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-white">✓</span>
                Professional editing included
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-white">✓</span>
                High-resolution delivery
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-white">✓</span>
                Fast turnaround time
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-8 text-center shadow-2xl shadow-black/30 md:p-14">
            <p className="text-sm uppercase tracking-[0.32em] text-neutral-500">
              Custom Coverage
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Need a custom package?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-neutral-400">
              For destination weddings, multi-day events, commercial projects,
              or private commissions, we can design a tailored photography
              experience.
            </p>

            <Link
              to="/contact"
              className="mt-9 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-black transition duration-300 hover:scale-[1.02] hover:bg-neutral-200"
            >
              Contact Photographer
            </Link>
          </div>
        </section>
      </main>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default Packages;
