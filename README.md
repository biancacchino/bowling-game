# Bowling Alley Game

A cute pixel-art bowling game built with vanilla JavaScript and HTML5 Canvas. This was my first real attempt at building a physics-based game from scratch, so it's probably not perfect but it works!

## What is this?

Basically a bowling game where you aim, charge power, and try to knock down pins. The pins have little faces and everything is pastel colored because I thought it would be fun. The ball curves based on where you aim it, and pins can knock into each other which is pretty satisfying.

## How to Play

1. **Aim**: Use left/right arrow keys to position the ball
2. **Charge**: Hold spacebar to charge power (longer = more power)
3. **Launch**: Release spacebar to roll the ball
4. **Reset**: Click "New Roll" button or press 'R' to start over

The goal is to knock down as many pins as possible. Your high score is saved automatically!

## Tech Stack

- **HTML5 Canvas** - For rendering everything
- **Vanilla JavaScript (ES6 Modules)** - No frameworks, just plain JS
- **CSS** - For styling the UI elements

## Project Structure

I tried to organize this into separate modules because I heard that's good practice. Here's what each file does:

```
js/
├── config.js          - All the constants (speeds, sizes, etc.)
├── gameObjects.js     - Creates the ball and pins
├── storage.js         - Handles localStorage for high scores
├── input.js           - Keyboard input handling
├── physics.js         - Collision detection and physics updates
├── gameState.js       - Manages game states (aiming, rolling, etc.)
├── visualEffects.js   - Spark effects and visual timers
├── renderer.js        - All the canvas drawing code
├── ui.js              - HUD updates
└── main.js            - Main game loop that ties everything together
```

## How It Works (kinda)

### Physics

The physics is pretty basic - I'm using simple velocity and friction calculations. When the ball hits a pin, I calculate the collision normal and apply an impulse. Same thing for pin-to-pin collisions. It's not super realistic but it feels okay to play.

The ball has friction applied each frame using `velocity *= friction^dt` which I learned from some game dev tutorial. The pins also slow down over time.

### Collision Detection

Using circle-circle collision detection. For each pair of objects, I check if the distance between centers is less than the sum of their radii. If they're colliding, I:
1. Calculate the collision normal (direction from one to the other)
2. Apply impulse based on that direction
3. Separate them to prevent overlap

I had to look up how to do proper collision response because my first attempt had pins just sticking together. The separation step was important.

### State Management

The game has different states:
- `TITLE` - Shows the title screen
- `AIMING` - You're positioning and charging
- `ROLLING` - Ball is moving
- `SETTLE` - Waiting for pins to stop moving
- `RESULT` - Shows your score

I use a simple state machine pattern. Probably could be better but it works.

### Rendering

Everything is drawn on a canvas. I disabled image smoothing to get that pixelated look. The rendering happens every frame in the game loop using `requestAnimationFrame`.

I draw things in layers:
1. Background and lane
2. Pins (with cute faces)
3. Ball (with a heart on it)
4. Visual effects (sparks when pins are hit)
5. Power bar
6. Title overlay (if showing)

## Things I Learned

- **ES6 Modules**: This was my first time using `import/export`. It's way better than having everything in one file.
- **Canvas API**: Learned a lot about drawing shapes, gradients, and transformations
- **Game Loops**: Understanding delta time and frame-independent movement
- **Collision Detection**: Circle collision math and response
- **State Management**: How to organize game states without a framework

## Things That Were Hard

- Getting the pin-to-pin collisions to work properly. They kept overlapping or not transferring momentum correctly.
- Making the power bar look good with the gradient and pulsing effect
- Figuring out when the roll should "settle" - had to check if all pins are slow enough
- Canvas coordinate system was confusing at first (y increases downward)

## Future Improvements (maybe)

- Add sound effects
- Better pin physics (maybe rotation?)
- Different pin arrangements
- Multiplayer or turn-based scoring
- Better visual feedback

## Running It

Just open `index.html` in a browser. No build step needed, it's all vanilla JS. Make sure you're using a browser that supports ES6 modules (which is basically all modern browsers).

## License

This is just a learning project, so do whatever you want with it I guess.

---

*Made while learning game development. Probably has bugs but it's playable!*

