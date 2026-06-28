import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import './styles/tokens.css';

import ChallengeBriefView from './components/ChallengeBriefView';
import JobUnderstandingView from './components/JobUnderstandingView';
import CandidateRankingView from './components/CandidateRankingView';
import SignalAnalysisView from './components/SignalAnalysisView';
import RankedShortlistView from './components/RankedShortlistView';

export default function App() {
  const [view, setView] = useState('#brief');
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#brief';
      if (['#brief', '#understanding', '#ranking', '#analysis', '#shortlist'].includes(hash)) {
        setView(hash);
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navLinks = [
    { id: '#brief', label: '1. Challenge Brief' },
    { id: '#understanding', label: '2. Job Understanding' },
    { id: '#ranking', label: '3. Candidate Ranking' },
    { id: '#analysis', label: '4. Signal Analysis' },
    { id: '#shortlist', label: '5. Ranked Shortlist' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-body)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] px-6 py-4 flex items-center justify-between bg-[var(--bg)]/90 backdrop-blur-sm">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[var(--text)]">
            <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
            <line x1="8" y1="2" x2="8" y2="22" stroke="currentColor" strokeWidth="2" />
            <line x1="2" y1="10" x2="8" y2="10" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="font-bold text-lg tracking-tight leading-none" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Perspex Evaluation Console
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.id}
              className={`text-sm transition-colors ${
                view === link.id
                  ? 'text-[var(--text)] font-semibold border-b border-[var(--text)] pb-0.5'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] pb-0.5 border-b border-transparent'
              }`}
            >
              {link.label}
            </a>
          ))}
          
          <div className="w-px h-4 bg-[var(--divider)] mx-2"></div>
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-1.5 rounded-[var(--radius)] hover:bg-[var(--surface-offset)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors border border-transparent hover:border-[var(--border)]"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-10">
        {view === '#brief' && <ChallengeBriefView />}
        {view === '#understanding' && <JobUnderstandingView />}
        {view === '#ranking' && <CandidateRankingView />}
        {view === '#analysis' && <SignalAnalysisView />}
        {view === '#shortlist' && <RankedShortlistView />}
      </main>
    </div>
  );
}
