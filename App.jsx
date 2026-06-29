import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import UploadView from './views/UploadView';
import ResultsView from './views/ResultsView';
import AboutView from './views/AboutView';
import useTheme from './hooks/useTheme';

function App() {
  const [theme, setTheme] = useTheme();
  const [activeView, setActiveView] = useState('upload');
  const [isMenuOpen, setMenuOpen] = useState(false);

  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [candidateFile, setCandidateFile] = useState(null);
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['upload', 'results', 'about'].includes(hash)) {
        setActiveView(hash);
      } else {
        setActiveView('upload');
      }
      setMenuOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleRun = (jd) => {
    setJdText(jd);
    setIsProcessing(true);
    setActiveView('results');
    window.location.hash = 'results';
  };

  const handleReset = () => {
    setResults(null);
    setIsProcessing(false);
    setJdText('');
    setJdFile(null);
    setCandidateFile(null);
    setActiveView('upload');
    window.location.hash = 'upload';
  };

  const renderView = () => {
    if (isProcessing || (activeView === 'results' && !results)) {
      return <ResultsView isProcessing={true} onProcessComplete={setResults} jdText={jdText} />;
    }
    switch (activeView) {
      case 'results': return <ResultsView result={results} onReset={handleReset} />;
      case 'about': return <AboutView />;
      case 'upload':
      default:
        return <UploadView onRun={handleRun} jdFile={jdFile} setJdFile={setJdFile} candidateFile={candidateFile} setCandidateFile={setCandidateFile} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text-primary)] font-body">
      <Nav activeView={activeView} isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
      <main className="flex-1 flex flex-col relative w-full">
        {renderView()}
      </main>
    </div>
  );
}

export default App;