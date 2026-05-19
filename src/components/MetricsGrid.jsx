const fmt = n => '$' + Math.round(n).toLocaleString()

export default function MetricsGrid({ confirmed, goal, ytd }) {
  const gap = Math.max(0, goal - confirmed)
  const pct = Math.min(100, Math.round((confirmed / goal) * 100))

  let statusText, statusClass
  if (pct >= 100) { statusText = 'Goal hit!'; statusClass = 'metric-sub on-track' }
  else if (pct >= 50) { statusText = `${pct}% there`; statusClass = 'metric-sub on-track' }
  else { statusText = `${pct}% of goal`; statusClass = 'metric-sub off-track' }

  return (
    <div className="metric-grid">
      <div className="metric">
        <div className="metric-label">Confirmed income</div>
        <div className="metric-val">{fmt(confirmed)}</div>
        <div className={statusClass}>{statusText}</div>
      </div>
      <div className="metric">
        <div className="metric-label">Monthly goal</div>
        <div className="metric-val">{fmt(goal)}</div>
        <div className="metric-sub" style={{color:'var(--text-muted)'}}>Q1 target</div>
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
