import React, { useEffect, useRef, useState } from 'react';
import { runRankingPipeline } from '../engine/ranker';

export default function PipelineView({ jdText, onProgress }) {
  const ranOnce = useRef(false);
  
  const [activeStage, setActiveStage] = useState(1);
  const [logs, setLogs] = useState({});

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    runRankingPipeline(jdText, (p) => {
      let stage = 1;
      let logMsg = p.message || '';
      
      switch (p.phase) {
        case 'parsing_jd':
          stage = 1; break;
        case 'jd_parsed':
          stage = 2; logMsg = `JD parsed · ${(p.parsedJD?.role_title || '').substring(0,20)}`; break;
        case 'loading_candidates':
          stage = 2; logMsg = 'Loading pool and applying heuristic gates...'; break;
        case 'candidates_loaded':
          stage = 3; logMsg = `Filtered honeypots. Base pool ready (${p.totalCandidates} total).`; break;
        case 'scoring':
          stage = 4; logMsg = p.message; break;
        case 'partial_results':
          stage = 4; logMsg = `Scoring... ${p.scored} / ${p.total} candidates processed`; break;
        case 'finalizing':
          stage = 5; logMsg = 'Sorting candidates...'; break;
        case 'summary':
          stage = 5; logMsg = 'Generating executive summary...'; break;
        case 'complete':
          stage = 6; logMsg = 'Pipeline complete. Transitioning...'; break;
        default:
          stage = 1;
      }

      setActiveStage(stage);
      if (logMsg) {
        setLogs(prev => ({ ...prev, [stage]: logMsg }));
      }
      onProgress(p);
    }).catch(err => {
      setLogs(prev => ({ ...prev, 1: `ERROR: ${err.message}` }));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stages = [
    { n: 1, label: 'Parsing JD' },
    { n: 2, label: 'Detecting Honeypots' },
    { n: 3, label: 'Running FAISS Search' },
    { n: 4, label: 'Scoring Candidates' },
    { n: 5, label: 'Writing Shortlist' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] bg-[var(--bg)] p-8">
      <div className="w-full max-w-[320px] flex flex-col gap-6">
        {stages.map(s => {
          const isCompleted = activeStage > s.n;
          const isActive = activeStage === s.n;
          const isPending = activeStage < s.n;
          
          return (
            <div 
              key={s.n} 
              className={`flex flex-col gap-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-35'}`}
            >
              <div className={`text-[15px] ${isActive ? 'font-[600]' : 'font-[400]'} text-[var(--text-primary)] flex gap-3`}>
                <span className="w-4 tabular-nums">{s.n}.</span>
                <span>{s.label}</span>
              </div>
              {/* Optional minimal log display if active */}
              {(isActive && logs[s.n]) && (
                <div className="text-[13px] text-[var(--text-muted)] ml-7">
                  {logs[s.n]}
                </div>
              )}
            </div>
          );
        })}
        <div className="mt-8 text-[13px] text-[var(--text-muted)] pt-6 border-t border-[var(--border)]">
          Analyzing 100,000 candidates
        </div>
      </div>
    </div>
  );
}
