export default function ThemeToggle({ theme, onToggle }) {
  const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'

  return (
    <button className="theme-toggle icon-button" type="button" onClick={onToggle} aria-label={label} title={label}>
      {theme === 'light' ? (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M20.5 15.6A8.4 8.4 0 0 1 8.4 3.5 8.7 8.7 0 1 0 20.5 15.6Z" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5V5M12 19v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12H5M19 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
        </svg>
      )}
    </button>
  )
}
