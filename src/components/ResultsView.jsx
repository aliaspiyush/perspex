import React, { useState, useEffect, useMemo } from 'react';
import { Download, RotateCcw, ChevronUp, ChevronDown, X } from 'lucide-react';

// Seeded PRNG
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

const generateCandidates = () => {
  const rand = mulberry32(12345);
  const candidates = [];
  
  for (let i = 0; i < 100; i++) {
    // Top candidates get higher base values
    const isTop = i < 10;
    const isTail = i > 85;
    const isHoneypot = i >= 95;

    let semantic = isTop ? 0.85 + rand() * 0.14 : (isTail ? 0.3 + rand() * 0.2 : 0.5 + rand() * 0.3);
    let behavioral = isTop ? 0.8 + rand() * 0.2 : (isTail ? 0.2 + rand() * 0.3 : 0.4 + rand() * 0.4);
    let experience = isTop ? 0.9 + rand() * 0.1 : (isTail ? 0.4 + rand() * 0.3 : 0.5 + rand() * 0.4);
    let preference = isTop ? 0.7 + rand() * 0.3 : (isTail ? 0.1 + rand() * 0.4 : 0.3 + rand() * 0.5);

    if (isHoneypot) {
      semantic = 0.99; // Suspiciously high keyword match
      behavioral = 0.1; // But terrible behavioral signals
    }

    const final_score = (0.40 * semantic) + (0.30 * behavioral) + (0.20 * experience) + (0.10 * preference);
    
    candidates.push({
      id: `CAND_${String(i + 1).padStart(5, '0')}`,
      semantic,
      behavioral,
      experience,
      preference,
      final_score,
      signals: {
        open_to_work: isHoneypot ? false : rand() > 0.3,
        notice_period: Math.floor(rand() * 60) + ' days',
        response_rate: isHoneypot ? '0%' : Math.floor(60 + rand() * 40) + '%',
        github_score: (rand() * 100).toFixed(1),
        last_active: Math.floor(rand() * 14) + ' days ago',
        work_mode: rand() > 0.5 ? 'Remote' : 'Hybrid'
      }
    });
  }
  
  return candidates.sort((a, b) => b.final_score - a.final_score).map((c, idx) => ({ ...c, rank: idx + 1 }));
};

