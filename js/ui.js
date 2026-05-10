const hud = {
  muted:  false,
  paused: false,
  buttons: {
    mute:  { x: 0, y: 10, w: 40, h: 40 },   // Dinamik — o'ng tomonga
    pause: { x: 0, y: 10, w: 40, h: 40 },   // Dinamik — o'ng tomonga
  },
};
// HUD tugma sprite'lari
const btnSoundOn  = new Image(); btnSoundOn.src  = "assets/buttons_png/sound_on.png";
const btnSoundOff = new Image(); btnSoundOff.src = "assets/buttons_png/sound_off.png";
const btnPause    = new Image(); btnPause.src    = "assets/buttons_png/pause.png";
const btnResume   = new Image(); btnResume.src   = "assets/buttons_png/resume.png";
const btnLogo     = new Image(); btnLogo.src     = "assets/buttons_png/ikki_olam.png";
// Fon musiqasi
const bgMusic = new Audio("assets/music/Funny Song _ Comedic Background Music _ Silly Chicken.mp3");
bgMusic.loop = true;
bgMusic.preload = "auto";
window.bgMusic = bgMusic;
function initHUD(canvas) {
  canvas.addEventListener("click", e => {
    if (window._gameState !== "playing") return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const b = hud.buttons;
    if (mx >= b.mute.x  && mx <= b.mute.x  + b.mute.w  && my >= b.mute.y  && my <= b.mute.y  + b.mute.h) {
      hud.muted  = !hud.muted;
      if (hud.muted) {
        window.bgMusic.pause();
      } else {
        window.bgMusic.play().catch(() => {});
      }
    }
    if (mx >= b.pause.x && mx <= b.pause.x + b.pause.w && my >= b.pause.y && my <= b.pause.y + b.pause.h)
      hud.paused = !hud.paused;
    // DAVOM ETISH tugmasi (pauza paytida)
    if (hud.paused && btnResume && btnResume.complete) {
      const dw = 200;
      const dh = dw * (btnResume.naturalHeight / btnResume.naturalWidth);
      const dx = CANVAS_W / 2 - dw / 2;
      const dy = CANVAS_H / 2;
      if (mx >= dx && mx <= dx + dw && my >= dy && my <= dy + dh) {
        hud.paused = false;
      }
    }
  });
}
function drawHUD(ctx, gameSpeed) {
  // Tugmalar o'ng tomonda
  hud.buttons.pause.x = CANVAS_W - 50;
  hud.buttons.mute.x  = CANVAS_W - 98;
  // Mute tugmasi (sprite)
  const muteImg = hud.muted ? btnSoundOff : btnSoundOn;
  if (muteImg && muteImg.complete && muteImg.naturalWidth > 0) {
    ctx.drawImage(muteImg, hud.buttons.mute.x, hud.buttons.mute.y, 40, 40);
  }
  // Pause tugmasi (sprite)
  if (btnPause && btnPause.complete && btnPause.naturalWidth > 0) {
    ctx.save();
    if (hud.paused) ctx.globalAlpha = 0.5;
    ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 4;
    ctx.drawImage(btnPause, hud.buttons.pause.x, hud.buttons.pause.y, 40, 40);
    ctx.restore();
  }
  // Tezlik ko'rsatgichi (chap tomon)
  drawSpeedMeter(ctx, gameSpeed);
  // Score panel (o'yinga mos oltin stil)
  ctx.save();
  ctx.textAlign = "left";
  // Score
  ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 10;
  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 18px 'Share Tech Mono', monospace";
  ctx.fillText(`⚔ ${score}`, 115, 30);
  // Best
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#c0a06088";
  ctx.font = "12px 'Share Tech Mono', monospace";
  ctx.fillText(`🏆 ${highScore}`, 190, 30);
  // Jonlar (yuraklar) — CHAP tomonda
  ctx.shadowColor = "#ff2222"; ctx.shadowBlur = 8;
  ctx.font = "20px sans-serif";
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < lives ? "#ff3333" : "#33333366";
    ctx.fillText("♥", 10 + i * 24, 30);
  }
  ctx.restore();
  // Boshqaruv matni
  ctx.save();
  ctx.fillStyle = "#c0a06044"; ctx.font = "11px 'Share Tech Mono', monospace"; ctx.textAlign = "left";
  ctx.fillText("W — Green  |  ↑ — Orange", 10, CANVAS_H - 10);
  ctx.restore();
}
function drawSpeedMeter(ctx, speed) {
  const x = 10, y = 55, w = 8, maxH = 80;
  const ratio = Math.min((speed - SPEED_BASE) / (SPEED_MAX - SPEED_BASE), 1);
  const fillH = ratio * maxH;
  ctx.save();
  // Fon
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath(); ctx.roundRect(x, y, w, maxH, 4); ctx.fill();
  // To'ldirilgan qism
  const grad = ctx.createLinearGradient(0, y + maxH, 0, y);
  grad.addColorStop(0, "#4caf50");
  grad.addColorStop(0.6, "#ffeb3b");
  grad.addColorStop(1, "#f44336");
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.roundRect(x, y + maxH - fillH, w, fillH, 4); ctx.fill();
  // Ramka
  ctx.strokeStyle = "#ffffff22"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(x, y, w, maxH, 4); ctx.stroke();
  // "SPD" yozuvi
  ctx.fillStyle = "#ffffff44"; ctx.font = "9px monospace"; ctx.textAlign = "center";
  ctx.fillText("SPD", x + w / 2, y + maxH + 12);
  ctx.restore();
}
// ── Ekranlar ─────────────────────────────────────────────────────
function drawStartScreen(ctx) {
  ctx.fillStyle = "rgba(0,0,0,0.68)";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = "center";
  // Logo (Ikki Olam)
  if (btnLogo && btnLogo.complete && btnLogo.naturalWidth > 0) {
    const lw = Math.min(CANVAS_W * 0.8, 300);
    const lh = lw * (btnLogo.naturalHeight / btnLogo.naturalWidth);
    ctx.drawImage(btnLogo, CANVAS_W / 2 - lw / 2, CANVAS_H / 2 - lh - 20, lw, lh);
  } else {
    ctx.save();
    ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 28;
    ctx.fillStyle   = "#ffd700";
    ctx.font        = "bold 48px 'Share Tech Mono', monospace";
    ctx.fillText("IKKI OLAM", CANVAS_W / 2, CANVAS_H / 2 - 60);
    ctx.restore();
  }
  // Yozuvlar olib tashlandi
}
function drawPauseScreen(ctx) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.save();
  // DAVOM ETISH tugmasi (sprite)
  if (btnResume && btnResume.complete && btnResume.naturalWidth > 0) {
    const dw = 200;
    const dh = dw * (btnResume.naturalHeight / btnResume.naturalWidth);
    ctx.drawImage(btnResume, CANVAS_W / 2 - dw / 2, CANVAS_H / 2, dw, dh);
  }
}
function drawGameOverScreen(ctx) {
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.textAlign = "center";
  ctx.save();
  ctx.shadowColor = "#ff6b6b"; ctx.shadowBlur = 24;
  ctx.fillStyle   = "#ff6b6b";
  ctx.font        = "bold 40px 'Share Tech Mono', monospace";
  ctx.fillText("O'YIN TUGADI", CANVAS_W / 2, CANVAS_H / 2 - 55);
  ctx.restore();
  ctx.save();
  ctx.shadowColor = "#ffd700"; ctx.shadowBlur = 6;
  ctx.fillStyle = "#ffd700"; ctx.font = "22px 'Share Tech Mono', monospace";
  ctx.fillText(`⚔ BALL:   ${score}`, CANVAS_W / 2, CANVAS_H / 2 - 8);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#c0a060"; ctx.font = "15px 'Share Tech Mono', monospace";
  ctx.fillText(`🏆 REKORD: ${highScore}`, CANVAS_W / 2, CANVAS_H / 2 + 22);
  ctx.restore();
}