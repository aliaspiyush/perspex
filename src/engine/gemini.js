// Gemini API Client — API key is read from environment (VITE_GEMINI_API_KEY)
// Lazy-initialised so the module can be imported even before the key check.

import { GoogleGenAI } from "@google/genai";

let _ai = null;
function getAI() {
  if (_ai) return _ai;
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env file or Vercel env vars.');
  _ai = new GoogleGenAI({ apiKey: key });
  return _ai;
}

function handleGeminiError(error) {
  if (error?.status === 404) throw new Error("Gemini model not found. Check model name.");
  if (error?.status === 429) throw new Error("Rate limit hit. Please wait a moment and retry.");
  throw error;
}

async function generateJSON(prompt) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 8192,
    },
  });
  const text = response.text;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);
    throw new Error('Could not parse JSON from Gemini response');
  }
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
    { "name": "string", "importance": "critical|high|medium", "context": "why this skill matters for this role" }
  ],
  "preferred_skills": [{ "name": "string", "importance": "medium|low" }],
  "semantic_clusters": ["cluster1", "cluster2"],
  "domain_context": "deep description of the technical domain and what mastery looks like",
  "work_style": "remote|hybrid|onsite|flexible",
  "behavioral_expectations": ["expectation1", "expectation2"],
  "anti_patterns": ["pattern that would disqualify or significantly downrank a candidate"],
  "scoring_priorities": {
    "semantic_fit": "what makes a strong semantic match for this role",
    "career_relevance": "what career trajectory signals strong fit",
    "signal_quality": "what behavioral signals matter most"
  }
}`;

  try {
    return await generateJSON(prompt);
  } catch (error) {
    handleGeminiError(error);
  }
}

// ── PHASE 2: Score a batch of flat-format candidates (from our JSONL) ──────
export async function scoreCandidateBatch(parsedJD, candidates) {
  const summaries = candidates.map((c, idx) => {
    const skills = Array.isArray(c.skills) ? c.skills.join(', ') : '';
    return `
CANDIDATE ${idx + 1} [ID: ${c.id}]
Name: ${c.name || c.id}
Title: ${c.title || 'N/A'} @ ${c.current_company || 'N/A'}
Location: ${c.location || 'N/A'}
Experience: ${c.experience_years || 0} years
Skills: ${skills}
Education: ${c.education || 'N/A'}
GitHub Stars: ${c.github_stars || 0} | Open Source Contributions: ${c.open_source_contributions || 0}
Publications: ${c.publications || 0}
Response Rate: ${c.response_rate || 'N/A'} | Recent Activity Score: ${c.recent_activity_score || 'N/A'}
Notice Period: ${c.notice_period_weeks || 'N/A'} weeks
Remote Preference: ${c.remote_preference || 'N/A'}
Summary: ${(c.summary || '').slice(0, 400)}`.trim();
  });

  const prompt = `You are the ultimate AI recruiter performing intelligent candidate ranking.

TARGET ROLE:
Title: ${parsedJD.role_title}
Summary: ${parsedJD.role_summary}
Domain: ${parsedJD.domain_context}
Seniority: ${parsedJD.seniority}
Experience: ${parsedJD.experience_years?.min}–${parsedJD.experience_years?.max} years (ideal: ${parsedJD.experience_years?.ideal})
Required Skills: ${(parsedJD.required_skills || []).map(s => `${s.name} (${s.importance})`).join(', ')}
Preferred Skills: ${(parsedJD.preferred_skills || []).map(s => s.name).join(', ')}
Semantic Clusters: ${(parsedJD.semantic_clusters || []).join(', ')}
Behavioral Expectations: ${(parsedJD.behavioral_expectations || []).join(', ')}
Anti-patterns to penalize: ${(parsedJD.anti_patterns || []).join(', ')}

RANKING PHILOSOPHY:
- Semantic Fit: ${parsedJD.scoring_priorities?.semantic_fit}
- Career Relevance: ${parsedJD.scoring_priorities?.career_relevance}
- Signal Quality: ${parsedJD.scoring_priorities?.signal_quality}

CANDIDATES TO EVALUATE:
${summaries.join('\n\n---\n\n')}

Score each candidate 0-100 in four dimensions. Go BEYOND keyword matching — understand semantic fit, career trajectory, publication quality, open-source credibility, and genuine signal quality. A data analyst with no LLM experience should score far lower than a researcher with RLHF papers regardless of years of experience.

Return ONLY a JSON array with exactly ${candidates.length} objects in the same order as the candidates above:
[
  {
    "candidate_id": "string (the ID from the candidate)",
    "overall_score": number (0-100, weighted composite),
    "semantic_fit": number (0-100, role/skills/domain alignment),
    "behavioral": number (0-100, activity, responsiveness, open-source, publications),
    "experience": number (0-100, years, seniority, career trajectory),
    "preference": number (0-100, location, remote pref, notice period fit),
    "reasoning": "2-3 sentences — be highly specific about what drove the score, mentioning actual skills or projects",
    "key_strengths": ["strength1", "strength2", "strength3"],
    "concerns": ["concern1"],
    "is_honeypot": false
  }
]`;

  try {
    return await generateJSON(prompt);
  } catch (error) {
    handleGeminiError(error);
  }
}

// ── PHASE 3: Generate executive summary ───────────────────────────────────
export async function generateRankingSummary(parsedJD, topCandidates) {
  const top5 = topCandidates.slice(0, 5);
  const prompt = `You are a senior technical recruiter. Write a concise executive summary (3-4 sentences) of the top candidates shortlisted for the role of "${parsedJD.role_title}".

Top candidates:
${top5.map((c, i) => `#${i + 1}: ${c.name || c.candidate_id} (${c.candidate_id}) — Score: ${c.overall_score}/100 — ${c.reasoning}`).join('\n')}

Write a brief analytical paragraph explaining the quality of the shortlist and what made these candidates stand out. Be specific about their backgrounds.`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { temperature: 0.2, topP: 0.9, maxOutputTokens: 512 },
    });
    return response.text;
  } catch (error) {
    handleGeminiError(error);
  }
}
