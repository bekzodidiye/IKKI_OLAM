const PLAYER_X = 40;
function createPlayer(zone, color, jumpKey, leftKey, rightKey) {
  return {
    x: PLAYER_X,
    color, jumpKey, leftKey, rightKey, zone,
    w: 28, h: 52,
    vx: 0, vy: 0,
    onGround: true,
    legPhase: 0,
    _y: HALF - 52,
    invincible: 0,
  };
}
function resetPlayers(players) {
  for (const p of players) {
    p.x = PLAYER_X;
    p._y = HALF - 52;
    p.vy = 0;
    p.onGround = true;
    p.legPhase = 0;
    p.invincible = 0;
  }
}
function updatePlayer(p, gameSpeed) {
  // Unified physics: everything happens in the top half physically, then flipped if needed
  if (keys[p.jumpKey] && p.onGround) {
    p.vy = -13; 
    p.onGround = false;
    if (window.sfxJump) {
      window.sfxJump.currentTime = 0;
      window.sfxJump.play().catch(() => {});
    }
  }
  p.vy += GRAVITY; 
  p._y += p.vy;
  p.legPhase += gameSpeed * 0.04;
  const homeY = HALF - 20 - p.h; 
  if (p._y >= homeY) { p._y = homeY; p.vy = 0; p.onGround = true; }
}
const greenRunFrames = [];
for (let i = 0; i < 6; i++) { 
  const img = _loader.add(new Image()); img.src = `assets/green/run_${i}.png`; greenRunFrames.push(img); 
}
const greenJumpFrames = [];
for (let i = 0; i < 3; i++) { 
  const img = _loader.add(new Image()); img.src = `assets/green/jump_${i}.png`; greenJumpFrames.push(img); 
}
const orangeRunFrames = [];
for (let i = 0; i < 6; i++) { 
  const img = _loader.add(new Image()); img.src = `assets/orange/run_${i}.png`; orangeRunFrames.push(img); 
}
const orangeJumpFrames = [];
for (let i = 0; i < 3; i++) { 
  const img = _loader.add(new Image()); img.src = `assets/orange/jump_${i}.png`; orangeJumpFrames.push(img); 
}
function drawPlayer(ctx, p) {
  ctx.save();
  // Invincible miltillash effekti (faqat shu bolacha)
  if (p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0) {
    ctx.globalAlpha = 0.3;
  }
  // Endi pastki personaj flip qilinadi (inverted dunyo)
  if (p.zone === "bottom") {
    ctx.translate(p.x + p.w / 2, HALF);
    ctx.scale(1, -1);
    ctx.translate(-(p.x + p.w / 2), -HALF);
  }
  // Sprite tanlash
  let frames = [];
  let frameIdx = 0;
  if (p.zone === "top") {
    // Top: Green Boy
    if (p.onGround) {
      frames = greenRunFrames;
      frameIdx = Math.floor(p.legPhase) % 6;
    } else {
      frames = greenJumpFrames;
      if (p.vy < -2) frameIdx = 0;      
      else if (p.vy > 2) frameIdx = 2; 
      else frameIdx = 1;              
    }
  } else {
    // Bottom: Orange Warrior
    if (p.onGround) {
      frames = orangeRunFrames;
      frameIdx = Math.floor(p.legPhase) % 6;
    } else {
      frames = orangeJumpFrames;
      // Inverted visual: jump moves physical -y (away from HALF), 
      // which flipped means further away from HALF into the bottom world.
      if (p.vy < -2) frameIdx = 0;      
      else if (p.vy > 2) frameIdx = 2; 
      else frameIdx = 1;              
    }
  }
  const sprite = frames[frameIdx];
  if (sprite && sprite.complete && sprite.naturalWidth > 0) {
    const dh = 75; 
    const dw = dh * (sprite.naturalWidth / sprite.naturalHeight);
    const dx = p.x + p.w / 2 - dw / 2;
    const dy = p._y + p.h - dh + 5; 
    ctx.drawImage(sprite, dx, dy, dw, dh);
  } else {
    // Eskicha chizish logikasi (fallback)
    const cx = p.x + p.w / 2;
    const topY = p._y;
    const headR = 10;
    const headCY = topY + headR + 1;
    const bodyTop = headCY + headR;
    const bodyH = 18;
    const hipY = bodyTop + bodyH;
    const legL = 13;
    const swing = Math.sin(p.legPhase) * 9;
    ctx.lineCap = "round";
    ctx.shadowColor = p.color;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 5;
    ctx.shadowBlur = 5;
    // Oyoqlar
    ctx.beginPath();
    ctx.moveTo(cx - 5, hipY);
    ctx.lineTo(cx - 5 + swing, hipY + legL * 0.55);
    ctx.lineTo(cx - 5 + swing * 1.1, hipY + legL);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 5, hipY);
    ctx.lineTo(cx + 5 - swing, hipY + legL * 0.55);
    ctx.lineTo(cx + 5 - swing * 1.1, hipY + legL);
    ctx.stroke();
    // Tana
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(cx - 9, bodyTop, 18, bodyH, 3);
    ctx.fill();
    // Qo'llar
    ctx.lineWidth = 4;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(cx - 9, bodyTop + 4);
    ctx.lineTo(cx - 16, bodyTop + 14 + swing * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 9, bodyTop + 4);
    ctx.lineTo(cx + 16, bodyTop + 14 - swing * 0.8);
    ctx.stroke();
    // Bosh
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, headCY, headR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(cx - 3.5, headCY - 1, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 3.5, headCY - 1, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(cx - 3, headCY - 1, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 4, headCY - 1, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}