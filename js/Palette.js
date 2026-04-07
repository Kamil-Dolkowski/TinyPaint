export default class Palette {
    constructor(paletteDiv, paletteBtn, currentColor, canvas) {
        this.paletteDiv = paletteDiv;
        this.paletteBtn = paletteBtn;
        this.currentColor = currentColor;
        this.canvas = canvas;

        this.isPaletteVisible = false;
        this.colors = ["#000000", "#ffffff", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#ff4000"];

        this.initBasicColors();

        window.addEventListener("resize", this.updatePosition.bind(this));
    }

    initBasicColors() {
        this.colors.forEach(color => {
            const button = document.createElement("button");

            button.className = "color-button";
            button.dataset.color = color;
            button.dataset.state = "off";
            button.style.backgroundColor = color;

            button.addEventListener("click", () => {
                const buttons = this.paletteDiv.querySelectorAll("button");

                buttons.forEach(btn => {
                    btn.dataset.state = "off";
                });

                button.dataset.state = "on";

                this.changeColor(button.dataset.color);
            });

            this.paletteDiv.appendChild(button);
        });

        // init first button color
        const firstBtn = this.paletteDiv.querySelector("button");
        
        this.changeColor(firstBtn.dataset.color);
        firstBtn.dataset.state = "on";
    }

    updatePosition() {
        const rect = this.paletteBtn.getBoundingClientRect();

        this.paletteDiv.style.left = rect.right + 15 + "px";
        this.paletteDiv.style.top = rect.bottom - this.paletteDiv.height + "px";
    }

    show() {
        this.paletteDiv.style.display = "grid";
    }

    hide() {
        this.paletteDiv.style.display = "none";
    }

    changeColor(color) {
        const ctx = this.canvas.canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        this.currentColor.style.backgroundColor = color;
    }


}