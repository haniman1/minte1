import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const categories = ["All", "Wedding", "Portrait", "Events", "Travel"];

const fallbackPhotos = [
  {
    id: "fallback-1",
    title: "Golden Hour Vows",
    category: "Wedding",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "fallback-2",
    title: "Editorial Stillness",
    category: "Portrait",
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "fallback-3",
    title: "Private Evening",
    category: "Events",
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=85",
  },
];

// Shorter on mobile, taller from the sm breakpoint up
const heightPattern = [
  "h-[320px] sm:h-[420px]",
  "h-[400px] sm:h-[560px]",
  "h-[300px] sm:h-[360px]",
  "h-[380px] sm:h-[500px]",
  "h-[320px] sm:h-[390px]",
  "h-[420px] sm:h-[620px]",
];

const translations = {
  en: {
    studioArchive: "Studio Archive",
    gallery: "Gallery",
    galleryDesc:
      "A collection of timeless moments, composed with atmosphere, emotion, and editorial restraint.",
    noPhotos: "No photos found for this category.",
    loadMore: "Load More",
    featuredWork: "Featured Work",
    featuredFallback: "A frame with lasting presence",
    openImage: "Open image",
    untitled: "Untitled Frame",
    close: "Close",
    previous: "Previous",
    next: "Next",
    categories: {
      All: "All",
      Wedding: "Wedding",
      Portrait: "Portrait",
      Events: "Events",
      Travel: "Travel",
    },
  },
  am: {
    studioArchive: "ስቱዲዮ ማህደር",
    gallery: "ጋለሪ",
    galleryDesc: "በከባቢ፣ በስሜት እና በጥንቃቄ የተዋቀሩ የማይረሱ ጊዜዎች ስብስብ።",
    noPhotos: "በዚህ ምድብ ውስጥ ፎቶ አልተገኘም።",
    loadMore: "ተጨማሪ ይጫኑ",
    featuredWork: "ተመረጠ ስራ",
    featuredFallback: "ዘላቂ ስሜት ያለው ፍሬም",
    openImage: "ምስል ክፈት",
    untitled: "ርዕስ የሌለው ፍሬም",
    close: "ዝጋ",
    previous: "ቀዳሚ",
    next: "ቀጣይ",
    categories: {
      All: "ሁሉም",
      Wedding: "ሰርግ",
      Portrait: "ፖርትሬት",
      Events: "ዝግጅቶች",
      Travel: "ጉዞ",
    },
  },
};

function getImageUrl(photo) {
  return photo.imageUrl || photo.image || photo.url || photo.src || "";
}

function getCategory(photo) {
  return photo.category?.name || photo.category || "Editorial";
}

/* ─── Small presentational helpers (no state, no logic) ─────────────────── */
const ring =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]";

