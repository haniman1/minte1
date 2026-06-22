import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── Design tokens (matches Admin / AdminPackages / AdminPhotos) ─────────── */
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

/* ─── Focused input hook ─────────────────────────────────────────────────── */
function useInputStyle(hasError) {
  const [focused, setFocused] = useState(false);
  return {
    style: {
      width: "100%",
      background: T.surfaceDeep,
      border: `1px solid ${hasError ? T.redBdr : focused ? T.accentBdr : T.border}`,
      borderRadius: 10,
      padding: "12px 14px",
      fontSize: 14,
      color: T.heading,
      outline: "none",
      transition: "border-color 0.18s, box-shadow 0.18s",
      boxShadow: focused
        ? `0 0 0 3px ${hasError ? T.redDim : T.accentDim}`
        : "none",
      fontFamily: "inherit",
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const emailInput = useInputStyle(!!error);
  const pwInput = useInputStyle(!!error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.message || "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0ms !important; animation: none !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Background glows ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 560,
            height: 320,
            background:
              "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "15%",
            width: 300,
            height: 300,
            background:
              "radial-gradient(ellipse, rgba(120,100,200,0.04) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
        }}
      >
        {/* Icon + heading */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: T.accentDim,
              border: `1px solid ${T.accentBdr}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 22,
            }}
          >
            📸
          </div>

          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: T.heading,
              letterSpacing: "-0.03em",
              marginBottom: 8,
            }}
          >
            Admin access
          </h1>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.5 }}>
            Sign in to your photography dashboard
          </p>
        </div>

        {/* Form panel */}
        <div
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 20,
            padding: "32px 32px 28px",
            boxShadow:
              "0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Email */}
              <div>
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
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourphoto.com"
                  required
                  autoComplete="email"
                  style={emailInput.style}
                  onFocus={emailInput.onFocus}
                  onBlur={emailInput.onBlur}
                />
              </div>

              {/* Password */}
              <div>
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
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    style={{ ...pwInput.style, paddingRight: 44 }}
                    onFocus={pwInput.onFocus}
                    onBlur={pwInput.onBlur}
                  />
                  {/* Show/hide toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: T.muted,
                      padding: 4,
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = T.body;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = T.muted;
                    }}
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    background: T.redDim,
                    border: `1px solid ${T.redBdr}`,
                    borderRadius: 9,
                    padding: "10px 14px",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke={T.red}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    style={{ flexShrink: 0 }}
                  >
                    <circle cx="8" cy="8" r="7" />
                    <line x1="8" y1="5" x2="8" y2="8.5" />
                    <circle cx="8" cy="11" r="0.5" fill={T.red} />
                  </svg>
                  <span style={{ fontSize: 13, color: T.red }}>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  marginTop: 4,
                  borderRadius: 10,
                  border: "none",
                  background: loading ? T.surfaceHi : T.accent,
                  color: loading ? T.muted : "#000",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.02em",
                  transition:
                    "background 0.2s, color 0.2s, opacity 0.15s, transform 0.12s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.opacity = "0.88";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "none";
                }}
              >
                {loading ? (
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
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {/* Demo credentials */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: `1px solid ${T.border}`,
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: T.muted,
                marginBottom: 6,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Demo credentials
            </p>
            <code
              style={{
                fontSize: 12,
                color: T.body,
                background: T.surfaceDeep,
                border: `1px solid ${T.border}`,
                borderRadius: 7,
                padding: "6px 12px",
                display: "inline-block",
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                letterSpacing: "0.04em",
              }}
            >
              admin@photo.com · admin123
            </code>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link
            to="/"
            style={{
              fontSize: 13,
              color: T.muted,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.body;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.muted;
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M10 3L5 8l5 5" />
            </svg>
            Back to website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
