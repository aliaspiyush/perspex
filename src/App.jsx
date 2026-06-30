import { useEffect, useRef, useState } from 'react'
import Nav from './components/Nav.jsx'
import { useTheme } from './hooks/useTheme.js'
import AboutView from './views/AboutView.jsx'
import HomeView from './views/HomeView.jsx'
import ResultsView from './views/ResultsView.jsx'
import UploadView from './views/UploadView.jsx'
import { runRankingPipeline } from './engine/ranker.js'

const routes = ['home', 'upload', 'results', 'about']

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '')
  return routes.includes(hash) ? hash : 'home'
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash)
  const { theme, toggleTheme } = useTheme()

  // Upload inputs
  const [jdText, setJdText] = useState('')
  const [jdFile, setJdFile] = useState(null)
  const [candidateFile, setCandidateFile] = useState(null)
  const [weights, setWeights] = useState({
    semantic: 40,
    behavioral: 30,
    experience: 20,
    preference: 10,
  })

  // Run state
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(null)   // { phase, message, pct, ... }
  const [results, setResults] = useState([])
  const [summary, setSummary] = useState('')
  const [parsedJD, setParsedJD] = useState(null)
  const [hasRun, setHasRun] = useState(false)
  const [runError, setRunError] = useState(null)
  const abortRef = useRef(false)

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash())
    if (!window.location.hash) {
      window.location.hash = 'home'
    } else {
      handleHashChange()
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const runRanking = async () => {
    // Figure out the JD text — file takes priority
    let effectiveJD = jdText.trim()
    if (jdFile) {
      effectiveJD = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target.result)
        reader.onerror = () => reject(new Error('Failed to read JD file'))
        reader.readAsText(jdFile)
      })
    }
    if (!effectiveJD) return

    abortRef.current = false
    setHasRun(true)
    setIsRunning(true)
    setResults([])
    setSummary('')
    setParsedJD(null)
    setRunError(null)
    setProgress({ phase: 'starting', message: 'Starting Perspex…', pct: 0 })
    window.location.hash = 'results'

    try {
      const { finalRanked, parsedJD: jd, summary: sum } = await runRankingPipeline(
        effectiveJD,
        candidateFile,
        (prog) => {
          if (abortRef.current) return
          setProgress(prog)
          if (prog.partialResults) setResults(prog.partialResults)
        }
      )

      if (!abortRef.current) {
        setResults(finalRanked)
        setSummary(sum)
        setParsedJD(jd)
        setIsRunning(false)
        setProgress(null)
      }
    } catch (err) {
      console.error('Pipeline error:', err)
      if (!abortRef.current) {
        setRunError(err.message || 'Unknown error')
        setIsRunning(false)
        setProgress(null)
      }
    }
  }

  const handleRerun = () => {
    window.location.hash = 'upload'
  }

  return (
    <div className="app-shell">
      <Nav route={route} theme={theme} onToggleTheme={toggleTheme} />
      <main className="app-main">
        {route === 'home' && <HomeView />}
        {route === 'upload' && (
          <UploadView
            jdText={jdText}
            setJdText={setJdText}
            jdFile={jdFile}
            setJdFile={setJdFile}
            candidateFile={candidateFile}
            setCandidateFile={setCandidateFile}
            weights={weights}
            setWeights={setWeights}
            onRun={runRanking}
            isRunning={isRunning}
          />
        )}
        {route === 'results' && (
          <ResultsView
            results={results}
            hasRun={hasRun}
            isRunning={isRunning}
            progress={progress}
            summary={summary}
            parsedJD={parsedJD}
            runError={runError}
            onRerun={handleRerun}
          />
        )}
        {route === 'about' && <AboutView />}
      </main>
    </div>
  )
}
