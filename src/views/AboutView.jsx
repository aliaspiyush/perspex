// About page — fully updated to reflect the real Gemini-powered architecture

const pipeline = [
  {
    name: 'Deep JD Understanding',
    tag: 'Phase 01 · Gemini 2.5 Flash',
    description:
      'Gemini 2.5 Flash parses the job description into a machine-usable ranking schema: required skills with importance weights, ideal seniority, experience bands, semantic domain clusters, behavioral expectations, and anti-patterns that disqualify candidates. This goes far beyond extracting keywords.',
  },
  {
    name: 'Contextual Relevance',
    tag: 'Phase 02 · Semantic Scoring',
    description:
      'Candidates are evaluated for semantic fit using Gemini\'s language understanding — not keyword overlap. A researcher who fine-tuned LLMs at DeepMind scores far higher than someone who listed "LLMs" without evidence. Every profile is read in context of the specific role.',
  },
  {
    name: 'Signal Integration',
    tag: 'Phase 03 · Multi-Signal Fusion',
    description:
      'All available signals are fused into four scored dimensions: Semantic Fit (40%), Behavioral Signals (30%), Experience Depth (20%), and Preference Alignment (10%). Signals include GitHub activity, publications, response rate, notice period, open-source contributions, and work-mode preference.',
  },
  {
    name: 'Ranked Shortlist',
    tag: 'Phase 04 · Output',
    description:
      'Gemini produces an ordered shortlist with per-candidate composite scores, explicit reasoning for each rank, key strengths, stated concerns, and a honeypot filter that removes keyword-stuffed profiles. An executive summary explains the quality of the entire shortlist.',
  },
]

const dimensions = [
  { weight: '40%', label: 'Semantic Fit',           desc: 'Role, domain, and skills alignment evaluated by Gemini language understanding' },
  { weight: '30%', label: 'Behavioral Signals',      desc: 'GitHub activity, publications, response rate, open-source contributions' },
  { weight: '20%', label: 'Experience Depth',        desc: 'Years of experience, seniority level, career trajectory, domain exposure' },
  { weight: '10%', label: 'Preference Alignment',    desc: 'Remote preference, notice period, company size and culture compatibility' },
]

export default function AboutView() {
  return (
    <article className="page about-page">
      <div className="about-powered-strip">
        <span>Powered by</span>
        <strong>Gemini 2.5 Flash</strong>
        <span className="about-powered-dot">·</span>
        <span>Google DeepMind</span>
      </div>

      <h1>How Perspex Works</h1>
      <p>
        Perspex is an AI-native candidate ranking system built for the{' '}
        <strong>Data &amp; AI Challenge: Intelligent Candidate Discovery</strong>.
        It doesn't filter résumés — it intelligently ranks candidates by true
        contextual fit using Gemini 2.5 Flash as its core reasoning engine.
      </p>

      <hr />

      <h2>The Problem with Keyword Matching</h2>
      <p>
        Keyword matching rewards candidates who repeat role terms, even when the
        underlying career history does not support the claim. Perspex replaces keyword
        overlap with Gemini's language understanding — evaluating what a candidate
        actually did, not just what words appear on their profile.
      </p>

      <hr />

      <h2>The AI Pipeline</h2>
      <ol className="about-pipeline-list">
        {pipeline.map(({ name, tag, description }) => (
          <li key={name} className="about-pipeline-item">
            <div className="about-pipeline-header">
              <strong>{name}</strong>
              <span className="about-pipeline-tag">{tag}</span>
            </div>
            <span>{description}</span>
          </li>
        ))}
      </ol>

      <hr />

      <h2>Scoring Formula</h2>
      <p>
        Every candidate receives four scores (0–100) from Gemini, fused into a single
        composite rank. Weights are configurable before each run.
      </p>

      <div className="about-dimensions">
        {dimensions.map(({ weight, label, desc }) => (
          <div key={label} className="about-dimension-row">
            <div className="about-dimension-header">
              <strong>{label}</strong>
              <span className="about-dimension-weight">{weight}</span>
            </div>
            <span className="about-dimension-desc">{desc}</span>
          </div>
        ))}
      </div>

      <pre className="formula-block">{`FINAL_SCORE =
  0.40 × Semantic Fit       (Gemini contextual scoring)
+ 0.30 × Behavioral Signals (activity, publications, GitHub)
+ 0.20 × Experience Depth   (years, seniority, trajectory)
+ 0.10 × Preference Fit     (remote, notice, work-mode)

Honeypot filter: keyword-stuffed profiles removed before scoring.
Each score generated live by Gemini 2.5 Flash with explicit reasoning.`}</pre>

      <hr />

      <h2>Why Gemini?</h2>
      <p>
        Gemini 2.5 Flash provides the language understanding needed to evaluate
        candidates the way a senior technical recruiter would — interpreting nuanced
        job descriptions, understanding what "fine-tuned LLMs at DeepMind" implies
        versus "worked with AI tools", and generating auditable, candidate-specific
        reasoning for every rank. All processing happens client-side via the Gemini API.
        No candidate data is stored or sent to any third-party server.
      </p>
    </article>
  )
}
