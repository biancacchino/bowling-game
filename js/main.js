import * as Config from './config.js';
import { initializeGameObjects, resetPins, resetBall } from './gameObjects.js';
import { loadHighScore } from './storage.js';
import { setupInputHandlers, handleAimingInput } from './input.js';
import {
  updateBallRolling,
  updatePins,
  handleBallPinCollisions,
  handlePinPinCollisions,
  checkSettleCondition,
  updateSettle,
} from './physics.js';
import { resetGame, finalizeRoll } from './gameState.js';
import {
  spawnSpark,
  updateVisualEffects,
  updatePowerVisualTimers,
  updateShake,
  updateTitleOverlay,
} from './visualEffects.js';
import { render, drawTitleOverlay } from './renderer.js';
import { updateHUD, triggerHudPulse } from './ui.js';

// Initialize DOM elements
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const hud = document.getElementById('hud');
const newRollBtn = document.getElementById('newRollBtn');
const gutterRange = document.getElementById('gutterRange');
const gutterValue = document.getElementById('gutterValue');

// Initialize game objects
const { ball, pins, laneX, laneY, laneW, laneH, laneCenter } = initializeGameObjects(canvas);
ball.canvasHeight = canvas.height;

// Initialize game state
let gutterWidth = parseInt(gutterRange.value, 10) || 38;
gutterValue.textContent = gutterWidth;

const keyState = { ArrowLeft: false, ArrowRight: false };

// State management with setters
const gameState = {
  power: 0,
  isCharging: false,
  settleTimer: 0,
  pinsKnocked: 0,
  previousScore: 0,
  highScore: loadHighScore(),
  setPower: (val) => { gameState.power = val; },
  setIsCharging: (val) => { gameState.isCharging = val; },
  setSettleTimer: (val) => { gameState.settleTimer = val; },
};

const visualTimers = {
  shakeTimer: 0,
  chargePulseTime: 0,
  releaseFlashTimer: 0,
  titleFadeTimer: 0,
  setShakeTimer: (val) => { visualTimers.shakeTimer = val; },
  setChargePulseTime: (val) => { visualTimers.chargePulseTime = val; },
  setReleaseFlashTimer: (val) => { visualTimers.releaseFlashTimer = val; },
  setTitleFadeTimer: (val) => { visualTimers.titleFadeTimer = val; },
};

const visualEffects = [];

// Helper functions
function clampBallX() {
  const minX = laneX + gutterWidth + ball.radius;
  const maxX = laneX + laneW - gutterWidth - ball.radius;
  ball.x = Math.min(Math.max(ball.x, minX), maxX);
}

function resetGameHandler() {
  resetGame(ball, pins, gameState, hud, laneCenter, laneY, laneH);
  clampBallX();
}

function finalizeRollHandler() {
  finalizeRoll(pins, gameState, ball, visualTimers, () => triggerHudPulse(hud, Config.RESULT_PULSE_DURATION));
}

function spawnSparkHandler(x, y) {
  spawnSpark(visualEffects, x, y);
}

// Setup input handlers
setupInputHandlers(
  ball,
  keyState,
  gameState,
  visualTimers,
  laneCenter,
  laneW,
  gutterWidth,
  resetGameHandler,
  clampBallX
);

newRollBtn.addEventListener('click', resetGameHandler);

gutterRange.addEventListener('input', (event) => {
  gutterWidth = parseInt(event.target.value, 10);
  gutterValue.textContent = gutterWidth;
  clampBallX();
});

// Update loop
function update(dt) {
  handleAimingInput(dt, ball, keyState, gameState, clampBallX);
  updatePowerVisualTimers(
    dt,
    gameState.isCharging,
    visualTimers.chargePulseTime,
    visualTimers.setChargePulseTime,
    visualTimers.releaseFlashTimer,
    visualTimers.setReleaseFlashTimer
  );
  updateShake(dt, visualTimers.shakeTimer, visualTimers.setShakeTimer);
  updateVisualEffects(dt, visualEffects);
  updateTitleOverlay(dt, ball, visualTimers.titleFadeTimer, visualTimers.setTitleFadeTimer, Config.TITLE_FADE_DURATION);

  if (ball.state === 'ROLLING') {
    updateBallRolling(dt, ball);
    handleBallPinCollisions(ball, pins, spawnSparkHandler);
    handlePinPinCollisions(pins);
    updatePins(dt, pins, laneX, laneY, laneW, laneH);
    if (checkSettleCondition(ball, laneY)) {
      gameState.settleTimer = 0;
    }
  } else if (ball.state === 'SETTLE') {
    handlePinPinCollisions(pins);
    updatePins(dt, pins, laneX, laneY, laneW, laneH);
    updateSettle(dt, pins, gameState.settleTimer, gameState.setSettleTimer, finalizeRollHandler);
  }
}

// Render loop
function renderFrame() {
  render(
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
    gameState.power,
    gameState.isCharging,
    visualTimers.chargePulseTime,
    visualTimers.releaseFlashTimer,
    visualTimers.shakeTimer
  );
  drawTitleOverlay(ctx, canvas, ball, visualTimers.titleFadeTimer);
  updateHUD(hud, ball, gameState.pinsKnocked, gameState.previousScore, gameState.highScore, gameState.power);
}

// Game loop
let lastTime = performance.now();

function loop(time) {
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;
  update(deltaTime);
  renderFrame();
  requestAnimationFrame(loop);
}

// Initialize
resetGameHandler();
ball.state = 'TITLE';
visualTimers.titleFadeTimer = 0;
requestAnimationFrame(loop);


