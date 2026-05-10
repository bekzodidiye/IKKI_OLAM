let ropeActive = false;
function updateRope(players) {
  const top     = players[0];
  const bot     = players[1];
  const pulling = keys["ArrowDown"] && !top.onGround;
  ropeActive = pulling;
  if (pulling) {
    // Markaziy chiziqqa (HALF) tortish — oyoqlari HALF da bo'lishi kerak
    const targetY = HALF - top.h;
    const distToCenter = targetY - top._y;
    // Instant snap: to'g'ridan pozitsiyaga o'rnatish
    top.vy = distToCenter * 0.4;  // kuchli tortish
    // Gravitatsiyani bekor qilish
    if (Math.abs(distToCenter) < 5) {
      top._y = targetY;
      top.vy = 0;
    }
    // Pastki sakrash
    if (bot.onGround) bot.vy = JUMP_FORCE;
  }
}
function drawRope(ctx, players) {
  // Arqon oyoqlardan chiqadi — ikkala personaj ham oyoqlari HALF da
  const a = { x: players[0].x + players[0].w / 2, y: HALF };
  const b = { x: players[1].x + players[1].w / 2, y: HALF };
  const dist    = Math.hypot(b.x - a.x, b.y - a.y);
  const stretch = Math.min(dist / (HALF * 1.6), 1);
  const gVal    = Math.round(200 - stretch * 140);
  ctx.save();
  // Tashqi glow qatlami
  ctx.lineWidth   = ropeActive ? 10 : 7;
  ctx.lineCap     = "round";
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = `rgb(255,${gVal},50)`;
  ctx.shadowColor = `rgb(255,${gVal},50)`;
  ctx.shadowBlur  = 30;
  _drawRopePath(ctx, a, b);
  ctx.stroke();
  // Ichki asosiy chiziq
  ctx.globalAlpha = 1;
  ctx.lineWidth   = ropeActive ? 3.5 : 2.5;
  ctx.shadowBlur  = ropeActive ? 16 : 8;
  const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
  grad.addColorStop(0,   `rgba(255,${gVal},20,0.9)`);
  grad.addColorStop(0.5, "rgba(255,230,50,1)");
  grad.addColorStop(1,   `rgba(255,${gVal},20,0.9)`);
  ctx.strokeStyle = grad;
  _drawRopePath(ctx, a, b);
  ctx.stroke();
  // Halqalar (O'chirilgan)
  ctx.restore();
}
function _drawRopePath(ctx, a, b) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  for (let i = 1; i <= ROPE_SEGMENTS; i++) {
    const t   = i / ROPE_SEGMENTS;
    const sag = Math.sin(t * Math.PI) * (ropeActive ? -12 : 30);
    ctx.lineTo(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t + sag);
  }
}