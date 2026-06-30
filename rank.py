import sys
import json
import csv
import logging
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer, util
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
MODEL_NAME = 'all-MiniLM-L6-v2'
BATCH_SIZE = 32
REQUIRED_OUTPUT_ROWS = 100

def load_jd(filepath: str) -> str:
    """Load the job description text."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        logger.error(f"Failed to read JD from {filepath}: {e}")
        sys.exit(1)

def load_candidates(filepath: str) -> List[Dict[str, Any]]:
    """Load candidates from a JSONL file."""
    candidates = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            for i, line in enumerate(f):
                line = line.strip()
                if not line:
                    continue
                try:
                    c = json.loads(line)
                    # Normalise ID field
                    if 'candidate_id' not in c and 'id' in c:
                        c['candidate_id'] = c['id']
                    
                    # Ensure candidateid exists for output formatting later
                    if 'candidate_id' in c:
                        c['candidateid'] = c['candidate_id']
                    
                    candidates.append(c)
                except json.JSONDecodeError:
                    logger.warning(f"Skipping invalid JSON on line {i+1}")
        return candidates
    except Exception as e:
        logger.error(f"Failed to load candidates from {filepath}: {e}")
        sys.exit(1)

def build_candidate_text(c: Dict[str, Any]) -> str:
    """Build a rich text representation of a candidate for semantic matching."""
    parts = []
    if c.get('title'):
        parts.append(f"Title: {c['title']}")
    if c.get('skills'):
        skills = c['skills']
        if isinstance(skills, list):
            skills = ", ".join(skills)
        parts.append(f"Skills: {skills}")
    if c.get('experience'):
        parts.append(f"Experience: {c['experience']}")
    if c.get('summary'):
        parts.append(f"Summary: {c['summary']}")
    
    return " | ".join(parts)

def build_reasoning(c: Dict[str, Any], semantic_pct: float, final_score: float) -> str:
    """Generate a deterministic, evidence-based reasoning string."""
    reasons = []
    
    # Semantic fit reasoning
    if semantic_pct > 80:
        reasons.append("Exceptional semantic alignment with role requirements.")
    elif semantic_pct > 60:
        reasons.append("Solid contextual overlap with core skills.")
    else:
        reasons.append("Moderate semantic match to job description.")
        
    # Experience reasoning
    years = c.get('years_of_experience', c.get('experience_years', None))
    if years is not None:
        reasons.append(f"Brings {years} years of relevant experience.")
        
    # Behavioral reasoning
    rr = c.get('response_rate', 0.0)
    if rr > 0.8:
        reasons.append("High historical response rate indicates strong intent.")
        
    # Preference reasoning
    remote = c.get('remote_preference', None)
    if remote:
        reasons.append(f"Prefers {remote} work environments.")
        
    reasoning_str = " ".join(reasons)
    # Ensure it's not empty
    if not reasoning_str:
        reasoning_str = f"Composite score of {final_score:.1f} based on available signals."
        
    return reasoning_str

def main():
    if len(sys.argv) < 3:
        print("Usage: python rank.py <job_description.txt> <candidates.jsonl>")
        sys.exit(1)
        
    jd_path = sys.argv[1]
    candidates_path = sys.argv[2]
    output_path = 'submission.csv'
    
    logger.info("Loading Job Description...")
    jd_text = load_jd(jd_path)
    
    logger.info("Loading Candidates...")
    candidates = load_candidates(candidates_path)
    if not candidates:
        logger.error("No candidates loaded.")
        sys.exit(1)
        
    logger.info(f"Loaded {len(candidates)} candidates. Initializing semantic model...")
    # Load model (will use cached version inside Docker)
    model = SentenceTransformer(MODEL_NAME)
    
    # 1. Semantic Scoring (40%)
    logger.info("Generating JD embedding...")
    jd_embedding = model.encode(jd_text, convert_to_tensor=True)
    
    logger.info("Generating candidate embeddings...")
    candidate_texts = [build_candidate_text(c) for c in candidates]
    candidate_embeddings = model.encode(candidate_texts, batch_size=BATCH_SIZE, convert_to_tensor=True, show_progress_bar=True)
    
    logger.info("Computing cosine similarities...")
    cosine_scores = util.cos_sim(jd_embedding, candidate_embeddings)[0].cpu().numpy()
    
    # 2. Signal Fusion & Scoring
    logger.info("Fusing signals and computing final scores...")
    results = []
    
    for i, c in enumerate(candidates):
        # Normalize semantic score (0 to 1)
        sem_score = max(0.0, float(cosine_scores[i]))
        
        # Synthetic behavioral/experience signals since actual DB isn't available
        # In a real scenario these would be mapped directly from candidate metadata
        beh_score = float(c.get('response_rate', 0.5))
        exp_score = min(float(c.get('years_of_experience', c.get('experience_years', 5))) / 10.0, 1.0)
        pref_score = 1.0 if c.get('remote_preference') == 'remote' else 0.5
        
        # Formula: 40% Sem, 30% Beh, 20% Exp, 10% Pref
        final_score = (0.40 * sem_score) + (0.30 * beh_score) + (0.20 * exp_score) + (0.10 * pref_score)
        
        # Scale to 0-100
        final_score_100 = round(final_score * 100, 2)
        semantic_100 = sem_score * 100
        
        # Build reasoning
        reasoning = build_reasoning(c, semantic_100, final_score_100)
        
        results.append({
            'candidateid': str(c.get('candidateid', f"cand_{i}")),
            'score': final_score_100,
            'reasoning': reasoning
        })
        
    # Sort descending by score
    logger.info("Sorting and ranking candidates...")
    results.sort(key=lambda x: x['score'], reverse=True)
    
    # Ensure exactly 100 rows per Redrob spec
    if len(results) > REQUIRED_OUTPUT_ROWS:
        results = results[:REQUIRED_OUTPUT_ROWS]
    elif len(results) < REQUIRED_OUTPUT_ROWS:
        logger.warning(f"Only {len(results)} candidates available, but {REQUIRED_OUTPUT_ROWS} requested. Outputting available.")
        
    # Assign monotonic ranks
    for rank, res in enumerate(results, start=1):
        res['rank'] = rank
        
    # 3. Export CSV
    logger.info(f"Writing {len(results)} results to {output_path}...")
    try:
        with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['candidateid', 'rank', 'score', 'reasoning']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for res in results:
                writer.writerow(res)
        logger.info(f"Successfully generated {output_path}")
    except Exception as e:
        logger.error(f"Failed to write CSV: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
