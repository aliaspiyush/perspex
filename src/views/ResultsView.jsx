import { useMemo, useState } from 'react'
import { exportCsv } from '../utils/exportCsv.js'
import { exportXlsx } from '../utils/exportXlsx.js'

const columns = [
  { key: 'rank',          label: 'Rank' },
  { key: 'candidate_id', label: 'Candidate' },
  { key: 'overall_score',label: 'Score' },
  { key: 'semantic',     label: 'Semantic' },
  { key: 'behavioral',   label: 'Behavioral' },
  { key: 'experience',   label: 'Experience' },
  { key: 'preference',   label: 'Preference' },
]

// ── Live progress screen ──────────────────────────────────────────────────
function LoadingState({ progress }) {
  const msg   = progress?.message || 'Starting Perspex…'
  const pct   = progress?.pct ?? 0
  const phase = progress?.phase || ''

  const steps = [
    { key: 'parsing_jd',        label: 'Deep JD Analysis' },
    { key: 'candidates_loaded', label: 'Candidate Pool Loaded' },
    { key: 'scoring',           label: 'Batch AI Scoring' },
    { key: 'partial_results',   label: 'Partial Results Available' },
    { key: 'finalizing',        label: 'Finalizing Rankings' },
    { key: 'summary',           label: 'Executive Summary' },
  ]

  const activeIdx = steps.findIndex(s => phase.startsWith(s.key))

  return (
    <section className="loading-state" aria-live="polite">
      <h1>Running Perspex</h1>
      <p>{msg}</p>

      {/* Progress bar */}
      <div className="progress-bar-track" style={{ marginTop: '2rem' }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="faint-line" style={{ marginTop: '0.5rem', fontSize: 'var(--text-xs)' }}>
        {pct}%
      </p>

      <ol style={{ marginTop: '2rem' }}>
        {steps.map((step, idx) => (
          <li
            key={step.key}
            className={idx <= activeIdx ? 'is-active' : ''}
          >
            <span>{String(idx + 1).padStart(2, '0')}</span>
            {step.label}
          </li>
        ))}
      </ol>

      {/* Show partial results live */}
      {progress?.partialResults?.length > 0 && (
        <p className="muted-line" style={{ marginTop: '1.5rem' }}>
          ✦ {progress.partialResults.length} candidates scored so far — top candidate: {' '}
          <strong>{progress.partialResults[0]?.name || progress.partialResults[0]?.candidate_id}</strong>
          {' '}({progress.partialResults[0]?.overall_score}/100)
        </p>
      )}
    </section>
  )
}

// ── Candidate detail drawer ───────────────────────────────────────────────
function CandidateDrawer({ candidate, onClose }) {
  if (!candidate) return null

  const scores = [
    ['Semantic Match',   candidate.semantic   ?? 0],
    ['Behavioral',       candidate.behavioral ?? 0],
    ['Experience Fit',   candidate.experience ?? 0],
    ['Preference Fit',   candidate.preference ?? 0],
  ]

  const signals = candidate.signals || {}

  function formatDate(val) {
    try { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(val)) }
    catch { return '—' }
  }

  return (
    <div className="drawer-layer" role="presentation">
      <button className="drawer-backdrop" type="button" aria-label="Close" onClick={onClose} />
      <aside className="candidate-drawer" role="dialog" aria-modal="true" aria-labelledby="cand-title">
        <div className="drawer-header">
          <div>
            <h2 id="cand-title">{candidate.name || candidate.candidate_id}</h2>
            {candidate.title && (
              <p className="muted-line" style={{ marginTop: '0.25rem' }}>
                {candidate.title}{candidate.current_company ? ` @ ${candidate.current_company}` : ''}
              </p>
            )}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* AI Reasoning */}
        {candidate.reasoning && (
          <section className="drawer-section">
            <h3>AI Reasoning</h3>
            <p className="muted-line" style={{ lineHeight: 1.6 }}>{candidate.reasoning}</p>
          </section>
        )}

        {/* Strengths & Concerns */}
        {(candidate.key_strengths?.length > 0 || candidate.concerns?.length > 0) && (
          <section className="drawer-section">
            {candidate.key_strengths?.length > 0 && (
              <>
                <h3>Key Strengths</h3>
                <ul className="reason-list">
                  {candidate.key_strengths.map(s => <li key={s}>{s}</li>)}
                </ul>
              </>
            )}
            {candidate.concerns?.length > 0 && (
              <>
                <h3 style={{ marginTop: '1rem' }}>Concerns</h3>
                <ul className="reason-list">
                  {candidate.concerns.map(c => <li key={c}>{c}</li>)}
                </ul>
              </>
            )}
          </section>
        )}

        {/* Score breakdown */}
        <section className="drawer-section">
          <h3>Score Breakdown</h3>
          <div className="score-breakdown">
            {scores.map(([label, value]) => {
              // value may be 0-1 (normalised) or 0-100
              const pctVal = value > 1 ? value : value * 100
              return (
                <div className="score-row" key={label}>
                  <div>
                    <span>{label}</span>
                    <strong>{pctVal.toFixed(0)}/100</strong>
                  </div>
                  <div className="score-track">
                    <span style={{ width: `${Math.round(pctVal)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Signals */}
        <section className="drawer-section">
          <h3>Signals</h3>
          <div className="signal-grid">
            <div><span>open_to_work</span><strong>{signals.open_to_work ? 'Yes' : 'No'}</strong></div>
            <div><span>notice_period</span><strong>{signals.notice_period != null ? `${signals.notice_period} days` : '—'}</strong></div>
            <div><span>response_rate</span><strong>{signals.response_rate != null ? `${Math.round(signals.response_rate * 100)}%` : '—'}</strong></div>
            <div><span>github_stars</span><strong>{signals.github_score >= 0 ? signals.github_score : 'N/A'}</strong></div>
            <div><span>last_active</span><strong>{signals.last_active ? formatDate(signals.last_active) : '—'}</strong></div>
            <div><span>work_mode</span><strong>{signals.work_mode || '—'}</strong></div>
          </div>
        </section>
      </aside>
    </div>
  )
}

// ── Main results view ─────────────────────────────────────────────────────
export default function ResultsView({
  results, hasRun, isRunning, progress, summary, parsedJD, runError, onRerun,
}) {
  const [sort, setSort] = useState({ key: 'rank', direction: 'asc' })
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [xlsxError, setXlsxError] = useState(false)

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key]
      const dir = sort.direction === 'asc' ? 1 : -1
      if (typeof av === 'string') return av.localeCompare(bv) * dir
      return (av - bv) * dir
    })
  }, [results, sort])

  const toggleSort = (key) => setSort(cur => ({
    key,
    direction: cur.key === key && cur.direction === 'asc' ? 'desc' : 'asc',
  }))

  const handleExportXlsx = () => {
    try { exportXlsx(results); setXlsxError(false) }
    catch (e) { console.error(e); setXlsxError(true) }
  }

  // Running — show live progress
  if (isRunning) return <LoadingState progress={progress} />

  // Error
  if (runError) {
    return (
      <section className="empty-state">
        <h1>Something went wrong.</h1>
        <p>{runError}</p>
        <a href="#upload">← Back to Upload</a>
      </section>
    )
  }

  // No run yet
  if (!hasRun) {
    return (
      <section className="empty-state">
        <h1>No results yet.</h1>
        <p>Upload a job description and candidate pool on the Upload screen, then run Perspex to see the ranked shortlist here.</p>
        <a href="#upload">Go to Upload →</a>
      </section>
    )
  }

  const hasResults = results && results.length > 0

  return (
    <div className="page results-page">
      <header className="results-header">
        <div>
          <h1>{parsedJD ? `${parsedJD.role_title} — Shortlist` : 'Ranked Shortlist'}</h1>
          <p>
            {hasResults
              ? `${results.length} candidates ranked by Gemini 2.5 Flash · semantic fit, behavioral signals, experience, and preference.`
              : 'No candidates were scored.'}
          </p>
          {summary && (
            <p className="results-summary-text">{summary}</p>
          )}
        </div>
        <div className="header-actions">
          {xlsxError && <span style={{ fontSize: '12px', color: 'red' }}>XLSX unavailable</span>}
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
              {columns.map(col => (
                <th key={col.key} scope="col">
                  <button type="button" onClick={() => toggleSort(col.key)}>
                    {col.label}
                    {sort.key === col.key && <span>{sort.direction === 'asc' ? '↑' : '↓'}</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedResults.map(c => {
              const score = c.overall_score ?? Math.round((c.final ?? 0) * 100)
              const sem   = c.semantic   > 1 ? c.semantic   : c.semantic   * 100
              const beh   = c.behavioral > 1 ? c.behavioral : c.behavioral * 100
              const exp   = c.experience > 1 ? c.experience : c.experience * 100
              const pref  = c.preference > 1 ? c.preference : c.preference * 100
              return (
                <tr
                  className={c.rank <= 5 ? 'top-candidate' : ''}
                  key={c.candidate_id}
                  tabIndex={0}
                  onClick={() => setSelectedCandidate(c)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedCandidate(c) }
                  }}
                >
                  <td>{c.rank}</td>
                  <td>
                    <span>{c.name || c.candidate_id}</span>
                    {c.name && <span className="faint-line" style={{ fontSize: 'var(--text-xs)', marginLeft: '0.5rem' }}>({c.candidate_id})</span>}
                  </td>
                  <td><strong>{score}</strong></td>
                  <td>{sem.toFixed(0)}</td>
                  <td>{beh.toFixed(0)}</td>
                  <td>{exp.toFixed(0)}</td>
                  <td>{pref.toFixed(0)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <CandidateDrawer candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </div>
  )
}
