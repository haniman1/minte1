import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { usePackages } from "../context/PackageContext";

/* ─── Tokens ─────────────────────────────────────────────────────────────── */
const T = {
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
  redDim: "rgba(248,113,113,0.1)",
  redBdr: "rgba(248,113,113,0.25)",
};
const EASE = [0.22, 1, 0.36, 1];
const sectionLabel = {
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: T.accent,
  fontWeight: 600,
  marginBottom: 16,
};
const EMPTY_FORM = {
  name: "",
  price: "",
  description: "",
  features: "",
  popular: false,
};

/* ─── Toasts ─────────────────────────────────────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: EASE }}
            style={{
              background: T.surfaceHi,
              border: `1px solid ${t.type === "error" ? T.redBdr : T.borderHi}`,
              borderRadius: 12,
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              minWidth: 260,
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 15 }}>
              {t.type === "error" ? "⚠️" : "✓"}
            </span>
            <span style={{ fontSize: 13, color: T.heading }}>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);
  const toast = (message, type = "success") => {
    const id = ++counter.current; // unique even when two toasts fire in the same millisecond
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
  };
  return { toasts, toast };
}

/* ─── Small pieces ───────────────────────────────────────────────────────── */
function StatChip({ label, value, accent }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "14px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: accent || T.heading,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 11,
          color: T.muted,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Field({ id, label, error, children, full }) {
  return (
    <div
      style={{
        gridColumn: full ? "1 / -1" : undefined,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <label
        htmlFor={id}
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: T.body,
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span role="alert" style={{ fontSize: 11, color: T.red }}>
          {error}
        </span>
      )}
    </div>
  );
}

const inputStyle = (focused) => ({
  width: "100%",
  background: T.surfaceDeep,
  border: `1px solid ${focused ? T.accentBdr : T.border}`,
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 14,
  color: T.heading,
  outline: "none",
  transition: "border-color 0.18s, box-shadow 0.18s",
  boxShadow: focused ? `0 0 0 3px ${T.accentDim}` : "none",
  fontFamily: "inherit",
});

function Input({ extraStyle, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle(focused), ...extraStyle }}
    />
  );
}

function Textarea(props) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      rows={3}
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle(focused), resize: "vertical", minHeight: 80 }}
    />
  );
}

/* Close a dialog with the Escape key */
function useEscape(onClose) {
  const ref = useRef(onClose);
  ref.current = onClose;
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && ref.current();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
}

