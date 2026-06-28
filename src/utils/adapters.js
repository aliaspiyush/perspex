// Mock data adapters to simulate parsing of challenge artifacts

export const fetchCandidates = async () => {
  try {
    const response = await fetch('/top100_full.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch candidates:', error);
    return [];
  }
};

export const parseJobDescription = () => {
  return {
    title: "Senior AI Engineer · Founding Team",
    seniority: "Senior",
    years_experience: "5+ years",
    required_skills: ["Python", "PyTorch", "LLM Fine-tuning", "System Design"],
    preferred_skills: ["Rust", "Kubernetes", "Vector Databases"],
    location: "San Francisco, CA or Remote (US/Canada)",
    work_mode: "Hybrid / Remote",
    salary: "$180k - $220k + Equity",
    must_have_filters: [
      "Minimum 3 years production ML experience",
      "Authorized to work in US/Canada"
    ],
    good_to_have_signals: [
      "Open source contributions",
      "Fast response rate"
    ],
    normalized: {
      semantic_terms: ["pytorch", "llm", "transformer", "mlops", "python", "system design"],
      experience_band: { min: 5, ideal: 8 },
      logistics: ["remote", "hybrid", "us", "canada"],
      behavioral: ["open_to_work", "high_response_rate"]
    }
  };
};

export const getChallengeFiles = () => [
  { name: 'README.docx', type: 'Documentation', role: 'Challenge Overview', status: 'loaded' },
  { name: 'job_description.docx', type: 'Input Data', role: 'Role Definition', status: 'parsed' },
  { name: 'sample_candidates.json', type: 'Input Data', role: 'Candidate Pool', status: 'parsed' },
  { name: 'candidate_schema.json', type: 'Schema', role: 'Data Validation', status: 'linked' },
  { name: 'redrob_signals_doc.docx', type: 'Documentation', role: 'Signal Definitions', status: 'linked' },
  { name: 'submission_spec.docx', type: 'Documentation', role: 'Output Rules', status: 'loaded' },
  { name: 'submission_metadata_template.yaml', type: 'Template', role: 'Submission Metadata', status: 'ready' },
  { name: 'validate_submission.py', type: 'Executable', role: 'Local Validator', status: 'ready' }
];

export const getMetadataTemplate = () => `team_name: ""
contact_email: ""
approach_summary: ""
runtime_seconds: 0
hardware_used: ""
external_libraries: []
`;
