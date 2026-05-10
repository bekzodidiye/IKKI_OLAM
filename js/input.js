const keys = {};
window.addEventListener("keydown", e => { keys[e.code] = true; });
window.addEventListener("keyup",   e => { keys[e.code] = false; });
// ── Mobil touch boshqaruv ────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  const btnLeft  = document.getElementById("btnLeft");
  const btnRight = document.getElementById("btnRight");
  if (btnLeft) {
    btnLeft.addEventListener("touchstart",  e => { e.preventDefault(); keys["KeyW"] = true; },     { passive: false });
    btnLeft.addEventListener("touchend",    e => { e.preventDefault(); keys["KeyW"] = false; },    { passive: false });
    btnLeft.addEventListener("touchcancel", e => { keys["KeyW"] = false; });
    // Mouse fallback (desktop testing)
    btnLeft.addEventListener("mousedown", () => { keys["KeyW"] = true; });
    btnLeft.addEventListener("mouseup",   () => { keys["KeyW"] = false; });
    btnLeft.addEventListener("mouseleave",() => { keys["KeyW"] = false; });
  }
  if (btnRight) {
    btnRight.addEventListener("touchstart",  e => { e.preventDefault(); keys["ArrowUp"] = true; },  { passive: false });
    btnRight.addEventListener("touchend",    e => { e.preventDefault(); keys["ArrowUp"] = false; }, { passive: false });
    btnRight.addEventListener("touchcancel", e => { keys["ArrowUp"] = false; });
    // Mouse fallback
    btnRight.addEventListener("mousedown", () => { keys["ArrowUp"] = true; });
    btnRight.addEventListener("mouseup",   () => { keys["ArrowUp"] = false; });
    btnRight.addEventListener("mouseleave",() => { keys["ArrowUp"] = false; });
  }
});