import { useEffect, useRef } from 'react'

const pipeline = [
  {
    step: '01',
    title: 'Deep Job Understanding',
    tag: 'Gemini 2.5 Flash',
    desc: 'Gemini 2.5 Flash parses the job description into a structured ranking schema: required skills with importance weights, seniority level, semantic domain clusters, behavioral expectations, and anti-patterns that disqualify candidates. Far beyond keyword extraction.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Contextual Relevance',
    tag: 'Semantic Scoring',
    desc: 'Candidates are evaluated for semantic fit using Gemini language understanding, not keyword overlap. A researcher who fine-tuned LLMs at DeepMind scores far higher than someone who merely listed "LLMs" on their profile. Context beats keyword counts.',
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
    tag: 'Multi-Signal Fusion',
    desc: 'All available signals are fused: profile attributes, career trajectory, GitHub activity, publication count, open-source contributions, response rate, notice period, and work-mode preference. Four dimensions, one auditable composite score.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 18l4-8 4 5 4-3 4 6" />
        <path d="M21 18H3" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Ranked Shortlist',
    tag: 'Output',
    desc: 'Gemini produces an ordered shortlist with per-candidate scores across four dimensions, explicit reasoning for each rank, key strengths, concerns, a honeypot filter that removes keyword-stuffed profiles, and an executive summary of the entire cohort.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
]

const signals = [
  { label: 'Semantic Fit',        pct: 40, desc: 'Role, domain and skills alignment evaluated by Gemini language understanding' },
  { label: 'Behavioral Signals',  pct: 30, desc: 'GitHub activity, publications, response rate, open-source contributions' },
  { label: 'Experience Depth',    pct: 20, desc: 'Years of experience, seniority level, career trajectory, domain exposure' },
  { label: 'Preference Fit',      pct: 10, desc: 'Remote preference, notice period, work-mode and culture compatibility' },
]

const stats = [
  { value: 'Gemini 2.5 Flash', label: 'Core AI engine powering every ranking' },
  { value: '4 Signals',        label: 'Fused per candidate into one composite score' },
  { value: 'Real-time',        label: 'AI ranking — results stream as they arrive' },
  { value: '100%',             label: 'Client-side — no candidate data leaves your browser' },
]

function AnimatedBar({ pct, delay = 0 }) {
  const barRef = useRef(null)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (barRef.current) barRef.current.style.width = `${pct}%`
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

      {/* Hero */}
      <section className="home-hero">
        
        {/* Decorative Floating Artifacts */}
        <div className="hero-floating-artifacts" aria-hidden="true">
          <div className="float-card float-card-1">
            <div className="fc-header">
              <span className="fc-dot" />
              <span>Semantic Match</span>
            </div>
            <div className="fc-bar"><div className="fc-fill" style={{width: '92%'}}></div></div>
            <div className="fc-text">High intent detected</div>
          </div>
          
          <div className="float-card float-card-2">
            <div className="fc-header">
              <span className="fc-dot fc-dot-blue" />
              <span>Pipeline Active</span>
            </div>
            <div className="fc-code">
              {`Score = 0.4(Sem) + 0.3(Beh)\nTarget: Senior AI Eng`}
            </div>
          </div>
          
          <div className="float-card float-card-3">
            <div className="fc-avatar" />
            <div className="fc-lines">
              <div className="fc-line" style={{width: '80%'}}></div>
              <div className="fc-line" style={{width: '60%'}}></div>
            </div>
            <div className="fc-badge">Rank 01</div>
          </div>
        </div>

        <div className="home-hero-badge">Powered by Gemini 2.5 Flash</div>
        <h1 className="home-hero-title">
          The AI recruiter that<br />
          <span className="home-hero-accent">sees the real signal.</span>
        </h1>
        <p className="home-hero-sub">
          Perspex doesn't filter resumes -- it intelligently ranks candidates
          using Gemini 2.5 Flash. Upload a job description and a candidate pool,
          and receive a semantically-aware, AI-ranked shortlist in seconds.
        </p>
        <div className="home-hero-actions">
          <button className="button primary-button" onClick={() => { window.location.hash = 'upload' }}>
            Try Perspex -&gt;
          </button>
          <button className="button ghost-button" onClick={() => { window.location.hash = 'about' }}>
            How it works
          </button>
        </div>
      </section>

      {/* Stats strip */}
      <section className="home-stats">
        {stats.map((s) => (
          <div key={s.label} className="home-stat-cell">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Pipeline */}
      <section className="home-section">
        <p className="home-section-eyebrow">How it works</p>
        <h2 className="home-section-title">From job description to AI-ranked shortlist.</h2>
        <p className="home-section-sub">
          Four stages powered by Gemini 2.5 Flash -- each adding a layer of intelligence.
          No black-box magic, just verifiable signal fusion with full candidate-level reasoning.
        </p>

        <div className="home-pipeline">
          {pipeline.map((stage) => (
            <div key={stage.step} className="home-pipeline-card">
              <div className="home-pipeline-icon">{stage.icon}</div>
              <div className="home-pipeline-meta">
                <span className="home-pipeline-step">{stage.step} &middot; {stage.tag}</span>
                <h3 className="home-pipeline-name">{stage.title}</h3>
              </div>
              <p className="home-pipeline-desc">{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring formula */}
      <section className="home-section">
        <p className="home-section-eyebrow">The scoring formula</p>
        <h2 className="home-section-title">Four signals. One score. Full transparency.</h2>
        <p className="home-section-sub">
          Every candidate's final rank is a weighted composite of four dimensions scored live
          by Gemini 2.5 Flash. Weights are fully configurable before each run.
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

      {/* Gemini info strip */}
      <div className="home-gemini-strip">
        <span><strong>Gemini 2.5 Flash</strong> generates scores, reasoning, key strengths, concerns, and an executive summary for every run.</span>
        <span className="home-gemini-strip-right">Real-time &middot; Auditable &middot; Client-side</span>
      </div>

      {/* CTA */}
      <section className="home-cta">
        <h2 className="home-cta-title">Ready to find your best candidate?</h2>
        <p className="home-cta-sub">
          Powered by Gemini 2.5 Flash. Runs entirely in your browser -- upload a JD and
          a candidate pool. No account. No server. No data leaves your device.
        </p>
        <button className="button primary-button" onClick={() => { window.location.hash = 'upload' }}>
          Get started -&gt;
        </button>
      </section>

    </div>
  )
}
