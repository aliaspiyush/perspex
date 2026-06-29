import React, { useState } from 'react';
import { ExternalLink, Key, FileText, Zap } from 'lucide-react';

export default function SetupView({ apiKey: initKey, jdText: initJD, onStart }) {
  const [apiKey, setApiKey] = useState(initKey || '');
  const [jdText, setJdText] = useState(initJD || '');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const canRun = apiKey.trim().length > 10 && jdText.trim().length > 50;

  const handleSubmit = () => {
    if (!apiKey.trim()) return setError('Please enter your Gemini API key.');
    if (!jdText.trim() || jdText.trim().length < 50) return setError('Please paste a job description (at least 50 characters).');
    setError('');
    onStart(apiKey.trim(), jdText.trim());
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">

      {/* Hero */}
      <div className="flex flex-col gap-4 border-b border-[var(--divider)] pb-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          Data &amp; AI Challenge · Redrob · India Runs
        </div>
        <h1 className="text-4xl font-[family-name:var(--font-display)] tracking-tight leading-tight">
          Intelligent Candidate Discovery
        </h1>
        <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-2xl">
          Paste a job description. Perspex uses <strong className="text-[var(--text)]">Google Gemini</strong> to deeply understand the role,
          then evaluates 100 candidates for <strong className="text-[var(--text)]">semantic fit</strong>,{' '}
          <strong className="text-[var(--text)]">career relevance</strong>, and{' '}
          <strong className="text-[var(--text)]">behavioral signals</strong> — producing an explainable ranked shortlist in seconds.
        </p>

        {/* How it works */}
        <div className="grid grid-cols-4 gap-3 mt-2">
          {[
            { n: '01', label: 'JD Understanding', desc: 'Gemini parses intent, skill clusters, seniority' },
            { n: '02', label: 'Semantic Fit',      desc: 'Beyond keywords — depth and domain context' },
            { n: '03', label: 'Signal Integration', desc: 'Career metadata + behavioral signals' },
            { n: '04', label: 'Ranked Shortlist',  desc: 'Score + AI reasoning for every candidate' },
          ].map(s => (
            <div key={s.n} className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-4 flex flex-col gap-2">
              <span className="font-mono text-xs text-[var(--text-faint)]">{s.n}</span>
              <span className="text-xs font-semibold">{s.label}</span>
              <span className="text-[10px] text-[var(--text-muted)] leading-relaxed">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* API Key */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Key size={14} className="text-[var(--text-muted)]" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Gemini API Key</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] focus:outline-none focus:border-[var(--text-muted)] transition-colors font-mono pr-16"
              />
              <button
                onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                {showKey ? 'hide' : 'show'}
              </button>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-[var(--text-muted)]">
              <p>Free tier available — no credit card needed.</p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--text)] hover:underline"
              >
                Get your free API key at Google AI Studio
                <ExternalLink size={11} />
              </a>
              <p className="text-[var(--text-faint)]">Key is stored in sessionStorage only — never sent anywhere except Gemini.</p>
            </div>
          </div>
        </div>

        {/* JD Summary */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-[var(--text-muted)]" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Candidate Pool</h2>
          </div>
          <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] p-5 flex flex-col gap-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Candidates',    value: '100' },
                { label: 'Source',        value: 'sample_candidates.json' },
                { label: 'Schema',        value: 'Redrob candidate_schema' },
                { label: 'Signals',       value: 'redrob_signals included' },
              ].map(r => (
                <div key={r.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{r.label}</span>
                  <span className="text-xs font-mono">{r.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] border-t border-[var(--divider)] pt-3">
              Each candidate will be evaluated by Gemini for semantic fit, career relevance, and behavioral signals against your JD.
            </p>
          </div>
        </div>
      </div>

      {/* JD Input */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-[var(--text-muted)]" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Job Description</h2>
          </div>
          <span className="text-xs text-[var(--text-muted)]">{jdText.length} chars</span>
        </div>
        <textarea
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          placeholder="Paste the full job description here… Gemini will extract skills, seniority, domain context, behavioral expectations, and semantic clusters."
          className="w-full h-64 px-4 py-3 text-sm border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] focus:outline-none focus:border-[var(--text-muted)] transition-colors resize-none leading-relaxed placeholder:text-[var(--text-faint)] font-mono"
        />
      </div>

      {/* Error + CTA */}
      {error && (
        <p className="text-sm text-[var(--text)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 bg-[var(--surface-offset)]">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canRun}
        className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius)] text-sm font-semibold transition-all ${
          canRun
            ? 'bg-[var(--text)] text-[var(--bg)] hover:opacity-85 cursor-pointer'
            : 'bg-[var(--surface-offset)] text-[var(--text-faint)] cursor-not-allowed border border-[var(--border)]'
        }`}
      >
        <Zap size={15} />
        Run AI Ranking Pipeline
      </button>

      <p className="text-xs text-[var(--text-muted)] text-center">
        Processes 100 candidates in ~20 Gemini API calls · gemini-1.5-flash · No GPU required
      </p>
    </div>
  );
}
