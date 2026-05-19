export function updatePitchStatus(value) {
  const el = document.getElementById('pitch-status');
  if (value >= 10) {
    el.innerHTML = '<strong style="color:var(--teal)">Goal hit! Keep going.</strong>';
  } else if (value > 0) {
    el.innerHTML = `<span style="color:var(--amber)">${10 - value} more to hit goal</span>`;
  } else {
    el.textContent = '';
  }
}
