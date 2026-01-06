import {
  BASE_LAUNCH_SPEED,
  LAUNCH_POWER_SCALE,
  AIM_CURVE_STRENGTH,
  AIMING_SPEED,
  POWER_CHARGE_RATE,
  MAX_POWER,
  RELEASE_FLASH_DURATION,
  TITLE_FADE_DURATION,
} from './config.js';

// Input handling
export function setupInputHandlers(
  ball,
  keyState,
  powerState,
  visualTimers,
  laneCenter,
  laneW,
  gutterWidth,
  resetGame,
  clampBallX
) {
  const { setPower, setIsCharging } = powerState;
  const { setReleaseFlashTimer } = visualTimers;

  window.addEventListener('keydown', (event) => {
    if (ball.state === 'TITLE') {
      ball.state = 'AIMING';
      visualTimers.titleFadeTimer = TITLE_FADE_DURATION;
      event.preventDefault();
      return;
    }

    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      keyState[event.code] = true;
      event.preventDefault();
    }

    if (event.code === 'Space' && ball.state === 'AIMING') {
      if (!powerState.isCharging) {
        setIsCharging(true);
        setPower(0);
      }
      event.preventDefault();
    }

    if (event.code === 'KeyR') {
      resetGame();
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      keyState[event.code] = false;
      event.preventDefault();
    }

    if (event.code === 'Space' && ball.state === 'AIMING' && powerState.isCharging) {
      setIsCharging(false);
      ball.state = 'ROLLING';
      // Read current power value directly from state
      const currentPower = powerState.power;
      const randomPowerScale = LAUNCH_POWER_SCALE + Math.random() * 0.4;
      const launchSpeed = BASE_LAUNCH_SPEED + currentPower * randomPowerScale;
      const ballOffsetFromCenter = ball.x - laneCenter;
      const maxOffset = (laneW - gutterWidth * 2) / 2;
      ball.vx = (ballOffsetFromCenter / maxOffset) * launchSpeed * AIM_CURVE_STRENGTH;
      ball.vy = -launchSpeed;
      setPower(0);
      setReleaseFlashTimer(RELEASE_FLASH_DURATION);
      event.preventDefault();
    }
  });
}

export function handleAimingInput(dt, ball, keyState, powerState, clampBallX) {
  if (ball.state !== 'AIMING') return;

  const { setPower } = powerState;

  let horizontal = 0;
  if (keyState.ArrowLeft) horizontal -= 1;
  if (keyState.ArrowRight) horizontal += 1;
  if (horizontal !== 0) {
    ball.x += horizontal * AIMING_SPEED * dt;
    clampBallX();
  }

  // Charge power while spacebar is held down
  if (powerState.isCharging) {
    const currentPower = powerState.power;
    setPower(Math.min(currentPower + POWER_CHARGE_RATE * dt, MAX_POWER));
  }
}

