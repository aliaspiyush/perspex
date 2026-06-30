import { useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { id: 'upload', label: 'Upload' },
  { id: 'results', label: 'Results' },
  { id: 'about', label: 'About' },
]

function LensMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-mark">
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
    <header className="site-nav">
      <a 
        className="brand" 
        href="#upload" 
        aria-label="Perspex upload"
      >
        <LensMark />
        <span>Perspex</span>
      </a>

      <nav className={`nav-links ${isOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
        {links.map((link) => {
          const isActive = route === link.id
          return (
            <button
              className="nav-link"
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

      <div className="nav-actions">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button
          className="icon-button menu-button"
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
            {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
    </header>
  )
}
