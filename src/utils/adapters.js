// Real data adapter — fetches AI-processed candidates from backend output

export const fetchCandidates = async () => {
  try {
    const response = await fetch('/top100_full.json');
    if (!response.ok) throw new Error('Failed to load top100_full.json');
    const data = await response.json();
    return data.map((c, i) => ({
      ...c,
      id: c.id || c.candidate_id || `CAND_${String(i + 1).padStart(7, '0')}`,
      rank: typeof c.rank === 'number' ? c.rank : i + 1,
      match_score: typeof c.match_score === 'number' ? c.match_score : 0,
      semantic:   typeof c.semantic   === 'number' ? c.semantic   : 0,
      career:     typeof c.career     === 'number' ? c.career     : 0,
      behavioral: typeof c.behavioral === 'number' ? c.behavioral : 0,
      penalty:    typeof c.penalty    === 'number' ? c.penalty    : 0,
      reasoning:  c.reasoning || '',
    }));
  } catch (err) {
    console.error('fetchCandidates:', err);
    return [];
  }
};

// Structured interpretation of the actual Redrob JD
export const parseJobDescription = () => ({
  title: 'AI/ML Engineer',
  seniority: 'Mid–Senior',
  years_experience: '5–8 years',
  work_mode: 'Remote / Hybrid',
  required_skills: ['Python', 'PyTorch', 'NLP', 'LLM Fine-tuning', 'MLOps', 'Transformers'],
  preferred_skills: ['Kubernetes', 'Vector Databases', 'Spark', 'Airflow', 'FAISS', 'LoRA'],
  target_titles: ['AI Engineer', 'ML Engineer', 'Machine Learning', 'Data Scientist'],
  semantic_terms: ['pytorch', 'llm', 'nlp', 'transformer', 'mlops', 'fine-tuning', 'deep learning', 'inference'],
  experience_band: { min: 5, ideal: 7, max: 10 },
  behavioral_signals: ['open_to_work', 'high_response_rate', 'interview_completion'],
  honeypot_flags: ['expert_skill_zero_duration', 'zero_response_rate'],
  score_weights: { semantic: 40, career: 35, signals: 25 },
});

export const getChallengeFiles = () => [
  { name: 'candidates.jsonl',                   type: 'Dataset',       role: '100K Candidate Pool (487 MB)', status: 'processed' },
  { name: 'job_description.docx',               type: 'Input',         role: 'Role Definition',              status: 'parsed'    },
  { name: 'candidate_schema.json',              type: 'Schema',        role: 'Data Validation',              status: 'linked'    },
  { name: 'redrob_signals_doc.docx',            type: 'Documentation', role: 'Signal Definitions',           status: 'linked'    },
  { name: 'rank_candidates.js',                 type: 'Engine',        role: 'Node.js Stream Ranker',        status: 'complete'  },
  { name: 'team_perspex.csv',                   type: 'Output',        role: 'Final Submission (Top 100)',   status: 'generated' },
  { name: 'validate_submission.py',             type: 'Executable',    role: 'Local Validator',              status: 'ready'     },
  { name: 'submission_metadata_template.yaml',  type: 'Template',      role: 'Submission Metadata',          status: 'ready'     },
];
