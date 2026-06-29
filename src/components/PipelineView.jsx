import React, { useEffect, useRef } from 'react';
import { runRankingPipeline } from '../engine/ranker';

export default function PipelineView({ apiKey, jdText, onProgress }) {
  const ranOnce = useRef(false);
  const logsEndRef = useRef(null);

  const [logs, setLogs] = React.useState([]);
  const [pct, setPct] = React.useState(0);
  const [phase, setPhase] = React.useState('starting');
  const [parsedJD, setParsedJD] = React.useState(null);
  const [partialResults, setPartialResults] = React.useState([]);
  const [error, setError] = React.useState(null);

  const addLog = (msg) => setLogs(l => [...l, { msg, ts: new Date().toLocaleTimeString() }]);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    runRankingPipeline(apiKey, jdText, (p) => {
      if (p.pct !== undefined) setPct(p.pct);
      if (p.phase) setPhase(p.phase);
      if (p.message) addLog(p.message);
      if (p.parsedJD) setParsedJD(p.parsedJD);
      if (p.partialResults) setPartialResults(p.partialResults.slice(0, 10));
      onProgress(p);
    }).catch(err => {
      setError(err.message || String(err));
      setPhase('error');
      addLog(`Error: ${err.message}`);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const scored = partialResults.length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-[family-name:var(--font-display)]">AI Ranking Pipeline Running</h1>
        <p className="text-sm text-[var(--text-muted)]">Gemini is evaluating candidates for semantic fit, career relevance, and behavioral signals.</p>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-[var(--text-muted)]">
          <span className="font-mono">{phase}</span>
          <span className="font-mono">{pct}%</span>
        </div>
        <div className="h-1.5 bg-[var(--surface-offset)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--text)] rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface-offset)] p-5">
          <div className="text-sm font-semibold mb-2">Pipeline Error</div>
          <p className="text-sm text-[var(--text-muted)] font-mono">{error}</p>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            Common causes: Invalid API key · Rate limit exceeded · Network error. Check your key at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">
              AI Studio
            </a>.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Parsed JD */}
        <div className="flex flex-col gap-4">
          {parsedJD ? (
            <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--divider)] bg-[var(--surface-2)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                ✓ JD Parsed by Gemini
              </div>
              <div className="p-4 flex flex-col gap-3 text-xs">
                <div>
                  <span className="text-[var(--text-muted)]">Role: </span>
                  <span className="font-semibold">{parsedJD.role_title}</span>
                  <span className="text-[var(--text-muted)] ml-2">({parsedJD.seniority})</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">{parsedJD.role_summary}</p>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Experience Band</span>
                  <div className="font-mono mt-1">{parsedJD.experience_years?.min}–{parsedJD.experience_years?.max} yrs (ideal: {parsedJD.experience_years?.ideal})</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Critical Skills</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(parsedJD.required_skills || [])
                      .filter(s => s.importance === 'critical')
                      .map(s => (
                        <span key={s.name} className="px-1.5 py-0.5 border border-[var(--border)] rounded font-mono bg-[var(--bg)]">{s.name}</span>
                      ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Semantic Clusters</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(parsedJD.semantic_clusters || []).map(c => (
                      <span key={c} className="px-1.5 py-0.5 border border-[var(--divider)] rounded text-[var(--text-muted)] bg-[var(--bg)] font-mono text-[10px]">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-6 flex items-center justify-center text-sm text-[var(--text-muted)] min-h-[200px]">
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-[var(--text-muted)] border-t-transparent rounded-full animate-spin" />
                Gemini parsing job description…
              </div>
            </div>
          )}
        </div>

        {/* Live partial results */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Live Rankings {scored > 0 ? `(Top ${Math.min(10, scored)} of ${scored} scored)` : ''}
          </div>
          <div className="border border-[var(--border)] rounded-[var(--radius)] overflow-hidden">
            {partialResults.length > 0 ? (
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[var(--divider)] bg-[var(--surface-2)]">
                  <tr>
                    <th className="px-3 py-2 text-[var(--text-muted)] font-medium">#</th>
                    <th className="px-3 py-2 text-[var(--text-muted)] font-medium">Candidate</th>
                    <th className="px-3 py-2 text-[var(--text-muted)] font-medium text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--divider)] bg-[var(--bg)]">
                  {partialResults.map((c, i) => (
                    <tr key={c.candidate_id} className="transition-colors hover:bg-[var(--surface-offset)]">
                      <td className="px-3 py-2 font-mono text-[var(--text-muted)]">{i + 1}</td>
                      <td className="px-3 py-2">
                        <div className="font-mono truncate max-w-[150px]">{c.candidate_id}</div>
                        <div className="text-[var(--text-muted)] truncate max-w-[150px]">{c.profile?.current_title || '—'}</div>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="font-mono font-bold">{c.overall_score}</span>
                        <span className="text-[var(--text-faint)]">/100</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                Results will appear as candidates are scored…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log stream */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Pipeline Log</div>
        <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--bg)] p-4 h-40 overflow-y-auto font-mono text-xs flex flex-col gap-1">
          {logs.map((l, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-[var(--text-faint)] shrink-0">{l.ts}</span>
              <span className="text-[var(--text-muted)]">{l.msg}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

    </div>
  );
}
