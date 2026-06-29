import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import './styles/tokens.css';
import UploadView from './components/UploadView';
import PipelineView from './components/PipelineView';
import ResultsView from './components/ResultsView';
import AboutView from './components/AboutView';

export default function App() {
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['upload', 'results', 'about'].includes(hash) ? hash : 'upload';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App functional state
  const [jdText, setJdText] = useState(() => sessionStorage.getItem('perspex_jd') || '');
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['upload', 'results', 'about'].includes(hash)) {
        setRoute(hash);
      } else {
        setRoute('upload');
      }
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNav = (r) => {
    window.location.hash = r;
  };

  const handleStart = (jd) => {
    sessionStorage.setItem('perspex_jd', jd);
    setJdText(jd);
    setIsPipelineRunning(true);
  };

  const handleProgress = (p) => {
    setProgress(p);
    if (p.phase === 'complete') {
      setFinalResult(p);
      setIsPipelineRunning(false);
      handleNav('results');
    }
  };

  const NavItems = () => (
    <>
      {['upload', 'results', 'about'].map((item) => (
        <button
          key={item}
          onClick={() => handleNav(item)}
          className={`capitalize ${route === item ? 'font-[600] border-b-2 border-[var(--text-primary)]' : 'font-[400] text-[var(--text-muted)] border-b-2 border-transparent hover:text-[var(--text-primary)]'} pb-1 transition-colors`}
        >
          {item}
        </button>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] font-[family-name:var(--font-body)]">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 h-[48px] w-full bg-[var(--bg)] border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-[family-name:var(--font-display)] text-[18px] text-[var(--text-primary)]">Perspex</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[14px]">
          <nav className="flex items-center gap-6 h-full pt-1">
            <NavItems />
          </nav>
          <button
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className="flex items-center justify-center min-w-[32px] min-h-[32px] text-[var(--text-primary)] hover:opacity-70 transition-opacity"
          >
            {theme === 'light' ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />}
          </button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className="flex items-center justify-center min-w-[32px] min-h-[32px] text-[var(--text-primary)]"
          >
            {theme === 'light' ? <Moon size={16} strokeWidth={1.5} /> : <Sun size={16} strokeWidth={1.5} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center min-w-[32px] min-h-[32px] text-[var(--text-primary)]"
          >
            {isMobileMenuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[48px] left-0 right-0 bg-[var(--bg)] border-b border-[var(--border)] z-40 flex flex-col p-4 gap-4 text-[14px]">
          <NavItems />
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative w-full">
        {isPipelineRunning ? (
          <PipelineView jdText={jdText} onProgress={handleProgress} />
        ) : (
          <>
            {route === 'upload' && <UploadView jdText={jdText} onRun={handleStart} />}
            {route === 'results' && <ResultsView result={finalResult} onReset={() => handleNav('upload')} />}
            {route === 'about' && <AboutView />}
          </>
        )}
      </main>
    </div>
  );
}
