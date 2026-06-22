import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import api from "../services/api";

/* ─── Design tokens (matches Admin.jsx + AdminPackages.jsx system) ────────── */
const T = {
  bg: "#0F0F11",
  surface: "#17171A",
  surfaceHi: "#1E1E22",
  surfaceDeep: "#0C0C0E",
  border: "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,255,0.13)",
  muted: "#52525C",
  body: "#A1A1AA",
  heading: "#F4F4F5",
  accent: "#C9A84C",
  accentDim: "rgba(201,168,76,0.13)",
  accentBdr: "rgba(201,168,76,0.28)",
  red: "#F87171",
  redDim: "rgba(248,113,113,0.08)",
  redBdr: "rgba(248,113,113,0.22)",
};

const CATEGORIES = [
  "wedding",
  "graduation",
  "portrait",
  "events",
  "engagement",
];

/* ─── Shared input style ─────────────────────────────────────────────────── */
function useInputStyle() {
  const [focused, setFocused] = useState(false);
  const style = {
    width: "100%",
    background: T.surfaceDeep,
    border: `1px solid ${focused ? T.accentBdr : T.border}`,
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 13,
    color: T.heading,
    outline: "none",
    transition: "border-color 0.18s, box-shadow 0.18s",
    boxShadow: focused ? `0 0 0 3px ${T.accentDim}` : "none",
    fontFamily: "inherit",
  };
  return {
    style,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
}

function StyledInput({ value, onChange, placeholder, type = "text" }) {
  const input = useInputStyle();
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={input.style}
      onFocus={input.onFocus}
      onBlur={input.onBlur}
    />
  );
}

function StyledSelect({ value, onChange, children }) {
  const input = useInputStyle();
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        ...input.style,
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2352525C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
        paddingRight: 36,
      }}
      onFocus={input.onFocus}
      onBlur={input.onBlur}
    >
      {children}
    </select>
  );
}