export default function ResultsView({ hasRun, onReset }) {
  const [loadingStage, setLoadingStage] = useState(hasRun ? 0 : -1);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    if (!hasRun) return;

    const stages = 5;
    let currentStage = 0;
    
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage >= stages) {
        clearInterval(interval);
        setData(generateCandidates());
        setLoadingStage(-1); // Done loading
      } else {
        setLoadingStage(currentStage);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [hasRun]);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    const csvContent = [
      ['candidate_id', 'rank', 'final_score', 'semantic', 'behavioral', 'experience', 'preference'].join(','),
      ...data.map(c => [c.id, c.rank, c.final_score.toFixed(3), c.semantic.toFixed(3), c.behavioral.toFixed(3), c.experience.toFixed(3), c.preference.toFixed(3)].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "perspex_submission.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!hasRun) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-[var(--text-muted)] text-sm">Run a ranking first.</p>
        <button onClick={onReset} className="text-sm font-medium border-b border-[var(--text)] hover:text-[var(--text-muted)] hover:border-[var(--text-muted)] transition-colors">
          Go to Upload
        </button>
      </div>
    );
  }

  if (loadingStage >= 0) {
    const stages = [
      'Parsing JD',
      'Detecting Honeypots',
      'Running FAISS Search',
      'Scoring Candidates',
      'Writing Shortlist'
    ];
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-8">
        <div className="flex flex-col gap-3">
          {stages.map((stage, idx) => (
            <div key={idx} className={`text-sm font-mono transition-all duration-300 ${idx === loadingStage ? 'text-[var(--text)] font-semibold scale-105' : (idx < loadingStage ? 'text-[var(--text-faint)]' : 'text-[var(--text-faint)] opacity-30')}`}>
              {idx < loadingStage ? '✓ ' : (idx === loadingStage ? '→ ' : '  ')}{stage}
            </div>
          ))}
        </div>
        <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-4">
          Analyzing 100,000 candidates
        </div>
      </div>
    );
  }

  const thClass = "px-4 py-3 text-left text-xs font-semibold tracking-wider text-[var(--text-muted)] cursor-pointer hover:bg-[var(--surface-2)] select-none border-b border-[var(--border)] sticky top-0 bg-[var(--surface)] z-10";

  return (
    <div className="flex flex-col w-full h-full relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium">Top 100 Candidates</h1>
          <p className="text-sm text-[var(--text-muted)]">Senior AI Engineer · Founding Team</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onReset} className="px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            Re-run
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-[var(--radius)] hover:bg-[var(--surface-offset)] transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] relative">
        <table className="w-full text-sm whitespace-nowrap border-collapse">
          <thead>
            <tr>
              {[
                { k: 'rank', l: 'Rank' },
                { k: 'id', l: 'Candidate ID' },
                { k: 'final_score', l: 'Score' },
                { k: 'semantic', l: 'Semantic' },
                { k: 'behavioral', l: 'Behavioral' },
                { k: 'experience', l: 'Experience' },
                { k: 'preference', l: 'Preference' }
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
          <tbody className="font-mono">
            {sortedData.map((row) => (
              <tr 
                key={row.id} 
                onClick={() => setSelectedCandidate(row)}
                className="border-b border-[var(--divider)] last:border-0 hover:bg-[var(--surface-offset)] cursor-pointer transition-colors"
              >
                <td className="px-4 py-2.5 text-[var(--text-muted)]">{row.rank}</td>
                <td className="px-4 py-2.5 font-medium text-[var(--text)]">{row.id}</td>
                <td className="px-4 py-2.5 font-semibold">{row.final_score.toFixed(3)}</td>
                <td className="px-4 py-2.5 text-[var(--text-muted)]">{row.semantic.toFixed(3)}</td>
                <td className="px-4 py-2.5 text-[var(--text-muted)]">{row.behavioral.toFixed(3)}</td>
                <td className="px-4 py-2.5 text-[var(--text-muted)]">{row.experience.toFixed(3)}</td>
                <td className="px-4 py-2.5 text-[var(--text-muted)]">{row.preference.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sidebar Panel overlay for mobile */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-40 bg-[var(--bg)]/50 backdrop-blur-sm md:hidden" onClick={() => setSelectedCandidate(null)}></div>
      )}

      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-[var(--surface)] border-l border-[var(--border)] z-50 transform transition-transform duration-200 ease-out flex flex-col shadow-2xl ${selectedCandidate ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {selectedCandidate && (
          <>
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
              <h2 className="text-lg font-mono font-medium">{selectedCandidate.id}</h2>
              <button onClick={() => setSelectedCandidate(null)} className="p-1 hover:bg-[var(--surface-offset)] rounded transition-colors text-[var(--text-muted)]">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8">
              
              {/* Scores */}
              <section className="flex flex-col gap-4">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Score Breakdown</h3>
                <div className="text-3xl font-mono mb-2">{selectedCandidate.final_score.toFixed(3)}</div>
                
                <div className="flex flex-col gap-3">
                  {[
                    { l: 'Semantic', v: selectedCandidate.semantic },
                    { l: 'Behavioral', v: selectedCandidate.behavioral },
                    { l: 'Experience', v: selectedCandidate.experience },
                    { l: 'Preference', v: selectedCandidate.preference }
                  ].map(score => (
                    <div key={score.l} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--text-muted)]">{score.l}</span>
                        <span className="font-mono">{score.v.toFixed(3)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--surface-offset)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--text)]" style={{ width: `${score.v * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Signals */}
              <section className="flex flex-col gap-4">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Key Signals</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedCandidate.signals).map(([key, value]) => (
                    <div key={key} className="p-3 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] flex flex-col gap-1">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{key.replace('_', ' ')}</span>
                      <span className="text-sm font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Reasoning */}
              <section className="flex flex-col gap-3 pb-8">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Why ranked here</h3>
                <ul className="flex flex-col gap-2 text-sm text-[var(--text-muted)] list-disc pl-4">
                  {selectedCandidate.semantic > 0.8 && <li>Exceptionally strong semantic alignment with required technical competencies.</li>}
                  {selectedCandidate.behavioral > 0.8 && <li>High response rate and immediate availability indicators present.</li>}
                  {selectedCandidate.experience > 0.8 && <li>Demonstrates seniority and stability in previous relevant roles.</li>}
                  {selectedCandidate.semantic > 0.95 && selectedCandidate.behavioral < 0.2 && <li>Warning: High keyword density but poor behavioral signals. Possible honeypot profile.</li>}
                  {selectedCandidate.final_score < 0.5 && <li>Overall signal strength insufficient compared to top cohort.</li>}
                </ul>
              </section>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
