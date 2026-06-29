import React from 'react';
import { parseJobDescription } from '../utils/adapters';

export default function JobUnderstandingView() {
  const jd = parseJobDescription();

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto pb-12">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[var(--divider)] pb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Pillar 01</div>
        <h1 className="text-3xl font-[family-name:var(--font-display)] tracking-tight">Deep Job Understanding</h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
          Raw job descriptions contain nuanced intent that simple keyword matching misses. Perspex parses the JD into a structured
          schema that drives the ranking engine — skills, seniority bands, semantic clusters, and behavioral expectations.
        </p>
      </div>

      {/* Structured Role Profile */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Parsed Role Profile</h2>

        <div className="border border-[var(--border)] rounded-[var(--radius)] overflow-hidden bg-[var(--surface)]">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-[var(--divider)]">
            {[
              { label: 'Role Title',       value: jd.title         },
              { label: 'Seniority',        value: jd.seniority     },
              { label: 'Experience Band',  value: jd.years_experience },
              { label: 'Work Mode',        value: jd.work_mode     },
            ].map(f => (
              <div key={f.label} className="px-5 py-4 flex flex-col gap-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{f.label}</span>
                <span className="text-sm font-medium">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Required vs Preferred */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Required Skills</h2>
          <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-5 flex flex-col gap-3">
            <p className="text-xs text-[var(--text-muted)]">High-weight signals — presence elevates rank significantly</p>
            <div className="flex flex-wrap gap-2">
              {jd.required_skills.map(s => (
                <span key={s} className="px-2 py-1 border border-[var(--border)] rounded text-xs font-mono bg-[var(--bg)]">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Preferred Skills</h2>
          <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-5 flex flex-col gap-3">
            <p className="text-xs text-[var(--text-muted)]">Moderate boost — good-to-have signals for differentiation</p>
            <div className="flex flex-wrap gap-2">
              {jd.preferred_skills.map(s => (
                <span key={s} className="px-2 py-1 border border-[var(--divider)] rounded text-xs font-mono text-[var(--text-muted)] bg-[var(--bg)]">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scoring weights */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Score Weight Allocation</h2>
        <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] overflow-hidden">
          {[
            {
              label: 'Semantic Fit',
              weight: jd.score_weights.semantic,
              desc: 'Skill name matching against semantic terms × proficiency multiplier × duration in months',
            },
            {
              label: 'Career Relevance',
              weight: jd.score_weights.career,
              desc: 'YOE bell-curve (5–8 yr ideal) + tenure months in ML/Backend/AI roles',
            },
            {
              label: 'Behavioral Signals',
              weight: jd.score_weights.signals,
              desc: 'open_to_work flag + recruiter response rate + interview completion rate',
            },
          ].map((row, i) => (
            <div key={row.label} className={`px-5 py-4 flex items-center gap-6 ${i > 0 ? 'border-t border-[var(--divider)]' : ''}`}>
              <div className="w-32 shrink-0">
                <span className="text-sm font-medium">{row.label}</span>
              </div>
              <div className="flex-1 flex items-center gap-4">
                <div className="flex-1 h-1.5 bg-[var(--surface-offset)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--text)] rounded-full" style={{ width: `${row.weight}%` }} />
                </div>
                <span className="font-mono text-sm w-10 text-right shrink-0">{row.weight}%</span>
              </div>
              <div className="hidden md:block w-80 text-xs text-[var(--text-muted)] leading-relaxed">
                {row.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Terms */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Semantic Term Index</h2>
        <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-5">
          <p className="text-xs text-[var(--text-muted)] mb-4">
            These tokens are matched against skill names in candidate profiles. Substring matching ensures "Fine-tuning LLMs" matches "llm".
          </p>
          <div className="flex flex-wrap gap-2">
            {jd.semantic_terms.map(t => (
              <code key={t} className="px-2 py-0.5 border border-[var(--divider)] rounded text-xs bg-[var(--bg)] text-[var(--text-muted)]">{t}</code>
            ))}
          </div>
        </div>
      </div>

      {/* Honeypot detection */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Contextual Relevance — Anti-Noise Rules</h2>
        <div className="border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
          <div className="px-5 py-3 bg-[var(--surface-2)] border-b border-[var(--divider)] text-xs text-[var(--text-muted)]">
            Two patterns that indicate dishonest or low-quality profiles — both trigger score penalties
          </div>
          {[
            {
              flag: 'expert_skill_zero_duration',
              desc: 'A candidate lists "Advanced" or "Expert" in a skill but duration_months = 0. This is statistically impossible and indicates keyword stuffing for ATS.',
              penalty: '−5.0 pts',
            },
            {
              flag: 'zero_response_rate',
              desc: 'recruiter_response_rate = 0. A perfect skill match who never responds is worthless to the hiring pipeline.',
              penalty: '−2.0 pts',
            },
          ].map(r => (
            <div key={r.flag} className="px-5 py-4 border-b border-[var(--divider)] last:border-0 bg-[var(--bg)] flex gap-5">
              <code className="font-mono text-xs text-[var(--text)] shrink-0 mt-0.5">{r.flag}</code>
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{r.desc}</p>
              </div>
              <span className="font-mono text-xs text-[var(--text)] shrink-0">{r.penalty}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
