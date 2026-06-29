import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp } from 'lucide-react';

function ScoreBar({ value, max = 100 }) {
  return (
    <div className="h-1 bg-[var(--surface-offset)] rounded-full overflow-hidden">
      <div
        className="h-full bg-[var(--text)] rounded-full"
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  );
}

function CandidateRow({ c, rank, isOpen, onToggle }) {
  const honeypot = c.is_honeypot;
  return (
    <div className={`border-b border-[var(--divider)] last:border-0 ${honeypot ? 'opacity-60' : ''}`}>
      <div
        className="grid items-center px-4 py-3 cursor-pointer hover:bg-[var(--surface-offset)] transition-colors"
        style={{ gridTemplateColumns: '2rem 1fr 1fr 6rem 6rem 6rem 6rem 2rem' }}
        onClick={onToggle}
      >
        <span className="font-mono text-xs text-[var(--text-muted)]">{rank}</span>
        <div className="flex flex-col min-w-0">
          <span className="font-mono text-xs font-medium truncate">{c.candidate_id}</span>
          {honeypot && <span className="text-[10px] text-[var(--text-muted)]">⚑ honeypot flag</span>}
        </div>
        <div className="flex flex-col min-w-0 pr-4">
          <span className="text-xs truncate">{c.profile?.current_title || '—'}</span>
          <span className="text-[10px] text-[var(--text-muted)] truncate">{c.profile?.current_company || '—'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs font-bold">{c.overall_score}</span>
          <ScoreBar value={c.overall_score} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-[var(--text-muted)]">{c.semantic_fit}</span>
          <ScoreBar value={c.semantic_fit} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-[var(--text-muted)]">{c.career_relevance}</span>
          <ScoreBar value={c.career_relevance} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-[var(--text-muted)]">{c.signal_quality}</span>
          <ScoreBar value={c.signal_quality} />
        </div>
        {isOpen ? <ChevronUp size={13} className="text-[var(--text-muted)]" /> : <ChevronDown size={13} className="text-[var(--text-muted)]" />}
      </div>

      {isOpen && (
        <div className="px-8 pb-5 pt-2 flex flex-col gap-4 border-t border-[var(--divider)] bg-[var(--surface)]">

          {/* AI Reasoning */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">AI Reasoning</span>
            <p className="text-xs text-[var(--text)] leading-relaxed">{c.reasoning || '—'}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Strengths */}
            {(c.key_strengths || []).length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Key Strengths</span>
                <ul className="flex flex-col gap-1">
                  {c.key_strengths.map((s, i) => (
                    <li key={i} className="text-xs text-[var(--text-muted)] flex gap-1.5">
                      <span className="text-[var(--text-faint)]">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Concerns */}
            {(c.concerns || []).length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Concerns</span>
                <ul className="flex flex-col gap-1">
                  {c.concerns.map((s, i) => (
                    <li key={i} className="text-xs text-[var(--text-muted)] flex gap-1.5">
                      <span className="text-[var(--text-faint)]">⚑</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Profile snapshot */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[var(--divider)]">
            {[
              { k: 'Experience', v: c.profile?.years_of_experience != null ? `${c.profile.years_of_experience} yrs` : null },
              { k: 'Location',   v: c.profile?.location },
              { k: 'Open to Work', v: c.redrob_signals?.open_to_work_flag ? 'Yes' : 'No' },
              { k: 'Response Rate', v: c.redrob_signals?.recruiter_response_rate != null ? `${Math.round(c.redrob_signals.recruiter_response_rate * 100)}%` : null },
              { k: 'Notice Period', v: c.redrob_signals?.notice_period_days != null ? `${c.redrob_signals.notice_period_days} days` : null },
              { k: 'GitHub Score',  v: c.redrob_signals?.github_activity_score != null ? c.redrob_signals.github_activity_score.toFixed(1) : null },
            ].filter(r => r.v).map(r => (
              <div key={r.k} className="flex flex-col gap-0.5">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{r.k}</span>
                <span className="text-xs font-mono">{r.v}</span>
              </div>
            ))}
          </div>

          {/* Top skills */}
          {(c.skills || []).length > 0 && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--divider)]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Top Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {c.skills.slice(0, 10).map((s, i) => (
                  <span key={i} className="px-1.5 py-0.5 border border-[var(--divider)] rounded text-[10px] font-mono bg-[var(--bg)] text-[var(--text-muted)]">
                    {s.name} · {s.proficiency} · {s.duration_months || 0}mo
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsView({ result, onReset }) {
  const [openId, setOpenId] = useState(null);
  const [filter, setFilter] = useState('');

  if (!result) return null;

  const { finalRanked = [], parsedJD, summary, totalCandidates } = result;

  const displayed = finalRanked.filter(c => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      (c.candidate_id || '').toLowerCase().includes(q) ||
      (c.profile?.current_title || '').toLowerCase().includes(q) ||
      (c.reasoning || '').toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    const rows = [
      ['rank', 'candidate_id', 'overall_score', 'semantic_fit', 'career_relevance', 'signal_quality', 'is_honeypot', 'reasoning'],
      ...finalRanked.map(c => [
        c.rank,
        c.candidate_id,
        c.overall_score,
        c.semantic_fit,
        c.career_relevance,
        c.signal_quality,
        c.is_honeypot ? 'true' : 'false',
        `"${(c.reasoning || '').replace(/"/g, "'")}"`,
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'perspex_ai_ranked.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const top1 = finalRanked[0];
  const avgScore = finalRanked.length > 0
    ? (finalRanked.reduce((s, c) => s + c.overall_score, 0) / finalRanked.length).toFixed(1)
    : 0;
  const honeypots = finalRanked.filter(c => c.is_honeypot).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8 pb-16">

      {/* Header */}
      <div className="flex items-end justify-between border-b border-[var(--divider)] pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-[family-name:var(--font-display)] tracking-tight">AI Ranked Shortlist</h1>
          <p className="text-sm text-[var(--text-muted)]">
            {finalRanked.length} candidates ranked by Gemini across semantic fit, career relevance &amp; behavioral signals
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--text)] text-[var(--bg)] text-xs font-semibold rounded-[var(--radius)] hover:opacity-80 transition-opacity shrink-0"
        >
          <Download size={13} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Evaluated',       value: totalCandidates || finalRanked.length },
          { label: 'Shortlisted',     value: finalRanked.length },
          { label: 'Top Score',       value: `${top1?.overall_score || 0}/100` },
          { label: 'Avg Score',       value: `${avgScore}/100` },
          { label: 'Honeypots Found', value: honeypots },
        ].map(s => (
          <div key={s.label} className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] px-4 py-3 flex flex-col gap-1">
            <span className="font-mono text-xl font-bold">{s.value}</span>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-6 flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">AI Executive Summary</h2>
          <p className="text-sm text-[var(--text)] leading-relaxed">{summary}</p>
        </div>
      )}

      {/* JD Context */}
      {parsedJD && (
        <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-5 flex flex-col gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Role Ranked Against</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Role</span>
              <span className="font-medium">{parsedJD.role_title} ({parsedJD.seniority})</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Experience</span>
              <span className="font-mono">{parsedJD.experience_years?.min}–{parsedJD.experience_years?.max} yrs</span>
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Critical Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {(parsedJD.required_skills || []).filter(s => s.importance === 'critical').map(s => (
                  <span key={s.name} className="px-1.5 py-0.5 border border-[var(--border)] rounded font-mono bg-[var(--bg)]">{s.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results table */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            All Ranked Candidates ({displayed.length})
          </h2>
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter by ID, title, or reasoning…"
            className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] focus:outline-none focus:border-[var(--text-muted)] transition-colors w-72"
          />
        </div>

        <div className="border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
          {/* Column headers */}
          <div
            className="grid px-4 py-2.5 bg-[var(--surface-2)] border-b border-[var(--divider)] text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
            style={{ gridTemplateColumns: '2rem 1fr 1fr 6rem 6rem 6rem 6rem 2rem' }}
          >
            <span>#</span>
            <span>Candidate</span>
            <span>Title / Company</span>
            <span>Score</span>
            <span>Semantic</span>
            <span>Career</span>
            <span>Signals</span>
            <span />
          </div>

          <div className="bg-[var(--bg)] divide-y divide-[var(--divider)]">
            {displayed.map((c, i) => (
              <CandidateRow
                key={c.candidate_id}
                c={c}
                rank={filter ? i + 1 : c.rank}
                isOpen={openId === c.candidate_id}
                onToggle={() => setOpenId(openId === c.candidate_id ? null : c.candidate_id)}
              />
            ))}
            {displayed.length === 0 && (
              <div className="px-6 py-10 text-center text-sm text-[var(--text-muted)]">
                No candidates match your filter.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
