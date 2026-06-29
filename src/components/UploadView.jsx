import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

export default function UploadView({ onRun }) {
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [poolFile, setPoolFile] = useState(null);

  const [weights, setWeights] = useState({
    semantic: 40,
    behavioral: 30,
    experience: 20,
    preference: 10
  });

  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  const isValid = sum === 100 && (jdText.trim() || jdFile) && poolFile;

  const handleJdDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setJdFile(file);
  };

  const handlePoolDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setPoolFile(file);
  };

  const handleRun = () => {
    onRun(jdText || 'Job description loaded from file.');
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 pt-[40px] pb-16 flex flex-col md:flex-row gap-[48px] items-start">
      
      {/* LEFT COLUMN */}
      <div className="w-full md:w-[420px] shrink-0 flex flex-col gap-6">
        
        {/* JD Section */}
        <section className="flex flex-col gap-6">
          <label className="text-[11px] font-[500] tracking-[0.08em] uppercase text-[var(--text-faint)]">Job Description</label>
          
          <textarea 
            className="w-full h-32 p-3 bg-[var(--surface)] border border-[var(--border)] text-[14px] resize-none focus:outline-none focus:border-[var(--text-muted)] transition-colors placeholder:text-[var(--text-faint)] text-[var(--text-primary)]"
            placeholder="Paste the job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border)] opacity-50"></div>
            <span className="text-[11px] uppercase tracking-widest text-[var(--text-faint)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)] opacity-50"></div>
          </div>
          
          <div 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handleJdDrop}
            className="relative flex flex-col items-center justify-center h-[80px] border border-dashed border-[var(--border)] bg-[var(--surface)] hover:border-[rgba(0,0,0,0.25)] dark:hover:border-[rgba(255,255,255,0.25)] transition-colors group cursor-pointer"
          >
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setJdFile(e.target.files[0])} accept=".txt,.docx" />
            {jdFile ? (
              <div className="flex items-center gap-3 text-[14px]">
                <FileText size={16} className="text-[var(--text-muted)]" />
                <span className="font-medium truncate max-w-[200px] text-[var(--text-primary)]">{jdFile.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <UploadCloud size={16} className="group-hover:text-[var(--text-primary)] transition-colors" />
                <span className="text-[14px]">Upload .docx or .txt</span>
              </div>
            )}
          </div>
        </section>

        {/* Candidate Pool Section */}
        <section className="flex flex-col gap-6">
          <label className="text-[11px] font-[500] tracking-[0.08em] uppercase text-[var(--text-faint)]">Candidate Pool</label>
          <div 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handlePoolDrop}
            className="relative flex flex-col items-center justify-center h-[80px] border border-dashed border-[var(--border)] bg-[var(--surface)] hover:border-[rgba(0,0,0,0.25)] dark:hover:border-[rgba(255,255,255,0.25)] transition-colors group cursor-pointer"
          >
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setPoolFile(e.target.files[0])} accept=".jsonl,.csv" />
            {poolFile ? (
              <div className="flex items-center gap-2 text-[14px] text-[var(--text-primary)] font-medium">
                <CheckCircle2 size={16} />
                <span>{poolFile.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <UploadCloud size={16} className="group-hover:text-[var(--text-primary)] transition-colors" />
                <span className="text-[14px]">Upload candidates.jsonl</span>
              </div>
            )}
          </div>
        </section>

        {/* Ranking Config */}
        <section className="flex flex-col gap-6">
          <label className="text-[11px] font-[500] tracking-[0.08em] uppercase text-[var(--text-faint)]">Ranking Configuration</label>
          
          <div className="flex flex-col gap-5">
            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="flex justify-between text-[14px]">
                  <span className="capitalize text-[var(--text-primary)]">{key}</span>
                  <span className="tabular-nums text-[var(--text-primary)]">{value}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={value}
                  onChange={(e) => setWeights({...weights, [key]: parseInt(e.target.value)})}
                  className="w-full accent-[var(--text-primary)] opacity-80 hover:opacity-100 h-2"
                />
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[var(--border)]">
            <span className={`text-[14px] ${sum === 100 ? 'font-[600] text-[var(--text-primary)]' : 'font-[400] text-[var(--text-muted)]'}`}>
              Total: {sum} / 100
            </span>
          </div>
        </section>

        <button 
          disabled={!isValid}
          onClick={handleRun}
          className={`w-full h-[40px] flex items-center justify-center text-[14px] font-[500] transition-all ${
            isValid 
              ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90' 
              : 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] opacity-35 cursor-not-allowed'
          }`}
        >
          Run Pipeline
        </button>

      </div>

      {/* RIGHT COLUMN - Pipeline Diagram */}
      <div className="hidden md:flex flex-1 flex-col mt-2">
        <div className="text-[18px] font-[600] text-[var(--text-primary)] mb-6">Pipeline Architecture</div>
        
        <div className="flex flex-col">
          {[
            { title: 'JD Parser', desc: 'Extracts core competencies and implicit requirements.' },
            { title: 'Honeypot Filter', desc: 'Identifies and removes artificially optimized profiles.' },
            { title: 'FAISS Search', desc: 'Performs high-dimensional semantic similarity retrieval.' },
            { title: 'Signal Scorer', desc: 'Evaluates behavioral and historical trajectory markers.' },
            { title: 'Ranked Output', desc: 'Consolidates deterministic scores into a strict ranking.' }
          ].map((stage, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-[var(--border)] items-start">
              <div className="text-[12px] text-[var(--text-faint)] w-4 pt-0.5 tabular-nums">
                {i + 1}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-[600] text-[14px] text-[var(--text-primary)]">{stage.title}</span>
                <span className="text-[13px] text-[var(--text-muted)]">{stage.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[var(--border)]">
          <div className="flex flex-col gap-1">
            <span className="text-[16px] font-[600] text-[var(--text-primary)]">100,000</span>
            <span className="text-[11px] text-[var(--text-muted)]">candidates</span>
          </div>
          <div className="h-8 w-px bg-[var(--border)]"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[16px] font-[600] text-[var(--text-primary)]">23</span>
            <span className="text-[11px] text-[var(--text-muted)]">behavioral signals</span>
          </div>
          <div className="h-8 w-px bg-[var(--border)]"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[16px] font-[600] text-[var(--text-primary)]">~41s</span>
            <span className="text-[11px] text-[var(--text-muted)]">runtime</span>
          </div>
        </div>
      </div>
      
      {/* Mobile */}
      <details className="md:hidden w-full">
        <summary className="text-[14px] font-[500] text-[var(--text-primary)] cursor-pointer py-2 border-b border-[var(--border)]">Pipeline Architecture</summary>
        <div className="pt-4 flex flex-col">
          {[
            { title: 'JD Parser', desc: 'Extracts core competencies.' },
            { title: 'Honeypot Filter', desc: 'Removes artificial profiles.' },
            { title: 'FAISS Search', desc: 'Semantic similarity retrieval.' },
            { title: 'Signal Scorer', desc: 'Evaluates behavioral markers.' },
            { title: 'Ranked Output', desc: 'Consolidates strict ranking.' }
          ].map((stage, i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-[var(--border)] last:border-0 items-start">
              <div className="text-[12px] text-[var(--text-faint)] w-4 pt-0.5 tabular-nums">{i + 1}</div>
              <div className="flex flex-col">
                <span className="font-[600] text-[14px] text-[var(--text-primary)]">{stage.title}</span>
                <span className="text-[13px] text-[var(--text-muted)]">{stage.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </details>

    </div>
  );
}
