import { useState } from 'react'

const fmt = n => '$' + Math.round(n).toLocaleString()

export default function MetricsGrid({ confirmed, goal, ytd, onGoalChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const gap = Math.max(0, goal - confirmed)
  const pct = Math.min(100, Math.round((confirmed / goal) * 100))

  let statusText, statusClass
  if (pct >= 100) { statusText = 'Goal hit!'; statusClass = 'metric-sub on-track' }
  else if (pct >= 50) { statusText = `${pct}% there`; statusClass = 'metric-sub on-track' }
  else { statusText = `${pct}% of goal`; statusClass = 'metric-sub off-track' }

  function startEditing() {
    setDraft(String(goal))
    setEditing(true)
  }

  function commitEdit() {
    const val = parseInt(draft)
    if (val > 0) onGoalChange(val)
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div className="metric-grid">
      <div className="metric">
        <div className="metric-label">Confirmed income</div>
        <div className="metric-val">{fmt(confirmed)}</div>
        <div className={statusClass}>{statusText}</div>
      </div>

      <div className="metric" style={{cursor: editing ? 'default' : 'pointer'}} onClick={!editing ? startEditing : undefined} title="Click to edit goal">
        <div className="metric-label" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          Monthly goal
          <span style={{fontSize:'10px', color:'var(--teal)', fontWeight:500}}>{editing ? 'Enter to save' : 'edit'}</span>
        </div>
        {editing ? (
          <input
            type="number"
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            style={{
              fontSize:'20px', fontWeight:500, color:'var(--text)',
              border:'none', borderBottom:'1.5px solid var(--teal)',
              background:'transparent', outline:'none', width:'100%', padding:'2px 0'
            }}
          />
        ) : (
          <div className="metric-val">{fmt(goal)}</div>
        )}
        <div className="metric-sub" style={{color:'var(--text-muted)'}}>monthly target</div>
      </div>

      <div className="metric">
        <div className="metric-label">Still needed</div>
        <div className="metric-val">{gap > 0 ? fmt(gap) : '$0'}</div>
        <div className="metric-sub" style={{color: gap > 0 ? 'var(--text-muted)' : 'var(--teal)'}}>
          {gap > 0 ? 'keep pitching' : 'goal hit! 🎉'}
        </div>
      </div>

      <div className="metric">
        <div className="metric-label">Year to date</div>
        <div className="metric-val">{fmt(ytd)}</div>
        <div className="metric-sub" style={{color:'var(--text-muted)'}}>all confirmed</div>
      </div>
    </div>
  )
}
