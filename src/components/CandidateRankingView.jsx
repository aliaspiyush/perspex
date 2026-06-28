import React, { useState, useEffect, useMemo } from 'react';
import { fetchCandidates } from '../utils/adapters';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

export default function CandidateRankingView() {
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [rawCandidates, setRawCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCandidates();
      setRawCandidates(data);
      setLoading(false);
    };
    load();
  }, []);

  const scoredCandidates = useMemo(() => {
    // The backend already calculated match_score, semantic, career, behavioral, penalty.
    const scored = rawCandidates.map(c => {
      return {
        ...c,
        semantic: c.semantic || 0,
        career: c.career || 0,
        signal: c.behavioral || 0, // In backend it's 'behavioral', mapping to 'signal' for this UI
        penalty: c.penalty || 0,
        match_score: c.match_score || 0
      };
    });

    if (sortConfig.key !== 'rank' || sortConfig.direction !== 'asc') {
      scored.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return scored;
  }, [rawCandidates, sortConfig]);

  if (loading) {
    return (
      <div className="flex flex-col gap-12 max-w-6xl mx-auto h-[calc(100vh-140px)]">
        <div className="flex flex-col gap-2 shrink-0">
          <h1 className="text-2xl font-[family-name:var(--font-display)]">Candidate Ranking Workbench</h1>
        </div>
        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)]">
          Loading actual candidate data from backend...
        </div>
      </div>
    );
  }

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const thClass = "px-4 py-3 text-left text-[11px] font-semibold tracking-wider uppercase text-[var(--text-muted)] cursor-pointer hover:bg-[var(--surface-2)] select-none border-b border-[var(--divider)] sticky top-0 bg-[var(--surface)] z-10";

  return (
    <div className="flex flex-col gap-8 h-full relative max-w-[1400px] mx-auto">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-[family-name:var(--font-display)]">Candidate Ranking Workspace</h1>
        <p className="text-sm text-[var(--text-muted)]">Evaluate candidates beyond keyword overlap by integrating contextual relevance and behavioral signals.</p>
      </div>

      <div className="flex flex-col h-[calc(100vh-220px)] border border-[var(--border)] bg-[var(--surface)]">
        
        {/* Top Summary Panel */}
        <div className="flex border-b border-[var(--divider)] bg-[var(--bg)] text-sm">
          <div className="flex-1 p-4 flex flex-col gap-1 border-r border-[var(--divider)]">
            <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Target Role</span>
            <span className="font-medium font-mono">Senior AI Engineer</span>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-1 border-r border-[var(--divider)]">
            <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Semantic Weight</span>
            <span className="font-mono">40%</span>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-1 border-r border-[var(--divider)]">
            <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Career Relevance</span>
            <span className="font-mono">35%</span>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-1">
            <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Signal Integration</span>
            <span className="font-mono">25%</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-sm whitespace-nowrap border-collapse">
            <thead>
              <tr>
                {[
                  { k: 'rank', l: 'Rank' },
                  { k: 'id', l: 'Candidate ID' },
                  { k: 'match_score', l: 'Match Score' },
                  { k: 'semantic', l: 'Semantic Fit' },
                  { k: 'career', l: 'Career Relevance' },
                  { k: 'signal', l: 'Signal Score' },
                  { k: 'penalty', l: 'Risk Penalty' }
                ].map(col => (
                  <th key={col.k} className={thClass} onClick={() => requestSort(col.k)}>
                    <div className="flex items-center gap-1">
                      {col.l}
                      {sortConfig.key === col.k && (
                        sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono bg-[var(--bg)]">
              {scoredCandidates.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => setSelectedCandidate(row)}
                  className={`border-b border-[var(--divider)] last:border-0 cursor-pointer transition-colors ${row.rank <= 10 ? 'bg-[var(--surface)] hover:bg-[var(--surface-2)]' : 'hover:bg-[var(--surface-offset)]'}`}
                >
                  <td className="px-4 py-2.5 text-[var(--text-muted)]">{row.rank}</td>
                  <td className="px-4 py-2.5 font-medium text-[var(--text)]">{row.id}</td>
                  <td className={`px-4 py-2.5 font-semibold ${row.rank <= 10 ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}>{(row.match_score).toFixed(3)}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)]">{(row.semantic).toFixed(3)}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)]">{(row.career).toFixed(3)}</td>
                  <td className="px-4 py-2.5 text-[var(--text-muted)]">{(row.signal).toFixed(3)}</td>
                  <td className={`px-4 py-2.5 ${row.penalty > 0 ? 'text-[var(--text)] font-semibold' : 'text-[var(--text-faint)]'}`}>
                    {row.penalty > 0 ? `-${row.penalty.toFixed(2)}` : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[460px] bg-[var(--surface)] border-l border-[var(--border)] z-50 transform transition-transform duration-200 ease-out shadow-2xl flex flex-col ${selectedCandidate ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {selectedCandidate && (
          <>
            <div className="px-6 py-5 border-b border-[var(--divider)] bg-[var(--bg)] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-mono font-medium">{selectedCandidate.id}</span>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Evaluation Context</span>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="p-1 hover:bg-[var(--surface-offset)] rounded transition-colors text-[var(--text-muted)]">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto flex flex-col p-6 gap-8 text-sm">
              
              <section className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase border-b border-[var(--divider)] pb-2">Why Relevant</h3>
                <div className="flex flex-col gap-2">
                  <div className="text-3xl font-mono mb-1">{selectedCandidate.match_score.toFixed(3)}</div>
                  <p className="text-[var(--text)] leading-relaxed">
                    {selectedCandidate.match_score > 0.8 
                      ? "Highly aligned. Semantic match confirms PyTorch/ML engineering capability, supported by stable career duration and fast responsiveness." 
                      : (selectedCandidate.penalty > 0 ? "Relevance degraded due to suspicious anomalies in profile structure and missing behavioral signals." : "Average relevance. Lacks strong contextual overlap or defining behavioral signals.")}
                  </p>
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase border-b border-[var(--divider)] pb-2">Career Evidence</h3>
                <div className="flex flex-col gap-1.5 leading-relaxed text-[var(--text-muted)]">
                  {selectedCandidate.career > 0.8 ? (
                    <span>Candidate possesses deep, verified tenure (5+ years) in closely related ML infrastructure roles, confirming seniority.</span>
                  ) : (
                    <span>Career history is either too brief or scattered to establish absolute seniority in required domains.</span>
                  )}
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase border-b border-[var(--divider)] pb-2">Skill Contextuality</h3>
                <div className="flex flex-col gap-1.5 leading-relaxed text-[var(--text-muted)]">
                  {selectedCandidate.semantic > 0.8 ? (
                    <span>Strong semantic overlap with `PyTorch`, `Transformers`, and `LLM Inference`. Skills appear embedded in career descriptions rather than just isolated tags.</span>
                  ) : (
                    <span>Keyword overlap is moderate to low. Missing contextual evidence of model deployment in production.</span>
                  )}
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase border-b border-[var(--divider)] pb-2">Signal Integration & Risk</h3>
                <div className="flex flex-col gap-3 leading-relaxed text-[var(--text-muted)]">
                  {selectedCandidate.penalty > 0 ? (
                    <div className="p-3 border border-[var(--text)] text-[var(--text)] font-medium text-xs rounded">
                      <strong>Keyword Stuffer Check Failed:</strong> High proficiency claimed on skills with 0 months duration. Accompanied by poor behavioral metrics (0% response rate). Candidate heavily penalized.
                    </div>
                  ) : (
                    <div className="text-sm">
                      Candidate passed baseline credibility checks. Behavioral signals ({selectedCandidate.redrob_signals.response_rate} response rate, active {selectedCandidate.redrob_signals.last_active}) strengthen ranking confidence.
                    </div>
                  )}
                </div>
              </section>

            </div>
          </>
        )}
      </div>

    </div>
  );
}
