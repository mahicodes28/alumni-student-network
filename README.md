# CareerPath AI

> **"Your Career Doesn't Need Guesswork."**  
> *From Career Discovery to Career Readiness.*

---

## 🚀 Overview

**CareerPath AI** is an AI-powered career companion and employability platform designed for the **MPONLINE IDEA & INNOVATION HACKATHON 2026** (**Problem Statement 01: AI-Powered Career Readiness & Employability Platform**). 

The platform supports the vision of **Campus to Corporate** by helping students understand their strengths, discover suitable career paths, identify skill gaps, build personalized learning roadmaps, match opportunities, optimize resumes, practice interviews, connect with industry mentors, and track their overall **Career Readiness Score**.

> *Note: This application evolved from an existing career networking codebase into a comprehensive, general-purpose AI Career Tech SaaS product.*

---

## 🎯 Problem Statement & Requirements Met

| Requirement | Implementation in CareerPath AI |
| :--- | :--- |
| **1. Analyse student profiles & academic records** | AI Assessment Engine processes degree, branch, CGPA, technical skills, projects, and certifications |
| **2. Recommend career paths** | Explainable AI fit scoring (e.g. Data Analyst 87%, Data Scientist 79%) with "Why this fits" evidence |
| **3. Suggest skill gaps** | AI Skill Gap Analyzer comparing current student skills against target market benchmarks |
| **4. Recommend online courses & certifications** | Smart Learning Recommendations matched directly to priority skill gaps |
| **5. Match internships & job opportunities** | AI Opportunity Matching engine with skill overlap breakdown (✓ matched vs ⚠ missing) |
| **6. Generate AI-based resume improvements** | AI Resume Analyzer with 0-100 scoring, ATS keyword alignment, and phrasing suggestions |
| **7. Conduct mock interviews** | Interactive AI Technical & Behavioral Mock Interview room with real-time feedback & readiness score |
| **8. Recommend government opportunities** | Curated government recruitment notices (NIC, ISRO, BEL, C-DAC) with eligibility benchmarks |

---

## 🔄 The 10-Step Employability Journey

```
PROFILE → UNDERSTAND → DISCOVER → IDENTIFY GAPS → LEARN → BUILD → APPLY → PRACTICE → CONNECT → MEASURE
```

1. **PROFILE**: Comprehensive academic, skill, and project student profile.
2. **UNDERSTAND**: AI strength and skill benchmark evaluation.
3. **DISCOVER**: Transparent career recommendations with fit percentage breakdown.
4. **IDENTIFY GAPS**: Categorized skills (Strong, Needs Improvement, Priority Gap).
5. **LEARN**: Curated courses, certifications, and practice projects.
6. **BUILD**: Personalized 5-phase interactive career roadmap with completion tracking.
7. **APPLY**: Matched internships and entry-level full-time opportunities.
8. **PRACTICE**: AI Mock Interview practice room with real-time feedback.
9. **CONNECT**: 1-on-1 Industry Mentor matching based on career track & skill gaps.
10. **MEASURE**: Central **AI Career Readiness Score (0-100)** with Next Best Action recommendations.

---

## 🛠 Tech Stack & Architecture

- **Frontend**: React 19, Vite 8, Lucide Icons, Recharts (Chart Analytics), Vanilla CSS Design System.
- **Backend**: Python 3.13, Flask, Werkzeug, PyMongo, Certifi, Groq API (Llama-3.3-70B-Versatile).
- **Database**: MongoDB Atlas (`users`, `profiles`, `career_paths`, `roadmaps`, `learning_resources`, `opportunities`, `government_jobs`, `resume_analyses`, `interview_sessions`, `requests`, `messages`).
- **Deployment**: Integrated single-origin serving (Vite build outputs directly to Flask static directory).

---

## 🔑 Key Differentiators

1. **Explainable AI Career Recommendations**: Every recommendation provides explicit evidence of why a role fits and what skills are missing.
2. **Skill Gap → Roadmap Connection**: Automatically converts identified gaps into actionable learning milestones.
3. **Career Path Simulator**: Allows students to compare two career paths side-by-side (e.g. Data Analyst vs Data Scientist) before committing.
4. **AI Opportunity & Industry Mentor Matching**: Matches positions and mentors based on career target alignment and skill gap remediation.
5. **Career Readiness Score & Next Best Action**: One central 0-100 metric continuously directing the student toward the highest-priority next step.

---

## 💻 Local Setup & Running Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB instance (local or MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd Backend
# Activate virtual environment if using one (e.g., source myenv/bin/activate or ..\myenv\Scripts\activate)
pip install -r requirements.txt

# Seed demo data (Career paths, learning resources, opportunities, government jobs, demo users)
python seed_demo_data.py

# Run Flask server
python app.py
```
*Backend runs on `http://localhost:8080`*

### 3. Frontend Setup (Development)
```bash
cd frontend-new
npm install
npm run dev
```
*Frontend dev server runs on `http://localhost:5173`*

### 4. Production Build & Serving
```bash
cd frontend-new
npm run build   # Builds directly into Backend/static
cd ../Backend
python app.py
```
*Visit `http://localhost:8080` to access full production build served by Flask.*

---

## 🔐 Environment Variables (`Backend/.env`)

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
GROQ_API_KEY=gsk_...
PORT=8080
```

---

## 👥 Demo Accounts

| Role | Email | Password | Target / Expertise |
| :--- | :--- | :--- | :--- |
| **Student** | `student@demo.com` | `Student123!` | Target Role: Data Analyst (87% Fit) |
| **Industry Mentor** | `sarah.sharma@industry.org` | `Mentor123!` | Senior Data Scientist at Google |
| **Industry Mentor** | `alex.chen@industry.org` | `Mentor123!` | Lead Analytics Manager at Amazon |
| **Admin** | *(Register/Configure admin role)* | - | Platform Control & Career Analytics |

---

## 🎬 2–3 Minute Hackathon Demo Flow

1. **Step 1 — Login**: Log in as `student@demo.com` (`Student123!`).
2. **Step 2 — Student Dashboard**: View **Career Readiness Score (76/100)** and the **Next Best Action** ("Complete Advanced SQL Module").
3. **Step 3 — Career AI Assessment**: Open `/career-ai`. View **Data Analyst (87% Fit)** with "Why this fits" evidence & areas to strengthen.
4. **Step 4 — Career Path Simulator**: Open `/career-simulator`. Compare *Data Analyst vs Data Scientist* side-by-side.
5. **Step 5 — Skill Gap Analyzer**: Open `/skill-gap`. Inspect current vs required skills & Top 3 Priority Skill Gaps (*Statistics, Advanced SQL, Business Analytics*).
6. **Step 6 — Personalized Roadmap**: Open `/roadmap`. Toggle milestone checkboxes and observe completion progress increase.
7. **Step 7 — Opportunities & Mentors**: Open `/opportunities` to see *Data Analyst Intern (91% Match)* and `/mentors` to connect with *Sarah Sharma (Senior Data Scientist at Google)*.
8. **Step 8 — AI Resume & Mock Interview**: Open `/resume-ai` for instant scoring and `/mock-interview` to run an interactive interview round.
9. **Step 9 — Return to Dashboard**: Observe updated Career Readiness Score reflecting completed tasks.

---

## 📜 License & Acknowledgments

Developed for **MPONLINE IDEA & INNOVATION HACKATHON 2026**.  
*Campus to Corporate — Empowering the next generation of job-ready graduates.*
