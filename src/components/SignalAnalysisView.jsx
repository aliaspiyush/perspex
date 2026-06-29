import React from 'react';

const SIGNAL_CLASSES = [
  {
    id: 'A',
    title: 'Profile Attributes',
    weight: '15%',
    field: 'profile.*',
    what: 'years_of_experience, current_title, current_company, headline',
    why: 'Establishes the baseline structural fit against JD hard constraints. Mismatches here cap the total score.',
    how: 'YOE scored on a bell-curve (5–8 yr ideal band). Title matched against target role list.',
  },
  {
    id: 'B',
    title: 'Career Metadata',
    weight: '35%',
    field: 'career_history[]',
    what: 'title, company, industry, duration_months, is_current',
    why: 'Validates that claimed experience is substantiated by real job history. Prevents over-ranking irrelevant career paths.',
    how: 'Titles matched against ML/AI/Backend target list. Relevant tenure months accumulated and normalized over 120-month ceiling.',
  },
  {
    id: 'C',
    title: 'Skill Depth',
    weight: '25%',
    field: 'skills[]',
    what: 'name, proficiency, duration_months, endorsements',
    why: 'Goes beyond keyword presence. A skill with 48 months of advanced-level practice outranks a beginner tag by 3×.',
    how: 'Proficiency multiplier (advanced 1.5× / intermediate 1.0× / beginner 0.5×) × duration fraction. Zero-duration expert skills = honeypot flag + penalty.',
  },
  {
    id: 'D',
    title: 'Behavioral Signals',
    weight: '25%',
    field: 'redrob_signals.*',
    what: 'open_to_work_flag, recruiter_response_rate, interview_completion_rate',
    why: 'Semantic match alone is necessary but not sufficient. A top-match candidate who never responds is useless. Active seekers are structurally more valuable.',
    how: 'open_to_work +0.3, response_rate ×0.4, interview_completion ×0.3. Zero response rate = −2 pt penalty.',
  },
];

const FORMULA_STEPS = [
  { step: '1', expr: 'skillScore = Σ (proficiencyWeight × min(duration, 60) / 60)', note: 'Per target skill found in profile' },
  { step: '2', expr: 'yoeScore = bell_curve(years_of_experience, ideal=6.5)', note: '1.0 at 5–8 yrs, degrades outside band' },
  { step: '3', expr: 'tenureScore = min(relevantMonths, 120) / 120', note: 'Accumulated months in ML/AI/Backend titles' },
  { step: '4', expr: 'careerScore = 0.4 × yoeScore + 0.6 × tenureScore', note: 'Weighted blend of YOE + tenure' },
  { step: '5', expr: 'behaviorScore = 0.3×openWork + 0.4×responseRate + 0.3×interviewRate', note: 'All signals in [0, 1] range' },
  { step: '6', expr: 'rawScore = (skillScore×3) + (careerScore×4) + (behaviorScore×3)', note: 'Pillar combination' },
  { step: '7', expr: 'finalScore = rawScore − penalties', note: 'Honeypot: −5.0 · Zero-response: −2.0' },
];

export default function SignalAnalysisView() {
  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto pb-12">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--divider)] pb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Pillar 03</div>
        <h1 className="text-3xl font-[family-name:var(--font-display)] tracking-tight">Signal Integration</h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
          Leveraging all available data — profile attributes, career metadata, and crucial activity/behavioral signals — to produce a score
          that reflects genuine candidate quality, not surface-level keyword density.
        </p>
      </div>

      {/* Core insight */}
      <div className="border border-[var(--border)] rounded-[var(--radius)] p-6 bg-[var(--surface)] text-sm leading-relaxed">
        <strong>Why multi-signal?</strong>{' '}
        Two candidates can have identical keyword overlap yet rank 30 positions apart. One spent 4 years in production ML at scale;
        the other spent 4 years in unrelated backend work with ML skills zero-duration copy-pasted from a template.
        Perspex separates them by integrating signal <em>depth</em>, not just signal <em>presence</em>.
      </div>

      {/* Signal classes */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Signal Classes</h2>
        <div className="flex flex-col gap-4">
          {SIGNAL_CLASSES.map(s => (
            <div key={s.id} className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--divider)] bg-[var(--surface-2)]">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[var(--text-muted)]">{s.id}</span>
                  <span className="font-semibold text-sm">{s.title}</span>
                  <code className="text-[10px] text-[var(--text-muted)] bg-[var(--bg)] px-1.5 py-0.5 rounded border border-[var(--divider)]">{s.field}</code>
                </div>
                <span className="font-mono text-xs text-[var(--text-muted)]">{s.weight}</span>
              </div>
              <div className="px-5 py-4 grid grid-cols-3 gap-6 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Fields Used</span>
                  <span className="text-[var(--text)] leading-relaxed">{s.what}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Why It Matters</span>
                  <span className="text-[var(--text-muted)] leading-relaxed">{s.why}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">How It's Scored</span>
                  <span className="text-[var(--text-muted)] leading-relaxed">{s.how}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scoring formula */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Scoring Formula</h2>
        <div className="border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
          <div className="px-5 py-3 bg-[var(--surface-2)] border-b border-[var(--divider)] text-xs text-[var(--text-muted)]">
            rank_candidates.js · lines 30–115
          </div>
          {FORMULA_STEPS.map((row, i) => (
            <div key={row.step} className={`flex gap-6 px-5 py-3 text-xs ${i > 0 ? 'border-t border-[var(--divider)]' : ''} bg-[var(--bg)]`}>
              <span className="font-mono text-[var(--text-muted)] w-4 shrink-0">{row.step}</span>
              <code className="font-mono text-[var(--text)] flex-1">{row.expr}</code>
              <span className="text-[var(--text-muted)] hidden md:block w-64 shrink-0 text-right">{row.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stream engine */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Lightning-Fast Engine Architecture</h2>
        <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-6 flex flex-col gap-4 text-sm">
          <p className="text-[var(--text-muted)] leading-relaxed">
            The 487MB <code className="bg-[var(--surface-offset)] px-1 rounded text-xs">candidates.jsonl</code> file is processed
            via Node.js <strong className="text-[var(--text)]">readline stream</strong> — one candidate at a time, zero memory accumulation.
            A <strong className="text-[var(--text)]">Top-100 priority queue</strong> is maintained in-memory. Any candidate scoring below the
            current 100th score is discarded immediately. Total runtime: <strong className="text-[var(--text)]">~5 seconds on CPU</strong>.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[var(--divider)]">
            {[
              { label: 'Memory Model',   value: 'O(100) constant'   },
              { label: 'Throughput',     value: '~20K cands/sec'    },
              { label: 'GPU Required',   value: 'No'                },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{s.label}</span>
                <span className="font-mono text-sm font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
