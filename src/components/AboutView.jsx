import React from 'react';

export default function AboutView() {
  return (
    <div className="w-full max-w-[640px] mx-auto pt-[64px] pb-[64px] px-6 flex flex-col font-[family-name:var(--font-body)]">
      
      {/* Header */}
      <div className="flex flex-col mb-12">
        <h1 className="text-[22px] font-[family-name:var(--font-display)] font-[400] text-[var(--text-primary)] leading-tight mb-2">
          How Perspex Works
        </h1>
        <p className="text-[15px] leading-[1.7] text-[var(--text-muted)]">
          A 5-stage offline pipeline for precision candidate ranking.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* Section 1 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)] border-b border-[var(--border)] pb-2">
            The Problem with Keyword Matching
          </h2>
          <div className="flex flex-col gap-4 text-[15px] leading-[1.7] text-[var(--text-primary)]">
            <p>
              A keyword-only system will over-rank candidates who list modern AI terms without demonstrated relevant work history.
            </p>
            <p className="text-[var(--text-muted)]">
              Perspex instead uses career history, semantic retrieval, and behavioral signals to reduce false positives.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)] border-b border-[var(--border)] pb-2">
            Our 5-Stage Pipeline
          </h2>
          <ol className="flex flex-col gap-2 list-decimal list-outside ml-4 text-[15px] leading-[1.7] text-[var(--text-primary)]">
            <li className="pl-1">
              <strong>JD Parser</strong> — Extracts core requirements and competencies.
            </li>
            <li className="pl-1">
              <strong>Honeypot Filter</strong> — Identifies profiles artificially optimized for ATS systems.
            </li>
            <li className="pl-1">
              <strong>FAISS Search</strong> — High-dimensional vector search for semantic role alignment.
            </li>
            <li className="pl-1">
              <strong>Multi-Signal Scorer</strong> — Applies behavioral weights and historical trajectory markers.
            </li>
            <li className="pl-1">
              <strong>Ranked Output</strong> — Consolidates all metrics into a final deterministic sort.
            </li>
          </ol>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)] border-b border-[var(--border)] pb-2">
            The 23 Behavioral Signals
          </h2>
          <div className="flex flex-col gap-4 text-[15px] leading-[1.7] text-[var(--text-primary)]">
            <p>
              The <code className="bg-[var(--surface)] px-1.5 py-0.5 rounded text-[13px] font-mono border border-[var(--border)]">redrob_signals</code> object is what moves this beyond resume ranking.
            </p>
            <p className="text-[var(--text-muted)]">
              Perspex uses a selected subset directly for scoring, while the rest support explainability and validation.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)] border-b border-[var(--border)] pb-2">
            Scoring Formula
          </h2>
          <p className="text-[15px] leading-[1.7] text-[var(--text-primary)]">
            The final score is a weighted combination of semantic alignment, historical behavioral markers, experience depth, and explicit candidate preferences.
          </p>
          
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[4px] p-[12px] font-mono text-[13px] leading-relaxed overflow-x-auto text-[var(--text-primary)]">
            <div className="mb-4">
              FINAL_SCORE = 0.40 × Semantic<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.30 × Behavioral<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20 × Experience<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.10 × Preference
            </div>
            
            <div className="text-[var(--text-muted)] border-t border-[var(--border)] pt-3 mt-3">
              Hard gates:<br/>
              &nbsp;&nbsp;open_to_work = false&nbsp;&nbsp;→ excluded<br/>
              &nbsp;&nbsp;honeypot flag = true&nbsp;&nbsp;→ removed before scoring
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
