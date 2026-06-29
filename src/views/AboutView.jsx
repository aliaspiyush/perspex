const pipeline = [
  ['JD Parser', 'Extracts role responsibilities, seniority markers, required AI experience, and hard constraints.'],
  ['Honeypot Filter', 'Detects keyword stuffing and profiles that appear optimized for retrieval instead of fit.'],
  ['FAISS Search', 'Runs a semantic retrieval pass over the candidate pool before heavier scoring.'],
  ['Signal Scorer', 'Blends redrob_signals with experience and preference features to score viable candidates.'],
  ['Ranked Output', 'Produces a deterministic shortlist suitable for export and challenge submission.'],
]

export default function AboutView() {
  return (
    <article className="page about-page">
      <h1>How Perspex Works</h1>
      <p>A 5-stage offline pipeline for precision candidate ranking.</p>

      <hr />

      <h2>The Problem with Keyword Matching</h2>
      <p>
        Keyword matching rewards candidates who repeat role terms, even when the underlying career history does not
        support the claim. Perspex starts with semantic similarity, then checks behavioral and experience evidence so
        keyword-stuffed profiles do not dominate the shortlist.
      </p>

      <hr />

      <h2>Our 5-Stage Pipeline</h2>
      <ol>
        {pipeline.map(([name, description]) => (
          <li key={name}>
            <strong>{name}</strong>
            <span>{description}</span>
          </li>
        ))}
      </ol>

      <hr />

      <h2>The 23 Behavioral Signals</h2>
      <p>
        Perspex uses redrob_signals to separate resume relevance from outreach likelihood. Availability, response
        behavior, recent activity, GitHub evidence, notice period, and work-mode fit all influence the final rank.
      </p>

      <hr />

      <h2>Scoring Formula</h2>
      <p>The final ranking blends four evidence streams, with hard exclusions applied before score aggregation.</p>
      <pre className="formula-block">{`FINAL_SCORE = 0.40 x Semantic Match
            + 0.30 x Behavioral Score
            + 0.20 x Experience Fit
            + 0.10 x Preference Fit

Hard exclusions:
  open_to_work = false  ->  excluded before scoring
  honeypot flag = true  ->  removed before retrieval`}</pre>
    </article>
  )
}
