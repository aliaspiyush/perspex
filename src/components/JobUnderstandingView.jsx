import React, { useState } from 'react';
import { parseJobDescription } from '../utils/adapters';
import { FileText } from 'lucide-react';

export default function JobUnderstandingView() {
  const [jdText, setJdText] = useState('');
  const [isParsed, setIsParsed] = useState(false);
  const profile = parseJobDescription(); // Using mock adapter for demonstration

  const handleParse = () => {
    setIsParsed(true);
  };

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-[family-name:var(--font-display)]">Job Understanding</h1>
        <p className="text-sm text-[var(--text-muted)]">Transform a job description into a structured, machine-usable ranking intent.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Input */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Job Description Input</h2>
          <div className="flex flex-col gap-4">
            <textarea 
              className="w-full h-[400px] p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] text-sm resize-none focus:outline-none focus:border-[var(--text)] transition-colors placeholder:text-[var(--text-faint)] font-mono leading-relaxed"
              placeholder="Paste raw job description text here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            <button 
              onClick={handleParse}
              disabled={!jdText.trim() && !isParsed}
              className={`w-full py-3 px-4 rounded-[var(--radius)] font-medium text-sm transition-colors ${
                jdText.trim() || isParsed ? 'bg-[var(--text)] text-[var(--bg)] hover:opacity-90' : 'bg-[var(--surface-offset)] text-[var(--text-faint)] cursor-not-allowed border border-[var(--border)]'
              }`}
            >
              Parse Job Intent
            </button>
          </div>
        </div>

        {/* Right: Output */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--text-muted)] uppercase">Structured Interpretation</h2>
          
          {!isParsed ? (
            <div className="flex-1 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] flex flex-col items-center justify-center text-[var(--text-muted)] gap-3 min-h-[400px]">
              <FileText size={24} className="opacity-50" />
              <span className="text-sm">Awaiting JD input for semantic analysis.</span>
            </div>
          ) : (
            <div className="border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] text-sm flex flex-col h-full overflow-y-auto max-h-[600px]">
              
              <div className="p-5 border-b border-[var(--divider)] bg-[var(--bg)]">
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-2 block">Structured Job Intent</span>
                <p className="text-[var(--text)] font-medium leading-relaxed">
                  Optimizing for an autonomous Senior AI Engineer capable of deploying PyTorch models to production, with strong remote work credibility and 5-8 years of demonstrated career stability.
                </p>
              </div>

              <div className="flex flex-col p-5 gap-6">
                
                <div className="grid grid-cols-2 gap-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Role Title</span>
                    <span className="font-mono">{profile.title.split('·')[0].trim()}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Seniority</span>
                    <span className="font-mono">{profile.seniority}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Experience Range</span>
                    <span className="font-mono">{profile.years_experience}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Location / Mode</span>
                    <span className="font-mono">{profile.work_mode}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Core Responsibilities</span>
                  <ul className="list-disc pl-4 text-xs text-[var(--text)] flex flex-col gap-1">
                    <li>Design and train transformer-based architectures</li>
                    <li>Optimize LLM inference latency for production</li>
                    <li>Collaborate with founding team on infrastructure</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Required Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.required_skills.map(s => <span key={s} className="px-1.5 py-0.5 border border-[var(--border)] rounded text-xs">{s}</span>)}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] tracking-wider">Ranking Signals Inferred</span>
                  <div className="p-3 border border-[var(--divider)] bg-[var(--surface-offset)] rounded text-xs flex flex-col gap-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Semantic Weight:</span>
                      <span>High (Technical depth required)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Behavioral Weight:</span>
                      <span>High (Startup environment requires high agency)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
