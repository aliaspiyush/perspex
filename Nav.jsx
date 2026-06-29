import React from 'react';
import ThemeToggle from './ThemeToggle';

const Nav = ({ activeView, isMenuOpen, setMenuOpen }) => {
  const NavLinks = () => (
    <>
      {['upload', 'results', 'about'].map(view => (
        <a
          key={view}
          href={`#${view}`}
          className={`capitalize text-[14px] pb-1 transition-colors ${
            activeView === view
              ? 'font-[600] border-b-2 border-[var(--text-primary)] text-[var(--text-primary)]'
              : 'font-[400] text-[var(--text-muted)] border-b-2 border-transparent hover:text-[var(--text-primary)]'
          }`}
        >
          {view}
        </a>
      ))}
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 h-[48px] w-full bg-[var(--bg)] border-b border-[var(--border)] px-4 md:px-6 flex items-center justify-between">
        <a href="#upload" className="flex items-center gap-3 text-[var(--text-primary)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 2L12 12" />
            <path d="M12 12L18 18" />
          </svg>
          <span className="font-[family-name:var(--font-display)] text-[18px]">Perspex</span>
        </a>

        <div className="hidden md:flex items-center gap-6 text-[14px]">
          <nav className="flex items-center gap-6 h-full pt-1">
            <NavLinks />
          </nav>
          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="flex items-center justify-center min-w-[32px] min-h-[32px] text-[var(--text-primary)]">
            {isMenuOpen ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>}
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <div className="md:hidden fixed top-[48px] left-0 right-0 bg-[var(--bg)] border-b border-[var(--border)] z-40 flex flex-col p-4 gap-4 text-[14px]">
          <NavLinks />
        </div>
      )}
    </>
  );
};

export default Nav;