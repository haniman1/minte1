import { useEffect } from "react";

const Lightbox = ({ isOpen, onClose, imageUrl, title, category }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-black border border-slate-700 text-white rounded-full p-3 hover:bg-slate-800 transition z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6h12v12"
            />
          </svg>
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt={title}
          className="max-h-[85vh] w-full object-contain rounded-2xl shadow-2xl"
        />

        {/* Image Info */}
        {(title || category) && (
          <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
            {title && (
              <h3 className="text-lg font-medium text-white">{title}</h3>
            )}
            {category && (
              <p className="text-sm text-neutral-400 mt-1 capitalize">
                {category}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
