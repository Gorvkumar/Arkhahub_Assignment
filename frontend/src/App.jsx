import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import api from './services/api'

function App() {
  const [status, setStatus] = useState(null)
  const [stats, setStats] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.getStatus()
      setStatus(data)
      
      if (data.hasResults && !data.inProgress) {
        fetchResults()
        fetchStats()
      }
    } catch (error) {
      console.error('Error fetching status:', error)
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 2000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  const fetchResults = async () => {
    try {
      const data = await api.getResults()
      setResults(data)
    } catch (error) {
      console.error('Error fetching results:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await api.getStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleStartAggregation = async () => {
    setLoading(true)
    try {
      await api.startAggregation()
      setResults(null)
      setStats(null)
    } catch (error) {
      console.error('Error starting aggregation:', error)
      alert('Failed to start aggregation. Make sure the backend server is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <Header />
      <Dashboard
        status={status}
        stats={stats}
        results={results}
        loading={loading}
        onStartAggregation={handleStartAggregation}
      />
    </div>
  )
}

export default App
