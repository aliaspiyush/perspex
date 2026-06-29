import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import './styles/tokens.css';
import SetupView    from './components/SetupView';
import PipelineView from './components/PipelineView';
import ResultsView  from './components/ResultsView';

export default function App() {
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  // app stage: 'setup' | 'running' | 'results'
  const [stage, setStage] = useState('setup');

  // persisted config
  const [jdText, setJdText] = useState(() => sessionStorage.getItem('perspex_jd') || DEFAULT_JD);

  // pipeline state
  const [progress, setProgress]     = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleStart = (jd) => {
    sessionStorage.setItem('perspex_jd', jd);
    setJdText(jd);
    setStage('running');
  };

  const handleProgress = (p) => {
    setProgress(p);
    if (p.phase === 'complete') {
      setFinalResult(p);
      setStage('results');
    }
  };

  const handleReset = () => {
    setStage('setup');
    setProgress(null);
    setFinalResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] font-[family-name:var(--font-body)]">

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] h-12 flex items-center justify-between px-6 bg-[var(--bg)]">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[var(--text)]">
            <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1.8"/>
            <line x1="8" y1="2" x2="8" y2="22" stroke="currentColor" strokeWidth="1.8"/>
            <line x1="2" y1="10" x2="8" y2="10" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
          <span className="font-semibold text-sm tracking-tight">Perspex</span>
          <span className="text-[var(--text-faint)] text-xs hidden sm:inline">/ AI Candidate Ranker</span>
        </div>

        <div className="flex items-center gap-3">
          {stage !== 'setup' && (
            <button
              onClick={handleReset}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--surface-offset)]"
            >
              ← New Run
            </button>
          )}
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            {['setup', 'running', 'results'].map((s, i) => (
              <React.Fragment key={s}>
                <span className={stage === s ? 'text-[var(--text)] font-medium' : ''}>
                  {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
                {i < 2 && <span className="text-[var(--text-faint)]">→</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="w-px h-4 bg-[var(--divider)]" />
          <button
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-offset)] transition-colors"
          >
            {theme === 'light' ? <Moon size={14}/> : <Sun size={14}/>}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {stage === 'setup'   && <SetupView    jdText={jdText} onStart={handleStart} />}
        {stage === 'running' && <PipelineView jdText={jdText} onProgress={handleProgress} />}
        {stage === 'results' && <ResultsView  result={finalResult} onReset={handleReset} />}
      </main>
    </div>
  );
}

const DEFAULT_JD = `Senior AI/ML Engineer — Intelligent Systems

We are looking for a senior AI/ML engineer to join our founding team and build the next generation of intelligent candidate discovery systems.

Responsibilities:
- Design and train transformer-based architectures for NLP and semantic understanding tasks
- Build and optimize LLM inference pipelines for production scale
- Fine-tune large language models (LLMs) using LoRA, QLoRA, and RLHF techniques
- Develop vector search and embedding infrastructure (FAISS, Milvus, Pinecone)
- Build MLOps pipelines for continuous model training and deployment on Kubernetes
- Collaborate with the founding team on system architecture and product direction

Requirements:
- 5+ years of hands-on experience in Machine Learning or AI Engineering
- Deep expertise in PyTorch, Transformers, and HuggingFace ecosystem
- Production experience deploying ML models at scale
- Strong understanding of NLP, semantic search, and information retrieval
- Experience with cloud infrastructure (AWS, GCP, or Azure)
- Excellent Python skills; familiarity with Rust or Go is a plus

What we value:
- Open source contributions and public work
- Fast learner with high agency and strong communication
- Experience in startup or fast-paced environments`;
