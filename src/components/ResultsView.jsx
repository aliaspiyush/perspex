import React, { useState, useEffect } from 'react';
import { Download, X, ChevronUp, ChevronDown } from 'lucide-react';

export default function ResultsView({ result, onReset }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedCandidate(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!result) return null;
  const { finalRanked = [], parsedJD } = result;

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

  const Bar = ({ value }) => {
    // Determine bar fill class based on current theme, assuming we use a CSS variable for simplicity
    // or just hardcode background using Tailwind classes that respect dark mode.
    // The spec says: grayscale fills only, bar fill = rgba(0,0,0,0.7) light / rgba(255,255,255,0.7) dark
    return (
      <div className="flex-1 h-1 bg-[var(--border)] ml-4 rounded-none overflow-hidden relative">
        <div 
          className="absolute left-0 top-0 bottom-0 bg-[rgba(0,0,0,0.7)] dark:bg-[rgba(255,255,255,0.7)]" 
          style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} 
        />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative w-full">
      {/* Header */}
      <div className="shrink-0 py-4 px-6 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[18px] font-[600] text-[var(--text-primary)]">Top 100 Candidates</span>
          <span className="text-[13px] text-[var(--text-muted)]">{parsedJD?.role_title || 'Senior AI Engineer'} &middot; Founding Team</span>
        </div>
        <div className="flex items-center gap-[8px]">
          <button onClick={onReset} className="h-8 px-3 flex items-center justify-center text-[14px] font-[500] text-[var(--text-primary)] transition-opacity hover:opacity-70 bg-transparent">
            Re-run
          </button>
          <button onClick={handleExport} className="h-8 px-4 flex items-center justify-center text-[14px] font-[500] transition-colors border border-[rgba(0,0,0,0.18)] dark:border-[rgba(255,255,255,0.15)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface)]">
            <Download size={14} className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex relative">
        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[680px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[var(--bg)] z-10 border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-2 text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    <div className="flex items-center gap-1 cursor-pointer">Rank <ChevronUp size={14} /></div>
                  </th>
                  <th className="px-4 py-2 text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">Candidate ID</th>
                  <th className="px-4 py-2 text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">Score</th>
                  <th className="px-4 py-2 text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">Semantic</th>
                  <th className="px-4 py-2 text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">Behavioral</th>
                  <th className="px-4 py-2 text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)]">Experience</th>
                </tr>
              </thead>
              <tbody>
                {finalRanked.map((c, i) => (
                  <tr 
                    key={c.candidate_id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`h-[40px] cursor-pointer ${i % 2 === 0 ? 'bg-transparent' : 'bg-[var(--surface)]'} hover:bg-[var(--surface)] transition-colors`}
                  >
                    <td className={`px-4 py-0 text-[14px] tabular-nums ${i < 10 ? 'text-[var(--text-primary)] font-[600]' : 'text-[var(--text-primary)] font-[400]'}`}>
                      {c.rank}
                    </td>
                    <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{c.candidate_id}</td>
                    <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{c.overall_score}</td>
                    <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{c.semantic_fit}</td>
                    <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{c.signal_quality}</td>
                    <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{c.career_relevance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar details */}
        <div 
          className={`absolute top-0 right-0 h-full w-[340px] bg-[var(--bg)] border-l border-[var(--border)] z-20 flex flex-col transition-transform duration-200 ease-out transform ${
            selectedCandidate ? 'translate-x-0' : 'translate-x-full'
          } md:relative md:transform-none md:flex ${selectedCandidate ? 'md:block' : 'md:hidden'}`}
          style={!selectedCandidate ? { display: 'none' } : {}}
        >
          {selectedCandidate && (
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-[600] text-[var(--text-primary)]">{selectedCandidate.candidate_id}</span>
                  <span className="text-[14px] text-[var(--text-muted)] tabular-nums">#{selectedCandidate.rank}</span>
                </div>
                <button onClick={() => setSelectedCandidate(null)} className="w-6 h-6 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col p-4 gap-4 border-b border-[var(--border)] shrink-0">
                <div className="text-[11px] font-[500] uppercase tracking-[0.08em] text-[var(--text-faint)] mb-2">Score Breakdown</div>
                
                <div className="flex items-center justify-between text-[14px] tabular-nums">
                  <span className="text-[var(--text-muted)] w-24">Overall</span>
                  <span className="font-[600] text-[var(--text-primary)]">{selectedCandidate.overall_score}</span>
                  <Bar value={parseFloat(selectedCandidate.overall_score || 0) / 100} />
                </div>
                
                <div className="flex items-center justify-between text-[14px] tabular-nums">
                  <span className="text-[var(--text-muted)] w-24">Semantic</span>
                  <span className="text-[var(--text-primary)]">{selectedCandidate.semantic_fit}</span>
                  <Bar value={parseFloat(selectedCandidate.semantic_fit || 0) / 100} />
                </div>
                
                <div className="flex items-center justify-between text-[14px] tabular-nums">
                  <span className="text-[var(--text-muted)] w-24">Behavioral</span>
                  <span className="text-[var(--text-primary)]">{selectedCandidate.signal_quality}</span>
                  <Bar value={parseFloat(selectedCandidate.signal_quality || 0) / 100} />
                </div>
                
                <div className="flex items-center justify-between text-[14px] tabular-nums">
                  <span className="text-[var(--text-muted)] w-24">Experience</span>
                  <span className="text-[var(--text-primary)]">{selectedCandidate.career_relevance}</span>
                  <Bar value={parseFloat(selectedCandidate.career_relevance || 0) / 100} />
                </div>
              </div>

              <div className="flex flex-col p-4 gap-4 border-b border-[var(--border)] shrink-0">
                <div className="text-[11px] font-[500] uppercase tracking-[0.08em] text-[var(--text-faint)] mb-2">Key Signals</div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[var(--text-faint)]">Open to Work</span>
                    <span className="text-[14px] font-[500] text-[var(--text-primary)]">{selectedCandidate.redrob_signals?.open_to_work_flag ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[var(--text-faint)]">Notice Period</span>
                    <span className="text-[14px] font-[500] text-[var(--text-primary)]">{selectedCandidate.redrob_signals?.notice_period_days || 0}d</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[var(--text-faint)]">Response Rate</span>
                    <span className="text-[14px] font-[500] text-[var(--text-primary)]">{Math.round((selectedCandidate.redrob_signals?.recruiter_response_rate || 0)*100)}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[var(--text-faint)]">GitHub Score</span>
                    <span className="text-[14px] font-[500] text-[var(--text-primary)]">{selectedCandidate.redrob_signals?.github_activity_score?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[var(--text-faint)]">Work Mode</span>
                    <span className="text-[14px] font-[500] text-[var(--text-primary)]">{selectedCandidate.profile?.work_mode || 'Hybrid'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[var(--text-faint)]">Location</span>
                    <span className="text-[14px] font-[500] text-[var(--text-primary)] truncate max-w-full" title={selectedCandidate.profile?.location || 'Unknown'}>{selectedCandidate.profile?.location || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-4 gap-2">
                <div className="text-[11px] font-[500] uppercase tracking-[0.08em] text-[var(--text-faint)] mb-2">Why Ranked Here</div>
                <div className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                  <ul className="list-disc pl-4 space-y-1">
                    {(selectedCandidate.key_strengths || []).slice(0, 3).map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                    {(!selectedCandidate.key_strengths || selectedCandidate.key_strengths.length === 0) && (
                      <li>{selectedCandidate.reasoning || 'Strong overall match with role requirements.'}</li>
                    )}
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
