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

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-start">
      
      {/* LEFT PANEL */}
      <div className="w-full md:w-[42%] flex flex-col gap-10">
        
        {/* JD Section */}
        <section className="flex flex-col gap-3">
          <label className="text-xs font-semibold tracking-wider text-[var(--text-muted)]">JOB DESCRIPTION</label>
          
          <textarea 
            className="w-full h-32 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] text-sm resize-none focus:outline-none focus:border-[var(--text-muted)] transition-colors placeholder:text-[var(--text-faint)]"
            placeholder="Paste the job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-[var(--divider)]"></div>
            <span className="text-[10px] uppercase tracking-widest text-[var(--text-faint)]">or</span>
            <div className="flex-1 h-px bg-[var(--divider)]"></div>
          </div>
          
          <div 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handleJdDrop}
            className="relative flex flex-col items-center justify-center p-6 border border-dashed border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius)] hover:bg-[var(--surface-2)] hover:border-[var(--text-muted)] transition-colors group cursor-pointer"
          >
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setJdFile(e.target.files[0])} accept=".txt,.docx" />
            {jdFile ? (
              <div className="flex items-center gap-3 text-sm">
                <FileText size={16} className="text-[var(--text-muted)]" />
                <span className="font-medium truncate max-w-[200px]">{jdFile.name}</span>
                <span className="text-[var(--text-faint)] text-xs">{(jdFile.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                <UploadCloud size={20} className="group-hover:text-[var(--text)] transition-colors" />
                <span className="text-sm">Upload .docx or .txt</span>
              </div>
            )}
          </div>
        </section>

        {/* Candidate Pool Section */}
        <section className="flex flex-col gap-3">
          <label className="text-xs font-semibold tracking-wider text-[var(--text-muted)]">CANDIDATE POOL</label>
          <div 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handlePoolDrop}
            className="relative flex flex-col items-center justify-center p-8 border border-dashed border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius)] hover:bg-[var(--surface-2)] hover:border-[var(--text-muted)] transition-colors group cursor-pointer"
          >
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setPoolFile(e.target.files[0])} accept=".jsonl,.csv" />
            {poolFile ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 size={16} className="text-[var(--text)]" />
                  {poolFile.name}
                </div>
                <div className="text-[var(--text-muted)] text-xs">
                  {(poolFile.size / (1024 * 1024)).toFixed(2)} MB • ~{Math.floor(poolFile.size / 500)} records estimated
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
                <UploadCloud size={20} className="group-hover:text-[var(--text)] transition-colors" />
                <span className="text-sm">Upload candidates.jsonl</span>
              </div>
            )}
          </div>
        </section>

        {/* Ranking Config */}
        <section className="flex flex-col gap-3">
          <details className="group border border-[var(--border)] rounded-[var(--radius)] bg-[var(--surface)] overflow-hidden">
            <summary className="p-4 text-xs font-semibold tracking-wider text-[var(--text-muted)] cursor-pointer select-none flex items-center justify-between">
              RANKING CONFIG
              <span className="text-[var(--text-faint)] group-open:hidden">Show</span>
              <span className="text-[var(--text-faint)] hidden group-open:block">Hide</span>
            </summary>
            
            <div className="p-4 pt-0 flex flex-col gap-5 border-t border-[var(--divider)] mt-2">
              
              {Object.entries(weights).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace('_', ' ')} Match</span>
                    <span className="font-mono text-[var(--text-muted)]">{value}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={value}
                    onChange={(e) => setWeights({...weights, [key]: parseInt(e.target.value)})}
                    className="w-full h-1 bg-[var(--border)] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--text)] [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-[var(--divider)] flex justify-between items-center">
                <span className="text-sm text-[var(--text-muted)]">Total Weight</span>
                <span className={`font-mono text-sm font-medium px-2 py-1 border rounded ${sum === 100 ? 'border-[var(--text)] text-[var(--text)]' : 'border-[var(--text-muted)] text-[var(--text-muted)]'}`}>
                  {sum} / 100
                </span>
              </div>
            </div>
          </details>
        </section>

        {/* Primary Action */}
        <button 
          disabled={!isValid}
          onClick={onRun}
          className={`w-full py-3.5 px-4 rounded-[var(--radius)] font-medium transition-all ${
            isValid 
              ? 'bg-[var(--primary)] text-[var(--primary-fg)] hover:bg-[var(--primary-hover)]' 
              : 'bg-[var(--surface-offset)] text-[var(--text-faint)] cursor-not-allowed border border-[var(--border)]'
          }`}
        >
          Run Perspex
        </button>

      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[58%] flex flex-col gap-10 mt-8 md:mt-0">
        
        <div className="flex flex-col gap-8">
          <h2 className="text-lg font-medium">Pipeline Architecture</h2>
          
          <div className="flex flex-col gap-4 relative before:content-[''] before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-px before:bg-[var(--border)]">
            {[
              { title: 'JD Parser', desc: 'Extracts core competencies and implicit requirements.' },
              { title: 'Honeypot Filter', desc: 'Identifies and removes artificially optimized profiles.' },
              { title: 'FAISS Search', desc: 'Performs high-dimensional semantic similarity retrieval.' },
              { title: 'Signal Scorer', desc: 'Evaluates behavioral and historical trajectory markers.' },
              { title: 'Ranked Output', desc: 'Consolidates deterministic scores into a strict ranking.' }
            ].map((stage, i) => (
              <div key={i} className="flex gap-4 relative z-10">
                <div className="w-7 h-7 shrink-0 rounded-full bg-[var(--bg)] border border-[var(--text)] flex items-center justify-center text-xs font-mono">
                  {i + 1}
                </div>
                <div className="flex flex-col gap-0.5 pt-1">
                  <span className="font-medium text-sm">{stage.title}</span>
                  <span className="text-sm text-[var(--text-muted)]">{stage.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap pt-6 border-t border-[var(--divider)]">
          <div className="px-3 py-1.5 border border-[var(--border)] rounded-[var(--radius)] text-xs text-[var(--text-muted)] font-mono">
            100K candidates
          </div>
          <div className="px-3 py-1.5 border border-[var(--border)] rounded-[var(--radius)] text-xs text-[var(--text-muted)] font-mono">
            23 signals
          </div>
          <div className="px-3 py-1.5 border border-[var(--border)] rounded-[var(--radius)] text-xs text-[var(--text-muted)] font-mono">
            ~41s runtime
          </div>
        </div>

      </div>

    </div>
  );
}
