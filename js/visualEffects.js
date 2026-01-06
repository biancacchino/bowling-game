// Visual effects management
export function spawnSpark(visualEffects, x, y) {
  visualEffects.push({
    type: 'spark',
    x,
    y,
    t: 0,
    duration: 0.4 + Math.random() * 0.2,
  });
}

export function updateVisualEffects(dt, visualEffects) {
  for (let i = visualEffects.length - 1; i >= 0; i -= 1) {
    const effect = visualEffects[i];
    effect.t += dt;
    if (effect.t >= effect.duration) {
      visualEffects.splice(i, 1);
    }
  }
}

export function updatePowerVisualTimers(dt, isCharging, chargePulseTime, setChargePulseTime, releaseFlashTimer, setReleaseFlashTimer) {
  if (isCharging) {
    setChargePulseTime(chargePulseTime + dt);
  } else {
    setChargePulseTime(0);
  }
  setReleaseFlashTimer(Math.max(releaseFlashTimer - dt, 0));
}

export function updateShake(dt, shakeTimer, setShakeTimer) {
  setShakeTimer(Math.max(shakeTimer - dt, 0));
}

export function updateTitleOverlay(dt, ball, titleFadeTimer, setTitleFadeTimer, TITLE_FADE_DURATION) {
  if (ball.state === 'TITLE') return;
  if (titleFadeTimer > 0) {
    setTitleFadeTimer(Math.max(titleFadeTimer - dt, 0));
  }
}

