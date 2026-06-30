import { useEffect, useRef } from 'react'

const pipeline = [
  {
    step: '01',
    title: 'Deep Job Understanding',
    desc: 'Perspex parses raw job descriptions — structured or freeform — extracting hard requirements, implicit seniority signals, culture cues, and preferred growth trajectories using large language model embeddings.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Semantic Embedding',
    desc: "Candidate profiles are vectorized via Gemini's text-embedding-004 model, capturing contextual meaning far beyond keyword overlap. Every role, project, and skill lives in high-dimensional semantic space.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="12" cy="12" r="3" />
        <circle cx="4" cy="6" r="2" />
        <circle cx="20" cy="6" r="2" />
        <circle cx="4" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
        <path d="M6 6.5l4 3.5M14 10l4-3.5M6 17.5l4-3.5M14 14l4 3.5" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Signal Integration',
    desc: 'A weighted scoring engine fuses four distinct signal layers — semantic fit, behavioral indicators, experience depth, and role preference alignment — into a single, auditable composite score.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 18l4-8 4 5 4-3 4 6" />
        <path d="M21 18H3" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Intelligent Ranking',
    desc: 'Candidates are sorted into a precision shortlist — not by résumé keywords but by true contextual fit. Every rank is explainable: scores break down by dimension so hiring decisions are transparent.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
]

const signals = [
  { label: 'Semantic Fit', pct: 40, desc: 'Role & responsibility match via vector cosine similarity' },
  { label: 'Behavioral', pct: 30, desc: 'Activity patterns, tenure signals, and growth trajectory' },
  { label: 'Experience Depth', pct: 20, desc: 'Seniority, domain exposure, and skill stack breadth' },
  { label: 'Preference Alignment', pct: 10, desc: 'Company size, culture, and role-type compatibility' },
]

const stats = [
  { value: '100K+', label: 'Candidates ranked in a single run' },
  { value: '4', label: 'Signal layers fused per candidate' },
  { value: '~4s', label: 'Median time to full shortlist' },
  { value: '100%', label: 'Client-side — no data leaves your browser' },
]

function AnimatedBar({ pct, delay = 0 }) {
  const barRef = useRef(null)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.width = `${pct}%`
      }
    }, delay + 400)
    return () => clearTimeout(timer)
  }, [pct, delay])

  return (
    <div className="home-bar-track">
      <div ref={barRef} className="home-bar-fill" style={{ width: 0 }} />
    </div>
  )
}

export default function HomeView() {
  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-badge">AI Candidate Ranking Engine</div>
        <h1 className="home-hero-title">
          The recruiter that<br />
          <span className="home-hero-accent">sees the real signal.</span>
        </h1>
        <p className="home-hero-sub">
          Perspex doesn't filter résumés — it ranks candidates by true contextual fit.
          Upload a job description and a candidate pool, and watch a semantically-aware
          AI produce an expert-ranked shortlist in seconds.
        </p>
        <div className="home-hero-actions">
          <button
            className="button primary-button"
            onClick={() => { window.location.hash = 'upload' }}
          >
            Try Perspex →
          </button>
          <button
            className="button ghost-button"
            onClick={() => { window.location.hash = 'about' }}
          >
            How it works
          </button>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="home-stats">
        {stats.map((s) => (
          <div key={s.label} className="home-stat-cell">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Pipeline ── */}
      <section className="home-section">
        <p className="home-section-eyebrow">How it works</p>
        <h2 className="home-section-title">From job description to ranked shortlist.</h2>
        <p className="home-section-sub">
          Four stages, each adding a layer of intelligence — no black-box magic, just verifiable signal fusion.
        </p>

        <div className="home-pipeline">
          {pipeline.map((stage) => (
            <div key={stage.step} className="home-pipeline-card">
              <div className="home-pipeline-icon">{stage.icon}</div>
              <div className="home-pipeline-meta">
                <span className="home-pipeline-step">{stage.step}</span>
                <h3 className="home-pipeline-name">{stage.title}</h3>
              </div>
              <p className="home-pipeline-desc">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Signals ── */}
      <section className="home-section">
        <p className="home-section-eyebrow">The scoring formula</p>
        <h2 className="home-section-title">Four signals. One score. Full transparency.</h2>
        <p className="home-section-sub">
          Every candidate's final rank is a weighted composite of four auditable dimensions.
          Weights are fully adjustable before each run.
        </p>

        <div className="home-signals">
          {signals.map((s, i) => (
            <div key={s.label} className="home-signal-row">
              <div className="home-signal-header">
                <span className="home-signal-label">{s.label}</span>
                <strong className="home-signal-pct">{s.pct}%</strong>
              </div>
              <AnimatedBar pct={s.pct} delay={i * 120} />
              <p className="home-signal-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <h2 className="home-cta-title">Ready to find your best candidate?</h2>
        <p className="home-cta-sub">
          Upload a JD and a candidate pool — Perspex runs entirely in your browser.
          No account. No data sent to a server.
        </p>
        <button
          className="button primary-button"
          onClick={() => { window.location.hash = 'upload' }}
        >
          Get started →
        </button>
      </section>
    </div>
  )
}
