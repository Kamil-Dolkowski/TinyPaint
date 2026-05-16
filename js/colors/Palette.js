import ColorPalette from './ColorPalette.js';
import ColorPicker from './ColorPicker.js';

export default class Palette {
    constructor(paletteWindow, paletteBtn, currentColorDiv, canvas) {
        this.paletteWindow = paletteWindow;
        this.paletteBtn = paletteBtn;
        this.currentColorDiv = currentColorDiv;
        this.canvas = canvas;

        this.ctx = this.canvas.canvas.getContext("2d");

        // palette options
        this.colorPaletteBtn = this.paletteWindow.querySelector("#color-palette-btn");
        this.colorPickerBtn = this.paletteWindow.querySelector("#color-picker-btn");

        this.colorPaletteContent = this.paletteWindow.querySelector("#color-palette");
        this.colorPickerContent = this.paletteWindow.querySelector("#color-picker");

        this.colorPalette = new ColorPalette(this.colorPaletteContent, this.changeColor.bind(this));
        this.colorPicker = new ColorPicker(this.colorPickerContent, this.changeColor.bind(this));

        // other variables
        this.isPaletteVisible = false;

        this.currentColor = this.colorPalette.basicColors[0];

        // init/events
        this.paletteBtn.addEventListener("click", () => {
            this.isPaletteVisible = !this.isPaletteVisible;
            this.updatePosition();

            if (this.isPaletteVisible) {
                this.show();
            } else {
                this.hide();
            }
            
        });

        this.colorPaletteBtn.addEventListener("click", () => {
            this.changeOptionWindow("color-palette");
        });

        this.colorPickerBtn.addEventListener("click", () => {
            this.changeOptionWindow("color-picker");
        });

        this.colorPicker.addToPaletteBtn.addEventListener("click", () => {
            this.colorPalette.addColorToPalette(this.currentColor);
        });

        window.addEventListener("resize", this.updatePosition.bind(this));
    }

    // Window
    updatePosition() {
        const rect = this.paletteBtn.getBoundingClientRect();
        const windowHeight = 250;
        const margin = 15;

        this.paletteWindow.style.left = rect.left + "px";
        this.paletteWindow.style.top = rect.top - (windowHeight + margin)+ "px";
    }

    show() {
        this.paletteWindow.style.display = "block";
    }

    hide() {
        this.paletteWindow.style.display = "none";
    }

    changeOptionWindow(name) {
        if (name == "color-palette") {
            this.colorPaletteContent.style.display = "block";
            this.colorPickerContent.style.display = "none";
        }

        if (name == "color-picker") {
            this.colorPaletteContent.style.display = "none";
            this.colorPickerContent.style.display = "block";

            requestAnimationFrame(() => this.colorPicker.colorSlider.updateLayout());
        }
    }

    // Canvas
    changeColor(color) {
        if (color === "none") color = "#000000";

        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;

        this.currentColorDiv.style.backgroundColor = color;
        this.currentColor = color;
    }
}