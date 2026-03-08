import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RocketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

const navLinks = [
  { label: "Planner", to: "/dashboard" },
  { label: "History", to: "/history" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??";

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,10,12,0.88)",
      backdropFilter: "blur(18px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{
        maxWidth: 1180, margin: "0 auto", padding: "0 24px",
        height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 24,
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#e91e8c,#c2185b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", boxShadow: "0 0 20px rgba(233,30,140,0.3)",
          }}>
            <RocketIcon />
          </div>
          <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "-0.3px" }}>
            Career<span style={{ color: "#e91e8c" }}>Pilot-AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }} className="desktop-links">
          {navLinks.map(({ label, to }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                padding: "8px 16px", borderRadius: 8, textDecoration: "none",
                fontSize: 14, fontWeight: active ? 500 : 400,
                color: active ? "#e91e8c" : "rgba(255,255,255,0.55)",
                background: active ? "rgba(233,30,140,0.1)" : "transparent",
                transition: "all 0.18s",
              }}>{label}</Link>
            );
          })}
        </div>

        {/* Right: user dropdown */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "6px 12px 6px 6px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              cursor: "pointer", color: "#fff", transition: "all 0.18s",
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg,#e91e8c,#9c27b0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 13,
            }}>{initials}</div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)" }} className="uname">
              {user?.username}
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              width: 220, background: "#141417",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
              padding: 8, boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
              animation: "dropIn 0.15s ease",
            }}>
              <div style={{ padding: "10px 12px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 6 }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>{user?.username}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{user?.email}</div>
              </div>
              <Link to="/history" onClick={() => setDropdownOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                  fontSize: 14, color: "rgba(255,255,255,0.65)", textDecoration: "none",
                  transition: "background 0.15s" }}
                className="dd-item">
                📋 Interview History
              </Link>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0" }} />
              <button onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8,
                  fontSize: 14, color: "#e91e8c", border: "none", background: "none",
                  cursor: "pointer", width: "100%", textAlign: "left",
                  fontFamily: "DM Sans,sans-serif", transition: "background 0.15s" }}
                className="dd-item-logout">
                🚪 Log Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{
            display: "none", background: "none", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: 8, color: "rgba(255,255,255,0.7)", cursor: "pointer",
          }}
          className="hamburger"
        >
          {mobileOpen
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 4 }}>
          {navLinks.map(({ label, to }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              style={{ padding: "11px 14px", borderRadius: 10, textDecoration: "none",
                fontSize: 15, color: location.pathname === to ? "#e91e8c" : "rgba(255,255,255,0.6)",
                background: location.pathname === to ? "rgba(233,30,140,0.1)" : "transparent" }}>
              {label}
            </Link>
          ))}
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
              borderRadius: 10, border: "none", background: "none", fontSize: 15,
              color: "#e91e8c", cursor: "pointer", fontFamily: "DM Sans,sans-serif", textAlign: "left" }}>
            🚪 Log Out
          </button>
        </div>
      )}
    </nav>
  );
}