/* ─── Modal form ─────────────────────────────────────────────────────────── */
function PackageForm({
  editing,
  formData,
  setFormData,
  onSave,
  onClose,
  errors,
}) {
  useEscape(onClose);
  const set = (key) => (e) =>
    setFormData((p) => ({ ...p, [key]: e.target.value }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={editing ? "Edit package" : "New package"}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.24, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.surface,
          border: `1px solid ${T.borderHi}`,
          borderRadius: 20,
          padding: "36px 36px 32px",
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: T.heading,
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              {editing ? "Edit package" : "New package"}
            </h3>
            <p style={{ fontSize: 13, color: T.muted }}>
              {editing
                ? "Update this pricing plan."
                : "Add a new pricing plan to your portfolio."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: T.surfaceHi,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.muted,
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ height: 1, background: T.border, marginBottom: 28 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <p style={sectionLabel}>Basic info</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px 16px",
              }}
            >
              <Field
                id="pkg-name"
                label="Package name *"
                error={errors.name}
                full
              >
                <Input
                  id="pkg-name"
                  value={formData.name}
                  placeholder="e.g. Essential, Premium…"
                  onChange={set("name")}
                />
              </Field>
              <Field
                id="pkg-desc"
                label="Description *"
                error={errors.description}
                full
              >
                <Textarea
                  id="pkg-desc"
                  value={formData.description}
                  placeholder="What's included in this plan?"
                  onChange={set("description")}
                />
              </Field>
            </div>
          </div>

          <div>
            <p style={sectionLabel}>Pricing</p>
            <Field id="pkg-price" label="Price (USD) *" error={errors.price}>
              <div style={{ position: "relative" }}>
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 14,
                    color: T.muted,
                    pointerEvents: "none",
                  }}
                >
                  $
                </span>
                <Input
                  id="pkg-price"
                  type="number"
                  min="0"
                  value={formData.price}
                  placeholder="0"
                  onChange={set("price")}
                  extraStyle={{ paddingLeft: 30 }}
                />
              </div>
            </Field>
          </div>

          <div>
            <p style={sectionLabel}>Features</p>
            <Field id="pkg-features" label="Features" full>
              <Textarea
                id="pkg-features"
                value={formData.features}
                placeholder="Comma-separated: 4-hour coverage, Online gallery, 200 edited photos"
                onChange={set("features")}
              />
            </Field>
            <p style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>
              Separate each feature with a comma.
            </p>
          </div>

          <div>
            <p style={sectionLabel}>Settings</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                role="switch"
                aria-checked={formData.popular}
                aria-label="Mark as most popular"
                onClick={() =>
                  setFormData((p) => ({ ...p, popular: !p.popular }))
                }
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 99,
                  padding: 0,
                  flexShrink: 0,
                  cursor: "pointer",
                  position: "relative",
                  background: formData.popular ? T.accent : T.surfaceDeep,
                  border: `1px solid ${formData.popular ? T.accent : T.border}`,
                  transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: formData.popular ? 20 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                />
              </button>
              <span style={{ fontSize: 13, color: T.body }}>
                Mark as most popular
              </span>
              {formData.popular && (
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: T.accent,
                    background: T.accentDim,
                    border: `1px solid ${T.accentBdr}`,
                    borderRadius: 99,
                    padding: "2px 8px",
                    fontWeight: 600,
                  }}
                >
                  Active
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 32,
            paddingTop: 24,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <button
            onClick={onSave}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 10,
              background: T.accent,
              color: "#000",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "opacity 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "none";
            }}
          >
            {editing ? "Save changes" : "Create package"}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "11px 20px",
              borderRadius: 10,
              background: "transparent",
              color: T.body,
              border: `1px solid ${T.border}`,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = T.borderHi)
            }
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
          >
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
  const actionBase = {
    flex: 1,
    padding: "9px 0",
    borderRadius: 9,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    transition:
      "border-color 0.15s, color 0.15s, background 0.15s, transform 0.12s",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22, ease: EASE }}
      whileHover={{ y: -3 }}
      style={{
        background: T.surface,
        border: `1px solid ${pkg.popular ? T.accentBdr : T.border}`,
        borderRadius: 18,
        padding: "28px 28px 24px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        boxShadow: pkg.popular
          ? `0 0 0 1px ${T.accentDim}, 0 8px 32px rgba(201,168,76,0.06)`
          : "none",
      }}
    >
      {pkg.popular && (
        <>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: -30,
              left: "50%",
              transform: "translateX(-50%)",
              width: 200,
              height: 80,
              background:
                "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: T.accent,
                background: T.accentDim,
                border: `1px solid ${T.accentBdr}`,
                borderRadius: 99,
                padding: "4px 12px",
              }}
            >
              Most popular
            </span>
          </div>
        </>
      )}

      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: T.heading,
          letterSpacing: "-0.02em",
          marginBottom: 8,
        }}
      >
        {pkg.name}
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 4,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, color: T.muted, marginTop: 2 }}>$</span>
        <span
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: T.heading,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {Number(pkg.price ?? 0).toLocaleString()}
        </span>
      </div>

      <p
        style={{
          fontSize: 13,
          color: T.body,
          lineHeight: 1.65,
          marginBottom: 20,
        }}
      >
        {pkg.description}
      </p>

      {features.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 24px",
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          {features.map((f, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 13,
                color: T.body,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <circle cx="8" cy="8" r="7.5" stroke={T.accentBdr} />
                <path
                  d="M5 8.5l2 2 4-4"
                  stroke={T.accent}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      <div
        style={{
          height: 1,
          background: T.border,
          marginBottom: 18,
          marginTop: "auto",
        }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onEdit(pkg)}
          style={{
            ...actionBase,
            background: T.surfaceHi,
            border: `1px solid ${T.border}`,
            color: T.body,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = T.borderHi;
            e.currentTarget.style.color = T.heading;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = T.border;
            e.currentTarget.style.color = T.body;
            e.currentTarget.style.transform = "none";
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(id)}
          style={{
            ...actionBase,
            background: T.redDim,
            border: `1px solid ${T.redBdr}`,
            color: T.red,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.16)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = T.redDim;
            e.currentTarget.style.transform = "none";
          }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        textAlign: "center",
        padding: "72px 24px",
        border: `1px dashed ${T.border}`,
        borderRadius: 18,
        background: T.surface,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: T.accentDim,
          border: `1px solid ${T.accentBdr}`,
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        📦
      </div>
      <h3
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: T.heading,
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}
      >
        No packages yet
      </h3>
      <p
        style={{
          fontSize: 13,
          color: T.muted,
          maxWidth: 280,
          margin: "0 auto 24px",
          lineHeight: 1.6,
        }}
      >
        Create your first pricing plan to start attracting clients.
      </p>
      <button
        onClick={onAdd}
        style={{
          padding: "10px 22px",
          borderRadius: 10,
          background: T.accent,
          color: "#000",
          border: "none",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.02em",
        }}
      >
        Add package
      </button>
    </motion.div>
  );
}

/* ─── Confirm dialog ─────────────────────────────────────────────────────── */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  useEscape(onCancel);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-label="Delete package"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.18, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.surface,
          border: `1px solid ${T.redBdr}`,
          borderRadius: 16,
          padding: "28px 28px 24px",
          maxWidth: 360,
          width: "100%",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: T.redDim,
            border: `1px solid ${T.redBdr}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            fontSize: 18,
          }}
        >
          🗑
        </div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: T.heading,
            marginBottom: 8,
          }}
        >
          Delete package
        </h3>
        <p
          style={{
            fontSize: 13,
            color: T.body,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 9,
              background: T.red,
              color: "#000",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 9,
              background: "transparent",
              color: T.body,
              border: `1px solid ${T.border}`,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
const AdminPackages = () => {
  const { packages, setPackages } = usePackages();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(EMPTY_FORM);
  const { toasts, toast } = useToast();

  const closeForm = () => {
    setIsAdding(false);
    setEditingPackage(null);
  };

  const openAddForm = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditingPackage(null);
    setIsAdding(true);
  };

  const openEditForm = (pkg) => {
    setFormData({
      name: pkg.name ?? "",
      price: String(pkg.price ?? ""),
      description: pkg.description ?? "",
      features: Array.isArray(pkg.features) ? pkg.features.join(", ") : "",
      popular: !!pkg.popular,
    });
    setErrors({});
    setEditingPackage(pkg);
    setIsAdding(true);
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (formData.price === "") e.price = "Price is required";
    else if (isNaN(Number(formData.price)) || Number(formData.price) < 0)
      e.price = "Enter a valid price";
    if (!formData.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const packageData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      features: formData.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      popular: formData.popular,
    };

    try {
      if (editingPackage) {
        const id = editingPackage._id || editingPackage.id;
        const res = await api.put(`/packages/${id}`, packageData);
        setPackages((prev) =>
          prev.map((pkg) => ((pkg._id || pkg.id) === id ? res.data : pkg)),
        );
        toast("Package updated successfully");
      } else {
        const res = await api.post("/packages", packageData);
        setPackages((prev) => [...prev, res.data]);
        toast("Package created");
      }
      closeForm();
    } catch (error) {
      console.error(error);
      toast(error.response?.data?.message || "Failed to save package", "error");
    }
  };

  const confirmDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      await api.delete(`/packages/${id}`);
      setPackages((prev) => prev.filter((pkg) => (pkg._id || pkg.id) !== id));
      toast("Package deleted");
    } catch {
      toast("Failed to delete package", "error");
    }
  };

  const popularCount = packages.filter((p) => p.popular).length;
  const maxPrice = packages.length
    ? Math.max(...packages.map((p) => Number(p.price ?? 0)))
    : 0;

  return (
    <div
      className="admin-packages"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", color: T.heading }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @media (max-width: 640px) {
          .pkg-grid   { grid-template-columns: 1fr !important; }
          .pkg-stats  { flex-direction: column !important; gap: 8px !important; }
          .pkg-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-packages * { transition-duration: 0ms !important; }
        }
      `}</style>

      <div
        className="pkg-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
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
            Packages
          </h2>
          <p style={{ fontSize: 13, color: T.muted }}>
            Manage pricing plans and offerings
          </p>
        </div>
        <button
          onClick={openAddForm}
          style={{
            padding: "9px 18px",
            borderRadius: 10,
            background: T.accent,
            color: "#000",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
            gap: 7,
            transition: "opacity 0.15s, transform 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "none";
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          Add package
        </button>
      </div>

      {packages.length > 0 && (
        <div
          className="pkg-stats"
          style={{ display: "flex", gap: 10, marginBottom: 28 }}
        >
          <StatChip label="Total plans" value={packages.length} />
          <StatChip
            label="Most popular active"
            value={popularCount}
            accent={popularCount > 0 ? T.accent : undefined}
          />
          <StatChip
            label="Top price"
            value={maxPrice > 0 ? `$${maxPrice.toLocaleString()}` : "—"}
          />
        </div>
      )}

      <div style={{ height: 1, background: T.border, marginBottom: 24 }} />

      {packages.length > 0 ? (
        <motion.div
          layout
          className="pkg-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          <AnimatePresence>
            {packages.map((pkg, i) => (
              <PkgCard
                key={pkg._id || pkg.id || `${pkg.name}-${i}`}
                pkg={pkg}
                onEdit={openEditForm}
                onDelete={setConfirmId}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState onAdd={openAddForm} />
      )}

      <AnimatePresence>
        {isAdding && (
          <PackageForm
            editing={editingPackage}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onClose={closeForm}
            errors={errors}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmId && (
          <ConfirmDialog
            message="This will permanently remove the package. This action cannot be undone."
            onConfirm={confirmDelete}
            onCancel={() => setConfirmId(null)}
          />
        )}
      </AnimatePresence>

      <Toast toasts={toasts} />
    </div>
  );
};

export default AdminPackages;
