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
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(147,197,253,0.12),transparent_32%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.08),transparent_34%)]" />

      <main className="relative z-10">
        <header className="relative mx-auto max-w-5xl px-6 pb-6 pt-16 text-center md:pt-20">
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "am" : "en")}
            className="absolute right-6 top-4 z-20 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Switch language"
          >
            EN / አማ
          </button>

          <div className="animate-[fadeUp_700ms_ease-out_both] motion-reduce:animate-none">
            <p className="text-xs font-medium uppercase tracking-[0.38em] text-neutral-500">
              {t.studioArchive}
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] md:text-6xl">
              {t.gallery}
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-400 md:text-base">
              {t.galleryDesc}
            </p>
          </div>
        </header>

        <section className="sticky top-0 z-30 border-y border-white/10 bg-[#0a0a0a]/80 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => {
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={active}
                  className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition duration-300 focus-visible:ring-2 focus-visible:ring-white ${
                    active
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-200"
                  }`}
                >
                  {t.categories[category]}
                  <span
                    className={`absolute inset-x-5 -bottom-0.5 h-px rounded-full bg-white transition duration-300 ${
                      active
                        ? "opacity-100 shadow-[0_0_18px_rgba(255,255,255,0.65)]"
                        : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  key={index}
                  className={`rounded-[1.5rem] bg-neutral-900 ${
                    heightPattern[index % heightPattern.length]
                  } animate-pulse`}
                />
              ))}
            </div>
          ) : visiblePhotos.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
              <p className="text-lg text-neutral-400">{t.noPhotos}</p>
            </div>
          ) : (
            <div
              key={selectedCategory}
              className="grid animate-[fadeUp_450ms_ease-out_both] grid-cols-1 items-start gap-5 motion-reduce:animate-none sm:grid-cols-2 lg:grid-cols-3"
            >
              {visiblePhotos.map((photo, index) => (
                <button
                  key={photo._id || photo.id || `${photo.title}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className={`group relative w-full cursor-zoom-in overflow-hidden rounded-[1.5rem] bg-neutral-900 text-left outline-none transition duration-300 hover:shadow-2xl hover:shadow-black/50 focus-visible:ring-2 focus-visible:ring-white ${
                    heightPattern[index % heightPattern.length]
                  }`}
                >
                  <img
                    src={getImageUrl(photo)}
                    alt={photo.title || "Gallery photograph"}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none"
                  />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.28)_100%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />

                  <div className="absolute left-5 top-5 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                    <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {getCategory(photo)}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {photo.title || t.untitled}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-300">
                      {t.openImage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && visibleCount < filteredPhotos.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 9)}
                className="rounded-full border border-white/15 bg-white/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white"
              >
                {t.loadMore}
              </button>
            </div>
          )}
        </section>

        {visiblePhotos.length > 2 && (
          <section className="relative mx-auto mb-20 max-w-7xl px-6">
            <div className="relative h-[70vh] overflow-hidden rounded-[2rem]">
              <img
                src={getImageUrl(visiblePhotos[1])}
                alt={visiblePhotos[1].title || t.featuredWork}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-8 left-6 max-w-xl md:bottom-12 md:left-12">
                <p className="text-sm uppercase tracking-[0.32em] text-neutral-300">
                  {t.featuredWork}
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                  {visiblePhotos[1].title || t.featuredFallback}
                </h2>
              </div>
            </div>
          </section>
        )}
      </main>

      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex animate-[fadeIn_220ms_ease-out_both] items-center justify-center bg-black/85 p-4 backdrop-blur-lg motion-reduce:animate-none"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title || t.untitled}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxIndex(null);
            }}
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-md transition hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white"
            aria-label={t.close}
          >
            ×
          </button>

          {visiblePhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur-md transition hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white md:left-8"
                aria-label={t.previous}
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white backdrop-blur-md transition hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white md:right-8"
                aria-label={t.next}
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative max-h-[88vh] w-full max-w-6xl animate-[lightboxIn_260ms_ease-out_both] motion-reduce:animate-none"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={getImageUrl(activePhoto)}
              alt={activePhoto.title || "Gallery photograph"}
              className="mx-auto max-h-[78vh] w-full rounded-[1.5rem] object-contain shadow-2xl shadow-black/70"
            />

            <div className="mt-4 flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-black/50 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {activePhoto.title || t.untitled}
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  {lightboxIndex + 1} / {visiblePhotos.length}
                </p>
              </div>

              <span className="w-max rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white">
                {getCategory(activePhoto)}
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
      `}</style>
    </div>
  );
}

export default Gallery;
