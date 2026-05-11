/**
 * Asset Loader for Ikki Olam
 * Tracks all images and audio to show a loading screen.
 */
const loader = {
  total: 0,
  loaded: 0,
  assets: [],
  onComplete: null,

  add(asset) {
    this.total++;
    this.assets.push(asset);
    
    if (asset instanceof HTMLImageElement) {
      if (asset.complete && asset.naturalWidth > 0) {
        this.track();
      } else {
        asset.onload = () => this.track();
        asset.onerror = () => {
          console.warn("Rasm yuklashda xato:", asset.src);
          this.track();
        };
      }
    } else if (asset instanceof HTMLAudioElement) {
      asset.oncanplaythrough = () => this.track();
      asset.onerror = () => {
        console.warn("Audio yuklashda xato:", asset.src);
        this.track();
      };
      // Ba'zi brauzerlar canplaythrough ni kutmasligi mumkin, preload auto bo'lsa
      if (asset.readyState >= 3) this.track();
    }
    return asset;
  },

  track() {
    this.loaded++;
    const percent = Math.floor((this.loaded / this.total) * 100);
    
    const bar = document.getElementById("loaderBar");
    const text = document.getElementById("loaderText");
    
    if (bar) bar.style.width = percent + "%";
    if (text) text.innerText = `Yuklanmoqda... ${percent}%`;
    
    if (this.loaded >= this.total) {
      setTimeout(() => {
        this.finish();
      }, 500);
    }
  },

  finish() {
    const preloader = document.getElementById("preloader");
    const wrapper = document.getElementById("gameWrapper");
    if (preloader) {
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
        if (wrapper) wrapper.style.display = "block";
        if (this.onComplete) this.onComplete();
      }, 500);
    }
  }
};

window._loader = loader;
