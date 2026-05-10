let obstacles   = [];
let score       = 0;
let highScore   = 0;
let obsTimer    = 0;
let lastZone    = null;
let obsInterval = 120;
let lives       = 3;
// ── Green to'siq rasmlari (22 ta, shaffof PNG) ─────────────────
const greenObsImages = [];
const greenFileNames = [
  "photo_1_2026-05-10_18-26-57.png",
  "photo_2_2026-05-10_18-26-57.png",
  "photo_3_2026-05-10_18-26-57.png",
  "photo_4_2026-05-10_18-26-57.png",
  "photo_5_2026-05-10_18-26-57.png",
  "photo_6_2026-05-10_18-26-57.png",
  "photo_7_2026-05-10_18-26-57.png",
  "photo_8_2026-05-10_18-26-57.png",
  "photo_9_2026-05-10_18-26-57.png",
  "photo_10_2026-05-10_18-26-57.png",
  "photo_12_2026-05-10_18-26-57.png",
  "photo_13_2026-05-10_18-26-57.png",
  "photo_14_2026-05-10_18-26-57.png",
  "photo_15_2026-05-10_18-26-57.png",
  "photo_16_2026-05-10_18-26-57.png",
  "photo_17_2026-05-10_18-26-57.png",
  "photo_18_2026-05-10_18-26-57.png",
  "photo_20_2026-05-10_18-26-57.png",
  "photo_21_2026-05-10_18-26-57.png",
  "photo_22_2026-05-10_18-26-57.png",
  "photo_23_2026-05-10_18-26-57.png",
  "photo_24_2026-05-10_18-26-57.png",
];
for (const fn of greenFileNames) {
  const img = new Image();
  img.src = `assets/tosiq_green_png/${fn}`;
  greenObsImages.push(img);
}
// ── Orange to'siq rasmlari (21 ta, shaffof PNG) ────────────────
const orangeObsImages = [];
const orangeFileNames = [
  "photo_3_2026-05-10_18-24-19.png",
  "photo_5_2026-05-10_18-24-19.png",
  "photo_6_2026-05-10_18-24-19.png",
  "photo_7_2026-05-10_18-24-19.png",
  "photo_8_2026-05-10_18-24-19.png",
  "photo_9_2026-05-10_18-24-19.png",
  "photo_10_2026-05-10_18-24-19.png",
  "photo_11_2026-05-10_18-24-19.png",
  "photo_12_2026-05-10_18-24-19.png",
  "photo_13_2026-05-10_18-24-19.png",
  "photo_14_2026-05-10_18-24-19.png",
  "photo_15_2026-05-10_18-24-19.png",
  "photo_16_2026-05-10_18-24-19.png",
  "photo_17_2026-05-10_18-24-19.png",
  "photo_18_2026-05-10_18-24-19.png",
  "photo_19_2026-05-10_18-24-19.png",
  "photo_20_2026-05-10_18-24-19.png",
  "photo_21_2026-05-10_18-24-19.png",
  "photo_22_2026-05-10_18-24-19.png",
  "photo_23_2026-05-10_18-24-19.png",
  "photo_24_2026-05-10_18-24-19.png",
];
for (const fn of orangeFileNames) {
  const img = new Image();
  img.src = `assets/tosiqlar_orange_png/${fn}`;
  orangeObsImages.push(img);
}
function resetObstacles() {
  obstacles   = [];
  score       = 0;
  obsTimer    = 0;
  lastZone    = null;
  obsInterval = 120;
  lives       = 3;
}
function spawnObstacle() {
  const zone = Math.random() < 0.5 ? "top" : "bottom";
  const xOff = Math.random() * 60;
  if (zone === "top") {
    const imgIdx = Math.floor(Math.random() * greenObsImages.length);
    spawnGreenObs(xOff, imgIdx);
  } else {
    const imgIdx = Math.floor(Math.random() * orangeObsImages.length);
    spawnOrangeObs(xOff, imgIdx);
  }
}
function spawnGreenObs(xOff, imgIdx) {
  const h = 30 + Math.random() * 15;
  obstacles.push({ type: "green_obj", zone: "top", imgIdx,
    x: CANVAS_W + xOff, w: h * 1.5, h, y: HALF - h - 20, passed: false });
}
function spawnOrangeObs(xOff, imgIdx) {
  const h = 30 + Math.random() * 15;
  obstacles.push({ type: "orange_obj", zone: "bottom", imgIdx,
    x: CANVAS_W + xOff, w: h * 1.5, h, y: HALF - h - 20, passed: false });
}
// ── Update ───────────────────────────────────────────────────────
function updateObstacles(players, speed, onGameOver) {
  obsTimer++;
  // Per-player invincible countdown
  for (const p of players) {
    if (p.invincible > 0) p.invincible--;
  }
  if (obsTimer % 400 === 0 && obsInterval > 45) obsInterval -= 5;
  if (obsTimer % obsInterval === 0) spawnObstacle();
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.x -= speed;
    if (!o.passed) {
      const p = players.find(pl => pl.zone === o.zone);
      if (p && o.x + o.w < p.x) {
        o.passed = true;
        score++;
        if (score > highScore) highScore = score;
      }
    }
    const p = players.find(pl => pl.zone === o.zone);
    if (p && rectsOverlap(p, o)) {
      if (p.invincible <= 0) {
        lives--;
        p.invincible = 90; // ~1.5 soniya faqat shu bolacha himoyada
        obstacles.splice(i, 1); // urilgan to'siqni olib tashlash
        if (lives <= 0) { onGameOver(); return; }
      }
      continue;
    }
    if (o.x + o.w < 0) obstacles.splice(i, 1);
  }
}
function rectsOverlap(a, b) {
  const m = 5;
  return (
    a.x  + m       < b.x + b.w &&
    a.x  + a.w - m > b.x       &&
    a._y + m       < b.y + b.h &&
    a._y + a.h - m > b.y
  );
}
// ── Chizish ──────────────────────────────────────────────────────
function drawObstacles(ctx) {
  for (const o of obstacles) {
    ctx.save();
    if (o.zone === "bottom") {
      ctx.translate(o.x + o.w / 2, HALF);
      ctx.scale(1, -1);
      ctx.translate(-(o.x + o.w / 2), -HALF);
    }
    const imgList = (o.zone === "top") ? greenObsImages : orangeObsImages;
    const sprite = imgList[o.imgIdx];
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      ctx.drawImage(sprite, o.x, o.y, o.w, o.h);
    } else {
      ctx.fillStyle = (o.zone === "top") ? "#4caf50" : "#ff9800";
      ctx.fillRect(o.x, o.y, o.w, o.h);
    }
    ctx.restore();
  }
}
// ── Score chizish ────────────────────────────────────────────────
function drawScore(ctx) {
  // Endi ui.js dagi drawHUD orqali chiziladi
}