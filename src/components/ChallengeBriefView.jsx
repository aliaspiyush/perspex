import React from 'react';
import { getChallengeFiles } from '../utils/adapters';

const PILLARS = [
  {
    num: '01',
    title: 'Deep Job Understanding',
    body: 'Interpreting complex, nuanced job descriptions into machine-usable ranking intent — skills, seniority bands, semantic clusters, and logistics.',
    href: '#understanding',
  },
  {
    num: '02',
    title: 'Contextual Relevance',
    body: 'Seeing beyond keywords to understand semantic fit. Skill proficiency × duration_months rewards genuine depth over keyword stuffing.',
    href: '#ranking',
  },
  {
    num: '03',
    title: 'Signal Integration',
    body: 'Leveraging all data: profile attributes, career metadata, and crucial activity/behavioral signals from redrob_signals.',
    href: '#signals',
  },
  {
    num: '04',
    title: 'Ranked Shortlist Output',
    body: 'Delivering a lightning-fast, highly accurate, expertly ranked shortlist. 100,000 candidates processed in ~5 seconds on CPU.',
    href: '#shortlist',
  },
];

const ENGINE_STATS = [
  { label: 'Candidates Processed', value: '100,000' },
  { label: 'Processing Time',      value: '~5s'       },
  { label: 'Top Shortlisted',      value: '100'        },
  { label: 'Scoring Dimensions',   value: '3'          },
];

export default function ChallengeBriefView() {
  const files = getChallengeFiles();

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto pb-12">

      {/* Problem Statement */}
      <div className="flex flex-col gap-5 border-b border-[var(--divider)] pb-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Data &amp; AI Challenge · Redrob · India Runs
        </div>
        <h1 className="text-4xl font-[family-name:var(--font-display)] tracking-tight leading-tight">
          Intelligent Candidate Discovery
        </h1>
        <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-2xl">
          Develop a robust, workable Proof of Concept that doesn't just filter, but <strong className="text-[var(--text)]">intelligently ranks candidates</strong>.
          Your system should act as the ultimate AI recruiter.
        </p>
        <blockquote className="border-l-2 border-[var(--text)] pl-5 py-1 text-sm text-[var(--text-muted)] italic leading-relaxed">
          "No fixed architecture → unleash your innovation → Bring the best of your creativity."
        </blockquote>
      </div>

      {/* 4 Pillars */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Four Core Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PILLARS.map(p => (
            <a
              key={p.num}
              href={p.href}
              className="group flex flex-col gap-3 p-5 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] hover:bg-[var(--surface-offset)] transition-colors no-underline"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-[var(--text-faint)]">{p.num}</span>
                <span className="text-[var(--text-faint)] group-hover:text-[var(--text-muted)] text-xs transition-colors">→</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-[var(--text)]">{p.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{p.body}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Engine Stats */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Perspex Engine — At a Glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ENGINE_STATS.map(s => (
            <div key={s.label} className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-4 flex flex-col gap-1">
              <span className="font-mono text-xl font-bold text-[var(--text)]">{s.value}</span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Files */}
      <div className="flex flex-col gap-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Challenge Artifacts</h2>
        <div className="border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-[var(--divider)] bg-[var(--surface-2)]">
              <tr>
                <th className="px-4 py-2.5 font-medium text-[var(--text-muted)]">File</th>
                <th className="px-4 py-2.5 font-medium text-[var(--text-muted)]">Type</th>
                <th className="px-4 py-2.5 font-medium text-[var(--text-muted)]">Role</th>
                <th className="px-4 py-2.5 font-medium text-[var(--text-muted)] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--divider)] bg-[var(--bg)]">
              {files.map(f => (
                <tr key={f.name}>
                  <td className="px-4 py-2.5 font-mono text-[var(--text)]">{f.name}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)]">{f.type}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)]">{f.role}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`font-mono uppercase tracking-wider text-[10px] ${
                      f.status === 'generated' || f.status === 'complete' || f.status === 'processed'
                        ? 'text-[var(--text)]'
                        : 'text-[var(--text-faint)]'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
