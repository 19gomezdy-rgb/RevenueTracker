import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { getEntries } from '../modules/entries.js'

export default function RevenueChart({ data, year, goal, months }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const confirmed = months.map((_, i) =>
      getEntries(data, i, year)
        .filter(e => e.status === 'confirmed' || e.status === 'deposit')
        .reduce((s, e) => s + e.amount, 0)
    )
    const pipeline = months.map((_, i) =>
      getEntries(data, i, year)
        .filter(e => e.status === 'pipeline' || e.status === 'invoiced')
        .reduce((s, e) => s + e.amount, 0)
    )

    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      data: {
        labels: months,
        datasets: [
          { type:'bar', label:'Confirmed', data:confirmed, backgroundColor:'#1D9E75', borderRadius:4, stack:'a' },
          { type:'bar', label:'Pipeline',  data:pipeline,  backgroundColor:'#9FE1CB', borderRadius:4, stack:'a' },
          { type:'line', label:'Goal', data:months.map(() => goal), borderColor:'#B4B2A9', borderDash:[5,4], borderWidth:1.5, pointRadius:0, tension:0 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ' $' + Math.round(ctx.raw).toLocaleString() } },
        },
        scales: {
          x: { grid:{ display:false }, ticks:{ color:'#A0A09C', font:{ size:11 }, autoSkip:false, maxRotation:0 } },
          y: { grid:{ color:'rgba(0,0,0,0.05)' }, ticks:{ color:'#A0A09C', font:{ size:11 }, callback: v => '$'+v.toLocaleString() }, beginAtZero:true, suggestedMax: goal * 1.3 },
        },
      },
    })

    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [data, year, goal, months])

  return (
    <div className="chart-card">
      <div className="chart-legend">
        <div className="legend-item"><div className="legend-swatch" style={{background:'var(--teal)'}} />Confirmed + deposit</div>
        <div className="legend-item"><div className="legend-swatch" style={{background:'#9FE1CB'}} />Pipeline + invoiced</div>
        <div className="legend-item"><div className="legend-swatch" style={{background:'#D3D1C7', border:'1px dashed #888'}} />$4k goal</div>
      </div>
      <div style={{position:'relative', width:'100%', height:'260px'}}>
        <canvas ref={canvasRef} role="img" aria-label="Monthly revenue bar chart for Dayview Media" />
      </div>
    </div>
  )
}
