import { BALL_RADIUS, pinRows, pinRadius, pinHorizontalSpacing, pinVerticalSpacing } from './config.js';

// Initialize game objects
export function initializeGameObjects(canvas) {
  const laneW = canvas.width * 0.45;
  const laneH = canvas.height * 0.85;
  const laneX = (canvas.width - laneW) / 2;
  const laneY = (canvas.height - laneH) / 2;
  const laneCenter = laneX + laneW / 2;

  const pins = (() => {
    const stack = [];
    pinRows.forEach((count, rowIndex) => {
      const rowY = laneY + 18 + rowIndex * pinVerticalSpacing;
      const startX = laneCenter - ((count - 1) * pinHorizontalSpacing) / 2;
      for (let i = 0; i < count; i += 1) {
        const x = startX + i * pinHorizontalSpacing;
        stack.push({
          x,
          y: rowY,
          vx: 0,
          vy: 0,
          r: pinRadius,
          startX: x,
          startY: rowY,
          down: false,
        });
      }
    });
    return stack;
  })();

  const ball = {
    radius: BALL_RADIUS,
    x: laneCenter,
    y: laneY + laneH - 36,
    vx: 0,
    vy: 0,
    state: 'TITLE',
  };

  return { ball, pins, laneX, laneY, laneW, laneH, laneCenter };
}

export function resetPins(pins) {
  pins.forEach((pin) => {
    pin.x = pin.startX;
    pin.y = pin.startY;
    pin.vx = 0;
    pin.vy = 0;
    pin.down = false;
  });
}

export function resetBall(ball, laneCenter, laneY, laneH) {
  ball.x = laneCenter;
  ball.y = laneY + laneH - 36;
  ball.vx = 0;
  ball.vy = 0;
  ball.state = 'AIMING';
}

