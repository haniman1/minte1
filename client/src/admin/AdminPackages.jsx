import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import api from "../services/api";
import { usePackages } from "../context/PackageContext";

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const T = {
  bg:          "#0F0F11",
  surface:     "#17171A",
  surfaceHi:   "#1E1E22",
  surfaceDeep: "#0C0C0E",
  border:      "rgba(255,255,255,0.07)",
  borderHi:    "rgba(255,255,255,0.13)",
  muted:       "#52525C",
  body:        "#A1A1AA",
  heading:     "#F4F4F5",
  accent:      "#C9A84C",
  accentDim:   "rgba(201,168,76,0.13)",
  accentBdr:   "rgba(201,168,76,0.28)",
  red:         "#F87171",
  redDim:      "rgba(248,113,113,0.1)",
  redBdr:      "rgba(248,113,113,0.25)",
  green:       "#4ADE80",
  greenDim:    "rgba(74,222,128,0.1)",
};

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 10 }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: T.surfaceHi, border: `1px solid ${t.type === "error" ? T.redBdr : T.borderHi}`,
              borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)", minWidth: 260,
            }}>
            <span style={{ fontSize: 15 }}>{t.type === "error" ? "⚠️" : "✓"}</span>
            <span style={{ fontSize: 13, color: T.heading }}>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  };
  return { toasts, toast: add };
}

/* ─── Stat chip ──────────────────────────────────────────────────────────── */
function StatChip({ label, value, accent }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
      padding: "14px 20px", display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: 20, fontWeight: 700, color: accent || T.heading, letterSpacing: "-0.02em" }}>
        {value}
      </span>
      <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Field ──────────────────────────────────────────────────────────────── */
function Field({ label, error, children, span }) {
  return (
    <div style={{ gridColumn: span === 2 ? "1 / -1" : undefined, display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: T.body, letterSpacing: "0.04em" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 11, color: T.red }}>{error}</span>}
    </div>
  );
}

const inputStyle = (focused) => ({
  width: "100%", background: T.surfaceDeep,
  border: `1px solid ${focused ? T.accentBdr : T.border}`,
  borderRadius: 10, padding: "11px 14px",
  fontSize: 14, color: T.heading, outline: "none",
  transition: "border-color 0.18s, box-shadow 0.18s",
  boxShadow: focused ? `0 0 0 3px ${T.accentDim}` : "none",
  fontFamily: "inherit",
});

function Input({ value, onChange, placeholder, type = "text", span }) {
  const [focused, setFocused] = useState(false);
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} type={type}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={inputStyle(focused)} />
  );
}

function Textarea({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ ...inputStyle(focused), resize: "vertical", minHeight: 80 }} />
  );
}

