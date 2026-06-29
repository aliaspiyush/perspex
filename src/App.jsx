import { useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import { useTheme } from './hooks/useTheme.js'
import { useMockData } from './hooks/useMockData.js'
import AboutView from './views/AboutView.jsx'
import ResultsView from './views/ResultsView.jsx'
import UploadView from './views/UploadView.jsx'

const routes = ['upload', 'results', 'about']

function getRouteFromHash() {
  const hash = window.location.hash.replace('#', '')
  return routes.includes(hash) ? hash : 'upload'
}

export default function App() {
  const [route, setRoute] = useState(getRouteFromHash)
  const { theme, toggleTheme } = useTheme()
  const [jdText, setJdText] = useState('')
  const [jdFile, setJdFile] = useState(null)
  const [candidateFile, setCandidateFile] = useState(null)
  const [weights, setWeights] = useState({
    semantic: 40,
    behavioral: 30,
    experience: 20,
    preference: 10,
  })
  const generatedResults = useMockData(weights)
  const [results, setResults] = useState([])
  const [hasRun, setHasRun] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromHash())
    }

    if (!window.location.hash) {
      window.location.hash = 'upload'
    } else {
      handleHashChange()
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const runRanking = () => {
    setHasRun(true)
    setIsRunning(true)
    setResults([])
    window.location.hash = 'results'

    window.setTimeout(() => {
      setResults(generatedResults)
      setIsRunning(false)
    }, 2200)
  }

  return (
    <div className="app-shell">
      <Nav route={route} theme={theme} onToggleTheme={toggleTheme} />
      <main className="app-main">
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
            onRerun={runRanking}
          />
        )}
        {route === 'about' && <AboutView />}
      </main>
    </div>
  )
}
