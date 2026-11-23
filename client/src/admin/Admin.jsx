import { useState, useEffect, useRef } from "react";
import AdminPhotos from "./AdminPhotos";
import AdminPackages from "./AdminPackages";
import { usePackages } from "../context/PackageContext";

/* ─── Tokens ─────────────────────────────────────────────────────────────── */
const T = {
  bg: "#0F0F11",
  surface: "#17171A",
  surfaceHi: "#1E1E22",
  border: "rgba(255,255,255,0.07)",
  borderHi: "rgba(255,255,255,0.12)",
  muted: "#52525C",
  subtle: "#3A3A44",
  body: "#A1A1AA",
  heading: "#F4F4F5",
  accent: "#C9A84C",
  accentDim: "rgba(201,168,76,0.12)",
  onlineGreen: "#22C55E",
};

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flex: 1,
        minWidth: 0,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.borderHi)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
    >
      <div
        aria-hidden="true"
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: T.accentDim,
          border: "1px solid rgba(201,168,76,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: T.heading,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontSize: 12,
            color: T.muted,
            marginTop: 4,
            letterSpacing: "0.02em",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

/* ─── Tab bar with sliding pill ──────────────────────────────────────────── */
const ICONS = {
  photos: (
    <>
      <rect x="1" y="3" width="14" height="10" rx="2" />
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="12.5" cy="5.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  packages: (
    <>
      <path d="M2 5l6-3 6 3v6l-6 3-6-3V5z" />
      <path d="M8 2v13M2 5l6 3 6-3" />
    </>
  ),
};

function TabBar({ tabs, activeTab, onSelect }) {
  const activeIdx = tabs.findIndex((t) => t.id === activeTab);
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 4,
        position: "relative",
        gap: 2,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 4,
          left: `calc(4px + ${activeIdx} * (100% - 8px) / ${tabs.length})`,
          width: `calc((100% - 8px) / ${tabs.length})`,
          height: "calc(100% - 8px)",
          background: T.surfaceHi,
          border: `1px solid ${T.borderHi}`,
          borderRadius: 8,
          transition: "left 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          zIndex: 0,
        }}
      />
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(tab.id)}
            style={{
              position: "relative",
              zIndex: 1,
              padding: "8px 22px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? T.heading : T.muted,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.01em",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = T.body;
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.color = T.muted;
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
              style={{ marginRight: 7, verticalAlign: "-2px" }}
            >
              {ICONS[tab.id]}
            </svg>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
const Admin = () => {
  const { packages } = usePackages();
  const [activeTab, setActiveTab] = useState("photos");
  const [visible, setVisible] = useState(true);
  const [timestamp, setTimestamp] = useState("");
  const [photoCount, setPhotoCount] = useState(null); // reported by AdminPhotos
  const timer = useRef(null);

  const handleLogout = () => {
    if (!window.confirm("Log out of the admin dashboard?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    sessionStorage.clear();
    window.location.replace("/login");
  };

  const switchTab = (id) => {
    if (id === activeTab) return;
    setVisible(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setActiveTab(id);
      setVisible(true);
    }, 140);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    setTimestamp(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date()),
    );
  }, []);

  const tabs = [
    { id: "photos", label: "Photos" },
    { id: "packages", label: "Packages" },
  ];
  const popularCount = packages.filter((p) => p.popular).length;

  return (
    <div
      className="admin-root"
      style={{
        minHeight: "100vh",
        backgroundColor: T.bg,
        color: T.heading,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Scoped to .admin-root so it can never affect the sidebar or other pages */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @media (max-width: 640px) {
          .admin-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .admin-stats  { flex-direction: column !important; }
          .admin-tab-row { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        }
        @media (prefers-reduced-motion: reduce) {
          .admin-root * { transition-duration: 0ms !important; animation: none !important; }
        }
      `}</style>

      <div
        style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}
      >
        {/* Header */}
        <div
          className="admin-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 99,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 500,
                color: T.body,
                letterSpacing: "0.02em",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = T.heading;
                e.currentTarget.style.borderColor = T.borderHi;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = T.body;
                e.currentTarget.style.borderColor = T.border;
              }}
            >
              Log out
            </button>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: T.accent,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              Studio Control
            </p>
            <h1
              style={{
                fontSize: "clamp(22px, 3.5vw, 30px)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: T.heading,
                lineHeight: 1.2,
              }}
            >
              Admin Dashboard
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {timestamp && (
              <span
                style={{
                  fontSize: 11,
                  color: T.muted,
                  letterSpacing: "0.04em",
                }}
              >
                Opened {timestamp}
              </span>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 99,
                padding: "6px 14px 6px 10px",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: T.onlineGreen,
                  boxShadow: "0 0 6px rgba(34,197,94,0.5)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: T.body,
                  letterSpacing: "0.02em",
                }}
              >
                Admin · Online
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: T.border, marginBottom: 32 }} />

        {/* Stats — real numbers, not hard-coded */}
        <div
          className="admin-stats"
          style={{ display: "flex", gap: 12, marginBottom: 32 }}
        >
          <StatCard icon="🖼" label="Total Photos" value={photoCount ?? "—"} />
          <StatCard icon="📦" label="Active Packages" value={packages.length} />
          <StatCard icon="⭐" label="Popular Packages" value={popularCount} />
        </div>

        <div className="admin-tab-row" style={{ marginBottom: 20 }}>
          <TabBar tabs={tabs} activeTab={activeTab} onSelect={switchTab} />
        </div>

        <div
          role="tabpanel"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: "clamp(20px, 3vw, 36px)",
            boxShadow:
              "0 2px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.18s ease, transform 0.18s ease",
          }}
        >
          {activeTab === "photos" && (
            <AdminPhotos onCountChange={setPhotoCount} />
          )}
          {activeTab === "packages" && <AdminPackages />}
        </div>
      </div>
    </div>
  );
};

export default Admin;
