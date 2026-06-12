this.transparencySlider.slider.addEventListener("change", e => {
    const {r,g,b} = this.getRgb();
    const a = parseInt(this.transparencySlider.value);

    const colorHex = this.rgbaToHex(r,g,b,a);
    this.changeColorCallback?.(colorHex);

    this.transparencySlider.thumb.style.backgroundColor = `hsla(0, 100%, 0%, ${e.detail.value / this.transparencySlider.max})`;
});

this.transparencySlider.thumb.style.backgroundColor = `hsla(0, 100%, 0%, ${this.transparencySlider.value / this.transparencySlider.max})`;

createTransparencySlider() {
    const transparencySlider = new Slider(0, 255, 255, "transparency-slider");

    return transparencySlider;
}

const a = parseInt(this.transparencySlider.value);