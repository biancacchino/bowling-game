// High score management
export function loadHighScore() {
  return parseInt(localStorage.getItem('bowlingHighScore') || '0', 10);
}

export function saveHighScore(score) {
  localStorage.setItem('bowlingHighScore', score.toString());
}

