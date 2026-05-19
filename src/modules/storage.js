const STORAGE_KEY = 'dayview-revenue-v2';
const PITCHES_KEY = 'dayview-pitches';

export function loadData() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    return d ? JSON.parse(d) : {};
  } catch { return {}; }
}

export function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export function loadPitches() {
  try { return parseInt(localStorage.getItem(PITCHES_KEY)) || 0; } catch { return 0; }
}

export function savePitchesData(value) {
  try { localStorage.setItem(PITCHES_KEY, String(value)); } catch {}
}
