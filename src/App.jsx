import React, { useState, useEffect } from 'react';
import { Sun, Moon, File, Settings } from 'lucide-react';
import './styles/tokens.css';
import SetupView    from './components/SetupView';
import PipelineView from './components/PipelineView';
import ResultsView  from './components/ResultsView';
import PythonTerminal from './components/PythonTerminal';
import SidebarConfig from './components/SidebarConfig';

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

  const isResults = stage === 'results';

  return (
    <div className="h-full flex flex-col bg-[var(--bg)] text-[var(--text)] font-[family-name:var(--font-body)]">

      {/* HEADER ROW — 48px tall, full width */}
      <header className="shrink-0 h-12 border-b border-[var(--border)] flex items-center justify-between px-6 bg-[var(--bg)] z-30">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest font-semibold">
          <span className="text-[var(--text-h)]">Perspex</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {['setup', 'running', 'results'].map((s, i) => (
            <React.Fragment key={s}>
              <span className={stage === s ? 'text-[var(--text-h)] font-bold underline underline-offset-4' : 'text-[var(--text-muted)]'}>
                {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
              {i < 2 && <span className="text-[var(--text-muted)]">→</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-h)] transition-colors"
          >
            {theme === 'light' ? <Moon size={14}/> : <Sun size={14}/>}
          </button>
        </div>
      </header>

      {/* MAIN GRID */}
      <main 
        className="flex-1 min-h-0 grid" 
        style={{ 
          gridTemplateColumns: isResults ? '64px 1fr' : '280px 1fr 280px' 
        }}
      >
        {/* LEFT COLUMN */}
        {isResults ? (
          <div className="h-full bg-[var(--surface-offset)] border-r border-[var(--border)] flex flex-col items-center py-6 gap-6">
            <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-h)] hover:bg-[var(--bg)] border border-transparent hover:border-[var(--border)] rounded-[var(--radius)] transition-colors">
              <File size={16} />
            </button>
            <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-h)] hover:bg-[var(--bg)] border border-transparent hover:border-[var(--border)] rounded-[var(--radius)] transition-colors">
              <Settings size={16} />
            </button>
          </div>
        ) : (
          <PythonTerminal />
        )}

        {/* CENTER COLUMN */}
        <div className="h-full overflow-y-auto flex flex-col bg-[var(--bg)] relative">
          {stage === 'setup'   && <SetupView    jdText={jdText} onStart={handleStart} />}
          {stage === 'running' && <PipelineView jdText={jdText} onProgress={handleProgress} />}
          {stage === 'results' && <ResultsView  result={finalResult} onReset={handleReset} />}
        </div>

        {/* RIGHT COLUMN (Hidden in Results) */}
        {!isResults && (
          <SidebarConfig />
        )}
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
