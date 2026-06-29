import React, { useState, useEffect } from 'react';
import useMockData from '../hooks/useMockData';
import { exportCsv } from '../utils/exportCsv';

const LoadingState = ({ onProcessComplete, jdText }) => {
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState({ 1: 'Initializing pipeline...' });
  const mockData = useMockData();

  const steps = [
    { n: 1, label: 'Parsing JD' },
    { n: 2, label: 'Detecting Honeypots' },
    { n: 3, label: 'Running FAISS Search' },
    { n: 4, label: 'Scoring Candidates' },
    { n: 5, label: 'Writing Shortlist' },
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => { setStep(2); setMessages(m => ({ ...m, 2: 'JD parsed. Applying heuristic gates...' })); }, 400),
      setTimeout(() => { setStep(3); setMessages(m => ({ ...m, 3: 'Filtered honeypots. Beginning vector search...' })); }, 800),
      setTimeout(() => { setStep(4); setMessages(m => ({ ...m, 4: 'Scoring candidates based on behavioral signals...' })); }, 1200),
      setTimeout(() => { setStep(5); setMessages(m => ({ ...m, 5: 'Finalizing ranks and generating summary...' })); }, 1800),
      setTimeout(() => {
        onProcessComplete({
          finalRanked: mockData,
          parsedJD: { role_title: 'Senior AI Engineer' },
          summary: 'AI ranking complete. Top candidates show strong semantic alignment and positive behavioral signals.'
        });
      }, 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onProcessComplete, mockData]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] p-8">
      <div className="w-full max-w-[320px] flex flex-col gap-6">
        <div className="text-center mb-4">
            <h1 className="text-[var(--text-lg)] font-[500]">Running Perspex</h1>
            <p className="text-[var(--text-base)] text-[var(--text-muted)]">Analyzing 100,000 candidates</p>
        </div>
        {steps.map(s => (
          <div key={s.n} className={`flex flex-col gap-1 transition-opacity duration-300 ${step >= s.n ? 'opacity-100' : 'opacity-35'}`}>
            <div className={`text-[15px] ${step >= s.n ? 'font-[600]' : 'font-[400]'} text-[var(--text-primary)] flex gap-3`}>
              <span className="w-4 tabular-nums">{String(s.n).padStart(2, '0')}</span>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailPanel = ({ candidate, onClose }) => {
    if (!candidate) return null;

    const ScoreBar = ({ value }) => (
        <div className="flex-1 h-1 bg-[var(--border)] ml-4 rounded-none overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 bg-[rgba(0,0,0,0.7)] dark:bg-[rgba(255,255,255,0.7)]" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
        </div>
    );

    const strengths = [];
    if (candidate.semantic_fit > 75) strengths.push("Strong semantic match suggests relevant AI experience.");
    if (candidate.signal_quality > 70) strengths.push("High behavioral score indicates strong engagement and responsiveness.");
    if (candidate.career_relevance > 70) strengths.push("Career trajectory shows consistent growth in relevant roles.");
    if (candidate.redrob_signals?.github_activity_score > 70) strengths.push(`Active on GitHub (score: ${candidate.redrob_signals.github_activity_score.toFixed(0)}) corroborates claimed skills.`);
    if (strengths.length === 0) strengths.push(candidate.reasoning || "Strong overall match with role requirements.");

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={onClose}></div>
            <div className="fixed top-0 right-0 h-full w-[360px] bg-[var(--bg)] border-l border-[var(--border)] z-30 flex-col transition-transform duration-200 ease-out hidden md:flex animate-slide-in">
                <div className="flex flex-col h-full overflow-y-auto">
                    <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-[16px] font-[600] text-[var(--text-primary)]">{candidate.candidate_id}</span>
                            <span className="text-[14px] text-[var(--text-muted)] tabular-nums">#{candidate.rank}</span>
                        </div>
                        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div className="flex flex-col p-4 gap-4 border-b border-[var(--border)] shrink-0">
                        <div className="text-[11px] font-[500] uppercase tracking-[0.08em] text-[var(--text-faint)] mb-2">Score Breakdown</div>
                        <div className="flex items-center justify-between text-[14px] tabular-nums"><span className="text-[var(--text-muted)] w-24">Overall</span><span className="font-[600] text-[var(--text-primary)]">{parseFloat(candidate.overall_score).toFixed(1)}</span><ScoreBar value={candidate.overall_score} /></div>
                        <div className="flex items-center justify-between text-[14px] tabular-nums"><span className="text-[var(--text-muted)] w-24">Semantic</span><span className="text-[var(--text-primary)]">{parseFloat(candidate.semantic_fit).toFixed(1)}</span><ScoreBar value={candidate.semantic_fit} /></div>
                        <div className="flex items-center justify-between text-[14px] tabular-nums"><span className="text-[var(--text-muted)] w-24">Behavioral</span><span className="text-[var(--text-primary)]">{parseFloat(candidate.signal_quality).toFixed(1)}</span><ScoreBar value={candidate.signal_quality} /></div>
                        <div className="flex items-center justify-between text-[14px] tabular-nums"><span className="text-[var(--text-muted)] w-24">Experience</span><span className="text-[var(--text-primary)]">{parseFloat(candidate.career_relevance).toFixed(1)}</span><ScoreBar value={candidate.career_relevance} /></div>
                    </div>
                     <div className="flex flex-col p-4 gap-4 border-b border-[var(--border)] shrink-0">
                        <div className="text-[11px] font-[500] uppercase tracking-[0.08em] text-[var(--text-faint)] mb-2">Key Signals</div>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div className="flex flex-col"><span className="text-[11px] text-[var(--text-faint)]">Open to Work</span><span className="text-[14px] font-[500] text-[var(--text-primary)]">{candidate.redrob_signals?.open_to_work_flag ? 'Yes' : 'No'}</span></div>
                            <div className="flex flex-col"><span className="text-[11px] text-[var(--text-faint)]">Notice Period</span><span className="text-[14px] font-[500] text-[var(--text-primary)]">{candidate.redrob_signals?.notice_period_days || 0}d</span></div>
                            <div className="flex flex-col"><span className="text-[11px] text-[var(--text-faint)]">Response Rate</span><span className="text-[14px] font-[500] text-[var(--text-primary)]">{Math.round((candidate.redrob_signals?.recruiter_response_rate || 0) * 100)}%</span></div>
                            <div className="flex flex-col"><span className="text-[11px] text-[var(--text-faint)]">GitHub Score</span><span className="text-[14px] font-[500] text-[var(--text-primary)]">{candidate.redrob_signals?.github_activity_score > 0 ? candidate.redrob_signals.github_activity_score.toFixed(1) : 'N/A'}</span></div>
                        </div>
                    </div>
                    <div className="flex flex-col p-4 gap-2">
                        <div className="text-[11px] font-[500] uppercase tracking-[0.08em] text-[var(--text-faint)] mb-2">Why Ranked Here</div>
                        <div className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                            <ul className="list-disc pl-4 space-y-1">
                                {strengths.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const ResultsView = ({ isProcessing, onProcessComplete, result, onReset }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'ascending' });

  if (isProcessing) {
    return <LoadingState onProcessComplete={onProcessComplete} />;
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-[var(--text-lg)] font-[500] mb-2">No ranking run yet.</h2>
        <p className="text-[var(--text-base)] text-[var(--text-muted)] mb-6">Upload a job description and candidate pool to begin.</p>
        <a href="#upload" className="text-[var(--text-primary)] font-[500] hover:underline">← Go to Upload</a>
      </div>
    );
  }

  const sortedResults = [...result.finalRanked].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  const headers = [
    { key: 'rank', label: 'Rank' },
    { key: 'candidate_id', label: 'Candidate ID' },
    { key: 'overall_score', label: 'Score' },
    { key: 'semantic_fit', label: 'Semantic' },
    { key: 'signal_quality', label: 'Behavioral' },
    { key: 'career_relevance', label: 'Experience' },
  ];

  return (
    <div className="h-full flex flex-col relative w-full">
      <div className="shrink-0 py-4 px-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg)]">
        <div className="flex flex-col">
          <span className="text-[var(--text-lg)] font-[600] text-[var(--text-primary)]">Top 100 Candidates</span>
          <span className="text-[var(--text-sm)] text-[var(--text-muted)]">{result.parsedJD?.role_title || 'Senior AI Engineer'}</span>
        </div>
        <div className="flex items-center gap-[var(--space-2)]">
          <button onClick={onReset} className="h-8 px-3 flex items-center justify-center text-[14px] font-[500] text-[var(--text-primary)] transition-opacity hover:opacity-70 bg-transparent">Re-run</button>
          <button onClick={() => exportCsv(result.finalRanked)} className="h-8 px-4 flex items-center justify-center text-[14px] font-[500] transition-colors border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface)] rounded-[6px]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[680px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[var(--bg)] z-10 border-b border-[var(--border)]">
              <tr>
                {headers.map(({ key, label }) => (
                  <th key={key} className="px-4 py-2 text-[12px] font-[600] uppercase tracking-[0.06em] text-[var(--text-muted)] cursor-pointer" onClick={() => requestSort(key)}>
                    <div className="flex items-center gap-1">{label} {getSortIndicator(key)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((candidate, index) => (
                <tr key={candidate.candidate_id} onClick={() => setSelectedCandidate(candidate)} className={`h-[40px] cursor-pointer ${index < 10 ? 'bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.02)]' : ''} hover:bg-[var(--surface)] transition-colors`}>
                  <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{candidate.rank}</td>
                  <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{candidate.candidate_id}</td>
                  <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[600]">{candidate.overall_score}</td>
                  <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{candidate.semantic_fit}</td>
                  <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{candidate.signal_quality}</td>
                  <td className="px-4 py-0 text-[14px] tabular-nums text-[var(--text-primary)] font-[400]">{candidate.career_relevance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DetailPanel candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  );
};

export default ResultsView;