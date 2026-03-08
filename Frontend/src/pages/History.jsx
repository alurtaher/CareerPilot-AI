import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { interviewApi } from "../api/client";
import Navbar from "../components/Navbar";

function ScoreBadge({ score }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#e91e8c";
  return (
    <span style={{
      fontSize: 13, fontWeight: 700, color, padding: "3px 10px",
      background: `${color}18`, borderRadius: 20, border: `1px solid ${color}30`,
    }}>
      {score}% Match
    </span>
  );
}

export default function History() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    interviewApi.getAll()
      .then(d => setReports(d.interviewReports || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c" }}>
      <Navbar />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 32, color: "#fff", margin: "0 0 6px" }}>
              Interview History
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: 0 }}>
              All your generated interview strategies
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "12px 22px", borderRadius: 10,
              background: "linear-gradient(135deg,#e91e8c,#c2185b)",
              border: "none", color: "#fff", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "Syne,sans-serif",
              boxShadow: "0 4px 20px rgba(233,30,140,0.35)",
            }}
          >
            ✦ New Plan
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <div className="spinner" />
          </div>
        ) : error ? (
          <div style={{
            background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)",
            borderRadius: 12, padding: 24, color: "#f06292", textAlign: "center",
          }}>{error}</div>
        ) : reports.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "#111114", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <h3 style={{ fontFamily: "Syne,sans-serif", color: "#fff", fontWeight: 700, fontSize: 20, margin: "0 0 10px" }}>
              No plans yet
            </h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, margin: "0 0 24px" }}>
              Generate your first interview strategy to get started
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "12px 24px", borderRadius: 10,
                background: "linear-gradient(135deg,#e91e8c,#c2185b)",
                border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "Syne,sans-serif",
              }}
            >
              Create Your First Plan
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16, color: "rgba(255,255,255,0.35)", fontSize: 14 }}>
              {reports.length} plan{reports.length !== 1 ? "s" : ""} generated
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {reports.map((report, i) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/report/${report._id}`)}
                  style={{
                    background: "#111114", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14, padding: "20px 24px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 16, flexWrap: "wrap",
                    animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                  className="report-card"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: "linear-gradient(135deg,rgba(233,30,140,0.2),rgba(194,24,91,0.2))",
                      border: "1px solid rgba(233,30,140,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20,
                    }}>
                      💼
                    </div>
                    <div>
                      <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: 16, color: "#fff", marginBottom: 4 }}>
                        {report.jobTitle || "Interview Plan"}
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                        {new Date(report.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })} · {new Date(report.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {report.matchScore !== undefined && <ScoreBadge score={report.matchScore} />}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
