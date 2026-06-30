import { useRef, useState } from 'react'

const defaultWeights = [
  { key: 'semantic', label: 'Semantic Match' },
  { key: 'behavioral', label: 'Behavioral Signals' },
  { key: 'experience', label: 'Experience Fit' },
  { key: 'preference', label: 'Preference Fit' },
]

const stages = [
  ['01', 'Deep JD Understanding', 'Gemini 2.5 Flash parses the job description into a structured schema — required skills, seniority, semantic clusters, anti-patterns.'],
  ['02', 'Contextual Relevance', 'Candidates scored on semantic fit using Gemini\'s language understanding, not keyword overlap. Context beats keyword counts.'],
  ['03', 'Signal Integration', 'Behavioral, experience, and preference signals fused with AI semantic scores into a weighted composite per candidate.'],
  ['04', 'Honeypot Filter', 'Keyword-stuffed and low-intent profiles identified and removed before the final ranking is produced.'],
  ['05', 'Ranked Output', 'Gemini produces the final shortlist with per-candidate scores, explicit reasoning, key strengths, and an executive summary.'],
]

function formatFileSize(file) {
  if (!file) return ''
  if (file.size > 1024 * 1024) {
    return `${(file.size / (1024 * 1024)).toFixed(2)} MB`
  }
  return `${Math.max(1, Math.round(file.size / 1024))} KB`
}

function FileDropZone({ accept, children, file, onFile, disabled, parsing, showFileInfo = true }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (nextFile) => {
    if (!nextFile || disabled) return
    onFile(nextFile)
  }

  return (
    <div
      className={`drop-zone ${isDragging ? 'is-dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        handleFile(event.dataTransfer.files?.[0])
      }}
    >
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept={accept}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <button className="drop-button" type="button" onClick={() => inputRef.current?.click()} disabled={disabled}>
        {isDragging ? 'Drop to upload' : children}
      </button>
      {parsing && <p className="muted-line">Parsing candidate pool...</p>}
      {file && showFileInfo && !parsing && (
        <p className="muted-line">
          {file.name} | {formatFileSize(file)}
        </p>
      )}
    </div>
  )
}

export default function UploadView({
  jdText,
  setJdText,
  jdFile,
  setJdFile,
  candidateFile,
  setCandidateFile,
  weights,
  setWeights,
  onRun,
  isRunning,
}) {
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isParsingCandidates, setIsParsingCandidates] = useState(false)
  const hasJobDescription = Boolean(jdText.trim()) || Boolean(jdFile)
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + Number(value), 0)
  const canRun = hasJobDescription && candidateFile && totalWeight === 100 && !isRunning

  const handleCandidateFile = (file) => {
    if (!file) return
    setIsParsingCandidates(true)
    window.setTimeout(() => {
      setCandidateFile(file)
      setIsParsingCandidates(false)
    }, 200)
  }

  return (
    <div className="page upload-layout">
      <section className="upload-form" aria-label="Ranking setup">

        {/* Sample files strip */}
        <div className="sample-strip">
          <span className="sample-strip-label">No files? Use samples →</span>
          <a
            className="sample-link"
            href="/sample_jd.txt"
            download="sample_jd.txt"
          >
            ↓ sample_jd.txt
          </a>
          <a
            className="sample-link"
            href="/sample_candidates.jsonl"
            download="sample_candidates.jsonl"
          >
            ↓ sample_candidates.jsonl
          </a>
        </div>

        <div className="form-section">
          <p className="section-label">Job Description</p>
          {!jdFile ? (
            <textarea
              className="jd-input"
              value={jdText}
              onChange={(event) => setJdText(event.target.value)}
              placeholder="Paste the Senior AI Engineer job description here."
              aria-label="Job description text"
            />
          ) : (
            <div className="file-summary">
              <strong>{jdFile.name}</strong>
              <span>{formatFileSize(jdFile)}</span>
              <button type="button" className="button ghost-button" onClick={() => setJdFile(null)}>
                Remove
              </button>
            </div>
          )}

          {!jdFile && (
            <>
              <div className="or-divider">
                <span>or</span>
              </div>
              <FileDropZone accept=".docx,.txt" file={jdFile} onFile={setJdFile}>
                Upload .docx or .txt
              </FileDropZone>
            </>
          )}
        </div>

        <div className="form-section">
          <p className="section-label">Candidate Pool</p>
          <FileDropZone
            accept=".jsonl"
            file={candidateFile}
            onFile={handleCandidateFile}
            parsing={isParsingCandidates}
            showFileInfo={false}
          >
            Upload .jsonl candidate pool
          </FileDropZone>
          {candidateFile && !isParsingCandidates && (
            <p className="muted-line">
              {candidateFile.name} | {(candidateFile.size / (1024 * 1024)).toFixed(2)} MB | ~100,000 records estimated
            </p>
          )}
        </div>

        <div className="form-section compact-section">
          <button
            className="config-toggle"
            type="button"
            onClick={() => setIsConfigOpen((current) => !current)}
            aria-expanded={isConfigOpen}
          >
            Configure weights {isConfigOpen ? '↑' : '↓'}
          </button>
          {isConfigOpen && (
            <div className="weight-panel">
              {defaultWeights.map((weight) => (
                <label className="range-row" key={weight.key}>
                  <span>{weight.label}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights[weight.key]}
                    onChange={(event) =>
                      setWeights((current) => ({
                        ...current,
                        [weight.key]: Number(event.target.value),
                      }))
                    }
                  />
                  <strong>{weights[weight.key]}</strong>
                </label>
              ))}
              <p className={totalWeight === 100 ? 'muted-line' : 'faint-line'}>
                {totalWeight} / 100{totalWeight === 100 ? '' : ' - Must total 100'}
              </p>
            </div>
          )}
        </div>

        <button className="button primary-button run-button" type="button" disabled={!canRun} onClick={onRun}>
          {isRunning ? 'Running Perspex' : 'Run Perspex ->'}
        </button>
      </section>

      <aside className="pipeline-panel" aria-label="Pipeline explanation">
        <div className="pipeline-list">
          {stages.map(([number, name, description]) => (
            <div className="pipeline-stage" key={number}>
              <span>{number}</span>
              <div>
                <h2>{name}</h2>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="stats-row" aria-label="Pipeline statistics">
          <span>Gemini 2.5 Flash</span>
          <span>4 signal layers</span>
          <span>Real-time AI ranking</span>
        </div>
      </aside>
    </div>
  )
}
