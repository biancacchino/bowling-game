import { HUD_MESSAGE_INSTRUCTIONS, SHAKE_DURATION } from './config.js';
import { resetPins, resetBall } from './gameObjects.js';
import { saveHighScore } from './storage.js';

// Game state management
export function resetGame(ball, pins, gameState, hud, laneCenter, laneY, laneH) {
  resetBall(ball, laneCenter, laneY, laneH);
  resetPins(pins);
  gameState.power = 0;
  gameState.isCharging = false;
  gameState.settleTimer = 0;
  gameState.pinsKnocked = 0;
  hud.textContent = HUD_MESSAGE_INSTRUCTIONS;
}

export function finalizeRoll(pins, gameState, ball, visualTimers, triggerHudPulse) {
  gameState.pinsKnocked = pins.filter((pin) => pin.down).length;
  gameState.previousScore = gameState.pinsKnocked;
  if (gameState.pinsKnocked > gameState.highScore) {
    gameState.highScore = gameState.pinsKnocked;
    saveHighScore(gameState.highScore);
  }
  ball.state = 'RESULT';
  gameState.settleTimer = 0;
  visualTimers.shakeTimer = SHAKE_DURATION;
  triggerHudPulse();
}

