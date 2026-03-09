# 🚀 CareerPilot-AI

> An AI-powered career preparation platform that analyzes job descriptions and your profile to generate personalized interview strategies, technical question banks, skill gap reports, and preparation plans.

![CareerPilot-AI](https://img.shields.io/badge/CareerPilot-AI-e91e8c?style=for-the-badge&logo=rocket)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

---

## 📌 Live Demo

🌐 **Frontend:** [https://careerpilot-ai-1-zs3k.onrender.com](https://careerpilot-ai-1-zs3k.onrender.com)


---



## ✨ Features

- 🔐 **Authentication** — Register, login, logout with JWT cookie-based auth
- 📄 **Resume Upload** — Upload PDF/DOCX resume or add a quick self-description
- 🤖 **AI Interview Plan** — Generates personalized plans using GEMINI AI based on your resume and job description
- 📊 **Match Score** — AI calculates how well your profile matches the job
- ⚙️ **Technical Questions** — Role-specific technical questions with answers
- 🧠 **Behavioral Questions** — STAR-format behavioral questions with tips
- 📈 **Skill Gap Analysis** — Identifies gaps with priority levels (high/medium/low)
- 🗓️ **Day-wise Preparation Plan** — Structured daily study plan
- 📥 **Resume PDF Generator** — Download a tailored resume PDF based on the job
- 📋 **Interview History** — View and revisit all previously generated plans

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Vite | Build tool & dev server |
| Vanilla CSS (inline) | Styling |
| Context API | Global auth state |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| pdf-parse | Resume PDF extraction |
| Multer | File upload handling |
| GEMINI AI | AI report generation |
| cookie-parser | Cookie management |
| cors | Cross-origin requests |

---

## 📁 Project Structure

```
CareerPilot-AI/
├── Backend/
│   ├── controllers/
│   │   ├── auth.controller.js        # register, login, logout, getMe
│   │   └── interview.controller.js   # generate report, get reports, PDF
│   ├── middlewares/
│   │   ├── auth.middleware.js         # JWT verification
│   │   └── file.middleware.js         # Multer file upload
│   ├── models/
│   │   ├── user.model.js
│   │   ├── blacklist.model.js
│   │   └── interviewReport.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── interview.routes.js
│   ├── services/
│   │   └── ai.service.js             # Claude AI integration
│   ├── app.js
│   └── server.js
│
└── Frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js              # All API calls
    │   ├── context/
    │   │   └── AuthContext.jsx        # Global auth state
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── History.jsx
    │   │   └── ReportView.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- GEMINI API key

### 1. Clone the repository
```bash
git clone https://github.com/alurtaher/CareerPilot-AI.git
cd CareerPilot-AI
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_claude_api_key
```

Start the backend:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## 🔌 API Reference

### Auth Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login with email & password | Public |
| `GET` | `/api/auth/logout` | Logout & blacklist token | Public |
| `GET` | `/api/auth/get-me` | Get current logged-in user | Private |

### Interview Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/interview/` | Generate new interview report | Private |
| `GET` | `/api/interview/` | Get all reports of logged-in user | Private |
| `GET` | `/api/interview/report/:id` | Get single report by ID | Private |
| `POST` | `/api/interview/resume/pdf/:id` | Download tailored resume PDF | Private |

---

## 🔐 Authentication Flow

```
Register / Login
      │
      ▼
Server generates JWT (1 day expiry)
      │
      ▼
JWT stored in httpOnly cookie (secure, sameSite: none)
      │
      ▼
Every private request → auth middleware verifies JWT
      │
      ▼
Logout → token added to blacklist in DB + cookie cleared
```

---

## 🤖 AI Integration

CareerPilot-AI uses **GEMINI AI** to generate structured interview reports:

1. User uploads resume PDF — parsed server-side using `pdf-parse`
2. Resume text + job description + self description sent to Gemini
3. Claude returns structured JSON with:
   - Match score (0–100)
   - Job title
   - Technical questions with answers
   - Behavioral questions with tips
   - Skill gaps with priority levels
   - Day-wise preparation plan
4. Report saved to MongoDB and returned to frontend

---

## ⚙️ Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GOOGLE_GENAI_API_KEY` | Claude AI API key |

---

## 🚢 Deployment

Both frontend and backend are deployed on **Render**.

**Backend:** Auto-deploys on push to `master` branch  
**Frontend:** Served as a static site via Render  
**Database:** MongoDB Atlas (cloud)

> **Note:** Vite proxy is configured to forward `/api` requests to the backend during local development, avoiding CORS issues entirely.

---

## 🔮 Upcoming Features

- [ ] Mock Interview Simulator (multi-turn AI conversation)
- [ ] ATS Resume Score Checker
- [ ] Voice Answer Practice (Web Speech API)
- [ ] Redis caching for AI responses
- [ ] Job queue for async report generation
- [ ] TypeScript migration

---

## 👨‍💻 Author

**Alur Taher Basha**  
Full Stack Developer  
📧 taherbasha295@gmail.com  
🔗 [GitHub](https://github.com/alurtaher)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ using React, Node.js, MongoDB & Claude AI</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>