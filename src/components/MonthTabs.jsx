export default function MonthTabs({ entries, currentMonth, months, onSelect }) {
  return (
    <div className="month-tabs">
      {months.map((name, i) => {
        const total = entries
          .filter(e => e.month === i && (e.status === 'confirmed' || e.status === 'deposit'))
          .reduce((s, e) => s + e.amount, 0)
        const label = total > 0 ? `${name} $${Math.round(total).toLocaleString()}` : name
        return (
          <button
            key={i}
            className={`mtab${i === currentMonth ? ' active' : ''}`}
            onClick={() => onSelect(i)}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
