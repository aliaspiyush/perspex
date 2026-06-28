import React from 'react';

export default function ChallengeBriefView() {
  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 border-b border-[var(--divider)] pb-8">
        <h1 className="text-3xl font-[family-name:var(--font-display)] tracking-tight">
          Data & AI Challenge: Intelligent Candidate Discovery
        </h1>
        <p className="text-lg text-[var(--text-muted)] font-medium leading-relaxed">
          Build a robust proof of concept that intelligently ranks candidates, not just filters them.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <h2 className="text-sm font-semibold tracking-wider text-[var(--text-muted)] uppercase">Problem Pillars</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col gap-3 p-6 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)]">
            <h3 className="text-base font-semibold text-[var(--text)] font-mono">1. Deep Job Understanding</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Interpret a nuanced job description into machine-usable criteria.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)]">
            <h3 className="text-base font-semibold text-[var(--text)] font-mono">2. Contextual Relevance</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Rank based on semantic fit, not keyword stuffing.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)]">
            <h3 className="text-base font-semibold text-[var(--text)] font-mono">3. Signal Integration</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Combine profile attributes, career history, and behavioral indicators.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-6 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)]">
            <h3 className="text-base font-semibold text-[var(--text)] font-mono">4. Ranked Output</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Deliver a shortlist that is fast, explainable, and relevant.
            </p>
          </div>

        </div>
      </div>

      <div className="mt-8 p-6 bg-[var(--text)] text-[var(--bg)] rounded-[var(--radius)]">
        <p className="text-sm font-medium">
          Perspex is designed exclusively as an evaluation workbench to demonstrate these 4 pillars in action.
        </p>
      </div>
    </div>
  );
}
