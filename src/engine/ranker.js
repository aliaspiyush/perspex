// Ranking pipeline orchestrator
import { parseJobDescription, scoreCandidateBatch, generateRankingSummary } from './gemini.js';

const BATCH_SIZE = 8;

// Parse JSONL text into array of candidate objects
function parseJsonl(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      try {
        const obj = JSON.parse(line);
        // Normalise the id field — accept 'id' or 'candidate_id'
        if (!obj.id && obj.candidate_id) obj.id = obj.candidate_id;
        if (!obj.candidate_id && obj.id) obj.candidate_id = obj.id;
        return obj;
      } catch {
        console.warn(`Skipping invalid JSONL line ${i + 1}:`, line.slice(0, 80));
        return null;
      }
    })
    .filter(Boolean);
}

// Read an uploaded File object as text
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export async function runRankingPipeline(jdText, candidateFile, onProgress) {
  // ── STEP 1: Parse JD ────────────────────────────────────────────────────
  onProgress({ phase: 'parsing_jd', message: 'Gemini is analyzing the job description…', pct: 5 });
  const parsedJD = await parseJobDescription(jdText);
  onProgress({ phase: 'jd_parsed', message: `JD parsed: "${parsedJD.role_title}" · ${parsedJD.seniority} · ${parsedJD.experience_years?.min}–${parsedJD.experience_years?.max} yrs`, pct: 12, parsedJD });

  // ── STEP 2: Load candidates ─────────────────────────────────────────────
  onProgress({ phase: 'loading_candidates', message: 'Reading candidate pool…', pct: 14 });

  let allCandidates = [];
  if (candidateFile) {
    const text = await readFileAsText(candidateFile);
    // Support both JSONL and JSON array formats
    const trimmed = text.trim();
    if (trimmed.startsWith('[')) {
      allCandidates = JSON.parse(trimmed);
      allCandidates = allCandidates.map(c => {
        if (!c.id && c.candidate_id) c.id = c.candidate_id;
        if (!c.candidate_id && c.id) c.candidate_id = c.id;
        return c;
      });
    } else {
      allCandidates = parseJsonl(text);
    }
  } else {
    // Fallback: fetch the sample file
    const res = await fetch('/sample_candidates.jsonl');
    const text = await res.text();
    allCandidates = parseJsonl(text);
  }

  onProgress({
    phase: 'candidates_loaded',
    message: `${allCandidates.length} candidates loaded. Starting AI evaluation…`,
    pct: 16,
    totalCandidates: allCandidates.length,
  });

  // ── STEP 3: Score in batches ─────────────────────────────────────────────
  const allScores = [];
  const totalBatches = Math.ceil(allCandidates.length / BATCH_SIZE);

  for (let i = 0; i < allCandidates.length; i += BATCH_SIZE) {
    const batch = allCandidates.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const pct = 16 + Math.round((batchNum / totalBatches) * 72);

    onProgress({
      phase: 'scoring',
      message: `Evaluating batch ${batchNum}/${totalBatches} — candidates ${i + 1}–${Math.min(i + BATCH_SIZE, allCandidates.length)}…`,
      pct,
      scored: allScores.length,
      total: allCandidates.length,
    });

    try {
      const batchScores = await scoreCandidateBatch(parsedJD, batch);

      const enriched = batchScores.map((score, idx) => {
        const raw = batch[idx] || {};
        return {
          // Merge Gemini scores with raw candidate data
          ...raw,
          candidate_id: score.candidate_id || raw.id || raw.candidate_id,
          name: raw.name || score.candidate_id,
          overall_score: score.overall_score ?? 0,
          final: (score.overall_score ?? 0) / 100,    // normalise 0-1 for existing UI
          semantic: (score.semantic_fit ?? 0) / 100,
          behavioral: (score.behavioral ?? 0) / 100,
          experience: (score.experience ?? 0) / 100,
          preference: (score.preference ?? 0) / 100,
          reasoning: score.reasoning || '',
          key_strengths: score.key_strengths || [],
          concerns: score.concerns || [],
          is_honeypot: score.is_honeypot || false,
          // Synthetic signals from raw data for the drawer
          signals: {
            open_to_work: raw.recent_activity_score > 0.5,
            notice_period: (raw.notice_period_weeks || 4) * 7,
            response_rate: raw.response_rate || 0.5,
            github_score: raw.github_stars || -1,
            last_active: new Date().toISOString(),
            work_mode: raw.remote_preference || 'remote',
          },
        };
      });

      allScores.push(...enriched);

      const sortedSoFar = [...allScores].sort((a, b) => b.overall_score - a.overall_score);
      onProgress({
        phase: 'partial_results',
        message: `${allScores.length}/${allCandidates.length} evaluated…`,
        partialResults: sortedSoFar,
        scored: allScores.length,
        total: allCandidates.length,
        pct,
      });
    } catch (err) {
      console.error(`Batch ${batchNum} failed:`, err);
      onProgress({
        phase: 'batch_error',
        message: `Batch ${batchNum} encountered an error — continuing…`,
        pct,
      });
    }
  }

  // ── STEP 4: Final sort ───────────────────────────────────────────────────
  onProgress({ phase: 'finalizing', message: 'Sorting final rankings…', pct: 92 });
  const finalRanked = allScores
    .filter(c => !c.is_honeypot)
    .sort((a, b) => b.overall_score - a.overall_score)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  // ── STEP 5: Executive summary ────────────────────────────────────────────
  onProgress({ phase: 'summary', message: 'Generating executive summary…', pct: 96 });
  let summary = '';
  try {
    summary = await generateRankingSummary(parsedJD, finalRanked);
  } catch {
    summary = `AI ranking complete. ${finalRanked.length} candidates evaluated. Top score: ${finalRanked[0]?.overall_score}/100.`;
  }

  onProgress({
    phase: 'complete',
    message: 'Ranking complete.',
    pct: 100,
    finalRanked,
    parsedJD,
    summary,
    totalCandidates: allCandidates.length,
  });

  return { finalRanked, parsedJD, summary };
}
