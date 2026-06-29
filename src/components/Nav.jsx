import { useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { id: 'upload', label: 'Upload' },
  { id: 'results', label: 'Results' },
  { id: 'about', label: 'About' },
]

function LensMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7" y="3" width="5" height="18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function Nav({ route, theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false)

  const navigate = (id) => {
    window.location.hash = id
    setIsOpen(false)
  }

  return (
    <header className="glass-header sticky top-0 z-50 h-[60px] flex items-center justify-between px-8">
      <a 
        className="flex items-center gap-2 text-[var(--text-primary)] hover:opacity-80 transition-opacity no-underline" 
        href="#upload" 
        aria-label="Perspex upload"
      >
        <LensMark />
        <span className="font-bold text-[18px] tracking-tight mt-[1px]">Perspex</span>
      </a>

      <nav className={`nav-links ${isOpen ? 'is-open' : ''} flex items-center gap-6`} aria-label="Primary navigation">
        {links.map((link) => {
          const isActive = route === link.id
          return (
            <button
              className={`text-[14px] transition-colors bg-transparent border-none cursor-pointer p-0 m-0 ${
                isActive 
                  ? 'font-semibold text-[var(--text-primary)] border-b-2 border-[var(--text-primary)] pb-0.5' 
                  : 'font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              type="button"
              key={link.id}
              onClick={() => navigate(link.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </button>
          )
        })}
      </nav>

      <div className="flex items-center gap-4">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          className="md:hidden flex items-center justify-center bg-transparent border-none cursor-pointer text-[var(--text-primary)] p-1"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none">
            {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
    </header>
  )
}
