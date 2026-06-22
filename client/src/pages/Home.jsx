import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

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
    icon: "01",
    description:
      "Cinematic coverage for ceremonies, portraits, receptions, and the quiet moments between.",
  },
  {
    title: "Portrait Photography",
    icon: "02",
    description:
      "Editorial portraits for individuals, couples, creatives, and personal branding sessions.",
  },
  {
    title: "Event Coverage",
    icon: "03",
    description:
      "Clean, atmospheric storytelling for private events, launches, celebrations, and gatherings.",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Shoots" },
  { value: 120, suffix: "+", label: "Weddings" },
  { value: 10, suffix: "+", label: "Years Experience" },
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
    heroPill: "Weddings • Portraits • Events",
    heroTitle: "CAPTURING TIMELESS MOMENTS",
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
    viewFullGallery: "View full gallery",
  },
  am: {
    heroPill: "ሰርግ • ፎቶ ስዕሎች • ዝግጅቶች",
    heroTitle: "የማይረሱ ጊዜዎችን መያዝ",
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
    viewFullGallery: "ሙሉ ጋለሪ ይመልከቱ",
  },
};

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let frame;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(eased * value));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
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

function WorkCard({ photo, index, onClick, viewFullGallery }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-[28rem] overflow-hidden rounded-[1.75rem] bg-neutral-900 text-left shadow-2xl shadow-black/30 outline-none transition duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-white"
    >
      <img
        src={getPhotoImage(photo)}
        alt={getPhotoTitle(photo, index)}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

      <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
        {getPhotoCategory(photo, index)}
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-2xl font-semibold tracking-tight text-white">
          {getPhotoTitle(photo, index)}
        </p>
        <p className="mt-2 text-sm text-neutral-300">{viewFullGallery}</p>
      </div>
    </button>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <article className="mx-3 w-80 shrink-0 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          loading="lazy"
          className="h-11 w-11 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-white">{testimonial.name}</p>
          <p className="text-sm text-neutral-500">{testimonial.handle}</p>
        </div>
        <span className="ml-auto text-xs text-neutral-500">
          {testimonial.date}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-neutral-300">
        {testimonial.review}
      </p>
    </article>
  );
}

function TestimonialsMarquee({ t }) {
  const firstRow = testimonials;
  const secondRow = [...testimonials].reverse();

  return (
    <section className="overflow-hidden border-y border-white/10 bg-neutral-950 py-16">
      <Reveal className="mx-auto mb-10 max-w-7xl px-6">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">
          {t.clientNotes}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
          {t.clientHeading}
        </h2>
      </Reveal>

      <div className="space-y-5">
        <div className="flex w-max animate-[marquee_34s_linear_infinite]">
          {[...firstRow, ...firstRow].map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-a-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>

        <div className="flex w-max animate-[marqueeReverse_38s_linear_infinite]">
          {[...secondRow, ...secondRow].map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.name}-b-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes marqueeReverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

const Home = () => {
  const navigate = useNavigate();

  const [lang, setLang] = useState("en");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-black text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 scale-105 animate-[heroZoom_18s_ease-in-out_infinite_alternate]">
          <img
            src={heroImage}
            alt="Cinematic photography studio hero"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/70 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(147,197,253,0.16),transparent_32%)]" />

        <button
          onClick={() => setLang(lang === "en" ? "am" : "en")}
          className="absolute top-6 right-6 z-20 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-md transition duration-300 hover:bg-black/60"
        >
          EN / አማ
        </button>

        <Reveal className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm uppercase tracking-[0.38em] text-blue-100/80">
            {t.heroPill}
          </p>

          <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.06em] text-white md:text-8xl">
            {t.heroTitle}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-neutral-300 md:text-xl">
            {t.heroDesc}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/gallery"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-black transition duration-300 hover:bg-neutral-200"
            >
              {t.viewGallery}
            </Link>

            <Link
              to="/contact"
              className="rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md transition duration-300 hover:bg-white/20"
            >
              {t.bookSession}
            </Link>
          </div>
        </Reveal>

        <style>{`
          @keyframes heroZoom {
            from { transform: scale(1.05); }
            to { transform: scale(1.13); }
          }
        `}</style>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">
              {t.portfolioLabel}
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              {t.portfolio}
            </h2>
          </div>

          <Link
            to="/gallery"
            className="w-max border-b border-white/50 pb-1 text-sm font-medium uppercase tracking-[0.2em] text-neutral-300 transition hover:text-white"
          >
            {t.viewAll}
          </Link>
        </Reveal>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[28rem] animate-pulse rounded-[1.75rem] bg-neutral-900"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {selectedWorks.map((photo, index) => (
              <Reveal key={photo._id || photo.id || index} delay={index * 70}>
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

      <section className="bg-neutral-950 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">
              {t.servicesLabel}
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              {t.servicesHeading}
            </h2>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 90}>
                <article className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                  <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
                    {service.icon}
                  </div>

                  <h3 className="text-2xl font-semibold tracking-tight">
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-neutral-400">
                    {service.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 md:grid-cols-3 md:p-10">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 100}>
              <div className="text-center">
                <p className="text-5xl font-black tracking-tight text-white md:text-6xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-sm uppercase tracking-[0.24em] text-neutral-400">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <TestimonialsMarquee t={t} />

      <section className="px-6 py-24">
        <Reveal className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-8 text-center shadow-2xl shadow-black/30 md:p-16">
          <p className="text-sm uppercase tracking-[0.32em] text-blue-100/80">
            {t.bookStudioLabel}
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            {t.bookStudioHeading}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-neutral-400">
            {t.bookStudioDesc}
          </p>

          <Link
            to="/contact"
            className="mt-9 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-black transition duration-300 hover:bg-neutral-200"
          >
            {t.contact}
          </Link>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