function Icon({ d, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function Gallery() {
  const [lang, setLang] = useState("en");
  const [photos, setPhotos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const t = translations[lang];

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get("/photos");
        setPhotos(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const galleryPhotos = photos.length > 0 ? photos : fallbackPhotos;

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === "All") return galleryPhotos;

    return galleryPhotos.filter(
      (photo) =>
        getCategory(photo).toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [galleryPhotos, selectedCategory]);

  // Memoized so effects depending on it don't re-run on every render
  const visiblePhotos = useMemo(
    () => filteredPhotos.slice(0, visibleCount),
    [filteredPhotos, visibleCount],
  );

  const activePhoto =
    lightboxIndex === null ? null : visiblePhotos[lightboxIndex];

  useEffect(() => {
    setVisibleCount(12);
    setLightboxIndex(null);
  }, [selectedCategory]);

  const goToNext = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % visiblePhotos.length,
    );
  }, [visiblePhotos.length]);

  const goToPrevious = useCallback(() => {
    setLightboxIndex((current) =>
      current === null
        ? null
        : (current - 1 + visiblePhotos.length) % visiblePhotos.length,
    );
  }, [visiblePhotos.length]);

  useEffect(() => {
    if (!activePhoto) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") goToNext();
      if (event.key === "ArrowLeft") goToPrevious();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto, goToNext, goToPrevious]);

  // Preload the next image while the lightbox is open
  useEffect(() => {
    if (lightboxIndex === null || visiblePhotos.length === 0) return;

    const nextPhoto = visiblePhotos[(lightboxIndex + 1) % visiblePhotos.length];
    const nextImageUrl = nextPhoto ? getImageUrl(nextPhoto) : "";

    if (nextImageUrl) {
      const image = new Image();
      image.src = nextImageUrl;
    }
  }, [lightboxIndex, visiblePhotos]);

  return (
    <div className="g-root relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      {/* Atmosphere: fine dot grid + warm gold glow (matches the Home page) */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(201,168,76,0.13),transparent_70%),radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(201,168,76,0.07),transparent_70%)]" />

      <main className="relative z-10">
        {/* ── Header ───────────────────────────────────────────────── */}
        <header className="relative mx-auto max-w-5xl px-6 pb-10 pt-24 text-center md:pb-14 md:pt-28">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "am" : "en")}
            className={`absolute right-6 top-5 z-20 inline-flex min-h-11 cursor-pointer items-center rounded-full border border-white/20 bg-black/50 px-5 text-sm font-medium text-white backdrop-blur-md transition duration-300 hover:border-[#C9A84C]/60 hover:text-[#C9A84C] ${ring}`}
            aria-label="Switch language"
          >
            EN / አማ
          </button>

          <div className="animate-[fadeUp_700ms_ease-out_both] motion-reduce:animate-none">
            <p className="flex items-center justify-center gap-4 text-xs font-medium uppercase tracking-[0.34em] text-[#C9A84C]">
              <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A84C]/70" />
              {t.studioArchive}
              <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A84C]/70" />
            </p>

            <h1 className="g-serif mt-5 text-6xl font-semibold leading-none tracking-[-0.03em] md:text-8xl">
              {t.gallery}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-neutral-300 md:text-lg">
              {t.galleryDesc}
            </p>
          </div>
        </header>

        {/* ── Category filter ──────────────────────────────────────── */}
        <section className="sticky top-0 z-30 border-y border-white/10 bg-[#0a0a0a]/85 px-6 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto md:justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={active}
                  className={`relative inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full px-5 text-sm font-medium transition duration-300 ${ring} ${
                    active
                      ? "text-[#C9A84C]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {t.categories[category]}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-5 bottom-1 h-px rounded-full bg-[#C9A84C] transition duration-300 ${
                      active
                        ? "opacity-100 shadow-[0_0_14px_rgba(201,168,76,0.8)]"
                        : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Photo grid ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          {loading ? (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3" aria-busy="true">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className={`mb-5 break-inside-avoid rounded-[1.5rem] bg-neutral-900 ${
                    heightPattern[index % heightPattern.length]
                  } animate-pulse`}
                />
              ))}
            </div>
          ) : visiblePhotos.length === 0 ? (
            <div className="flex flex-col items-center gap-5 rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-24 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C]">
                <Icon d="M3 7a2 2 0 0 1 2-2h2l1.5-2h7L17 5h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={24} />
              </span>
              <p className="text-lg text-neutral-300">{t.noPhotos}</p>
            </div>
          ) : (
            <div
              key={selectedCategory}
              className="animate-[fadeUp_450ms_ease-out_both] columns-1 gap-5 motion-reduce:animate-none sm:columns-2 lg:columns-3"
            >
              {visiblePhotos.map((photo, index) => (
                <button
                  key={photo._id || photo.id || `${photo.title}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className={`group relative mb-5 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-neutral-900 text-left transition duration-500 hover:-translate-y-1 hover:border-[#C9A84C]/50 hover:shadow-2xl hover:shadow-black/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${ring} ${
                    heightPattern[index % heightPattern.length]
                  }`}
                >
                  <img
                    src={getImageUrl(photo)}
                    alt={photo.title || "Gallery photograph"}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.07] group-focus-visible:scale-[1.07] motion-reduce:transition-none"
                  />

                  {/* Scrim stays on so the title is readable on touch screens too */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    {getCategory(photo)}
                  </span>

                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 flex h-9 w-9 scale-75 items-center justify-center rounded-full border border-[#C9A84C]/50 bg-[#C9A84C]/15 text-[#C9A84C] opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                  >
                    <Icon d="M7 17L17 7M17 7H8M17 7v9" size={14} />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h2 className="g-serif text-2xl font-semibold leading-tight tracking-tight text-white md:text-[1.75rem]">
                      {photo.title || t.untitled}
                    </h2>
                    <p className="mt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#C9A84C] transition duration-300 group-hover:translate-x-1">
                      {t.openImage}
                      <Icon d="M5 12h14M13 6l6 6-6 6" size={14} />
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#C9A84C] to-[#C9A84C]/30 transition-all duration-500 group-hover:w-full group-focus-visible:w-full"
                  />
                </button>
              ))}
            </div>
          )}

          {!loading && visibleCount < filteredPhotos.length && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <p className="text-sm tabular-nums text-neutral-400">
                {visiblePhotos.length} / {filteredPhotos.length}
              </p>
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 9)}
                className={`inline-flex min-h-12 cursor-pointer items-center rounded-full border border-[#C9A84C]/60 bg-[#C9A84C]/10 px-8 text-sm font-bold uppercase tracking-[0.18em] text-[#C9A84C] transition duration-300 hover:bg-[#C9A84C] hover:text-black hover:shadow-[0_0_40px_rgba(201,168,76,0.35)] ${ring}`}
              >
                {t.loadMore}
              </button>
            </div>
          )}
        </section>

        {/* ── Featured banner ──────────────────────────────────────── */}
        {visiblePhotos.length > 2 && (
          <section className="relative mx-auto mb-24 max-w-7xl px-6">
            <div className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10">
              <img
                src={getImageUrl(visiblePhotos[1])}
                alt={visiblePhotos[1].title || t.featuredWork}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-6 right-6 max-w-xl md:bottom-14 md:left-14">
                <p className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                  <span aria-hidden="true" className="h-px w-8 bg-[#C9A84C]/70" />
                  {t.featuredWork}
                </p>
                <h2 className="g-serif mt-4 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                  {visiblePhotos[1].title || t.featuredFallback}
                </h2>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── Lightbox ───────────────────────────────────────────────── */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex animate-[fadeIn_220ms_ease-out_both] items-center justify-center bg-black/90 p-4 backdrop-blur-lg motion-reduce:animate-none"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title || t.untitled}
        >
          <button
            type="button"
            autoFocus
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex(null);
            }}
            className={`absolute right-4 top-4 z-20 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-[#C9A84C] hover:text-black md:right-8 md:top-8 ${ring}`}
            aria-label={t.close}
          >
            <Icon d="M6 6l12 12M18 6L6 18" />
          </button>

          {visiblePhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                className={`absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-[#C9A84C] hover:text-black md:left-8 ${ring}`}
                aria-label={t.previous}
              >
                <Icon d="M15 5l-7 7 7 7" size={22} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className={`absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-[#C9A84C] hover:text-black md:right-8 ${ring}`}
                aria-label={t.next}
              >
                <Icon d="M9 5l7 7-7 7" size={22} />
              </button>
            </>
          )}

          <div
            className="relative max-h-[90vh] w-full max-w-6xl animate-[lightboxIn_260ms_ease-out_both] motion-reduce:animate-none"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={getImageUrl(activePhoto)}
              alt={activePhoto.title || "Gallery photograph"}
              className="mx-auto max-h-[76vh] w-full rounded-[1.5rem] object-contain shadow-2xl shadow-black/70"
            />

            <div className="mt-4 flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-black/60 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="g-serif text-2xl font-semibold text-white">
                  {activePhoto.title || t.untitled}
                </h2>
                <p className="mt-1 text-sm tabular-nums text-neutral-400">
                  {lightboxIndex + 1} / {visiblePhotos.length}
                </p>
              </div>

              <span className="w-max rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A84C]">
                {getCategory(activePhoto)}
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Noto+Serif+Ethiopic:wght@400;600;700&family=Noto+Sans+Ethiopic:wght@400;500;600&display=swap');

        .g-root { font-family: 'Inter', 'Noto Sans Ethiopic', system-ui, sans-serif; }
        .g-serif { font-family: 'Cormorant Garamond', 'Noto Serif Ethiopic', Georgia, serif; }
        .g-root ::selection { background: rgba(201,168,76,0.35); color: #fff; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes lightboxIn {
          from { opacity: 0; transform: scale(0.96) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .g-root *, .g-root *::before, .g-root *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Gallery;
