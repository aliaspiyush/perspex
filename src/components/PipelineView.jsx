import React, { useEffect, useRef, useState } from 'react';
import { runRankingPipeline } from '../engine/ranker';

export default function PipelineView({ jdText, onProgress }) {
  const ranOnce = useRef(false);
  
  const [activeStage, setActiveStage] = useState(1);
  const [logs, setLogs] = useState({}); // stage index -> log message

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    runRankingPipeline(jdText, (p) => {
      // Map pipeline phase to our 5 visual stages
      let stage = 1;
      let logMsg = p.message || '';
      
      switch (p.phase) {
        case 'parsing_jd':
          stage = 1; break;
        case 'jd_parsed':
          stage = 2; logMsg = `JD parsed · ${(p.parsedJD?.role_title || '').substring(0,20)} · ${p.parsedJD?.semantic_clusters?.length || 0} clusters`; break;
        case 'loading_candidates':
          stage = 2; logMsg = 'Loading pool and applying heuristic gates...'; break;
        case 'candidates_loaded':
          stage = 3; logMsg = `Filtered honeypots. Base pool ready (${p.totalCandidates} total).`; break;
        case 'scoring':
          stage = 4; logMsg = p.message; break;
        case 'partial_results':
          stage = 4; logMsg = `Scoring... ${p.scored} / ${p.total} candidates processed`; break;
        case 'finalizing':
          stage = 5; logMsg = 'Sorting candidates by multidimensional distance...'; break;
        case 'summary':
          stage = 5; logMsg = 'Generating executive summary for top candidates...'; break;
        case 'complete':
          stage = 6; logMsg = 'Pipeline complete. Transitioning to results...'; break;
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
    <div className="flex flex-col p-8 max-w-3xl mx-auto w-full gap-8 mt-12">
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text-h)]">Ranking in Progress</h1>
        <p className="text-[14px] text-[var(--text-muted)] font-mono uppercase tracking-widest">~41s estimated</p>
      </div>

      <div className="flex flex-col gap-4">
        {stages.map(s => {
          const isCompleted = activeStage > s.n;
          const isActive = activeStage === s.n;
          const isPending = activeStage < s.n;
          
          let icon = '[○]';
          if (isCompleted) icon = '[✓]';
          if (isActive) icon = '[●]';

          return (
            <div key={s.n} className="flex flex-col gap-2">
              <div 
                className={`border border-[var(--border)] px-4 py-3 flex items-center gap-4 font-mono text-[13px] ${
                  isActive ? 'bg-[var(--surface-offset)] text-[var(--text-h)] font-bold' :
                  isCompleted ? 'bg-[var(--surface)] text-[var(--text-h)]' :
                  'bg-[var(--surface)] text-[var(--text-faint)]'
                }`}
              >
                <span className={isActive ? 'animate-pulse' : ''}>{icon}</span>
                <span>{s.n} / 5</span>
                <span className="uppercase tracking-wide">{s.label}</span>
              </div>
              
              {/* Log Message beneath */}
              {(isActive || isCompleted) && logs[s.n] && (
                <div className="text-[11px] font-mono text-[var(--text-muted)] pl-4 border-l border-[var(--border)] ml-3">
                  {logs[s.n]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
