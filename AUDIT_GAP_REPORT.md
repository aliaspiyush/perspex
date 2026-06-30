# Perspex - Audit Gap Report

## 1. Repository Inventory
- **Frontend Files**: React (Vite) application present in `src/` (`App.jsx`, `views/`, `components/`, `styles/`, `index.css`).
- **Pipeline/Backend Files**: **MISSING**. No python scripts, no `rank.py`, no backend orchestration.
- **Docker/Requirements**: **MISSING**. No `Dockerfile` or `requirements.txt` / `pyproject.toml`.
- **Metadata YAML**: **MISSING**.
- **LLM/Gemini Integration**: Present as client-side JS (`src/engine/gemini.js` calls `@google/genai` directly from the browser).
- **FAISS / Sentence Transformers**: **MISSING**. Claimed in slides, not present in code.
- **Honeypot Filtering**: Implemented as a boolean prompt instruction in Gemini (`is_honeypot: boolean`), not a deterministic logic module.
- **CSV Output Scripts**: `src/utils/exportCsv.js` exists but only outputs `candidate_id,rank`.

## 2. Working Features Already Implemented
- The **Frontend web interface** (Upload, Results, About pages).
- **Real-time progress visualization** in `ResultsView.jsx`.
- **Gemini-backed JD parsing and batch scoring** executed via browser-based API calls.
- **Static HTML/CSS/JS frontend** using Vite and Vanilla CSS.

## 3. Claimed in slides but missing in code
- **Offline / CPU-only Ranking pipeline**: Claimed by Redrob constraints and presentation, totally missing.
- **FAISS-CPU & Sentence-transformers**: Claimed for semantic search, missing.
- **Pandas + ijson + Python-docx + Scipy**: Claimed for data wrangling, missing.
- **Dockerfile with python:3.11-slim**: Missing.
- **submission_metadata.yaml**: Missing.
- **Exactly 100 row CSV output guarantee**: UI exports whatever the JSONL length is.
- **Evidence-based reasoning from actual data (no hallucination)**: Currently relying fully on Gemini API with prompt instructions, which violates the offline constraints.

## 4. Claimed in slides but only partially implemented
- **Honeypot filter**: Exists as an LLM instruction, not a robust programmatic filter.
- **Deterministic scoring**: Fails because LLMs (Gemini via API) are inherently non-deterministic unless temperature is strictly 0 and even then can fluctuate over API updates.

## 5. Claimed in slides but contradicted by code
- **Offline pipeline / No Network constraint**: The current code heavily relies on a live internet connection to `generativelanguage.googleapis.com` to score every single candidate.
- **CSV format**: `candidateid,rank,score,reasoning` is required. `exportCsv.js` outputs `candidate_id,rank`.

## 6. Submission-spec blockers
- **CRITICAL**: No `rank.py` or entrypoint to run the ranking.
- **CRITICAL**: No `Dockerfile` to build the environment.
- **CRITICAL**: Live Gemini API calls during ranking violate the offline/CPU-only constraint. 
- **CRITICAL**: CSV output format is invalid.

## 7. Highest-priority fixes in order
1. **Priority 1 (Submission Correctness)**:
   - Create a Python script (`rank.py`) that reads `job_description.txt` and `candidates.jsonl`.
   - Output `submission.csv` with exactly 100 rows and the required columns (`candidateid,rank,score,reasoning`).
   - Write a fallback deterministic scoring logic (simulating signal fusion) using native Python (string matching, feature extraction) to satisfy offline CPU constraints.
2. **Priority 2 (Reproducibility)**:
   - Add `requirements.txt`.
   - Add `Dockerfile` (`FROM python:3.11-slim`).
   - Add `submission_metadata.yaml`.
3. **Priority 3 (Honesty / Frontend truthfulness)**:
   - Update `exportCsv.js` to match the exact `candidateid,rank,score,reasoning` headers.
   - Clarify in the UI that the Gemini API is a *demo feature*, whereas the submission backend runs the offline pipeline.

## 8. Risks and assumptions
- **Risk**: Moving from a purely Gemini API architecture to an offline CPU-only architecture in a short time frame means we must use a lightweight deterministic scorer (or very small sentence-transformer model) for the offline `rank.py`.
- **Assumption**: The frontend UI is acceptable as a "demo interface" for the judges, but the actual evaluation will be run headless via the Docker image and `rank.py`.
