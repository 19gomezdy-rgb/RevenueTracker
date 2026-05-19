const STORAGE_KEY = 'dayview-revenue-v2';
const PITCHES_KEY = 'dayview-pitches';
const GOAL_KEY = 'dayview-goal';

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

export function loadGoal(defaultGoal = 4000) {
  try { return parseInt(localStorage.getItem(GOAL_KEY)) || defaultGoal; } catch { return defaultGoal; }
}

export function saveGoal(value) {
  try { localStorage.setItem(GOAL_KEY, String(value)); } catch {}
}
