// Select elements
const ball = document.getElementById('ball');
const paddleTop = document.getElementById('paddle-top');
const paddleBottom = document.getElementById('paddle-bottom');
const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');

const gameContainer = document.getElementById('game-container');

// Pause indicator
const pauseOverlay = document.createElement('div');
pauseOverlay.id = 'pause-overlay';
pauseOverlay.textContent = 'Game Paused';
gameContainer.appendChild(pauseOverlay);

// Game variables
let ballX = 250, ballY = 400; // Ball position
let ballSpeedX = 4, ballSpeedY = 4; // Ball speed
let paddleTopX = 200, paddleBottomX = 200; // Paddle positions
const paddleSpeed = 5;
const paddleWidth = 100;
const gameWidth = 500;

// Scores
let player1Score = 0, player2Score = 0;

// Keyboard input tracking
const keys = { ArrowLeft: false, ArrowRight: false, a: false, z: false };

// Game state
let isPaused = false;

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = true;

    // Pause/Resume with 'Esc'
    if (e.key === 'Escape') togglePause();
});
document.addEventListener('keyup', (e) => {
    if (keys[e.key] !== undefined) keys[e.key] = false;
});

// Toggle pause state
function togglePause() {
    isPaused = !isPaused;
    pauseOverlay.style.display = isPaused ? 'flex' : 'none';
    if (!isPaused) update();
}

// Update game state
function update() {
    if (isPaused) return; // Stop updates if the game is paused

    // Move paddles
    if (keys.ArrowLeft && paddleBottomX > 0) paddleBottomX -= paddleSpeed;
    if (keys.ArrowRight && paddleBottomX < gameWidth - paddleWidth) paddleBottomX += paddleSpeed;
    if (keys.a && paddleTopX > 0) paddleTopX -= paddleSpeed;
    if (keys.z && paddleTopX < gameWidth - paddleWidth) paddleTopX += paddleSpeed;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with side walls
    if (ballX <= 0 || ballX >= gameWidth - 15) ballSpeedX *= -1;

    // Ball collision with paddles
    if (ballY <= 15 && ballX >= paddleTopX && ballX <= paddleTopX + paddleWidth) ballSpeedY *= -1;
    if (ballY >= 785 && ballX >= paddleBottomX && ballX <= paddleBottomX + paddleWidth) ballSpeedY *= -1;

    // Ball out of bounds
    if (ballY <= 0) {
        player2Score++;
        resetBall();
    }
    if (ballY >= 800) {
        player1Score++;
        resetBall();
    }

    // Update scores
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;

    // Update positions
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    paddleTop.style.left = paddleTopX + 'px';
    paddleBottom.style.left = paddleBottomX + 'px';

    // Repeat update
    requestAnimationFrame(update);
}

// Reset ball position
function resetBall() {
    ballX = 250;
    ballY = 400;
    ballSpeedY *= -1; // Reverse direction
}

// Start the game
update();