/* ─── Modal form ─────────────────────────────────────────────────────────── */
function PackageForm({ editing, formData, setFormData, onSave, onClose, errors }) {
  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <motion.div
        key="panel"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: T.surface, border: `1px solid ${T.borderHi}`,
          borderRadius: 20, padding: "36px 36px 32px",
          width: "100%", maxWidth: 560,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          maxHeight: "90vh", overflowY: "auto",
        }}
      >
        {/* Modal header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: T.heading, letterSpacing: "-0.02em", marginBottom: 4 }}>
              {editing ? "Edit package" : "New package"}
            </h3>
            <p style={{ fontSize: 13, color: T.muted }}>
              {editing ? "Update this pricing plan." : "Add a new pricing plan to your portfolio."}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: T.surfaceHi, border: `1px solid ${T.border}`, borderRadius: 8,
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: T.muted, fontSize: 16, flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: T.border, marginBottom: 28 }} />

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Basic info */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              color: T.accent, fontWeight: 600, marginBottom: 16 }}>Basic info</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
              <Field label="Package name *" error={errors.name} span={2}>
                <Input value={formData.name} placeholder="e.g. Essential, Premium…"
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              </Field>
              <Field label="Description *" error={errors.description} span={2}>
                <Textarea value={formData.description} placeholder="What's included in this plan?"
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
              </Field>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              color: T.accent, fontWeight: 600, marginBottom: 16 }}>Pricing</p>
            <Field label="Price (USD) *" error={errors.price}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  fontSize: 14, color: T.muted, pointerEvents: "none" }}>$</span>
                <Input value={formData.price} placeholder="0" type="number"
                  onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} />
              </div>
            </Field>
          </div>

          {/* Features */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              color: T.accent, fontWeight: 600, marginBottom: 16 }}>Features</p>
            <Field label="Features" span={2}>
              <Textarea value={formData.features} placeholder="Comma-separated: 4-hour coverage, Online gallery, 200 edited photos"
                onChange={e => setFormData(p => ({ ...p, features: e.target.value }))} />
            </Field>
            <p style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>Separate each feature with a comma.</p>
          </div>

          {/* Settings */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              color: T.accent, fontWeight: 600, marginBottom: 16 }}>Settings</p>
            <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div
                onClick={() => setFormData(p => ({ ...p, popular: !p.popular }))}
                style={{
                  width: 40, height: 22, borderRadius: 99,
                  background: formData.popular ? T.accent : T.surfaceDeep,
                  border: `1px solid ${formData.popular ? T.accent : T.border}`,
                  position: "relative", transition: "background 0.2s",
                  cursor: "pointer", flexShrink: 0,
                }}>
                <div style={{
                  position: "absolute", top: 2,
                  left: formData.popular ? "calc(100% - 20px)" : 2,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#fff", transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }} />
              </div>
              <span style={{ fontSize: 13, color: T.body }}>Mark as most popular</span>
              {formData.popular && (
                <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: T.accent, background: T.accentDim, border: `1px solid ${T.accentBdr}`,
                  borderRadius: 99, padding: "2px 8px", fontWeight: 600 }}>Active</span>
              )}
            </label>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 32, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
          <button onClick={onSave} style={{
            flex: 1, padding: "11px 0", borderRadius: 10,
            background: T.accent, color: "#000", border: "none",
            fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em",
            transition: "opacity 0.15s, transform 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}>
            {editing ? "Save changes" : "Create package"}
          </button>
          <button onClick={onClose} style={{
            padding: "11px 20px", borderRadius: 10,
            background: "transparent", color: T.body, border: `1px solid ${T.border}`,
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            transition: "border-color 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Package card ───────────────────────────────────────────────────────── */
function PkgCard({ pkg, onEdit, onDelete }) {
  const id = pkg._id || pkg.id;
  const features = Array.isArray(pkg.features) ? pkg.features : [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      style={{
        background: T.surface,
        border: `1px solid ${pkg.popular ? T.accentBdr : T.border}`,
        borderRadius: 18, padding: "28px 28px 24px",
        display: "flex", flexDirection: "column", gap: 0,
        position: "relative", overflow: "hidden",
        boxShadow: pkg.popular ? `0 0 0 1px ${T.accentDim}, 0 8px 32px rgba(201,168,76,0.06)` : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
    >
      {/* Top glow for popular */}
      {pkg.popular && (
        <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)",
          width: 200, height: 80,
          background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)",
          pointerEvents: "none" }} />
      )}

      {/* Popular badge */}
      {pkg.popular && (
        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
            color: T.accent, background: T.accentDim, border: `1px solid ${T.accentBdr}`,
            borderRadius: 99, padding: "4px 12px",
          }}>Most popular</span>
        </div>
      )}

      {/* Name + price */}
      <h3 style={{ fontSize: 18, fontWeight: 700, color: T.heading,
        letterSpacing: "-0.02em", marginBottom: 8 }}>{pkg.name}</h3>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>$</span>
        <span style={{ fontSize: 34, fontWeight: 800, color: T.heading,
          letterSpacing: "-0.04em", lineHeight: 1 }}>
          {Number(pkg.price ?? 0).toLocaleString()}
        </span>
      </div>

      <p style={{ fontSize: 13, color: T.body, lineHeight: 1.65, marginBottom: 20 }}>
        {pkg.description}
      </p>

      {/* Feature list */}
      {features.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px",
          display: "flex", flexDirection: "column", gap: 9 }}>
          {features.map((f, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: T.body }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="8" cy="8" r="7.5" stroke={T.accentBdr}/>
                <path d="M5 8.5l2 2 4-4" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: T.border, marginBottom: 18, marginTop: "auto" }} />

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onEdit(pkg)} style={{
          flex: 1, padding: "9px 0", borderRadius: 9,
          background: T.surfaceHi, border: `1px solid ${T.border}`,
          color: T.body, fontSize: 12, fontWeight: 500, cursor: "pointer",
          transition: "border-color 0.15s, color 0.15s, transform 0.12s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.heading; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.body; e.currentTarget.style.transform = "none"; }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M11 2.5l2.5 2.5-8 8H3v-2.5l8-8z"/>
          </svg>
          Edit
        </button>
        <button onClick={() => onDelete(id)} style={{
          flex: 1, padding: "9px 0", borderRadius: 9,
          background: T.redDim, border: `1px solid ${T.redBdr}`,
          color: T.red, fontSize: 12, fontWeight: 500, cursor: "pointer",
          transition: "background 0.15s, transform 0.12s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.16)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.redDim; e.currentTarget.style.transform = "none"; }}>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9"/>
          </svg>
          Delete
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
function EmptyState({ onAdd }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ textAlign: "center", padding: "72px 24px",
        border: `1px dashed ${T.border}`, borderRadius: 18, background: T.surface }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: T.accentDim,
        border: `1px solid ${T.accentBdr}`, margin: "0 auto 20px",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📦</div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: T.heading, marginBottom: 8, letterSpacing: "-0.01em" }}>
        No packages yet
      </h3>
      <p style={{ fontSize: 13, color: T.muted, maxWidth: 280, margin: "0 auto 24px", lineHeight: 1.6 }}>
        Create your first pricing plan to start attracting clients.
      </p>
      <button onClick={onAdd} style={{
        padding: "10px 22px", borderRadius: 10,
        background: T.accent, color: "#000", border: "none",
        fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em",
        transition: "opacity 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
        Add package
      </button>
    </motion.div>
  );
}

/* ─── Confirm dialog ─────────────────────────────────────────────────────── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: T.surface, border: `1px solid ${T.redBdr}`,
          borderRadius: 16, padding: "28px 28px 24px", maxWidth: 360, width: "100%",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: T.redDim,
          border: `1px solid ${T.redBdr}`, display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: 16, fontSize: 18 }}>🗑</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.heading, marginBottom: 8 }}>Delete package</h3>
        <p style={{ fontSize: 13, color: T.body, lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "10px 0", borderRadius: 9, background: T.red,
            color: "#000", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Delete</button>
          <button onClick={onCancel} style={{
            flex: 1, padding: "10px 0", borderRadius: 9, background: "transparent",
            color: T.body, border: `1px solid ${T.border}`, fontSize: 13, cursor: "pointer",
          }}>Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
const AdminPackages = () => {
  const { packages, setPackages } = usePackages();
  const [isAdding, setIsAdding]           = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [confirmId, setConfirmId]         = useState(null);
  const [errors, setErrors]               = useState({});
  const { toasts, toast }                 = useToast();

  const [formData, setFormData] = useState({
    name: "", price: "", description: "", features: "", popular: false,
  });

  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", features: "", popular: false });
    setErrors({});
  };

  const openAddForm = () => { resetForm(); setEditingPackage(null); setIsAdding(true); };

  const openEditForm = (pkg) => {
    setFormData({
      name: pkg.name, price: pkg.price.toString(),
      description: pkg.description,
      features: pkg.features ? pkg.features.join(", ") : "",
      popular: pkg.popular || false,
    });
    setErrors({});
    setEditingPackage(pkg);
    setIsAdding(true);
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())        e.name        = "Name is required";
    if (!formData.price)              e.price       = "Price is required";
    if (isNaN(Number(formData.price))) e.price      = "Must be a number";
    if (!formData.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const featuresArray = formData.features
      ? formData.features.split(",").map(f => f.trim()).filter(Boolean)
      : [];

    const packageData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      features: featuresArray,
      popular: formData.popular,
    };

    try {
      if (editingPackage) {
        const id = editingPackage._id || editingPackage.id;
        const res = await api.put(`/packages/${id}`, packageData);
        setPackages(prev => prev.map(pkg => ((pkg._id || pkg.id) === id ? res.data : pkg)));
        toast("Package updated successfully");
      } else {
        const res = await api.post("/packages", packageData);
        setPackages(prev => [...prev, res.data]);
        toast("Package created");
      }
      setIsAdding(false);
      setEditingPackage(null);
    } catch (error) {
      console.error(error);
      toast(error.response?.data?.message || "Failed to save package", "error");
    }
  };

  const handleDelete = async (id) => {
    setConfirmId(id);
  };

  const confirmDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      await api.delete(`/packages/${id}`);
      setPackages(prev => prev.filter(pkg => (pkg._id || pkg.id) !== id));
      toast("Package deleted");
    } catch {
      toast("Failed to delete package", "error");
    }
  };

  const popularCount  = packages.filter(p => p.popular).length;
  const maxPrice      = packages.length ? Math.max(...packages.map(p => Number(p.price ?? 0))) : 0;

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: T.heading }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 640px) {
          .pkg-grid { grid-template-columns: 1fr !important; }
          .pkg-stats { flex-direction: column !important; gap: 8px !important; }
          .pkg-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0ms !important; }
        }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="pkg-header" style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em",
            color: T.heading, marginBottom: 4 }}>Packages</h2>
          <p style={{ fontSize: 13, color: T.muted }}>Manage pricing plans and offerings</p>
        </div>
        <button onClick={openAddForm} style={{
          padding: "9px 18px", borderRadius: 10,
          background: T.accent, color: "#000", border: "none",
          fontSize: 13, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em",
          display: "flex", alignItems: "center", gap: 7,
          transition: "opacity 0.15s, transform 0.15s", flexShrink: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "none"; }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Add package
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      {packages.length > 0 && (
        <div className="pkg-stats" style={{ display: "flex", gap: 10, marginBottom: 28 }}>
          <StatChip label="Total plans" value={packages.length} />
          <StatChip label="Most popular active" value={popularCount} accent={popularCount > 0 ? T.accent : undefined} />
          <StatChip label="Top price" value={maxPrice > 0 ? `$${maxPrice.toLocaleString()}` : "—"} />
        </div>
      )}

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div style={{ height: 1, background: T.border, marginBottom: 24 }} />

      {/* ── Card grid ────────────────────────────────────────────────────── */}
      {packages.length > 0 ? (
        <motion.div layout className="pkg-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16,
        }}>
          <AnimatePresence mode="popLayout">
            {packages.map((pkg, i) => {
              const id = pkg._id || pkg.id;
              return (
                <PkgCard
                  key={id ?? `${pkg.name}-${i}`}
                  pkg={pkg}
                  onEdit={openEditForm}
                  onDelete={handleDelete}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState onAdd={openAddForm} />
      )}

      {/* ── Modal form ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isAdding && (
          <PackageForm
            editing={editingPackage}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onClose={() => { setIsAdding(false); setEditingPackage(null); }}
            errors={errors}
          />
        )}
      </AnimatePresence>

      {/* ── Confirm dialog ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmId && (
          <ConfirmDialog
            message="This will permanently remove the package. This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => setConfirmId(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Toasts ───────────────────────────────────────────────────────── */}
      <Toast toasts={toasts} />
    </div>
  );
};

export default AdminPackages;