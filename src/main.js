import './style.css';
import { loadData, saveData, loadPitches, savePitchesData } from './modules/storage.js';
import { addEntry, deleteEntry } from './modules/entries.js';
import { renderTabs, renderEntries, renderMetrics } from './modules/render.js';
import { renderChart } from './modules/chart.js';
import { updatePitchStatus } from './modules/pitches.js';

const now = new Date();
const year = now.getFullYear();
let currentMonth = now.getMonth();
let data = loadData();

function refresh() {
  renderTabs(data, currentMonth, year, (m) => { currentMonth = m; refresh(); });
  renderEntries(data, currentMonth, year, handleDelete);
  renderMetrics(data, currentMonth, year);
  renderChart(data, year);
}

function handleDelete(index) {
  if (!confirm('Delete this entry?')) return;
  data = deleteEntry(data, currentMonth, year, index);
  saveData(data);
  refresh();
}

function handleAddEntry() {
  const client = document.getElementById('inp-client').value.trim();
  const amount = parseFloat(document.getElementById('inp-amount').value);
  const type = document.getElementById('inp-type').value;
  const status = document.getElementById('inp-status').value;
  if (!client || !amount || amount <= 0) {
    alert('Please enter a client name and a valid amount.');
    return;
  }
  data = addEntry(data, currentMonth, year, { client, amount, type, status });
  document.getElementById('inp-client').value = '';
  document.getElementById('inp-amount').value = '';
  saveData(data);
  refresh();
}

document.getElementById('add-btn').addEventListener('click', handleAddEntry);
document.getElementById('pitches-sent').addEventListener('input', () => {
  const v = parseInt(document.getElementById('pitches-sent').value) || 0;
  savePitchesData(v);
  updatePitchStatus(v);
});

const savedPitches = loadPitches();
if (savedPitches) {
  document.getElementById('pitches-sent').value = savedPitches;
  updatePitchStatus(savedPitches);
}

refresh();
