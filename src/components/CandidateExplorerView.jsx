import React, { useState, useEffect } from 'react';
import { fetchCandidates } from '../utils/adapters';

const PROFICIENCY_WEIGHT = { advanced: 1.5, intermediate: 1.0, beginner: 0.5 };
const TARGET_SKILLS = ['pytorch', 'nlp', 'llm', 'transformer', 'mlops', 'ai', 'machine learning', 'deep learning', 'fine-tuning', 'infrastructure', 'faiss', 'lora', 'onnx', 'inference'];

function isAnomalous(c) {
  const skills = c.skills || [];
  return skills.some(s =>
    (s.proficiency === 'advanced' || s.proficiency === 'expert') &&
    (s.duration_months === 0 || s.duration_months == null)
  );
}

function flagsFor(c) {
  const f = [];
  const skills = c.skills || [];
  const sigs = c.redrob_signals || {};

  skills.forEach(s => {
    const isHigh = s.proficiency === 'advanced' || s.proficiency === 'expert';
    if (isHigh && (s.duration_months === 0 || s.duration_months == null)) {
      f.push(`Honeypot: "${s.name}" listed as ${s.proficiency} with 0 months duration`);
    }
  });

  if (sigs.recruiter_response_rate === 0) {
    f.push('Inactive: 0% recruiter response rate');
  }

  return f;
}

