// Ranking pipeline orchestrator — API key is handled internally via env
import { parseJobDescription, scoreCandidateBatch, generateRankingSummary } from './gemini.js';

const BATCH_SIZE = 5;

export async function loadCandidates() {
  const res = await fetch('/sample_candidates.json');
  if (!res.ok) throw new Error('Could not load sample_candidates.json');
  return res.json();
}

export async function runRankingPipeline(jdText, onProgress) {
  // STEP 1: Parse JD
  onProgress({ phase: 'parsing_jd', message: 'Gemini is deeply analyzing the job description…', pct: 5 });
  const parsedJD = await parseJobDescription(jdText);
  onProgress({ phase: 'jd_parsed', message: 'Job description parsed into ranking schema.', pct: 10, parsedJD });

  // STEP 2: Load candidates
  onProgress({ phase: 'loading_candidates', message: 'Loading candidate pool…', pct: 12 });
  const allCandidates = await loadCandidates();
  onProgress({
    phase: 'candidates_loaded',
    message: `${allCandidates.length} candidates loaded. Starting AI evaluation…`,
    pct: 15,
    totalCandidates: allCandidates.length,
  });

  // STEP 3: Score in batches
  const allScores = [];
  const totalBatches = Math.ceil(allCandidates.length / BATCH_SIZE);

  for (let i = 0; i < allCandidates.length; i += BATCH_SIZE) {
    const batch = allCandidates.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    onProgress({
      phase: 'scoring',
      message: `Evaluating batch ${batchNum}/${totalBatches} (candidates ${i + 1}–${Math.min(i + BATCH_SIZE, allCandidates.length)})…`,
      pct: 15 + Math.round((batchNum / totalBatches) * 75),
      batchNum,
      totalBatches,
      scored: allScores.length,
      total: allCandidates.length,
    });

    try {
      const batchScores = await scoreCandidateBatch(parsedJD, batch);
      const enriched = batchScores.map((score, idx) => ({
        ...score,
        candidate_id: score.candidate_id || batch[idx]?.candidate_id,
        profile:       batch[idx]?.profile        || {},
        skills:        batch[idx]?.skills         || [],
        career_history:batch[idx]?.career_history || [],
        education:     batch[idx]?.education      || [],
        redrob_signals:batch[idx]?.redrob_signals || {},
        certifications:batch[idx]?.certifications || [],
      }));
      allScores.push(...enriched);

      const sortedSoFar = [...allScores].sort((a, b) => b.overall_score - a.overall_score);
      onProgress({
        phase: 'partial_results',
        partialResults: sortedSoFar,
        scored: allScores.length,
        total: allCandidates.length,
      });
    } catch (err) {
      console.error(`Batch ${batchNum} failed:`, err);
    }
  }

  // STEP 4: Final sort
  onProgress({ phase: 'finalizing', message: 'Finalizing rankings…', pct: 92 });
  const finalRanked = allScores
    .sort((a, b) => b.overall_score - a.overall_score)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  // STEP 5: Summary
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
