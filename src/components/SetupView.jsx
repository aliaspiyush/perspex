import React, { useState } from 'react';

export default function SetupView({ jdText: initJD, onStart }) {
  const [jdText, setJdText] = useState(initJD || '');
  const [error, setError] = useState('');

  const canRun = jdText.trim().length > 50;

  const handleSubmit = () => {
    if (!jdText.trim() || jdText.trim().length < 50) return setError('Please paste a job description (at least 50 characters).');
    setError('');
    onStart(jdText.trim());
  };

  return (
    <div className="flex flex-col gap-6 p-8 max-w-3xl mx-auto w-full">
      
      {/* Top Metadata */}
      <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] font-mono">
        DATA &amp; AI CHALLENGE · REDROB · INDIA RUNS
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-[family-name:var(--font-display)] text-[var(--text-h)]">Intelligent Candidate Discovery</h1>
        <p className="text-[14px] text-[var(--text-muted)] leading-relaxed">
          Evaluate candidates for semantic fit, career relevance, and behavioral signals against your JD.
        </p>
      </div>

      {/* Pipeline Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { n: '01', label: 'JD Parser', desc: 'Intent & clusters' },
          { n: '02', label: 'Semantic',  desc: 'Context match' },
          { n: '03', label: 'Signals',   desc: 'Career & behavior' },
          { n: '04', label: 'Rank',      desc: 'Score & reason' },
        ].map(s => (
          <div key={s.n} className="border border-[var(--border)] bg-[var(--surface)] p-3 flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-[var(--text-muted)]">{s.n}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-h)]">{s.label}</span>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">{s.desc}</span>
          </div>
        ))}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* System Readiness */}
        <div className="border border-[var(--border)] bg-[var(--surface)] flex flex-col">
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-offset)] flex justify-between items-center">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-h)] font-mono">SYSTEM READINESS</span>
          </div>
          <div className="p-4 flex flex-col gap-2 text-[13px] font-mono">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Engine Online</span>
              <span className="text-[var(--text-h)] flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-pulse"/>ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Gemini API</span>
              <span className="text-[var(--text-h)]">CONNECTED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Model</span>
              <span className="text-[var(--text-h)]">READY</span>
            </div>
          </div>
        </div>

        {/* Candidate Pool */}
        <div className="border border-[var(--border)] bg-[var(--surface)] flex flex-col">
          <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-offset)] flex justify-between items-center">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-h)] font-mono">CANDIDATE POOL</span>
          </div>
          <div className="p-4 flex flex-col gap-2 text-[13px] font-mono">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Candidates</span>
              <span className="text-[var(--text-h)]">100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Source</span>
              <span className="text-[var(--text-h)]">sample_candidates.json</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Schema</span>
              <span className="text-[var(--text-h)]">Redrob schema</span>
            </div>
          </div>
        </div>
      </div>

      {/* JD Textarea */}
      <div className="border border-[var(--border)] bg-[var(--surface)] flex flex-col">
        <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-offset)] flex justify-between items-center">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-h)] font-mono">JOB DESCRIPTION</span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">{jdText.length} chars</span>
        </div>
        <textarea
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          placeholder="Paste job description..."
          className="w-full h-[120px] p-4 text-[13px] bg-transparent focus:outline-none resize-none leading-relaxed font-mono text-[var(--text)] placeholder-[var(--text-faint)]"
        />
      </div>

      {error && (
        <div className="border border-[var(--border)] p-3 text-[13px] font-mono bg-[var(--surface-offset)] text-[var(--text-h)]">
          {error}
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={handleSubmit}
        disabled={!canRun}
        className={`w-full p-4 text-[13px] font-bold font-mono uppercase tracking-widest transition-colors ${
          canRun 
            ? 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer' 
            : 'bg-[var(--surface-offset)] text-[var(--text-faint)] cursor-not-allowed border border-[var(--border)]'
        }`}
      >
        RUN PIPELINE
      </button>

    </div>
  );
}
