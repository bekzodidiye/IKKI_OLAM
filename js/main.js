const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");
canvas.width  = CANVAS_W;
canvas.height = CANVAS_H;
window.addEventListener("resize", () => {
  CANVAS_W = window.innerWidth;
  CANVAS_H = window.innerHeight;
  HALF     = CANVAS_H / 2;
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
});
let state             = "start";
window._gameState     = "start";
let gameSpeed         = SPEED_BASE;
let animSpeed         = SPEED_BASE;
let obsSpeed          = SPEED_BASE;
let bgSpeed           = SPEED_BASE;
let frameCount        = 0;
let speedPhase        = 0;
let lastSpeedScore    = 0;
let players = [
  createPlayer("top",    "#4caf50", "KeyW", null, null),          // Green Boy — W
  createPlayer("bottom", "#e8a020", "ArrowUp", null, null),       // Orange Warrior — ArrowUp
];
initBgLayers();
initHUD(canvas);
const startBtn   = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
const mobileControls = document.getElementById("mobileControls");
function startGame() {
  resetPlayers(players);
  resetObstacles();
  state         = "playing";
  window._gameState = "playing";
  gameSpeed     = SPEED_BASE;
  animSpeed     = SPEED_BASE;
  obsSpeed      = SPEED_BASE;
  bgSpeed       = SPEED_BASE;
  frameCount    = 0;
  speedPhase    = 0;
  lastSpeedScore = 0;
  hud.paused    = false;
  startBtn.style.display   = "none";
  restartBtn.style.display = "none";
  if (mobileControls) mobileControls.classList.add("show");
  if (!hud.muted && window.bgMusic) {
    window.bgMusic.currentTime = 0;
    window.bgMusic.play().catch(e => console.log("Musiqa play xatosi: ", e));
  }
}
function onGameOver() {
  state             = "gameover";
  window._gameState = "gameover";
  startBtn.style.display   = "none";
  restartBtn.style.display = "block";
  if (mobileControls) mobileControls.classList.remove("show");
  if (window.bgMusic) window.bgMusic.pause();
}
// Tezlik: har 5 scoredan keyin oshadi
function updateSpeed() {
  const level = Math.floor(score / 5);
  if (level > lastSpeedScore) {
    lastSpeedScore = level;
    animSpeed += 0.3;
    obsSpeed  += 0.3;
    bgSpeed   += 0.3;
  }
  gameSpeed = Math.min(obsSpeed, SPEED_MAX);
}
function loop() {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  const moving = state === "playing" && !hud.paused;
  drawBackground(ctx, moving ? bgSpeed * 0.08 : 0, moving ? obsSpeed : 0);
  if (moving) {
    frameCount++;
    updateSpeed();
    players.forEach(p => updatePlayer(p, animSpeed));
    updateObstacles(players, obsSpeed, onGameOver);
  }
  // drawRope(ctx, players); // Arqon chizish o'chirildi
  players.forEach(p => drawPlayer(ctx, p));
  drawObstacles(ctx);
  drawScore(ctx);
  drawHUD(ctx, gameSpeed);
  if (state === "start")                 drawStartScreen(ctx);
  if (state === "gameover")              drawGameOverScreen(ctx);
  if (state === "playing" && hud.paused) drawPauseScreen(ctx);
  requestAnimationFrame(loop);
}
loop();