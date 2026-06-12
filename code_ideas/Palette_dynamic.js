import ColorPalette from './ColorPalette.js';
import ColorPicker from './ColorPicker.js';

export default class Palette {
    constructor(paletteWindow, paletteBtn, currentColorDiv, canvas) {
        // ===== html elements =====
        // -- window structure
        this.paletteWindow = this.createPaletteWindow();

        this.paletteModes = this.createPaletteModes();
        this.paletteContent = this.createPaletteContent();

        // -- mode buttons
        this.colorPaletteBtn = this.createColorPaletteBtn();
        this.colorPickerBtn = this.createColorPickerBtn();

        // -- elements in toolbar
        this.element = this.createElement();

        this.iconBtn = this.createIconBtn();
        this.currentColor = this.createCurrentColor();

        // ===== elements composition =====
        // -- mode buttons
        this.paletteModes.appendChild(this.colorPaletteBtn);
        this.paletteModes.appendChild(this.colorPickerBtn);

        // -- window structure
        this.paletteWindow.appendChild(this.paletteModes);
        this.paletteWindow.appendChild(this.paletteContent);

        // -- elements in toolbar
        this.element.appendChild(this.iconBtn);
        this.element.appendChild(this.currentColor);
        



















        // switch mode buttons
        this.colorPaletteBtn = this.createColorPaletteBtn();
        this.colorPickerBtn = this.createColorPickerBtn();

        
        // ?? 
        this.colorPaletteContent = this.paletteWindow.querySelector("#color-palette");
        this.colorPickerContent = this.paletteWindow.querySelector("#color-picker");



        // main elements
        this.paletteOptions = this.createPaletteOptions();
        this.paletteContent = this.createPaletteContent();

        this.paletteWindow = this.createPaletteWindow();

        // button
        const iconBtn = this.createIconBtn();
        const currentColorDiv = currentColorDiv;



        this.paletteOptions.appendChild(this.colorPaletteBtn);
        this.paletteOptions.appendChild(this.colorPickerBtn);




        this.paletteWindow = paletteWindow;
        this.paletteBtn = paletteBtn;
        this.currentColorDiv = currentColorDiv;









        this.canvas = canvas;

        this.element = this.createElement();

        this.ctx = this.canvas.canvas.getContext("2d");

        // palette options
        // this.colorPaletteBtn = this.paletteWindow.querySelector("#color-palette-btn");
        // this.colorPickerBtn = this.paletteWindow.querySelector("#color-picker-btn");

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

    createColorPaletteBtn() {
        const button = document.createElement("button");
        button.id = "color-palette-btn";
        button.className = "button-small";
        button.textContent = "Paleta kolorów";

        return button;
    }

    createColorPickerBtn() {
        const button = document.createElement("button");
        button.id = "color-picker-btn";
        button.className = "button-small";
        button.textContent = "Wybierz kolor";

        return button;
    }

    createPaletteWindow() {
        const paletteWindow = document.createElement("div");
        paletteWindow.id = "palette-window";
        paletteWindow.className = "window";

        return paletteWindow;
    }

    createPaletteModes() {
        const paletteModes = document.createElement("div");
        paletteModes.id = "palette-modes";

        return paletteModes;
    }

    createPaletteContent() {
        const paletteContent = document.createElement("div");
        paletteContent.id = "palette-content";

        return paletteContent;
    }

    createElement() {
        const element = document.createElement("div");

        element.id = "palette";
        element.style.display = "flex";

        element.appendChild(this.paletteBtn);
        element.appendChild(this.currentColorDiv);

        return element;
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