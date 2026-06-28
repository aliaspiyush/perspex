import React from 'react';

export default function SignalAnalysisView() {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto h-full pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-[family-name:var(--font-display)]">Signal Analysis</h1>
        <p className="text-sm text-[var(--text-muted)]">Explainability engine demonstrating how data classes are integrated into the ranking heuristic.</p>
      </div>

      <div className="flex flex-col gap-8">
        
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Why Signal Integration Matters</h2>
          <div className="p-6 border border-[var(--text)] bg-[var(--text)] text-[var(--bg)] rounded-[var(--radius)] text-sm leading-relaxed font-medium">
            Two candidates with identical keyword overlap can rank vastly differently in this system. 
            By integrating contextual and behavioral signals (e.g., tenure consistency, recent activity, skill-to-duration ratios), 
            Perspex separates genuine, active, high-intent professionals from artificially optimized ATS resumes.
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Signal Classes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Class 1 */}
            <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--divider)] pb-3">
                <h3 className="font-mono text-sm font-semibold">Profile Quality</h3>
              </div>
              <div className="flex flex-col gap-3 text-sm text-[var(--text-muted)]">
                <p><strong className="text-[var(--text)]">What is used:</strong> Title relevance, location metadata, explicit years of experience.</p>
                <p><strong className="text-[var(--text)]">Why it matters:</strong> Establishes the baseline structural fit against JD hard constraints.</p>
                <p><strong className="text-[var(--text)]">Rank impact:</strong> Forms the foundational multiplier. Mismatches here cap the maximum possible score.</p>
              </div>
            </div>

            {/* Class 2 */}
            <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--divider)] pb-3">
                <h3 className="font-mono text-sm font-semibold">Career Depth & Relevance</h3>
              </div>
              <div className="flex flex-col gap-3 text-sm text-[var(--text-muted)]">
                <p><strong className="text-[var(--text)]">What is used:</strong> Contextual descriptions of past roles, tenure duration per role, trajectory of seniority.</p>
                <p><strong className="text-[var(--text)]">Why it matters:</strong> Prevents over-ranking candidates with 10 years of irrelevant experience or excessive job hopping.</p>
                <p><strong className="text-[var(--text)]">Rank impact:</strong> Modulates the experience score. Longer, highly relevant tenures boost rank significantly.</p>
              </div>
            </div>

            {/* Class 3 */}
            <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--divider)] pb-3">
                <h3 className="font-mono text-sm font-semibold">Skill Consistency</h3>
              </div>
              <div className="flex flex-col gap-3 text-sm text-[var(--text-muted)]">
                <p><strong className="text-[var(--text)]">What is used:</strong> Claimed proficiency levels versus attached duration_months.</p>
                <p><strong className="text-[var(--text)]">Why it matters:</strong> Acts as an automated honeypot detector. "Expert" skills with 0 months of duration indicate keyword stuffing.</p>
                <p><strong className="text-[var(--text)]">Rank impact:</strong> Detects anomalies and applies severe risk penalties, plummeting the rank of dishonest profiles.</p>
              </div>
            </div>

            {/* Class 4 */}
            <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--divider)] pb-3">
                <h3 className="font-mono text-sm font-semibold">Behavioral Responsiveness</h3>
              </div>
              <div className="flex flex-col gap-3 text-sm text-[var(--text-muted)]">
                <p><strong className="text-[var(--text)]">What is used:</strong> <code className="bg-[var(--surface-offset)] px-1 py-0.5 rounded border border-[var(--border)]">redrob_signals.response_rate</code> and <code className="bg-[var(--surface-offset)] px-1 py-0.5 rounded border border-[var(--border)]">last_active</code>.</p>
                <p><strong className="text-[var(--text)]">Why it matters:</strong> A perfect match who never responds is useless. Active seekers are structurally more valuable.</p>
                <p><strong className="text-[var(--text)]">Rank impact:</strong> Acts as a strong positive weight for active candidates, and a heavy penalty for dormant ones.</p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
