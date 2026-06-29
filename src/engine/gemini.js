// Gemini API Client — API key is read from environment (VITE_GEMINI_API_KEY)
// Never expose or accept the key from user input.

const GEMINI_MODEL = 'gemini-1.5-flash';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function getApiKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env file.');
  return key;
}

async function callGemini(prompt, jsonMode = true) {
  const apiKey = getApiKey();
  const url = `${BASE_URL}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 8192,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  if (jsonMode) {
    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) return JSON.parse(match[1]);
      throw new Error('Could not parse JSON from Gemini response');
    }
  }
  return text;
}

// ── PHASE 1: Parse JD into structured ranking intent ──────────────────────
export async function parseJobDescription(jdText) {
  const prompt = `You are an expert technical recruiter and AI systems analyst.

Analyze this job description and extract a precise, machine-usable ranking schema.

JOB DESCRIPTION:
${jdText}

Return ONLY a JSON object with this exact structure:
{
  "role_title": "string",
  "role_summary": "2-3 sentence summary of what this role truly requires",
  "seniority": "junior|mid|senior|lead|staff",
  "experience_years": { "min": number, "ideal": number, "max": number },
  "required_skills": [
    { "name": "string", "importance": "critical|high|medium", "context": "why this skill matters" }
  ],
  "preferred_skills": [{ "name": "string", "importance": "medium|low" }],
  "semantic_clusters": ["cluster1", "cluster2"],
  "domain_context": "deep description of the technical domain",
  "work_style": "remote|hybrid|onsite|flexible",
  "behavioral_expectations": ["expectation1", "expectation2"],
  "anti_patterns": ["pattern that would disqualify a candidate"],
  "scoring_priorities": {
    "semantic_fit": "what makes a strong semantic match for this role",
    "career_relevance": "what career trajectory signals strong fit",
    "signal_quality": "what behavioral signals matter most"
  }
}`;

  return await callGemini(prompt, true);
}

// ── PHASE 2: Score a batch of candidates against the parsed JD ─────────────
export async function scoreCandidateBatch(parsedJD, candidates) {
  const summaries = candidates.map((c, idx) => {
    const skills = (c.skills || [])
      .map(s => `${s.name} (${s.proficiency}, ${s.duration_months || 0}mo)`)
      .join(', ');
    const career = (c.career_history || [])
      .slice(0, 3)
      .map(j => `${j.title} @ ${j.company} (${j.duration_months || 0}mo)`)
      .join(' → ');
    const sigs = c.redrob_signals || {};
    return `
CANDIDATE ${idx + 1} [ID: ${c.candidate_id}]
Profile: ${c.profile?.years_of_experience || 0} yrs exp | ${c.profile?.current_title || 'N/A'} @ ${c.profile?.current_company || 'N/A'}
Headline: ${c.profile?.headline || 'N/A'}
Summary: ${(c.profile?.summary || '').slice(0, 300)}
Skills: ${skills}
Career: ${career}
Education: ${(c.education || []).map(e => `${e.degree} from ${e.institution}`).join('; ')}
Signals: open_to_work=${sigs.open_to_work_flag}, response_rate=${sigs.recruiter_response_rate}, interview_rate=${sigs.interview_completion_rate}, github=${sigs.github_activity_score}, notice_days=${sigs.notice_period_days}
Certifications: ${(c.certifications || []).map(cert => cert.name).join(', ') || 'none'}`.trim();
  });

  const prompt = `You are the ultimate AI recruiter performing intelligent candidate ranking.

TARGET ROLE:
Title: ${parsedJD.role_title}
Summary: ${parsedJD.role_summary}
Domain: ${parsedJD.domain_context}
Experience: ${parsedJD.experience_years?.min}–${parsedJD.experience_years?.max} years (ideal: ${parsedJD.experience_years?.ideal})
Required Skills: ${(parsedJD.required_skills || []).map(s => `${s.name} (${s.importance})`).join(', ')}
Semantic Clusters: ${(parsedJD.semantic_clusters || []).join(', ')}
Behavioral Expectations: ${(parsedJD.behavioral_expectations || []).join(', ')}

RANKING PHILOSOPHY:
- semantic_fit: ${parsedJD.scoring_priorities?.semantic_fit}
- career_relevance: ${parsedJD.scoring_priorities?.career_relevance}
- signal_quality: ${parsedJD.scoring_priorities?.signal_quality}

Anti-patterns to penalize: ${(parsedJD.anti_patterns || []).join(', ')}

CANDIDATES TO EVALUATE:
${summaries.join('\n\n---\n\n')}

Score each candidate. Go BEYOND keyword matching — understand semantic fit, career trajectory, and genuine signal quality.

Return ONLY a JSON array with exactly ${candidates.length} objects in the same order:
[
  {
    "candidate_id": "string",
    "overall_score": number (0-100),
    "semantic_fit": number (0-100),
    "career_relevance": number (0-100),
    "signal_quality": number (0-100),
    "reasoning": "2-3 sentences — be specific about what signals drove the score",
    "key_strengths": ["strength1", "strength2"],
    "concerns": ["concern1"],
    "is_honeypot": boolean
  }
]`;

  return await callGemini(prompt, true);
}

// ── PHASE 3: Generate executive summary ───────────────────────────────────
export async function generateRankingSummary(parsedJD, topCandidates) {
  const top5 = topCandidates.slice(0, 5);
  const prompt = `You are a senior technical recruiter. Write a concise executive summary (3-4 sentences) of the top candidates found for the role of "${parsedJD.role_title}".

Top candidates:
${top5.map((c, i) => `#${i + 1}: ${c.candidate_id} — Score: ${c.overall_score}/100 — ${c.reasoning}`).join('\n')}

Write a brief analytical summary explaining the quality of the shortlist and what made these candidates stand out. Be specific.`;

  return await callGemini(prompt, false);
}
