// UI management
export function updateHUD(hud, ball, pinsKnocked, previousScore, highScore, power) {
  if (ball.state === 'RESULT') {
    hud.textContent = `RESULT • Pins bonked: ${pinsKnocked} | Best: ${highScore}`;
    return;
  }

  if (ball.state === 'SETTLE') {
    hud.textContent = 'RESULT • Roll ended';
    return;
  }

  const powerText = ball.state === 'AIMING' ? Math.round(power) : 0;
  if (ball.state === 'ROLLING') {
    hud.textContent = 'ROLLING • Pins approaching!';
  } else if (ball.state === 'AIMING') {
    const scoreInfo = previousScore > 0 ? ` | Last: ${previousScore} | Best: ${highScore}` : ` | Best: ${highScore}`;
    hud.textContent = `AIM • Charging power: ${powerText}${scoreInfo}`;
  } else {
    hud.textContent = `AIM • Charging power: ${powerText}`;
  }
}

export function triggerHudPulse(hud, RESULT_PULSE_DURATION) {
  hud.classList.add('pulse');
  setTimeout(() => hud.classList.remove('pulse'), RESULT_PULSE_DURATION * 1000);
}


