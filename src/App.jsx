import { useState } from 'react'
import { loadData, saveData } from './modules/storage.js'
import { addEntry, deleteEntry, getEntries } from './modules/entries.js'
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
const GOAL = 4000
const now = new Date()
const YEAR = now.getFullYear()

export default function App() {
  const [data, setData] = useState(() => loadData())
  const [currentMonth, setCurrentMonth] = useState(now.getMonth())

  const currentEntries = getEntries(data, currentMonth, YEAR)
  const confirmed = currentEntries
    .filter(e => e.status === 'confirmed' || e.status === 'deposit')
    .reduce((s, e) => s + e.amount, 0)

  let ytd = 0
  for (let i = 0; i < 12; i++) {
    ytd += getEntries(data, i, YEAR)
      .filter(e => e.status === 'confirmed' || e.status === 'deposit')
      .reduce((s, e) => s + e.amount, 0)
  }

  function handleAddEntry(entry) {
    const updated = addEntry({ ...data }, currentMonth, YEAR, entry)
    setData({ ...updated })
    saveData(updated)
  }

  function handleDeleteEntry(index) {
    if (!confirm('Delete this entry?')) return
    const updated = deleteEntry({ ...data }, currentMonth, YEAR, index)
    setData({ ...updated })
    saveData(updated)
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="section-label">This month at a glance</div>
        <MetricsGrid confirmed={confirmed} goal={GOAL} ytd={ytd} />

        <ProgressBar confirmed={confirmed} goal={GOAL} />

        <div className="section-label">Select month</div>
        <MonthTabs
          data={data}
          year={YEAR}
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
        <RevenueChart data={data} year={YEAR} goal={GOAL} months={MONTHS} />

        <div style={{textAlign:'center', padding:'1rem 0', fontSize:'12px', color:'var(--text-hint)'}}>
          Data saved locally in your browser · Dayview Media Revenue Tracker
        </div>
      </div>
    </>
  )
}