function FieldLabel({ children }) {
  return (
    <label
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: T.body,
        letterSpacing: "0.04em",
        display: "block",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

/* ─── Dropzone area ──────────────────────────────────────────────────────── */
function DropzoneArea({ previewUrl, onChange }) {
  const [hover, setHover] = useState(false);
  const inputRef = useRef(null);

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          border: `1.5px dashed ${hover ? T.accentBdr : T.border}`,
          borderRadius: 14,
          background: hover ? T.accentDim : T.surfaceDeep,
          padding: previewUrl ? 0 : "32px 20px",
          cursor: "pointer",
          transition: "border-color 0.2s, background 0.2s",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {previewUrl ? (
          <div style={{ position: "relative" }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                display: "block",
                borderRadius: 12,
              }}
            />
            {/* Swap overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                background: "rgba(0,0,0,0.55)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: hover ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={T.accent}
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span style={{ fontSize: 12, color: T.accent, fontWeight: 500 }}>
                Click to change
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: hover ? "rgba(201,168,76,0.2)" : T.surface,
                border: `1px solid ${hover ? T.accentBdr : T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={hover ? T.accent : T.muted}
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 13,
                  color: hover ? T.accent : T.body,
                  fontWeight: 500,
                  transition: "color 0.2s",
                  marginBottom: 4,
                }}
              >
                Click to select image
              </p>
              <p style={{ fontSize: 11, color: T.muted }}>
                JPG, PNG, WEBP · Max 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden actual file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

/* ─── Category badge ─────────────────────────────────────────────────────── */
function CategoryBadge({ category }) {
  return (
    <span
      style={{
        fontSize: 10,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontWeight: 600,
        color: T.heading,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${T.borderHi}`,
        borderRadius: 99,
        padding: "3px 10px",
      }}
    >
      {category}
    </span>
  );
}

/* ─── Photo card ─────────────────────────────────────────────────────────── */
function PhotoCard({ photo, onDelete }) {
  const [hover, setHover] = useState(false);
  const id = photo._id || photo.id;
  const date = photo.createdAt
    ? new Date(photo.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hover ? T.borderHi : T.border}`,
        borderRadius: 16,
        overflow: "hidden",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hover
          ? "0 16px 40px rgba(0,0,0,0.45)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        transition:
          "transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s, border-color 0.2s",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
        <img
          src={photo.imageUrl}
          alt={photo.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        {/* Hover gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)",
            opacity: hover ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
        {/* Category badge */}
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <CategoryBadge category={photo.category} />
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: "18px 20px 20px" }}>
        <h4
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: T.heading,
            letterSpacing: "-0.01em",
            marginBottom: 5,
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {photo.title}
        </h4>
        <p
          style={{
            fontSize: 11,
            color: T.muted,
            letterSpacing: "0.03em",
            marginBottom: 16,
          }}
        >
          Uploaded {date}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 8,
              background: T.surfaceHi,
              border: `1px solid ${T.border}`,
              color: T.body,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.borderHi;
              e.currentTarget.style.color = T.heading;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.color = T.body;
            }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: 8,
              background: T.redDim,
              border: `1px solid ${T.redBdr}`,
              color: T.red,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(248,113,113,0.14)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = T.redDim;
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton card ──────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 220,
          background: T.surfaceHi,
          animation: "pulse 1.8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          padding: "18px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            height: 14,
            width: "65%",
            borderRadius: 6,
            background: T.surfaceHi,
            animation: "pulse 1.8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 10,
            width: "40%",
            borderRadius: 6,
            background: T.surfaceHi,
            animation: "pulse 1.8s ease-in-out infinite 0.15s",
          }}
        />
        <div
          style={{
            height: 32,
            borderRadius: 8,
            marginTop: 4,
            background: T.surfaceHi,
            animation: "pulse 1.8s ease-in-out infinite 0.3s",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "64px 24px",
        border: `1px dashed ${T.border}`,
        borderRadius: 16,
        background: T.surface,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: T.accentDim,
          border: `1px solid ${T.accentBdr}`,
          margin: "0 auto 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={T.accent}
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: T.heading,
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}
      >
        No photos yet
      </h3>
      <p
        style={{
          fontSize: 13,
          color: T.muted,
          maxWidth: 260,
          margin: "0 auto",
          lineHeight: 1.6,
        }}
      >
        Upload your first photo using the panel above.
      </p>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
const AdminPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    category: "",
    file: null,
    previewUrl: null,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const res = await api.get("/photos");
      setPhotos(res.data);
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewPhoto({ ...newPhoto, file, previewUrl });
    }
  };

  const handleUpload = async () => {
    if (!newPhoto.file || !newPhoto.title || !newPhoto.category) {
      alert("Please fill all fields and select an image");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("title", newPhoto.title);
    formData.append("category", newPhoto.category);
    formData.append("image", newPhoto.file);
    try {
      await api.post("/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Photo uploaded successfully!");
      fetchPhotos();
      setNewPhoto({ title: "", category: "", file: null, previewUrl: null });
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await api.delete(`/photos/${id}`);
      alert("Photo deleted successfully");
      fetchPhotos();
    } catch {
      alert("Failed to delete photo");
    }
  };

  const canUpload =
    !uploading && !!newPhoto.file && !!newPhoto.title && !!newPhoto.category;

  return (
    <div
      style={{ fontFamily: "'Inter', system-ui, sans-serif", color: T.heading }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        @media (max-width: 640px) {
          .photos-upload-grid { grid-template-columns: 1fr !important; }
          .photos-grid         { grid-template-columns: 1fr !important; }
          .photos-header       { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .photos-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0ms !important; animation: none !important; }
        }
      `}</style>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div
        className="photos-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: T.heading,
              marginBottom: 4,
            }}
          >
            Photos
          </h2>
          <p style={{ fontSize: 13, color: T.muted }}>
            Upload and manage your gallery
          </p>
        </div>
        {!loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 99,
              padding: "6px 14px",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke={T.accent}
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <rect x="1" y="3" width="14" height="10" rx="2" />
              <circle cx="8" cy="8" r="2.2" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 500, color: T.body }}>
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </span>
          </div>
        )}
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ height: 1, background: T.border, marginBottom: 28 }} />

      {/* ── Upload panel ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 18,
          padding: "28px 28px 24px",
          marginBottom: 32,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: T.accent,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Upload
          </p>
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: T.heading,
              letterSpacing: "-0.01em",
            }}
          >
            Add new photo
          </h3>
        </div>

        <div
          className="photos-upload-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Left: dropzone */}
          <div>
            <FieldLabel>Image file</FieldLabel>
            <DropzoneArea
              previewUrl={newPhoto.previewUrl}
              onChange={handleFileChange}
            />
          </div>

          {/* Right: metadata */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <FieldLabel>Photo title *</FieldLabel>
              <StyledInput
                value={newPhoto.title}
                placeholder="e.g. Golden Hour Ceremony"
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, title: e.target.value })
                }
              />
            </div>

            <div>
              <FieldLabel>Category *</FieldLabel>
              <StyledSelect
                value={newPhoto.category}
                onChange={(e) =>
                  setNewPhoto({ ...newPhoto, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option
                    key={c}
                    value={c}
                    style={{ background: T.surfaceDeep }}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </StyledSelect>
            </div>

            {/* Upload button */}
            <button
              onClick={handleUpload}
              disabled={!canUpload}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "12px 0",
                borderRadius: 10,
                border: "none",
                background: canUpload ? T.accent : T.surfaceHi,
                color: canUpload ? "#000" : T.muted,
                fontSize: 13,
                fontWeight: 600,
                cursor: canUpload ? "pointer" : "not-allowed",
                letterSpacing: "0.02em",
                transition:
                  "background 0.2s, color 0.2s, opacity 0.15s, transform 0.12s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                if (canUpload) {
                  e.currentTarget.style.opacity = "0.88";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "none";
              }}
            >
              {uploading ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ animation: "spin 0.9s linear infinite" }}
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Uploading…
                </>
              ) : (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload to gallery
                </>
              )}
            </button>

            {/* Helper hint */}
            {!newPhoto.file && (
              <p
                style={{
                  fontSize: 11,
                  color: T.muted,
                  textAlign: "center",
                  marginTop: -6,
                }}
              >
                Select an image, title, and category to enable upload
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Section label ─────────────────────────────────────────────────── */}
      {(photos.length > 0 || loading) && (
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: T.accent,
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            Gallery
          </p>
          <p style={{ fontSize: 13, color: T.muted }}>All uploaded photos</p>
        </div>
      )}

      {/* ── Photo grid ────────────────────────────────────────────────────── */}
      {loading ? (
        <div
          className="photos-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : photos.length > 0 ? (
        <div
          className="photos-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {photos.map((photo) => (
            <PhotoCard
              key={photo._id || photo.id}
              photo={photo}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminPhotos;
