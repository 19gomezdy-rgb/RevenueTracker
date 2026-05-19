import { getEntries } from './entries.js';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const GOAL = 4000;

function fmt(n) { return '$' + Math.round(n).toLocaleString(); }
function pillClass(t) { return { retainer:'pill-retainer', project:'pill-project', product:'pill-product', coaching:'pill-coaching', other:'pill-other' }[t] || 'pill-other'; }
function pillLabel(t) { return { retainer:'Retainer', project:'Project', product:'Product', coaching:'Coaching', other:'Other' }[t] || t; }
function statusLabel(s) { return { confirmed:'Paid', deposit:'Deposit', invoiced:'Invoiced', pipeline:'Pipeline' }[s] || s; }
function statusColor(s) { return { confirmed:'var(--teal)', deposit:'var(--teal)', invoiced:'var(--amber)', pipeline:'var(--text-muted)' }[s] || 'var(--text-muted)'; }

export function renderTabs(data, currentMonth, year, onTabClick) {
  const container = document.getElementById('month-tabs');
  container.innerHTML = '';
  MONTHS.forEach((name, i) => {
    const total = getEntries(data, i, year)
      .filter(e => e.status === 'confirmed' || e.status === 'deposit')
      .reduce((s, e) => s + e.amount, 0);
    const btn = document.createElement('button');
    btn.className = 'mtab' + (i === currentMonth ? ' active' : '');
    btn.textContent = total > 0 ? `${name} $${Math.round(total).toLocaleString()}` : name;
    btn.onclick = () => onTabClick(i);
    container.appendChild(btn);
  });
  document.getElementById('month-name-label').textContent = MONTHS[currentMonth];
}

export function renderEntries(data, currentMonth, year, onDelete) {
  const entries = getEntries(data, currentMonth, year);
  const container = document.getElementById('entries-container');
  if (!entries.length) {
    container.innerHTML = '<div class="empty">No entries yet for this month</div>';
    return;
  }
  let html = `<table><thead><tr>
    <th style="width:32%">Client</th>
    <th style="width:16%">Amount</th>
    <th style="width:18%">Type</th>
    <th style="width:18%">Status</th>
    <th style="width:10%">Date</th>
    <th style="width:6%"></th>
  </tr></thead><tbody>`;
  entries.forEach((e, i) => {
    const d = e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
    html += `<tr>
      <td title="${e.client}">${e.client}</td>
      <td style="font-weight:500;">${fmt(e.amount)}</td>
      <td><span class="pill ${pillClass(e.type)}">${pillLabel(e.type)}</span></td>
      <td style="color:${statusColor(e.status)};font-size:12px;">${statusLabel(e.status)}</td>
      <td style="color:var(--text-hint);font-size:12px;">${d}</td>
      <td><button class="del-btn" data-index="${i}" title="Delete">×</button></td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
  container.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => onDelete(parseInt(btn.dataset.index)));
  });
}

export function renderMetrics(data, currentMonth, year) {
  const entries = getEntries(data, currentMonth, year);
  const confirmed = entries
    .filter(e => e.status === 'confirmed' || e.status === 'deposit')
    .reduce((s, e) => s + e.amount, 0);
  const gap = Math.max(0, GOAL - confirmed);
  const pct = Math.min(100, Math.round((confirmed / GOAL) * 100));

  document.getElementById('m-total').textContent = fmt(confirmed);
  document.getElementById('m-gap').textContent = gap > 0 ? fmt(gap) : '$0';
  const gapSub = document.getElementById('m-gap-sub');
  gapSub.textContent = gap > 0 ? 'keep pitching' : 'goal hit! 🎉';
  gapSub.style.color = gap > 0 ? 'var(--text-muted)' : 'var(--teal)';

  const statusEl = document.getElementById('m-status');
  if (pct >= 100) { statusEl.textContent = 'Goal hit!'; statusEl.className = 'metric-sub on-track'; }
  else if (pct >= 50) { statusEl.textContent = pct + '% there'; statusEl.className = 'metric-sub on-track'; }
  else { statusEl.textContent = pct + '% of goal'; statusEl.className = 'metric-sub off-track'; }

  const fill = document.getElementById('progress-fill');
  fill.style.width = pct + '%';
  fill.style.background = pct >= 100 ? 'var(--teal)' : pct >= 50 ? '#5DCAA5' : 'var(--amber)';
  document.getElementById('pct-label').textContent = `${pct}% of $${GOAL.toLocaleString()} goal`;
  document.getElementById('pct-right').textContent = fmt(confirmed) + ' confirmed';

  let ytd = 0;
  for (let i = 0; i < 12; i++) {
    ytd += getEntries(data, i, year)
      .filter(e => e.status === 'confirmed' || e.status === 'deposit')
      .reduce((s, e) => s + e.amount, 0);
  }
  document.getElementById('ytd-total').textContent = fmt(ytd);

  ['retainer', 'project', 'product', 'coaching'].forEach(t => {
    document.getElementById('b-' + t).textContent = fmt(
      entries.filter(e => e.type === t).reduce((s, e) => s + e.amount, 0)
    );
  });
}