export default function CandidateExplorerView() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchCandidates().then(data => {
      setCandidates(data);
      if (data.length > 0) setSelectedId(data[0].id);
      setLoading(false);
    });
  }, []);

  const filtered = candidates.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.id || '').toLowerCase().includes(q) ||
      (c.profile?.current_title || c.profile?.headline || '').toLowerCase().includes(q) ||
      (c.profile?.current_company || '').toLowerCase().includes(q) ||
      (c.skills || []).some(s => s.name.toLowerCase().includes(q))
    );
  });

  const selected = candidates.find(c => c.id === selectedId);
  const flags = selected ? flagsFor(selected) : [];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
        <div>
          <h1 className="text-2xl font-[family-name:var(--font-display)]">Candidate Explorer</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Inspect ranked candidates from the AI backend</p>
        </div>
        <div className="flex-1 flex items-center justify-center border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] text-sm text-[var(--text-muted)]">
          Loading AI-ranked candidates…
        </div>
      </div>
    );
  }

  const TABS = ['profile', 'career', 'skills', 'signals', 'score'];

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
      <div className="shrink-0">
        <h1 className="text-2xl font-[family-name:var(--font-display)]">Candidate Explorer</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {candidates.length} AI-ranked candidates — click any row to inspect full profile
        </p>
      </div>

      <div className="flex-1 min-h-0 flex border border-[var(--border)] rounded-[var(--radius)] overflow-hidden bg-[var(--surface)]">

        {/* ── Left list ── */}
        <div className="w-64 shrink-0 flex flex-col border-r border-[var(--border)]">
          <div className="p-3 border-b border-[var(--divider)] bg-[var(--surface-2)]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="w-full px-2.5 py-1.5 text-xs border border-[var(--border)] rounded bg-[var(--bg)] focus:outline-none focus:border-[var(--text-muted)] transition-colors"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c => {
              const anomaly = isAnomalous(c);
              return (
                <div
                  key={c.id}
                  onClick={() => { setSelectedId(c.id); setActiveTab('profile'); }}
                  className={`px-3 py-3 border-b border-[var(--divider)] cursor-pointer transition-colors border-l-2 ${
                    selectedId === c.id
                      ? 'bg-[var(--surface-offset)] border-l-[var(--text)]'
                      : 'border-l-transparent hover:bg-[var(--surface-offset)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-medium truncate">{c.id}</span>
                    {anomaly && <span className="text-[10px] font-mono shrink-0 text-[var(--text-muted)]">⚑</span>}
                  </div>
                  <div className="text-xs text-[var(--text)] truncate mt-0.5">
                    {c.profile?.current_title || c.profile?.headline || '—'}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate">
                    #{c.rank} · {c.match_score?.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right detail ── */}
        <div className="flex-1 min-w-0 flex flex-col bg-[var(--bg)]">
          {selected ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--divider)] flex items-start justify-between shrink-0">
                <div>
                  <div className="font-mono text-sm font-semibold">{selected.id}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">
                    {selected.profile?.current_title || selected.profile?.headline || '—'}
                    {selected.profile?.current_company ? ` · ${selected.profile.current_company}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono border border-[var(--border)] px-2 py-1 rounded bg-[var(--surface)]">
                    Rank #{selected.rank}
                  </span>
                  <span className="font-mono border border-[var(--border)] px-2 py-1 rounded bg-[var(--surface)]">
                    Score {selected.match_score?.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Flags */}
              {flags.length > 0 && (
                <div className="mx-6 mt-4 px-4 py-3 border border-[var(--border)] rounded bg-[var(--surface-offset)] shrink-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">
                    ⚑ Consistency Flags
                  </div>
                  <ul className="flex flex-col gap-1">
                    {flags.map((f, i) => (
                      <li key={i} className="text-xs text-[var(--text)]">{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tabs */}
              <div className="px-6 border-b border-[var(--divider)] flex gap-4 shrink-0 mt-2">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2.5 capitalize text-xs transition-colors border-b-2 ${
                      activeTab === tab
                        ? 'border-[var(--text)] text-[var(--text)] font-medium'
                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-6">

                {activeTab === 'profile' && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      { k: 'Title',      v: selected.profile?.current_title || selected.profile?.headline },
                      { k: 'Company',    v: selected.profile?.current_company  },
                      { k: 'Location',   v: selected.profile?.location          },
                      { k: 'Country',    v: selected.profile?.country           },
                      { k: 'Experience', v: selected.profile?.years_of_experience != null ? `${selected.profile.years_of_experience} yrs` : null },
                      { k: 'Industry',   v: selected.profile?.current_industry   },
                    ].filter(r => r.v).map(r => (
                      <div key={r.k} className="flex flex-col gap-1">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{r.k}</span>
                        <span className="text-sm">{r.v}</span>
                      </div>
                    ))}
                    {selected.profile?.summary && (
                      <div className="col-span-2 flex flex-col gap-1 mt-2">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Summary</span>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{selected.profile.summary}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'career' && (
                  <div className="flex flex-col gap-6">
                    {(selected.career_history || []).map((job, i) => (
                      <div key={i} className="flex flex-col gap-2 pb-5 border-b border-[var(--divider)] last:border-0 last:pb-0">
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium">{job.title}</span>
                          <span className="font-mono text-xs text-[var(--text-muted)] shrink-0 ml-4">{job.duration_months}mo</span>
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {job.company}{job.is_current ? ' (current)' : ''}
                          {job.industry ? ` · ${job.industry}` : ''}
                        </div>
                        {job.description && (
                          <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">{job.description}</p>
                        )}
                      </div>
                    ))}
                    {(!selected.career_history || selected.career_history.length === 0) && (
                      <p className="text-sm text-[var(--text-muted)]">No career history available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="border border-[var(--divider)] rounded overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[var(--surface-2)] border-b border-[var(--divider)]">
                        <tr>
                          <th className="px-4 py-2 text-[var(--text-muted)] font-medium">Skill</th>
                          <th className="px-4 py-2 text-[var(--text-muted)] font-medium">Proficiency</th>
                          <th className="px-4 py-2 text-[var(--text-muted)] font-medium">Duration</th>
                          <th className="px-4 py-2 text-[var(--text-muted)] font-medium">Target?</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--divider)] bg-[var(--bg)]">
                        {(selected.skills || []).map((s, i) => {
                          const isTarget = TARGET_SKILLS.some(t => s.name.toLowerCase().includes(t));
                          const isFlag = (s.proficiency === 'advanced' || s.proficiency === 'expert') && !s.duration_months;
                          return (
                            <tr key={i} className={isFlag ? 'bg-[var(--surface-offset)]' : ''}>
                              <td className="px-4 py-2">{s.name}{isFlag ? ' ⚑' : ''}</td>
                              <td className="px-4 py-2 capitalize text-[var(--text-muted)]">{s.proficiency}</td>
                              <td className="px-4 py-2 font-mono">{s.duration_months || 0}mo</td>
                              <td className="px-4 py-2">
                                {isTarget
                                  ? <span className="text-[var(--text)] font-medium">✓</span>
                                  : <span className="text-[var(--text-faint)]">—</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'signals' && (
                  <div className="flex flex-col gap-4">
                    <p className="text-xs text-[var(--text-muted)]">Raw <code className="bg-[var(--surface-offset)] px-1 rounded">redrob_signals</code> payload — the behavioral layer of the scoring model</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selected.redrob_signals || {}).map(([key, value]) => {
                        if (typeof value === 'object' && value !== null) return null;
                        return (
                          <div key={key} className="border border-[var(--border)] rounded p-3 bg-[var(--surface)] flex flex-col gap-1">
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                            <span className="font-mono text-xs truncate">{String(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'score' && (
                  <div className="flex flex-col gap-6">
                    <p className="text-xs text-[var(--text-muted)]">Score breakdown as computed by the Perspex AI engine</p>
                    {[
                      { label: 'Match Score (final)', value: selected.match_score, max: 30, bold: true },
                      { label: 'Semantic Fit',         value: selected.semantic,    max: 12 },
                      { label: 'Career Relevance',     value: selected.career,      max: 12 },
                      { label: 'Behavioral Signals',   value: selected.behavioral,  max: 9  },
                    ].map(s => (
                      <div key={s.label} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span className={s.bold ? 'font-semibold text-[var(--text)]' : 'text-[var(--text-muted)]'}>{s.label}</span>
                          <span className="font-mono">{(s.value || 0).toFixed(4)}</span>
                        </div>
                        <div className="h-1.5 bg-[var(--surface-offset)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--text)] rounded-full"
                            style={{ width: `${Math.min(100, ((s.value || 0) / s.max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {(selected.penalty || 0) > 0 && (
                      <div className="flex justify-between text-xs border-t border-[var(--divider)] pt-3 text-[var(--text-muted)]">
                        <span>Risk Penalty Applied</span>
                        <span className="font-mono">−{selected.penalty?.toFixed(2)}</span>
                      </div>
                    )}
                    {selected.reasoning && (
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">AI Reasoning</span>
                        <p className="text-xs text-[var(--text)] leading-relaxed border border-[var(--border)] rounded p-3 bg-[var(--surface)]">
                          {selected.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)]">
              Select a candidate to inspect
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
