import React, { useState, useEffect, useMemo } from 'react';
import { fetchCandidates } from '../utils/adapters';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

export default function CandidateRankingView() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates().then(data => {
      setCandidates(data);
      setLoading(false);
    });
  }, []);

  const sorted = useMemo(() => {
    const arr = [...candidates];
    arr.sort((a, b) => {
      const av = a[sortConfig.key] ?? 0;
      const bv = b[sortConfig.key] ?? 0;
      if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
      if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [candidates, sortConfig]);

  const requestSort = key => {
    setSortConfig(prev =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'rank' ? 'asc' : 'desc' }
    );
  };

  const SortIcon = ({ colKey }) => {
    if (sortConfig.key !== colKey) return <ChevronUp size={12} className="opacity-20" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp size={12} />
      : <ChevronDown size={12} />;
  };

  const th = 'px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] cursor-pointer select-none sticky top-0 bg-[var(--surface)] border-b border-[var(--divider)] hover:text-[var(--text)] transition-colors';

  if (loading) {
    return (
      <div className="flex flex-col gap-8 h-[calc(100vh-140px)]">
        <div className="flex flex-col gap-2 shrink-0">
          <h1 className="text-2xl font-[family-name:var(--font-display)]">Candidate Ranking Workbench</h1>
          <p className="text-sm text-[var(--text-muted)]">Live view of AI-scored candidates across 3 signal dimensions</p>
        </div>
        <div className="flex-1 flex items-center justify-center border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] text-sm text-[var(--text-muted)]">
          Running scoring engine on real candidate data...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full relative">
      <div className="flex justify-between items-start shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-[family-name:var(--font-display)]">Candidate Ranking Workbench</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {candidates.length} candidates scored across Semantic · Career · Behavioral dimensions
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <span className="font-mono border border-[var(--border)] rounded px-2 py-1 bg-[var(--surface)]">
            Weights: 40% / 35% / 25%
          </span>
        </div>
      </div>

      <div className="flex gap-6 min-h-0 flex-1">
        {/* Table */}
        <div className="flex-1 border border-[var(--border)] rounded-[var(--radius)] overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead>
                <tr>
                  {[
                    { key: 'rank', label: 'Rank' },
                    { key: 'id', label: 'Candidate ID' },
                    { key: 'match_score', label: 'Match Score' },
                    { key: 'semantic', label: 'Semantic' },
                    { key: 'career', label: 'Career' },
                    { key: 'behavioral', label: 'Signals' },
                    { key: 'penalty', label: 'Penalty' },
                  ].map(col => (
                    <th
                      key={col.key}
                      className={th}
                      onClick={() => requestSort(col.key)}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        <SortIcon colKey={col.key} />
                      </span>
                    </th>
                  ))}
                  <th className={th + ' cursor-default'}>Title</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--divider)] bg-[var(--bg)]">
                {sorted.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`cursor-pointer transition-colors ${
                      selectedCandidate?.id === c.id
                        ? 'bg-[var(--surface-offset)]'
                        : 'hover:bg-[var(--surface-offset)]'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{c.rank}</td>
                    <td className="px-4 py-3 font-mono text-xs font-medium">{c.id}</td>
                    <td className="px-4 py-3 font-mono text-xs font-bold">{c.match_score.toFixed(4)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{c.semantic.toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{c.career.toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{c.behavioral.toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">
                      {c.penalty > 0
                        ? <span className="text-[var(--text)]">-{c.penalty.toFixed(2)}</span>
                        : <span className="opacity-30">0.00</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)] max-w-[200px] truncate">
                      {c.profile?.current_title || c.profile?.headline || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail drawer */}
        {selectedCandidate && (
          <div className="w-[340px] shrink-0 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--divider)] bg-[var(--surface-2)]">
              <div>
                <div className="font-mono text-sm font-semibold">{selectedCandidate.id}</div>
                <div className="text-xs text-[var(--text-muted)]">Rank #{selectedCandidate.rank}</div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              {/* Score breakdown */}
              <section className="flex flex-col gap-3">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Score Breakdown</h3>
                {[
                  { label: 'Match Score', value: selectedCandidate.match_score, max: 30 },
                  { label: 'Semantic Fit', value: selectedCandidate.semantic, max: 12 },
                  { label: 'Career Relevance', value: selectedCandidate.career, max: 12 },
                  { label: 'Behavioral Signals', value: selectedCandidate.behavioral, max: 9 },
                ].map(s => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-muted)]">{s.label}</span>
                      <span className="font-mono font-semibold">{s.value.toFixed(2)}</span>
                    </div>
                    <div className="h-1 bg-[var(--surface-offset)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--text)] rounded-full"
                        style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                {selectedCandidate.penalty > 0 && (
                  <div className="text-xs flex justify-between border-t border-[var(--divider)] pt-2">
                    <span className="text-[var(--text-muted)]">Risk Penalty</span>
                    <span className="font-mono">-{selectedCandidate.penalty.toFixed(2)}</span>
                  </div>
                )}
              </section>

              {/* Reasoning */}
              {selectedCandidate.reasoning && (
                <section className="flex flex-col gap-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">AI Reasoning</h3>
                  <p className="text-xs text-[var(--text)] leading-relaxed border border-[var(--border)] rounded p-3 bg-[var(--bg)]">
                    {selectedCandidate.reasoning}
                  </p>
                </section>
              )}

              {/* Profile */}
              <section className="flex flex-col gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Profile</h3>
                <div className="flex flex-col gap-2 text-xs">
                  {[
                    { k: 'Title', v: selectedCandidate.profile?.current_title || selectedCandidate.profile?.headline },
                    { k: 'Company', v: selectedCandidate.profile?.current_company },
                    { k: 'Experience', v: selectedCandidate.profile?.years_of_experience ? `${selectedCandidate.profile.years_of_experience} years` : null },
                    { k: 'Location', v: selectedCandidate.profile?.location },
                  ].filter(item => item.v).map(item => (
                    <div key={item.k} className="flex gap-2">
                      <span className="text-[var(--text-muted)] w-16 shrink-0">{item.k}</span>
                      <span className="text-[var(--text)]">{item.v}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Top skills */}
              {selectedCandidate.skills?.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Skills</h3>
                  <div className="flex flex-col gap-1.5">
                    {selectedCandidate.skills.slice(0, 8).map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-[var(--text)]">{s.name}</span>
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <span className="capitalize">{s.proficiency}</span>
                          <span className="font-mono">{s.duration_months || 0}mo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Signals */}
              <section className="flex flex-col gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Behavioral Signals</h3>
                <div className="flex flex-col gap-1.5 text-xs">
                  {[
                    { k: 'Open to Work', v: selectedCandidate.redrob_signals?.open_to_work_flag ? 'Yes' : 'No' },
                    { k: 'Response Rate', v: selectedCandidate.redrob_signals?.recruiter_response_rate != null ? `${(selectedCandidate.redrob_signals.recruiter_response_rate * 100).toFixed(0)}%` : null },
                    { k: 'Interview Rate', v: selectedCandidate.redrob_signals?.interview_completion_rate != null ? `${(selectedCandidate.redrob_signals.interview_completion_rate * 100).toFixed(0)}%` : null },
                    { k: 'Notice Period', v: selectedCandidate.redrob_signals?.notice_period_days != null ? `${selectedCandidate.redrob_signals.notice_period_days} days` : null },
                  ].filter(item => item.v != null).map(item => (
                    <div key={item.k} className="flex justify-between">
                      <span className="text-[var(--text-muted)]">{item.k}</span>
                      <span className="font-mono text-[var(--text)]">{item.v}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
