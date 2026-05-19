import { useState, useEffect } from 'react'
import { fetchEntriesByYear, insertEntry, deleteEntry as dbDelete, fetchGoal, saveGoal } from './modules/db.js'
import Header from './components/Header.jsx'
import MetricsGrid from './components/MetricsGrid.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import MonthTabs from './components/MonthTabs.jsx'
import EntryForm from './components/EntryForm.jsx'
import EntriesTable from './components/EntriesTable.jsx'
import BreakdownGrid from './components/BreakdownGrid.jsx'
import PitchesTracker from './components/PitchesTracker.jsx'
import RevenueChart from './components/RevenueChart.jsx'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const now = new Date()
const YEAR = now.getFullYear()

export default function App() {
  const [entries, setEntries] = useState([])
  const [goal, setGoal] = useState(4000)
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [fetchedEntries, fetchedGoal] = await Promise.all([
          fetchEntriesByYear(YEAR),
          fetchGoal(),
        ])
        setEntries(fetchedEntries)
        setGoal(fetchedGoal)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const currentEntries = entries.filter(e => e.month === currentMonth)

  const confirmed = currentEntries
    .filter(e => e.status === 'confirmed' || e.status === 'deposit')
    .reduce((s, e) => s + e.amount, 0)

  const ytd = entries
    .filter(e => e.status === 'confirmed' || e.status === 'deposit')
    .reduce((s, e) => s + e.amount, 0)

  async function handleAddEntry(entry) {
    try {
      const newEntry = await insertEntry({ ...entry, month: currentMonth, year: YEAR })
      setEntries(prev => [...prev, newEntry])
    } catch (err) {
      alert('Failed to save entry: ' + err.message)
    }
  }

  async function handleDeleteEntry(id) {
    if (!confirm('Delete this entry?')) return
    try {
      await dbDelete(id)
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch (err) {
      alert('Failed to delete entry: ' + err.message)
    }
  }

  async function handleGoalChange(newGoal) {
    setGoal(newGoal)
    try {
      await saveGoal(newGoal)
    } catch (err) {
      alert('Failed to save goal: ' + err.message)
    }
  }

  if (loading) return (
    <>
      <Header />
      <div className="container" style={{textAlign:'center', paddingTop:'4rem', color:'var(--text-muted)'}}>
        Loading...
      </div>
    </>
  )

  if (error) return (
    <>
      <Header />
      <div className="container" style={{textAlign:'center', paddingTop:'4rem', color:'var(--coral)'}}>
        Could not connect to database: {error}
      </div>
    </>
  )

  return (
    <>
      <Header />
      <div className="container">
        <div className="section-label">This month at a glance</div>
        <MetricsGrid confirmed={confirmed} goal={goal} ytd={ytd} onGoalChange={handleGoalChange} />

        <ProgressBar confirmed={confirmed} goal={goal} />

        <div className="section-label">Select month</div>
        <MonthTabs
          entries={entries}
          currentMonth={currentMonth}
          months={MONTHS}
          onSelect={setCurrentMonth}
        />

        <div className="section-label">Log income</div>
        <EntryForm onAdd={handleAddEntry} />

        <div className="section-label">
          Entries — <span>{MONTHS[currentMonth]}</span>
        </div>
        <EntriesTable entries={currentEntries} onDelete={handleDeleteEntry} />

        <div className="section-label">Breakdown by stream</div>
        <BreakdownGrid entries={currentEntries} />

        <div className="section-label">Weekly pitches tracker</div>
        <PitchesTracker />

        <div className="section-label">Yearly revenue overview</div>
        <RevenueChart entries={entries} goal={goal} months={MONTHS} />

        <div style={{textAlign:'center', padding:'1rem 0', fontSize:'12px', color:'var(--text-hint)'}}>
          Data saved to Supabase · Dayview Media Revenue Tracker
        </div>
      </div>
    </>
  )
}
