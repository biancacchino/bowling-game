import {
  MAX_POWER,
  POWER_BAR_WIDTH,
  POWER_BAR_HEIGHT,
  TITLE_FADE_DURATION,
  SHAKE_AMOUNT,
  RELEASE_FLASH_DURATION,
} from './config.js';

// Rendering functions
export function drawTitleOverlay(ctx, canvas, ball, titleFadeTimer) {
  const overlayAlpha =
    ball.state === 'TITLE'
      ? 1
      : titleFadeTimer > 0
      ? titleFadeTimer / TITLE_FADE_DURATION
      : 0;
  if (overlayAlpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = 0.85 * overlayAlpha;
  ctx.fillStyle = '#fff9fe';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2f1d30';
  ctx.textAlign = 'center';
  ctx.font = '48px "Press Start 2P"';
  ctx.fillText('Bowling Alley', canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '18px "Press Start 2P"';
  ctx.fillText('Press Space to Bowl', canvas.width / 2, canvas.height / 2 + 30);
  ctx.restore();
}

export function render(
  ctx,
  canvas,
  ball,
  pins,
  visualEffects,
  laneX,
  laneY,
  laneW,
  laneH,
  gutterWidth,
  power,
  isCharging,
  chargePulseTime,
  releaseFlashTimer,
  shakeTimer
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  const shakeX = shakeTimer > 0 ? (Math.random() * 2 - 1) * SHAKE_AMOUNT : 0;
  const shakeY = shakeTimer > 0 ? (Math.random() * 2 - 1) * (SHAKE_AMOUNT * 0.6) : 0;
  ctx.save();
  ctx.translate(shakeX, shakeY);

  // Background
  ctx.fillStyle = '#fdeff9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Gutters
  const gutterColor = '#cfe4ff';
  ctx.fillStyle = gutterColor;
  ctx.fillRect(laneX - gutterWidth, laneY, gutterWidth, laneH);
  ctx.fillRect(laneX + laneW, laneY, gutterWidth, laneH);

  // Lane
  ctx.fillStyle = '#f7d7a6';
  ctx.fillRect(laneX, laneY, laneW, laneH);

  // Lane stripes
  const stripeCount = 6;
  const stripeHeight = laneH / (stripeCount * 1.2);
  for (let i = 0; i < stripeCount; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)';
    ctx.fillRect(laneX, laneY + i * stripeHeight * 1.4, laneW, stripeHeight);
  }

  // Foul line
  const foulLineY = laneY + laneH - 90;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.setLineDash([12, 8]);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(laneX + gutterWidth, foulLineY);
  ctx.lineTo(laneX + laneW - gutterWidth, foulLineY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineCap = 'butt';

  // Pins
  pins.forEach((pin) => {
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, pin.r, 0, Math.PI * 2);
    ctx.fillStyle = pin.down ? 'rgba(255,255,255,0.35)' : '#fff8d8';
    ctx.strokeStyle = pin.down ? 'rgba(255,255,255,0.6)' : '#ffd4a1';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    const eyeOffsetX = pin.r * 0.4;
    const eyeOffsetY = pin.r * 0.1;
    const pupilRadius = 1.4;
    ctx.fillStyle = pin.down ? '#b38f84' : '#38221b';
    if (pin.down) {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pin.x - eyeOffsetX, pin.y - eyeOffsetY);
      ctx.lineTo(pin.x - eyeOffsetX + 4, pin.y - eyeOffsetY + 4);
      ctx.moveTo(pin.x - eyeOffsetX + 4, pin.y - eyeOffsetY);
      ctx.lineTo(pin.x - eyeOffsetX, pin.y - eyeOffsetY + 4);
      ctx.moveTo(pin.x + eyeOffsetX - 4, pin.y - eyeOffsetY);
      ctx.lineTo(pin.x + eyeOffsetX, pin.y - eyeOffsetY + 4);
      ctx.moveTo(pin.x + eyeOffsetX, pin.y - eyeOffsetY);
      ctx.lineTo(pin.x + eyeOffsetX - 4, pin.y - eyeOffsetY + 4);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(pin.x - eyeOffsetX, pin.y - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
      ctx.arc(pin.x + eyeOffsetX, pin.y - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f0a4aa';
      ctx.beginPath();
      ctx.arc(pin.x - eyeOffsetX + 1.5, pin.y - eyeOffsetY + 6, 2, 0, Math.PI * 2);
      ctx.arc(pin.x + eyeOffsetX - 1.5, pin.y - eyeOffsetY + 6, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f47f92';
      ctx.beginPath();
      ctx.arc(pin.x, pin.y + 4, pin.r * 0.4, 0, Math.PI, false);
      ctx.stroke();
    }
  });

  // Ball
  ctx.fillStyle = '#f44336';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffc6dc';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Ball highlight
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.4, ball.radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffe9f2';
  ctx.beginPath();
  const heartX = ball.x + ball.radius * 0.25;
  const heartY = ball.y - ball.radius * 0.1;
  const heartRadius = ball.radius * 0.18;
  ctx.moveTo(heartX, heartY);
  ctx.arc(heartX - heartRadius / 2, heartY, heartRadius / 2, Math.PI, 0, true);
  ctx.arc(heartX + heartRadius / 2, heartY, heartRadius / 2, Math.PI, 0, true);
  ctx.lineTo(heartX, heartY + heartRadius);
  ctx.closePath();
  ctx.fill();

  // Visual effects
  visualEffects.forEach((effect) => {
    if (effect.type !== 'spark') return;
    const progress = effect.t / effect.duration;
    const alpha = 1 - progress;
    const size = 12 + progress * 6;
    ctx.save();
    ctx.translate(effect.x, effect.y);
    ctx.rotate(progress * Math.PI * 2);
    ctx.fillStyle = `rgba(255, 218, 233, ${alpha})`;
    for (let i = 0; i < 4; i += 1) {
      ctx.fillRect(-size / 2, -1, size, 2);
      ctx.rotate(Math.PI / 2);
    }
    ctx.restore();
  });

  // Power bar
  const barX = (canvas.width - POWER_BAR_WIDTH) / 2;
  const barY = laneY + laneH + 18;
  ctx.fillStyle = '#f0e0ff';
  ctx.fillRect(barX, barY, POWER_BAR_WIDTH, POWER_BAR_HEIGHT);
  const gradient = ctx.createLinearGradient(barX, 0, barX + POWER_BAR_WIDTH, 0);
  gradient.addColorStop(0, '#a7f3d0');
  gradient.addColorStop(0.5, '#fef08a');
  gradient.addColorStop(1, '#fb7185');
  ctx.fillStyle = gradient;
  const baseWidth = Math.max((power / MAX_POWER) * POWER_BAR_WIDTH, 0);
  const flashScale =
    releaseFlashTimer > 0
      ? 1 - 0.18 * (releaseFlashTimer / RELEASE_FLASH_DURATION)
      : 1;
  const displayWidth = Math.max(baseWidth * flashScale, 2);
  ctx.fillRect(barX, barY, displayWidth, POWER_BAR_HEIGHT);
  ctx.strokeStyle =
    releaseFlashTimer > 0 ? 'rgba(255,255,255,0.95)' : 'rgba(34,34,34,0.65)';
  ctx.lineWidth = isCharging
    ? 3 + Math.sin(chargePulseTime * 8) * 0.8
    : 3;
  ctx.strokeRect(barX, barY, POWER_BAR_WIDTH, POWER_BAR_HEIGHT);

  ctx.restore();
}

