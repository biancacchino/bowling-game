import {
  BALL_FRICTION,
  PIN_FRICTION,
  PIN_IMPULSE,
  PIN_TO_PIN_IMPULSE,
  DOWN_DISTANCE,
  SETTLE_SPEED_THRESHOLD,
  SETTLE_DURATION,
} from './config.js';

// Physics updates
export function updateBallRolling(dt, ball) {
  const damping = Math.pow(BALL_FRICTION, dt * 60);
  ball.vx *= damping;
  ball.vy *= damping;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
}

export function updatePins(dt, pins, laneX, laneY, laneW, laneH) {
  pins.forEach((pin) => {
    pin.x += pin.vx * dt;
    pin.y += pin.vy * dt;
    pin.vx *= PIN_FRICTION;
    pin.vy *= PIN_FRICTION;

    const travel = Math.hypot(pin.x - pin.startX, pin.y - pin.startY);
    const outOfBounds =
      pin.x - pin.r < laneX ||
      pin.x + pin.r > laneX + laneW ||
      pin.y - pin.r < laneY ||
      pin.y + pin.r > laneY + laneH;

    if (travel > DOWN_DISTANCE || outOfBounds) {
      pin.down = true;
    }
  });
}

// Collision detection
export function handleBallPinCollisions(ball, pins, spawnSpark) {
  pins.forEach((pin) => {
    if (pin.down) return;

    const dx = pin.x - ball.x;
    const dy = pin.y - ball.y;
    const dist = Math.hypot(dx, dy);
    const minDist = ball.radius + pin.r;

    if (dist < minDist) {
      const safeDist = dist || 0.001;
      const nx = dx / safeDist;
      const ny = dy / safeDist;
      const overlap = minDist - dist;

      pin.vx += nx * PIN_IMPULSE;
      pin.vy += ny * PIN_IMPULSE;

      ball.vx *= 0.9;
      ball.vy *= 0.9;

      pin.x += nx * overlap;
      pin.y += ny * overlap;
      spawnSpark(pin.x, pin.y);
    }
  });
}

export function handlePinPinCollisions(pins) {
  for (let i = 0; i < pins.length; i += 1) {
    const pin1 = pins[i];
    if (pin1.down) continue;

    for (let j = i + 1; j < pins.length; j += 1) {
      const pin2 = pins[j];
      if (pin2.down) continue;

      const dx = pin2.x - pin1.x;
      const dy = pin2.y - pin1.y;
      const dist = Math.hypot(dx, dy);
      const minDist = pin1.r + pin2.r;

      if (dist < minDist && dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        const overlap = minDist - dist;

        const relativeVx = pin2.vx - pin1.vx;
        const relativeVy = pin2.vy - pin1.vy;
        const relativeSpeed = relativeVx * nx + relativeVy * ny;

        if (relativeSpeed > 0) {
          const impulse = relativeSpeed * 0.5;
          pin1.vx += nx * impulse;
          pin1.vy += ny * impulse;
          pin2.vx -= nx * impulse;
          pin2.vy -= ny * impulse;

          pin1.vx += nx * PIN_TO_PIN_IMPULSE * 0.3;
          pin1.vy += ny * PIN_TO_PIN_IMPULSE * 0.3;
          pin2.vx -= nx * PIN_TO_PIN_IMPULSE * 0.3;
          pin2.vy -= ny * PIN_TO_PIN_IMPULSE * 0.3;
        }

        const separation = overlap * 0.5;
        pin1.x -= nx * separation;
        pin1.y -= ny * separation;
        pin2.x += nx * separation;
        pin2.y += ny * separation;
      }
    }
  }
}

export function checkSettleCondition(ball, laneY) {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (
    speed < SETTLE_SPEED_THRESHOLD ||
    ball.y - ball.radius < laneY ||
    ball.y + ball.radius > ball.canvasHeight
  ) {
    ball.vx = 0;
    ball.vy = 0;
    ball.state = 'SETTLE';
    return true;
  }
  return false;
}

export function updateSettle(dt, pins, settleTimer, setSettleTimer, finalizeRoll) {
  const allPinsSlow = pins.every(
    (pin) => Math.hypot(pin.vx, pin.vy) < SETTLE_SPEED_THRESHOLD
  );

  if (allPinsSlow) {
    const newTimer = settleTimer + dt;
    setSettleTimer(newTimer);
    if (newTimer >= SETTLE_DURATION) {
      finalizeRoll();
    }
  } else {
    setSettleTimer(0);
  }
}

