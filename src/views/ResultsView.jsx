import { useEffect, useMemo, useState } from 'react'
import { exportCsv } from '../utils/exportCsv.js'
import { exportXlsx } from '../utils/exportXlsx.js'

const progressSteps = [
  'Parsing JD',
  'Detecting Honeypots',
  'Running FAISS Search',
  'Scoring Candidates',
  'Writing Shortlist',
]

const columns = [
  { key: 'rank', label: 'Rank' },
  { key: 'candidate_id', label: 'Candidate ID' },
  { key: 'final', label: 'Score' },
  { key: 'semantic', label: 'Semantic' },
  { key: 'behavioral', label: 'Behavioral' },
  { key: 'experience', label: 'Experience' },
  { key: 'preference', label: 'Preference' },
]

function LoadingState() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((current) => Math.min(progressSteps.length - 1, current + 1))
    }, 400)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="loading-state" aria-live="polite">
      <h1>Running Perspex</h1>
      <p>Analyzing 100,000 candidates</p>
      <ol>
        {progressSteps.map((step, index) => (
          <li className={index <= activeStep ? 'is-active' : ''} key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  )
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function CandidateDrawer({ candidate, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!candidate) return null

  const scores = [
    ['Semantic Match', candidate.semantic],
    ['Behavioral Signals', candidate.behavioral],
    ['Experience Fit', candidate.experience],
    ['Preference Fit', candidate.preference],
  ]
  const signals = candidate.signals
  const reasons = [
    candidate.semantic >= candidate.behavioral
      ? 'Strong semantic match suggests relevant AI engineering experience.'
      : 'Behavioral signals indicate high intent and responsiveness.',
    candidate.experience >= candidate.preference
      ? 'Experience fit aligns with senior-level delivery expectations.'
      : 'Preference fit suggests the role constraints are a practical match.',
    signals.github_score > 0
      ? `Active on GitHub (score: ${signals.github_score}) corroborates claimed skills.`
      : 'Recent activity and response signals keep the profile viable for outreach.',
  ]

  return (
    <div className="drawer-layer" role="presentation">
      <button className="drawer-backdrop" type="button" aria-label="Close candidate detail" onClick={onClose} />
      <aside className="candidate-drawer" role="dialog" aria-modal="true" aria-labelledby="candidate-title">
        <div className="drawer-header">
          <h2 id="candidate-title">{candidate.candidate_id}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close detail panel">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <section className="drawer-section">
          <h3>Score breakdown</h3>
          <div className="score-breakdown">
            {scores.map(([label, value]) => (
              <div className="score-row" key={label}>
                <div>
                  <span>{label}</span>
                  <strong>{value.toFixed(2)}</strong>
                </div>
                <div className="score-track">
                  <span style={{ width: `${Math.round(value * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="drawer-section">
          <h3>Key signals</h3>
          <div className="signal-grid">
            <div>
              <span>open_to_work</span>
              <strong>{signals.open_to_work ? 'Yes' : 'No'}</strong>
            </div>
            <div>
              <span>notice_period</span>
              <strong>{signals.notice_period} days</strong>
            </div>
            <div>
              <span>response_rate</span>
              <strong>{Math.round(signals.response_rate * 100)}%</strong>
            </div>
            <div>
              <span>github_score</span>
              <strong>{signals.github_score < 0 ? 'N/A' : signals.github_score}</strong>
            </div>
            <div>
              <span>last_active</span>
              <strong>{formatDate(signals.last_active)}</strong>
            </div>
            <div>
              <span>work_mode</span>
              <strong>{signals.work_mode}</strong>
            </div>
          </div>
        </section>

        <section className="drawer-section">
          <h3>Why this candidate</h3>
          <ul className="reason-list">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  )
}

export default function ResultsView({ results, hasRun, isRunning, onRerun }) {
  const [sort, setSort] = useState({ key: 'rank', direction: 'asc' })
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [xlsxError, setXlsxError] = useState(false)

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      const aValue = a[sort.key]
      const bValue = b[sort.key]
      const direction = sort.direction === 'asc' ? 1 : -1

      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue) * direction
      }

      return (aValue - bValue) * direction
    })
  }, [results, sort])

  const toggleSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleExportXlsx = () => {
    try {
      exportXlsx(results)
      setXlsxError(false)
    } catch (e) {
      console.error(e)
      setXlsxError(true)
    }
  }

  if (isRunning) {
    return <LoadingState />
  }

  if (!hasRun) {
    return (
      <section className="empty-state">
        <h1>No results yet.</h1>
        <p>
          Upload a job description and candidate pool on the Upload screen, then run Perspex to see the ranked shortlist here.
        </p>
        <a href="#upload">
          Go to Upload &rarr;
        </a>
      </section>
    )
  }

  const hasResults = results && results.length > 0;

  return (
    <div className="page results-page">
      <header className="results-header">
        <div>
          <h1>Top 100 Candidates</h1>
          <p>Ranked by semantic match, behavioral signals, experience fit, and preference fit.</p>
        </div>
        <div className="header-actions">
          {xlsxError && <span style={{ fontSize: '12px', color: 'red' }}>XLSX export unavailable</span>}
          <button className="button secondary-button" type="button" onClick={handleExportXlsx} disabled={!hasResults}>
            Export XLSX
          </button>
          <button className="button secondary-button" type="button" onClick={() => exportCsv(results)} disabled={!hasResults}>
            Export CSV
          </button>
          <button className="button ghost-button" type="button" onClick={onRerun}>
            Re-run
          </button>
        </div>
      </header>

      <div className="table-wrap">
        <table className="results-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">
                  <button type="button" onClick={() => toggleSort(column.key)}>
                    {column.label}
                    {sort.key === column.key && <span>{sort.direction === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((candidate) => (
              <tr
                className={candidate.rank <= 10 ? 'top-candidate' : ''}
                key={candidate.candidate_id}
                tabIndex={0}
                onClick={() => setSelectedCandidate(candidate)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedCandidate(candidate)
                  }
                }}
              >
                <td>{candidate.rank}</td>
                <td>{candidate.candidate_id}</td>
                <td>{candidate.final.toFixed(3)}</td>
                <td>{candidate.semantic.toFixed(2)}</td>
                <td>{candidate.behavioral.toFixed(2)}</td>
                <td>{candidate.experience.toFixed(2)}</td>
                <td>{candidate.preference.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CandidateDrawer candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  )
}
