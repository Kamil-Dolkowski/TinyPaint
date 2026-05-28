import ColorPalette from './ColorPalette.js';
import ColorPicker from './ColorPicker.js';

export default class Palette extends EventTarget {
    constructor(paletteWindow, paletteControl, canvas) {
        super();
        
        this.paletteWindow = paletteWindow;
        this.paletteControl = paletteControl
        this.canvas = canvas;

        this.ctx = this.canvas.ctx;

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
        this.paletteControl.iconBtn.addEventListener("click", () => {
            this.updatePosition();
            this.paletteWindow.classList.toggle("hidden");
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
        const rect = this.paletteControl.iconBtn.getBoundingClientRect();
        const windowHeight = 250;
        const margin = 15;

        this.paletteWindow.style.left = rect.left + "px";
        this.paletteWindow.style.top = rect.top - (windowHeight + margin)+ "px";
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

        this.paletteControl.changeCurrentColor(color);
        this.currentColor = color;

        // event
        this.dispatchEvent(
            new CustomEvent("change", {
                detail: { color: this.currentColor }
            })
        );
    }
}