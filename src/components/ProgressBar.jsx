const fmt = n => '$' + Math.round(n).toLocaleString()

export default function ProgressBar({ confirmed, goal }) {
  const pct = Math.min(100, Math.round((confirmed / goal) * 100))
  const fillColor = pct >= 100 ? 'var(--teal)' : pct >= 50 ? '#5DCAA5' : 'var(--amber)'

  return (
    <div className="progress-wrap">
      <div className="progress-header">
        <span>{pct}% of {fmt(goal)} goal</span>
        <span>{fmt(confirmed)} confirmed</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{width: `${pct}%`, background: fillColor}}
        />
      </div>
    </div>
  )
}
