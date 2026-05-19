import Chart from 'chart.js/auto';
import { getEntries } from './entries.js';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const GOAL = 4000;

let chartInstance = null;

export function renderChart(data, year) {
  const confirmed = MONTHS.map((_, i) =>
    getEntries(data, i, year)
      .filter(e => e.status === 'confirmed' || e.status === 'deposit')
      .reduce((s, e) => s + e.amount, 0)
  );
  const pipeline = MONTHS.map((_, i) =>
    getEntries(data, i, year)
      .filter(e => e.status === 'pipeline' || e.status === 'invoiced')
      .reduce((s, e) => s + e.amount, 0)
  );

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(document.getElementById('yearChart'), {
    data: {
      labels: MONTHS,
      datasets: [
        { type: 'bar', label: 'Confirmed', data: confirmed, backgroundColor: '#1D9E75', borderRadius: 4, stack: 'a' },
        { type: 'bar', label: 'Pipeline', data: pipeline, backgroundColor: '#9FE1CB', borderRadius: 4, stack: 'a' },
        { type: 'line', label: 'Goal', data: MONTHS.map(() => GOAL), borderColor: '#B4B2A9', borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0, tension: 0 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' $' + Math.round(ctx.raw).toLocaleString() } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#A0A09C', font: { size: 11 }, autoSkip: false, maxRotation: 0 } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#A0A09C', font: { size: 11 }, callback: v => '$' + v.toLocaleString() }, beginAtZero: true, suggestedMax: GOAL * 1.3 }
      }
    }
  });
}
