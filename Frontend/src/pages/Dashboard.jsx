import { useState, useRef, useCallback, useEffect } from "react";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentReports, setRecentReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    interviewApi.getAll()
      .then(d => setRecentReports(d.interviewReports || []))
      .catch(() => {})
      .finally(() => setReportsLoading(false));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
      setResumeFile(file);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return setError("Please paste a job description.");
    if (!resumeFile && !selfDescription.trim()) return setError("Please upload your resume or add a self description.");
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    if (resumeFile) formData.append("resume", resumeFile);

    try {
      const data = await interviewApi.generate(formData);
      navigate(`/report/${data.interviewReport._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0c" }}>
      <Navbar />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp 0.4s ease" }}>
          <h1 style={{
            fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "clamp(28px,4vw,42px)",
            color: "#fff", margin: "0 0 12px",
          }}>
            Create Your Custom <span style={{ color: "#e91e8c" }}>Interview Plan</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            Let our AI analyze the job requirements and your unique profile to build a winning strategy.
          </p>
        </div>

        {/* Main card */}
        <div style={{
          background: "#111114", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, padding: 28, animation: "fadeUp 0.5s ease 0.1s both",
        }}>
          {error && (
            <div style={{
              background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)",
              borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#f06292", fontSize: 14,
            }}>{error}</div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="planner-grid">

            {/* Left: Job Description */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🎯</span>
                  <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 600, color: "#fff", fontSize: 15 }}>
                    Target Job Description
                  </span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#e91e8c", padding: "3px 9px",
                  background: "rgba(233,30,140,0.15)", borderRadius: 6, letterSpacing: "0.5px",
                }}>REQUIRED</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                maxLength={5000}
                placeholder={`Paste the full job description here...\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."`}
                style={{
                  width: "100%", minHeight: 320, padding: "14px 16px", borderRadius: 12,
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.8)", fontSize: 14, resize: "vertical",
                  outline: "none", boxSizing: "border-box", fontFamily: "DM Sans,sans-serif",
                  lineHeight: 1.6,
                }}
                className="cp-input"
              />
              <div style={{ textAlign: "right", fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
                {jobDescription.length} / 5000 chars
              </div>
            </div>

            {/* Right: Profile */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>👤</span>
                <span style={{ fontFamily: "Syne,sans-serif", fontWeight: 600, color: "#fff", fontSize: 15 }}>
                  Your Profile
                </span>
              </div>

              {/* Upload zone */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>Upload Resume</span>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: "#22c55e", padding: "2px 8px",
                    background: "rgba(34,197,94,0.12)", borderRadius: 6,
                  }}>BEST RESULTS</span>
                </div>

                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragOver ? "#e91e8c" : resumeFile ? "#22c55e" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 12, padding: "28px 16px", textAlign: "center",
                    cursor: "pointer", transition: "all 0.2s",
                    background: dragOver ? "rgba(233,30,140,0.05)" : resumeFile ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileChange} style={{ display: "none" }} />
                  {resumeFile ? (
                    <>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
                      <div style={{ color: "#22c55e", fontSize: 14, fontWeight: 500 }}>{resumeFile.name}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}>
                        Click to replace
                      </div>
                    </>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" style={{ margin: "0 auto 10px", display: "block" }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: 500 }}>
                        Click to upload or drag & drop
                      </div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 4 }}>
                        PDF or DOCX (Max 5MB)
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* OR divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>OR</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* Self description */}
              <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                Quick Self-Description
              </div>
              <textarea
                value={selfDescription}
                onChange={e => setSelfDescription(e.target.value)}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                style={{
                  width: "100%", minHeight: 120, padding: "12px 14px", borderRadius: 10,
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.8)", fontSize: 14, resize: "vertical",
                  outline: "none", boxSizing: "border-box", fontFamily: "DM Sans,sans-serif",
                  lineHeight: 1.6,
                }}
                className="cp-input"
              />

              {/* Info notice */}
              <div style={{
                marginTop: 12, padding: "12px 14px", borderRadius: 10,
                background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
                fontSize: 13, color: "rgba(255,255,255,0.55)",
                display: "flex", alignItems: "flex-start", gap: 8,
              }}>
                <span style={{ color: "#60a5fa", marginTop: 1 }}>ℹ</span>
                Either a <strong style={{ color: "rgba(255,255,255,0.8)" }}>Resume</strong> or a{" "}
                <strong style={{ color: "rgba(255,255,255,0.8)" }}>Self Description</strong> is required to generate a personalized plan.
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
              ⚡ AI-Powered Strategy Generation • Approx 30s
            </span>
            <button
              onClick={handleGenerate}
              disabled={loading}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "13px 28px", borderRadius: 12,
                background: loading ? "rgba(233,30,140,0.5)" : "linear-gradient(135deg,#e91e8c,#c2185b)",
                border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Syne,sans-serif",
                boxShadow: loading ? "none" : "0 4px 24px rgba(233,30,140,0.4)",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  Generating your plan…
                </>
              ) : (
                <>✦ Generate My Interview Strategy</>
              )}
            </button>
          </div>
        </div>

        {/* Recent reports */}
        <div style={{ marginTop: 48, animation: "fadeUp 0.5s ease 0.2s both" }}>
          <h2 style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 20 }}>
            My Recent Interview Plans
          </h2>

          {reportsLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div className="spinner" style={{ margin: "0 auto" }} />
            </div>
          ) : recentReports.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 24px",
              background: "#111114", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16,
              color: "rgba(255,255,255,0.3)", fontSize: 15,
            }}>
              No interview plans yet. Generate your first one above! 🚀
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {recentReports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/report/${report._id}`)}
                  style={{
                    background: "#111114", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14, padding: 20, cursor: "pointer",
                    transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 10,
                  }}
                  className="report-card"
                >
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 600, fontSize: 15, color: "#fff" }}>
                    {report.jobTitle || "Interview Plan"}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                    Generated on {new Date(report.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </div>
                  {report.matchScore !== undefined && <ScoreBadge score={report.matchScore} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
