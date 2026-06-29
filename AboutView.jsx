import React from 'react';

const AboutView = () => {
  return (
    <div className="w-full max-w-[680px] mx-auto pt-[var(--space-12)] pb-[var(--space-16)] px-6 flex flex-col">
      <div className="flex flex-col mb-12">
        <h1 className="text-[var(--text-xl)] font-[family-name:var(--font-display)] font-[400] text-[var(--text-primary)] leading-tight mb-2">How Perspex Works</h1>
        <p className="text-[var(--text-base)] leading-[1.7] text-[var(--text-muted)]">A 5-stage offline pipeline for precision candidate ranking.</p>
      </div>

      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <h2 className="text-[var(--text-sm)] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">The Problem with Keyword Matching</h2>
          <div className="flex flex-col gap-4 text-[var(--text-base)] leading-[1.7] text-[var(--text-primary)]">
            <p>A keyword-only system will over-rank candidates who list modern AI terms without demonstrated relevant work history.</p>
            <p className="text-[var(--text-muted)]">Perspex instead uses career history, semantic retrieval, and behavioral signals to reduce false positives.</p>
          </div>
        </section>

        <hr className="border-[var(--border)]" />

        <section className="flex flex-col gap-4">
          <h2 className="text-[var(--text-sm)] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">Our 5-Stage Pipeline</h2>
          <ol className="flex flex-col gap-2 list-decimal list-outside ml-4 text-[var(--text-base)] leading-[1.7] text-[var(--text-primary)]">
            <li className="pl-1"><strong>JD Parser</strong> — Extracts core requirements and competencies.</li>
            <li className="pl-1"><strong>Honeypot Filter</strong> — Identifies profiles artificially optimized for ATS systems.</li>
            <li className="pl-1"><strong>FAISS Search</strong> — High-dimensional vector search for semantic role alignment.</li>
            <li className="pl-1"><strong>Multi-Signal Scorer</strong> — Applies behavioral weights and historical trajectory markers.</li>
            <li className="pl-1"><strong>Ranked Output</strong> — Consolidates all metrics into a final deterministic sort.</li>
          </ol>
        </section>

        <hr className="border-[var(--border)]" />

        <section className="flex flex-col gap-4">
          <h2 className="text-[var(--text-sm)] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">The 23 Behavioral Signals</h2>
          <div className="flex flex-col gap-4 text-[var(--text-base)] leading-[1.7] text-[var(--text-primary)]">
            <p>The <code className="bg-[var(--surface)] px-1.5 py-0.5 text-[var(--text-sm)] font-mono border border-[var(--border)] rounded-[4px]">redrob_signals</code> object is what moves this beyond resume ranking.</p>
            <p className="text-[var(--text-muted)]">Perspex uses a selected subset directly for scoring, while the rest support explainability and validation.</p>
          </div>
        </section>

        <hr className="border-[var(--border)]" />

        <section className="flex flex-col gap-4">
          <h2 className="text-[var(--text-sm)] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">Scoring Formula</h2>
          <p className="text-[var(--text-base)] leading-[1.7] text-[var(--text-primary)]">The final score is a weighted combination of semantic alignment, historical behavioral markers, experience depth, and explicit candidate preferences.</p>
          <pre className="formula-block">
            {`FINAL_SCORE = 0.40 × Semantic Match
            + 0.30 × Behavioral Score
            + 0.20 × Experience Fit
            + 0.10 × Preference Fit

Hard exclusions:
  open_to_work = false  →  excluded before scoring
  honeypot flag = true  →  removed before retrieval`}
          </pre>
        </section>
      </div>
    </div>
  );
};

export default AboutView;