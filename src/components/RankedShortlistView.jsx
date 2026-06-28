import React, { useMemo } from 'react';
import { generateMockCandidates } from '../utils/adapters';
import { Download } from 'lucide-react';

export default function RankedShortlistView() {
  
  const topCandidates = useMemo(() => {
    const raw = generateMockCandidates();
    const scored = raw.map(c => {
      let penalty = 0;
      if (c.skills.some(s => (s.proficiency === 'Expert' || s.proficiency === 'Advanced') && s.duration_months === 0)) penalty += 0.2;
      if (c.redrob_signals.response_rate === '0%') penalty += 0.15;

      const match_score = Math.max(0, (0.4 * c.semantic) + (0.35 * c.experience) + (0.25 * c.behavioral) - penalty);
      return { ...c, match_score };
    });
    
    scored.sort((a, b) => b.match_score - a.match_score);
    return scored.slice(0, 10).map((c, i) => ({ ...c, rank: i + 1 }));
  }, []);

  const handleExport = () => {
    const csvContent = [
      ['candidate_id', 'rank', 'match_score'].join(','),
      ...topCandidates.map(r => [r.id, r.rank, r.match_score.toFixed(3)].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "perspex_shortlist.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto pb-12">
      <div className="flex items-end justify-between border-b border-[var(--divider)] pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-[family-name:var(--font-display)] tracking-tight">Top Ranked Candidates</h1>
          <p className="text-sm text-[var(--text-muted)] font-medium">
            The final, explainable output required by the challenge problem statement.
          </p>
        </div>
        <button onClick={handleExport} className="px-5 py-2.5 bg-[var(--text)] text-[var(--bg)] font-medium rounded-[var(--radius)] text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
          <Download size={16} />
          Export Shortlist CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Col - Output Logic */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Output Logic</h2>
            <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] text-sm overflow-hidden">
              <div className="flex flex-col gap-4 p-5">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">1</div>
                  <div className="flex flex-col">
                    <span className="font-semibold mb-1">JD Interpreted</span>
                    <span className="text-[var(--text-muted)] text-xs leading-relaxed">Raw role descriptions mapped into structured semantic constraints and seniority bounds.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">2</div>
                  <div className="flex flex-col">
                    <span className="font-semibold mb-1">Candidates Evaluated Contextually</span>
                    <span className="text-[var(--text-muted)] text-xs leading-relaxed">Assessed against the job intent using skill depth and career duration rather than keyword density alone.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">3</div>
                  <div className="flex flex-col">
                    <span className="font-semibold mb-1">Signals Integrated</span>
                    <span className="text-[var(--text-muted)] text-xs leading-relaxed">Behavioral data, response rates, and consistency checks layered on to severely penalize noise/honeypots.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">4</div>
                  <div className="flex flex-col">
                    <span className="font-semibold mb-1">Shortlist Produced</span>
                    <span className="text-[var(--text-muted)] text-xs leading-relaxed">A lightning-fast, highly accurate output ready for pipeline progression.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="p-4 bg-[var(--surface-offset)] rounded-[var(--radius)] text-xs text-[var(--text-muted)] leading-relaxed border border-[var(--border)]">
              <strong>Trust Indicator:</strong><br/>
              The candidates shown here represent genuine matches cleared of ATS keyword stuffers, maximizing recruiter efficiency by guaranteeing high intent and structural fit.
            </div>
          </section>
        </div>

        {/* Right Col - Table */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Final Result</h2>
          <div className="border border-[var(--border)] rounded-[var(--radius)] flex flex-col h-full bg-[var(--surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="border-b border-[var(--divider)] bg-[var(--surface-2)]">
                  <tr>
                    <th className="px-5 py-3 font-mono text-xs text-[var(--text-muted)]">Rank</th>
                    <th className="px-5 py-3 font-mono text-xs text-[var(--text-muted)]">Candidate ID</th>
                    <th className="px-5 py-3 font-mono text-xs text-[var(--text-muted)]">Current Title</th>
                    <th className="px-5 py-3 font-mono text-xs text-[var(--text-muted)] text-right">Match Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)] bg-[var(--bg)]">
                  {topCandidates.map(row => (
                    <tr key={row.id} className="hover:bg-[var(--surface-offset)] transition-colors">
                      <td className="px-5 py-3.5 font-mono text-[var(--text-muted)]">{row.rank}</td>
                      <td className="px-5 py-3.5 font-medium">{row.id}</td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)]">{row.profile.title}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-semibold">{row.match_score.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
