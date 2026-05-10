const greenBg1 = new Image(); greenBg1.src = "assets/background/scene.jpg";
const greenBg2 = new Image(); greenBg2.src = "assets/background/scene2.jpg";
const greenBg3 = new Image(); greenBg3.src = "assets/background/scene3.jpg";
const orangeBg1 = new Image(); orangeBg1.src = "assets/background/orange_.jpg";
const orangeBg2 = new Image(); orangeBg2.src = "assets/background/orange_2.jpg";
const orangeBg3 = new Image(); orangeBg3.src = "assets/background/orange1.jpg";
const groundTex = new Image(); groundTex.src = "assets/background/tosh.png";
let bgOffset = 0;
let groundOffset = 0;
// ... (Rasmlar yuqorida yuklangan)
function drawBackground(ctx, bgSpeed, groundSpeed = 0) {
  bgOffset += bgSpeed; 
  groundOffset += groundSpeed;
  const bgs = [greenBg1, greenBg2, greenBg3];
  const bgH = HALF / 2; // Bo'yi 2 barobar kamaytirildi
  // Haqiqiy enini hisoblash (bgH ga ko'ra)
  let totalW = 0;
  for (const img of bgs) {
    if (img.complete) totalW += img.naturalWidth * (bgH / img.naturalHeight);
  }
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#0d2b0d";
  ctx.fillRect(0, HALF - bgH, CANVAS_W, bgH);
  let currentX = 0;
  for (let i = 0; i < bgs.length; i++) {
    const img = bgs[i];
    if (img.complete) {
       const dw = img.naturalWidth * (bgH / img.naturalHeight);
       let x = currentX - (bgOffset % totalW);
       if (x + dw < 0) x += totalW;
       ctx.drawImage(img, x, HALF - bgH, dw, bgH);
       if (x + dw < CANVAS_W) ctx.drawImage(img, x + totalW, HALF - bgH, dw, bgH);
       currentX += dw;
    }
  }
  ctx.restore();
  // ── Pastki zona (Orange/History) ──────────────────────────
  const orangeBgs = [orangeBg1, orangeBg2, orangeBg3];
  let totalOW = 0;
  for (const img of orangeBgs) {
    if (img.complete) totalOW += img.naturalWidth * (bgH / img.naturalHeight);
  }
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#1a0e04";
  ctx.fillRect(0, HALF, CANVAS_W, bgH);
  if (totalOW > 0) {
    const loopO = bgOffset % totalOW;
    let curX = 0;
    ctx.translate(0, HALF);
    ctx.scale(1, -1);
    ctx.translate(0, -HALF);
    for (let i = 0; i < orangeBgs.length; i++) {
      const img = orangeBgs[i];
      if (img.complete) {
        const dw = img.naturalWidth * (bgH / img.naturalHeight);
        let x = curX - loopO;
        if (x + dw < 0) x += totalOW;
        ctx.drawImage(img, x, HALF - bgH, dw, bgH);
        if (x + dw < CANVAS_W) ctx.drawImage(img, x + totalOW, HALF - bgH, dw, bgH);
        curX += dw;
      }
    }
  }
  ctx.restore();
  // ── Markaziy Tosh (Ground platform) ──────────────────
  if (groundTex.complete && groundTex.naturalWidth > 0) {
    ctx.save();
    const gh = 40; // Yuza oraliqlari
    const gw = groundTex.naturalWidth * (gh / groundTex.naturalHeight);
    if (gw > 0) {
      const gLoops = Math.ceil(CANVAS_W / gw) + 1;
      const gOff = groundOffset % gw;
      for (let i = 0; i < gLoops; i++) {
        ctx.drawImage(groundTex, i * gw - gOff, HALF - 20, gw, gh);
      }
    }
    // Yordamchi chiziqlar olib tashlandi.
    ctx.restore();
  }
}
// initBgLayers endi kerak emas — parallax runtime da chiziladi
function initBgLayers() {
  // Bo'sh funksiya — eski kod bilan moslashuv uchun
}