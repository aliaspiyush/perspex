# Perspex — The AI Recruiter That Sees the Real Signal 🔮

![Perspex Architecture Overview](https://img.shields.io/badge/Powered_by-Gemini_2.5_Flash-blue?style=for-the-badge&logo=google) ![Vite React](https://img.shields.io/badge/Vite-React-646CFF?style=for-the-badge&logo=vite) ![100% Client Side](https://img.shields.io/badge/Architecture-100%25_Client_Side-success?style=for-the-badge)

Perspex is an **AI-native candidate ranking system** built as a Proof of Concept for the **Data & AI Challenge: Intelligent Candidate Discovery**. 

Instead of relying on easily manipulated keyword matching, Perspex uses **Gemini 2.5 Flash**'s advanced language understanding to evaluate candidates the way a senior technical recruiter would—interpreting nuanced job descriptions and extracting genuine contextual fit.

> **Note**: Perspex is a 100% client-side application. No servers, no databases, and no candidate data leaves your browser (other than direct transmission to the Gemini API).

---

## 🎯 The Problem Solved

Traditional Application Tracking Systems (ATS) rely on keyword matching. This rewards candidates who keyword-stuff their resumes, even if their career history doesn't support the claims. 

Perspex solves this by running a **4-stage intelligence pipeline**:

1. **Deep JD Understanding**: Gemini parses the job description into a structured schema (skills, seniority, semantic clusters, anti-patterns).
2. **Contextual Relevance**: Candidates are scored on semantic fit. *Example: A researcher who fine-tuned LLMs at DeepMind scores higher than someone who merely listed "LLMs" as a skill tag without evidence.*
3. **Signal Integration**: Behavioral, experience, and preference signals (like GitHub activity, response rate, notice period, and open-source contributions) are fused with the AI semantic score.
4. **Ranked Output**: A transparent, auditable shortlist is generated with explicit reasoning for every rank, key strengths, concerns, and an executive summary.

---

## 🧮 The Scoring Formula

Every candidate receives four scores (0–100) from Gemini, fused into a single composite rank. The default weights are:

```text
FINAL_SCORE =
  0.40 × Semantic Fit       (Gemini contextual scoring)
+ 0.30 × Behavioral Signals (activity, publications, GitHub)
+ 0.20 × Experience Depth   (years, seniority, trajectory)
+ 0.10 × Preference Fit     (remote, notice, work-mode)
```

*(Keyword-stuffed "honeypot" profiles are flagged and heavily penalized before scoring).*

---

## ✨ Key Features

- **Premium Glassmorphic UI**: A stunning, modern, "Apple-like" frosted glass aesthetic.
- **Live AI Streaming**: Real-time progress bars and partial results as Gemini processes candidate batches.
- **Deep Transparency**: Click on any ranked candidate to open a drawer detailing Gemini's exact reasoning, identified strengths, concerns, and a visual signal breakdown.
- **Export Ready**: Instantly export the AI-ranked shortlist to `.csv` or `.xlsx`.
- **Zero Configuration Sandbox**: Comes pre-loaded with a sample Job Description and a 15-candidate mock pool for instant one-click testing.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (Free tier is perfectly fine).

### Redrob Challenge Submission (Offline CPU Pipeline)

Perspex includes a fully offline, deterministic ranking backend built to satisfy the strict Redrob evaluation constraints (no network, CPU-only, exact 100 row output).

**Using Docker (Recommended):**
\`\`\`bash
docker build -t perspex-ranker .
docker run --rm -v $(pwd):/app perspex-ranker public/sample_jd.txt public/sample_candidates.jsonl
\`\`\`
*(This will generate a \`submission.csv\` in your current directory).*

**Using Python directly:**
\`\`\`bash
pip install -r requirements.txt
python rank.py public/sample_jd.txt public/sample_candidates.jsonl
\`\`\`

---

### Web Demo UI (Live Gemini Stream)

To view the interactive front-end demo with real-time AI progress streaming:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/aliaspiyush/perspex.git
   cd perspex
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: For Vercel deployments, add this key to your Vercel Environment Variables).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 8
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Backdrop Filters)
- **AI Engine**: `@google/genai` (Gemini 2.5 Flash)
- **Data Handling**: Client-side JSON/JSONL blob parsing (`FileReader`)
- **Export utilities**: `xlsx`, dynamic CSV blobs

---

## 📝 Usage Guide

1. Navigate to the **Upload** page.
2. (Optional) Click **"Download sample files"** to test the system with our pre-configured AI Engineer Job Description and candidate pool.
3. Upload a `job_description.txt` and a `candidates.jsonl` (or `.json`) file.
4. Click **Run Perspex**.
5. Watch the live execution progress as Gemini scores batches.
6. Navigate to the **Results** page to view the deterministic ranking, AI executive summary, and per-candidate reasoning.

---

*Built for the Hack2Skill Data & AI Challenge.*
