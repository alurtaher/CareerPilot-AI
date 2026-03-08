import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0a0a0c", padding: "24px", position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        width: "100%", maxWidth: 440, animation: "fadeUp 0.4s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg,#e91e8c,#c2185b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: "0 0 32px rgba(233,30,140,0.35)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 28, color: "#fff", margin: 0 }}>
            Welcome back
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 8 }}>
            Sign in to your CareerPilot-AI account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#111114", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 18, padding: 32,
        }}>
          {error && (
            <div style={{
              background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)",
              borderRadius: 10, padding: "12px 16px", marginBottom: 20,
              color: "#f06292", fontSize: 14,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                Email address
              </label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} required
                placeholder="you@example.com"
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.18s",
                  fontFamily: "DM Sans,sans-serif",
                }}
                className="cp-input"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                Password
              </label>
              <input
                name="password" type="password" value={form.password}
                onChange={handleChange} required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
                  fontFamily: "DM Sans,sans-serif",
                }}
                className="cp-input"
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: 4, padding: "13px 24px", borderRadius: 10,
                background: loading ? "rgba(233,30,140,0.5)" : "linear-gradient(135deg,#e91e8c,#c2185b)",
                border: "none", color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Syne,sans-serif", letterSpacing: "0.3px",
                boxShadow: loading ? "none" : "0 4px 20px rgba(233,30,140,0.35)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#e91e8c", textDecoration: "none", fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
