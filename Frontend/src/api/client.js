const BASE_URL = "https://careerpilot-ai-nmom.onrender.com";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  logout: () => request("/api/auth/logout"),

  getMe: () => request("/api/auth/get-me"),
};

// ─── INTERVIEW ────────────────────────────────────────────────────────────────
export const interviewApi = {
  /** formData must contain: resume (File), jobDescription, selfDescription */
  generate: (formData) =>
    request("/api/interview/", {
      method: "POST",
      body: formData, // no Content-Type header — browser sets multipart boundary
    }),

  getById: (id) => request(`/api/interview/report/${id}`),

  getAll: () => request("/api/interview/"),

  /** Returns a Blob (PDF) */
  downloadResumePdf: async (id) => {
    const res = await fetch(`${BASE_URL}/api/interview/resume/pdf/${id}`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to generate PDF");
    return res.blob();
  },
};
