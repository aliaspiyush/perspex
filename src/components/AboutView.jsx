import React from 'react';

export default function AboutView() {
  return (
    <div className="w-full max-w-[680px] mx-auto py-12 px-6 flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col gap-4 mb-16">
        <h1 className="text-5xl font-[family-name:var(--font-display)] leading-tight tracking-tight">
          How Perspex Works
        </h1>
        <p className="text-lg text-[var(--text-muted)]">
          A 5-stage offline pipeline for precision candidate ranking.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        
        {/* Section 1 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-[family-name:var(--font-display)] border-b border-[var(--divider)] pb-4">
            The Problem with Keyword Matching
          </h2>
          <div className="flex flex-col gap-4 text-[var(--text)] leading-relaxed">
            <p>
              A keyword-only system will over-rank candidates who list modern AI terms without demonstrated relevant work history.
            </p>
            <p className="text-[var(--text-muted)]">
              Perspex instead uses career history, semantic retrieval, and behavioral signals to reduce false positives.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-[family-name:var(--font-display)] border-b border-[var(--divider)] pb-4">
            Our 5-Stage Pipeline
          </h2>
          <ol className="flex flex-col gap-4 list-decimal list-outside ml-5 text-[var(--text)]">
            <li className="pl-2">
              <strong>JD Parser</strong> — Extracts core requirements and competencies.
            </li>
            <li className="pl-2">
              <strong>Honeypot Filter</strong> — Identifies profiles artificially optimized for ATS systems.
            </li>
            <li className="pl-2">
              <strong>FAISS Search</strong> — High-dimensional vector search for semantic role alignment.
            </li>
            <li className="pl-2">
              <strong>Multi-Signal Scorer</strong> — Applies behavioral weights and historical trajectory markers.
            </li>
            <li className="pl-2">
              <strong>Ranked Output</strong> — Consolidates all metrics into a final deterministic sort.
            </li>
          </ol>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-[family-name:var(--font-display)] border-b border-[var(--divider)] pb-4">
            The 23 Behavioral Signals
          </h2>
          <div className="flex flex-col gap-4 text-[var(--text)] leading-relaxed">
            <p>
              The <code className="bg-[var(--surface-offset)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border)]">redrob_signals</code> object is what moves this beyond resume ranking.
            </p>
            <p className="text-[var(--text-muted)]">
              Perspex uses a selected subset directly for scoring, while the rest support explainability and validation.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-[family-name:var(--font-display)] border-b border-[var(--divider)] pb-4">
            Scoring Formula
          </h2>
          <p className="text-[var(--text)] leading-relaxed">
            The final score is a weighted combination of semantic alignment, historical behavioral markers, experience depth, and explicit candidate preferences.
          </p>
          
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-6 font-mono text-sm leading-relaxed overflow-x-auto">
            <div className="text-[var(--text)] mb-4">
              FINAL_SCORE = 0.40 × Semantic<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.30 × Behavioral<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20 × Experience<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.10 × Preference
            </div>
            
            <div className="text-[var(--text-muted)] border-t border-[var(--divider)] pt-4 mt-4">
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
