import React, { useState, useMemo } from 'react';

const UploadView = ({ onRun, jdFile, setJdFile, candidateFile, setCandidateFile }) => {
  const [jdText, setJdText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isConfigOpen, setConfigOpen] = useState(false);
  const [weights, setWeights] = useState({
    semantic: 40,
    behavioral: 30,
    experience: 20,
    preference: 10,
  });

  const totalWeight = useMemo(() => Object.values(weights).reduce((sum, w) => sum + w, 0), [weights]);
  const isRunDisabled = !(jdText.trim() || jdFile) || !candidateFile || totalWeight !== 100;

  const handleDrop = (setter) => (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setter(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 pt-[var(--space-10)] pb-16 flex flex-col md:flex-row gap-[var(--space-12)] items-start">
      <div className="w-full md:w-[420px] shrink-0 flex flex-col gap-6">
        <section className="flex flex-col gap-6">
          <label className="text-[var(--text-xs)] font-[500] tracking-[0.08em] uppercase text-[var(--text-faint)]">Job Description</label>
          {!jdFile ? (
            <textarea
              className="w-full h-40 p-3 bg-[var(--surface)] border border-[var(--border)] text-[14px] resize-none focus:outline-none focus:border-[var(--text-muted)] transition-colors placeholder:text-[var(--text-faint)] text-[var(--text-primary)] rounded-[6px]"
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          ) : (
             <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[6px]">
                <span className="text-[14px] font-medium text-[var(--text-primary)]">{jdFile.name}</span>
                <button onClick={() => setJdFile(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">&times;</button>
             </div>
          )}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--border)] opacity-50" />
            <span className="text-[var(--text-xs)] uppercase tracking-widest text-[var(--text-faint)]">or</span>
            <div className="flex-1 h-px bg-[var(--border)] opacity-50" />
          </div>
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop(setJdFile)} className={`relative flex flex-col items-center justify-center h-[80px] border border-dashed border-[var(--border)] bg-[var(--surface)] hover:border-[rgba(0,0,0,0.25)] dark:hover:border-[rgba(255,255,255,0.25)] transition-colors group cursor-pointer rounded-[6px] ${isDragging ? 'border-solid' : ''}`}>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setJdFile(e.target.files[0])} accept=".docx,.txt" />
            <span className="text-[14px] text-[var(--text-muted)]">{isDragging ? 'Drop to upload' : 'Upload .docx or .txt'}</span>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <label className="text-[var(--text-xs)] font-[500] tracking-[0.08em] uppercase text-[var(--text-faint)]">Candidate Pool</label>
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop(setCandidateFile)} className={`relative flex flex-col items-center justify-center h-[80px] border border-dashed border-[var(--border)] bg-[var(--surface)] hover:border-[rgba(0,0,0,0.25)] dark:hover:border-[rgba(255,255,255,0.25)] transition-colors group cursor-pointer rounded-[6px] ${isDragging ? 'border-solid' : ''}`}>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setCandidateFile(e.target.files[0])} accept=".jsonl,.csv" />
            {candidateFile ? (
              <div className="text-center">
                <span className="text-[14px] font-medium text-[var(--text-primary)]">{candidateFile.name}</span>
                <p className="text-[12px] text-[var(--text-muted)]">{(candidateFile.size / 1024 / 1024).toFixed(2)} MB | ~100,000 records estimated</p>
              </div>
            ) : (
              <span className="text-[14px] text-[var(--text-muted)]">{isDragging ? 'Drop to upload' : 'Upload candidates.jsonl'}</span>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <button onClick={() => setConfigOpen(!isConfigOpen)} className="text-left text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[13px]">Configure weights {isConfigOpen ? '↑' : '↓'}</button>
          {isConfigOpen && (
            <div className="flex flex-col gap-5 p-4 border border-[var(--border)] rounded-[6px] bg-[var(--surface)]">
              {Object.entries(weights).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[14px]">
                    <span className="capitalize text-[var(--text-primary)]">{key.replace('_', ' ')}</span>
                    <span className="tabular-nums text-[var(--text-primary)]">{value}</span>
                  </div>
                  <input type="range" min="0" max="100" value={value} onChange={(e) => setWeights({ ...weights, [key]: parseInt(e.target.value) })} className="w-full h-2 accent-[var(--text-primary)] opacity-80 hover:opacity-100" />
                </div>
              ))}
              <div className="pt-2 border-t border-[var(--border)]">
                <span className={`text-[14px] ${totalWeight === 100 ? 'font-[600] text-[var(--text-primary)]' : 'font-[400] text-[var(--text-faint)]'}`}>
                  Total: {totalWeight} / 100 {totalWeight !== 100 && '(Must total 100)'}
                </span>
              </div>
            </div>
          )}
        </section>

        <button disabled={isRunDisabled} onClick={() => onRun(jdText)} className={`w-full h-[40px] flex items-center justify-center text-[14px] font-[500] transition-all rounded-[6px] ${!isRunDisabled ? 'bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90' : 'bg-[var(--text-primary)] text-[var(--bg)] opacity-35 cursor-not-allowed'}`}>
          Run Perspex →
        </button>
      </div>

      <div className="hidden md:flex flex-1 flex-col mt-2">
        <div className="text-[var(--text-lg)] font-[600] text-[var(--text-primary)] mb-6">Pipeline Architecture</div>
        <div className="flex flex-col">
          {[
            { title: 'JD Parser', desc: 'Extracts core competencies and implicit requirements.' },
            { title: 'Honeypot Filter', desc: 'Identifies and removes artificially optimized profiles.' },
            { title: 'FAISS Search', desc: 'Performs high-dimensional semantic similarity retrieval.' },
            { title: 'Signal Scorer', desc: 'Evaluates behavioral and historical trajectory markers.' },
            { title: 'Ranked Output', desc: 'Consolidates deterministic scores into a strict ranking.' },
          ].map((item, index) => (
            <div key={index} className="flex gap-4 py-4 border-b border-[var(--border)] items-start">
              <div className="text-[var(--text-xs)] text-[var(--text-faint)] w-4 pt-0.5 tabular-nums">{String(index + 1).padStart(2, '0')}</div>
              <div className="flex flex-col gap-1">
                <span className="font-[600] text-[14px] text-[var(--text-primary)]">{item.title}</span>
                <span className="text-[13px] text-[var(--text-muted)]">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[var(--border)]">
          <div className="flex flex-col gap-1"><span className="text-[var(--text-base)] font-[600] text-[var(--text-primary)]">100K</span><span className="text-[var(--text-xs)] text-[var(--text-muted)]">candidates</span></div>
          <div className="h-8 w-px bg-[var(--border)]" />
          <div className="flex flex-col gap-1"><span className="text-[var(--text-base)] font-[600] text-[var(--text-primary)]">23</span><span className="text-[var(--text-xs)] text-[var(--text-muted)]">signals</span></div>
          <div className="h-8 w-px bg-[var(--border)]" />
          <div className="flex flex-col gap-1"><span className="text-[var(--text-base)] font-[600] text-[var(--text-primary)]">~41s</span><span className="text-[var(--text-xs)] text-[var(--text-muted)]">runtime</span></div>
        </div>
      </div>
    </div>
  );
};

export default UploadView;