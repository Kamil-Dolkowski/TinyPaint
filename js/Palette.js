export default class Palette {
    constructor(paletteWindow, paletteBtn, currentColor, canvas) {
        this.paletteWindow = paletteWindow;
        this.paletteBtn = paletteBtn;
        this.currentColor = currentColor;
        this.canvas = canvas;

        this.colorPalette = this.paletteWindow.querySelector("#color-palette-content");
        this.colorPicker = this.paletteWindow.querySelector("#color-picker");

        this.isPaletteVisible = false;
        this.basicColors = ["#000000", "#ffffff", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#ff4000"];

        this.initColorButtons();

        window.addEventListener("resize", this.updatePosition.bind(this));
        
    }

    initColorButtons() {
        // color buttons dataset:
        // data-focus = "true" / "false"
        // data-color = "#ffffff" / "none"

        const count = 48;

        for(let i = 0; i < count; i++) {
            const color = this.basicColors[i] ?? "none";

            const button = document.createElement("button");

            button.className = "color-button";
            button.dataset.id = i;
            button.dataset.color = color;
            button.dataset.focus = "false";
            button.style.backgroundColor = color;

            button.addEventListener("click", () => {
                const buttons = this.colorPalette.querySelectorAll("button");

                buttons.forEach(btn => {
                    btn.dataset.focus = "false";
                });

                button.dataset.focus = "true";

                this.changeColor(button.dataset.color);
            });

            this.colorPalette.appendChild(button);
        }

        // init first button color
        const firstBtn = this.colorPalette.querySelector("button");

        this.changeColor(firstBtn.dataset.color);
        firstBtn.dataset.focus = "true";
    }

    updatePosition() {
        const rect = this.paletteBtn.getBoundingClientRect();

        this.paletteWindow.style.left = rect.right + 15 + "px";
        this.paletteWindow.style.top = rect.bottom - this.paletteWindow.height + "px";
    }

    show() {
        this.paletteWindow.style.display = "block";
    }

    hide() {
        this.paletteWindow.style.display = "none";
    }

    changeColor(color) {
        const ctx = this.canvas.canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        this.currentColor.style.backgroundColor = color;
    }


}