import React, { useState, useEffect, useMemo } from 'react';
import { fetchCandidates } from '../utils/adapters';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

export default function RankingView() {
  const [weights, setWeights] = useState({
    semantic: 40,
    behavioral: 25,
    experience: 20,
    preference: 10
  });

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

  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [selectedCandidate, setSelectedCandidate] = useState(null);


  const scoredCandidates = useMemo(() => {
    const scored = rawCandidates.map(c => {
      // Use the actual AI backend base values.
      // Since they are pre-calculated, we just scale them based on weights.
      const semanticBase = c.semantic || 0;
      const behavioralBase = c.behavioral || 0;
      const experienceBase = c.career || 0; 
      
      const penalty = c.penalty || 0;

      const wSemantic = (weights.semantic / 100) * semanticBase;
      const wBehavioral = (weights.signals / 100) * behavioralBase;
      const wExperience = (weights.career / 100) * experienceBase;

      const final_score = Math.max(0, wSemantic + wBehavioral + wExperience - penalty);

      return {
        ...c,
        semantic: semanticBase,
        behavioral: behavioralBase,
        experience: experienceBase,
        penalty,
        final_score
      };
    });

    // Sort by final score to assign rank
    scored.sort((a, b) => b.final_score - a.final_score);
    scored.forEach((c, idx) => c.rank = idx + 1);

    // Re-apply current sort config
    if (sortConfig.key !== 'rank' || sortConfig.direction !== 'asc') {
      scored.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return scored;
  }, [rawCandidates, weights, sortConfig]);

  const sum = Object.values(weights).reduce((a, b) => a + b, 0);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const thClass = "px-4 py-3 text-left text-xs font-semibold tracking-wider text-[var(--text-muted)] cursor-pointer hover:bg-[var(--surface-2)] select-none border-b border-[var(--divider)] sticky top-0 bg-[var(--surface)] z-10";

  return (
    <div className="flex flex-col gap-8 h-full relative max-w-[1400px] mx-auto">
      
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-[family-name:var(--font-display)]">Scoring Workbench</h1>
          <p className="text-sm text-[var(--text-muted)]">Configure dimensions and preview offline ranking output</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
        
        {/* Left Column - Controls */}
        <div className="xl:col-span-1 flex flex-col gap-8 overflow-y-auto pr-2">
          
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Weight Controls</h2>
            <div className="border border-[var(--border)] rounded-[var(--radius)] p-5 bg-[var(--surface)] flex flex-col gap-5 text-sm">
              
              {Object.entries(weights).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize text-[var(--text)]">{key} Fit</span>
                    <span className="font-mono text-[var(--text-muted)]">{value}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={value}
                    onChange={(e) => setWeights({...weights, [key]: parseInt(e.target.value)})}
                    className="w-full h-1 bg-[var(--border)] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-[var(--text)] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                  />
                </div>
              ))}

              <div className="mt-2 pt-4 border-t border-[var(--divider)] flex justify-between items-center text-xs">
                <span className="text-[var(--text-muted)] uppercase tracking-wider">Total Active Weight</span>
                <span className={`font-mono font-medium px-2 py-1 border rounded ${sum === 100 ? 'border-[var(--text)] text-[var(--text)]' : 'border-[var(--text-muted)] text-[var(--text-muted)]'}`}>
                  {sum} / 100
                </span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Honeypot Logic & Rules</h2>
            <div className="border border-[var(--border)] rounded-[var(--radius)] p-5 bg-[var(--surface)] flex flex-col gap-4 text-xs leading-relaxed text-[var(--text-muted)]">
              <div className="flex flex-col gap-1">
                <strong className="text-[var(--text)]">Experience Inconsistencies</strong>
                <p>Penalizes configurations where candidate claims "Expert" proficiency without corresponding duration.</p>
              </div>
              <div className="flex flex-col gap-1">
                <strong className="text-[var(--text)]">Behavioral Red Flags</strong>
                <p>Heavy penalties applied for 0% response rates despite being "open to work". Derived from <code className="bg-[var(--surface-offset)] border border-[var(--border)] px-1 py-0.5 rounded">redrob_signals</code>.</p>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column - Table */}
        <div className="xl:col-span-3 flex flex-col min-h-0 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)]">
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-sm whitespace-nowrap border-collapse">
              <thead>
                <tr>
                  {[
                    { k: 'rank', l: 'Rank' },
                    { k: 'id', l: 'ID' },
                    { k: 'final_score', l: 'Final' },
                    { k: 'semantic', l: 'Semantic' },
                    { k: 'behavioral', l: 'Behavioral' },
                    { k: 'experience', l: 'Experience' },
                    { k: 'preference', l: 'Pref' },
                    { k: 'penalty', l: 'Penalty' }
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
                {scoredCandidates.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => setSelectedCandidate(row)}
                    className="border-b border-[var(--divider)] last:border-0 hover:bg-[var(--surface-offset)] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-2 text-[var(--text-muted)]">{row.rank}</td>
                    <td className="px-4 py-2 font-medium text-[var(--text)]">{row.id}</td>
                    <td className="px-4 py-2 font-semibold text-[var(--text)]">{(row.final_score).toFixed(3)}</td>
                    <td className="px-4 py-2 text-[var(--text-muted)]">{(row.semantic).toFixed(3)}</td>
                    <td className="px-4 py-2 text-[var(--text-muted)]">{(row.behavioral).toFixed(3)}</td>
                    <td className="px-4 py-2 text-[var(--text-muted)]">{(row.experience).toFixed(3)}</td>
                    <td className="px-4 py-2 text-[var(--text-muted)]">{(row.preference).toFixed(3)}</td>
                    <td className={`px-4 py-2 ${row.penalty > 0 ? 'text-[var(--text)] font-semibold' : 'text-[var(--text-faint)]'}`}>
                      {row.penalty > 0 ? `-${row.penalty.toFixed(2)}` : '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[420px] bg-[var(--bg)] border-l border-[var(--border)] z-50 transform transition-transform duration-200 ease-out shadow-2xl flex flex-col ${selectedCandidate ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {selectedCandidate && (
          <>
            <div className="px-6 py-4 border-b border-[var(--divider)] flex items-center justify-between">
              <h2 className="text-sm font-mono font-medium">{selectedCandidate.id} Analysis</h2>
              <button onClick={() => setSelectedCandidate(null)} className="p-1 hover:bg-[var(--surface-offset)] rounded transition-colors text-[var(--text-muted)]">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8 text-sm">
              
              <section className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Score Breakdown</h3>
                <div className="text-4xl font-mono pb-2">{selectedCandidate.final_score.toFixed(3)}</div>
                <div className="flex flex-col gap-3 text-xs font-mono">
                  {[
                    { label: 'Semantic', base: selectedCandidate.semantic, weight: weights.semantic },
                    { label: 'Behavioral', base: selectedCandidate.behavioral, weight: weights.behavioral },
                    { label: 'Experience', base: selectedCandidate.experience, weight: weights.experience },
                    { label: 'Preference', base: selectedCandidate.preference, weight: weights.preference },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[var(--text-muted)]">
                        <span className="uppercase">{item.label}</span>
                        <span>{item.base.toFixed(3)} × {item.weight}%</span>
                      </div>
                      <div className="w-full h-1 bg-[var(--divider)]">
                        <div className="h-full bg-[var(--text)]" style={{ width: `${item.base * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                  {selectedCandidate.penalty > 0 && (
                    <div className="flex justify-between text-[var(--text)] font-semibold pt-2 border-t border-[var(--divider)] mt-2">
                      <span className="uppercase">Risk Penalty</span>
                      <span>-{selectedCandidate.penalty.toFixed(3)}</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Ranking Evidence</h3>
                <div className="flex flex-col gap-2 text-[var(--text)] leading-relaxed">
                  {selectedCandidate.penalty > 0 && (
                    <div className="p-3 border border-[var(--text)] bg-[var(--text)] text-[var(--bg)] font-medium text-xs mb-2 rounded-[var(--radius)]">
                      Flagged: Inconsistent skill duration or suspicious behavioral signal patterns detected.
                    </div>
                  )}
                  {selectedCandidate.semantic > 0.8 && <p>• Strong presence of required semantic terms mapping to PyTorch and ML pipelines.</p>}
                  {selectedCandidate.behavioral > 0.8 && <p>• Positive behavioral signals: fast response rates and recent activity confirm active job seeking.</p>}
                  {selectedCandidate.experience < 0.5 && <p>• Experience band falls below the ideal target of 8 years for Senior level.</p>}
                  {selectedCandidate.preference > 0.6 && <p>• Geographic logistics align with Hybrid/Remote requirements.</p>}
                </div>
              </section>

            </div>
          </>
        )}
      </div>

    </div>
  );
}
