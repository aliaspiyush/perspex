import React, { useState } from 'react';
import { Download, X } from 'lucide-react';

export default function ResultsView({ result, onReset }) {
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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

  const handleExportXLSX = () => {
    if (!window.XLSX) {
      alert("XLSX library not loaded yet.");
      return;
    }
    const XLSX = window.XLSX;
    const wb = XLSX.utils.book_new();

    const rankData = finalRanked.map(r => ({
      'Rank': r.rank,
      'Candidate ID': r.candidate_id,
      'Final Score': r.overall_score,
      'Semantic': r.semantic_fit,
      'Behavioral': r.signal_quality,
      'Experience': r.career_relevance,
      'Preference': r.preference || 0,
      'Open to Work': r.redrob_signals?.open_to_work_flag ? 'Yes' : 'No',
      'Notice Period (days)': r.redrob_signals?.notice_period_days || 0,
      'Response Rate': r.redrob_signals?.recruiter_response_rate || 0,
      'GitHub Score': r.redrob_signals?.github_activity_score || 0,
      'Work Mode': r.profile?.work_mode || 'N/A'
    }));

    const ws1 = XLSX.utils.json_to_sheet(rankData);
    ws1['!cols'] = Object.keys(rankData[0] || {}).map(key => ({ wch: Math.max(12, key.length + 2) }));
    ws1['!views'] = [{ state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft' }];
    
    const range = XLSX.utils.decode_range(ws1['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = ws1[XLSX.utils.encode_cell({ c: C, r: R })];
        if (!cell) continue;
        cell.s = { font: { name: 'Calibri', sz: 11 } };
        if (R === 0) {
          cell.s.font.bold = true;
        } else {
          if (R % 2 !== 0) cell.s.fill = { fgColor: { rgb: "FFF5F5F5" } };
          if (C >= 2 && C <= 6) cell.z = '0.000';
          if (R <= 10 && (C === 0 || (C >= 2 && C <= 6))) {
            cell.s.font.bold = true;
            delete cell.s.fill;
          }
        }
      }
    }
    XLSX.utils.book_append_sheet(wb, ws1, 'Rankings');

    const ts = new Date().toISOString().slice(0,16).replace('T','_').replace(':','');
    XLSX.writeFile(wb, `perspex_report_${ts}.xlsx`);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      {/* Top Bar */}
      <div className="shrink-0 h-14 px-6 border-b border-[var(--border)] flex items-center justify-between">
        <div className="font-mono text-[13px] text-[var(--text-h)] font-medium">
          Top {finalRanked.length} Candidates · {parsedJD?.role_title || 'Role'}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onReset} className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-h)]">
            Re-run
          </button>
          <div className="w-px h-4 bg-[var(--divider)]"></div>
          <button onClick={handleExport} className="font-mono text-[11px] uppercase tracking-widest border border-[var(--border)] px-3 py-1.5 hover:bg-[var(--surface-offset)] text-[var(--text-h)]">
            Export CSV
          </button>
          <button onClick={handleExportXLSX} className="font-mono text-[11px] uppercase tracking-widest border border-[var(--border)] px-3 py-1.5 hover:bg-[var(--surface-offset)] text-[var(--text-h)]">
            Export XLSX
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="overflow-y-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[var(--bg)] border-b border-[var(--border)] z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Rank</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Candidate ID</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[var(--text-h)]">Score</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Semantic</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Behavioral</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Experience</th>
                  <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">Preference</th>
                </tr>
              </thead>
              <tbody>
                {finalRanked.map((c, i) => (
                  <tr 
                    key={c.candidate_id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`h-9 cursor-pointer ${i % 2 === 0 ? 'bg-[var(--bg)]' : 'bg-[var(--surface-offset)]'} hover:bg-[var(--border)] transition-colors ${selectedCandidate?.candidate_id === c.candidate_id ? 'bg-[var(--border)]' : ''}`}
                  >
                    <td className={`px-4 py-0 font-mono text-[13px] ${i < 10 ? 'border-l-2 border-black dark:border-white font-bold text-[var(--text-h)]' : 'border-l-2 border-transparent text-[var(--text-muted)]'}`}>
                      {c.rank}
                    </td>
                    <td className="px-4 py-0 font-mono text-[13px] text-[var(--text-h)]">{c.candidate_id}</td>
                    <td className="px-4 py-0 font-mono text-[13px] font-bold text-[var(--text-h)]">{c.overall_score}</td>
                    <td className="px-4 py-0 font-mono text-[13px] text-[var(--text-muted)]">{c.semantic_fit}</td>
                    <td className="px-4 py-0 font-mono text-[13px] text-[var(--text-muted)]">{c.signal_quality}</td>
                    <td className="px-4 py-0 font-mono text-[13px] text-[var(--text-muted)]">{c.career_relevance}</td>
                    <td className="px-4 py-0 font-mono text-[13px] text-[var(--text-muted)]">{c.preference || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slide-in Detail Panel */}
        {selectedCandidate && (
          <div className="w-[320px] shrink-0 border-l border-[var(--border)] bg-[var(--surface-offset)] h-full overflow-y-auto flex flex-col p-6 font-mono">
            <div className="flex items-start justify-between mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Candidate</span>
                <span className="text-[18px] font-bold text-[var(--text-h)]">{selectedCandidate.candidate_id}</span>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-[var(--text-muted)] hover:text-[var(--text-h)]">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-6 text-[13px] leading-relaxed">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)] pb-2">Breakdown</span>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Score</span> <span className="font-bold text-[var(--text-h)]">{selectedCandidate.overall_score}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Semantic</span> <span>{selectedCandidate.semantic_fit}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Behavioral</span> <span>{selectedCandidate.signal_quality}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Experience</span> <span>{selectedCandidate.career_relevance}</span></div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)] pb-2">Signals</span>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Open to Work</span> <span>{selectedCandidate.redrob_signals?.open_to_work_flag ? 'Yes' : 'No'}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Notice Period</span> <span>{selectedCandidate.redrob_signals?.notice_period_days || 0}d</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Response Rate</span> <span>{Math.round((selectedCandidate.redrob_signals?.recruiter_response_rate || 0)*100)}%</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">GitHub Score</span> <span>{selectedCandidate.redrob_signals?.github_activity_score?.toFixed(1) || '0.0'}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Work Mode</span> <span>{selectedCandidate.profile?.work_mode || 'N/A'}</span></div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)] pb-2">Why Ranked Here</span>
                <p className="text-[var(--text)] font-sans">{selectedCandidate.reasoning || 'No specific reasoning provided.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
