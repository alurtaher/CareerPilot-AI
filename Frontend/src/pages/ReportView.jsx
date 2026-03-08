import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { interviewApi } from "../api/client";
import Navbar from "../components/Navbar";

// ─── Section Card ─────────────────────────────────────────────────────────────
function Section({ icon, title, children, accent = false }) {
  return (
    <div style={{
      background: "#111114", border: `1px solid ${accent ? "rgba(233,30,140,0.2)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", margin: 0 }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function QuestionList({ items = [] }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => {
        const q = typeof item === "string" ? item : item.question || item;
        const a = typeof item === "object" ? (item.answer || item.tip || item.guidance) : null;
        const isOpen = open === i;
        return (
          <div key={i}
            style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, overflow: "hidden",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%", display: "flex", alignItems: "flex-start", gap: 12,
                padding: "14px 16px", background: "none", border: "none",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <span style={{
                minWidth: 24, height: 24, borderRadius: 6,
                background: "rgba(233,30,140,0.15)", color: "#e91e8c",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, marginTop: 1,
              }}>{i + 1}</span>
              <span style={{ flex: 1, fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{q}</span>
              {a && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0, marginTop: 3 }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              )}
            </button>
            {a && isOpen && (
              <div style={{
                padding: "0 16px 14px 52px", fontSize: 13,
                color: "rgba(255,255,255,0.55)", lineHeight: 1.7,
                borderTop: "1px solid rgba(255,255,255,0.05)",
                paddingTop: 12,
              }}>
                💡 {a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SkillGap({ items = [] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {items.map((item, i) => {
        const label = typeof item === "string" ? item : item.skill || item.gap || JSON.stringify(item);
        const level = typeof item === "object" ? item.priority || item.level : null;
        const color = level === "high" ? "#ef4444" : level === "medium" ? "#f59e0b" : "#e91e8c";
        return (
          <div key={i} style={{
            padding: "8px 14px", borderRadius: 20,
            background: `${color}12`, border: `1px solid ${color}30`,
            fontSize: 13, color,
          }}>
            {label}
            {level && <span style={{ opacity: 0.7, marginLeft: 6, fontSize: 11 }}>({level})</span>}
          </div>
        );
      })}
    </div>
  );
}

function PrepPlan({ plan }) {
  if (!plan) return null;
  if (typeof plan === "string") {
    return (
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
        {plan}
      </div>
    );
  }
  if (Array.isArray(plan)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {plan.map((step, i) => {
          const text = typeof step === "string" ? step : step.task || step.action || JSON.stringify(step);
          const week = typeof step === "object" ? step.week || step.timeframe : null;
          return (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "14px 16px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, alignItems: "flex-start",
            }}>
              <div style={{
                minWidth: 28, height: 28, borderRadius: 8,
                background: "rgba(233,30,140,0.15)", color: "#e91e8c",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
              }}>{i + 1}</div>
              <div>
                {week && <div style={{ fontSize: 11, color: "#e91e8c", fontWeight: 600, marginBottom: 3 }}>{week}</div>}
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{text}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  // object with week keys etc
  return (
    <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
      {JSON.stringify(plan, null, 2)}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ReportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    interviewApi.getById(id)
      .then(d => setReport(d.interviewReport))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const blob = await interviewApi.downloadResumePdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to generate PDF: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const score = report?.matchScore;
  const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#e91e8c";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c" }}>
      <Navbar />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px" }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 32,
            background: "none", border: "none", color: "rgba(255,255,255,0.45)",
            cursor: "pointer", fontSize: 14, padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <div className="spinner" />
          </div>
        ) : error ? (
          <div style={{
            background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)",
            borderRadius: 12, padding: 32, color: "#f06292", textAlign: "center", fontSize: 16,
          }}>{error}</div>
        ) : report && (
          <>
            {/* Header */}
            <div style={{
              background: "#111114", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20, padding: 32, marginBottom: 28, animation: "fadeUp 0.4s ease",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              flexWrap: "wrap", gap: 20,
            }}>
              <div>
                <h1 style={{
                  fontFamily: "Syne,sans-serif", fontWeight: 700,
                  fontSize: "clamp(22px,3vw,32px)", color: "#fff", margin: "0 0 10px",
                }}>
                  {report.jobTitle || "Interview Plan"}
                </h1>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
                  Generated {new Date(report.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "long", year: "numeric",
                  })}
                </div>

                {score !== undefined && (
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      fontSize: 36, fontWeight: 800, fontFamily: "Syne,sans-serif",
                      color: scoreColor,
                    }}>{score}%</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: scoreColor }}>Match Score</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>Profile ↔ Job fit</div>
                    </div>
                    {/* Score bar */}
                    <div style={{
                      marginLeft: 8, width: 140, height: 8, borderRadius: 4,
                      background: "rgba(255,255,255,0.08)", overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${score}%`, height: "100%", borderRadius: 4,
                        background: scoreColor, transition: "width 1s ease",
                      }} />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "13px 22px", borderRadius: 12,
                  background: downloading ? "rgba(233,30,140,0.4)" : "linear-gradient(135deg,#e91e8c,#c2185b)",
                  border: "none", color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: downloading ? "not-allowed" : "pointer",
                  fontFamily: "Syne,sans-serif",
                  boxShadow: downloading ? "none" : "0 4px 20px rgba(233,30,140,0.35)",
                  whiteSpace: "nowrap",
                }}
              >
                {downloading ? (
                  <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating PDF…</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download Resume PDF</>
                )}
              </button>
            </div>

            {/* Report sections */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="report-grid">

              {/* Technical Questions */}
              {report.technicalQuestions?.length > 0 && (
                <div style={{ gridColumn: "1 / -1", animation: "fadeUp 0.4s ease 0.1s both" }}>
                  <Section icon="⚙️" title="Technical Questions" accent>
                    <QuestionList items={report.technicalQuestions} />
                  </Section>
                </div>
              )}

              {/* Behavioral Questions */}
              {report.behavioralQuestions?.length > 0 && (
                <div style={{ gridColumn: "1 / -1", animation: "fadeUp 0.4s ease 0.15s both" }}>
                  <Section icon="🧠" title="Behavioral Questions">
                    <QuestionList items={report.behavioralQuestions} />
                  </Section>
                </div>
              )}

              {/* Skill Gaps */}
              {report.skillGaps?.length > 0 && (
                <div style={{ animation: "fadeUp 0.4s ease 0.2s both" }}>
                  <Section icon="📈" title="Skill Gaps to Address">
                    <SkillGap items={report.skillGaps} />
                  </Section>
                </div>
              )}

              {/* Preparation Plan */}
              {report.preparationPlan && (
                <div style={{ animation: "fadeUp 0.4s ease 0.25s both" }}>
                  <Section icon="🗓️" title="Preparation Plan">
                    <PrepPlan plan={report.preparationPlan} />
                  </Section>
                </div>
              )}

              {/* Job Description summary */}
              {report.jobDescription && (
                <div style={{ gridColumn: "1 / -1", animation: "fadeUp 0.4s ease 0.3s both" }}>
                  <Section icon="📄" title="Job Description">
                    <div style={{
                      fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.8,
                      maxHeight: 160, overflow: "auto", whiteSpace: "pre-wrap",
                    }}>
                      {report.jobDescription}
                    </div>
                  </Section>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
