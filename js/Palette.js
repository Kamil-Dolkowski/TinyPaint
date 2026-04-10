export default class Palette {
    constructor(paletteWindow, paletteBtn, currentColorDiv, canvas) {
        this.paletteWindow = paletteWindow;
        this.paletteBtn = paletteBtn;
        this.currentColorDiv = currentColorDiv;
        this.canvas = canvas;

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

        window.addEventListener("resize", this.updatePosition.bind(this));
    }

    // Window
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

    changeOptionWindow(name) {
        if (name == "color-palette") {
            this.colorPaletteContent.style.display = "block";
            this.colorPickerContent.style.display = "none";
        }

        if (name == "color-picker") {
            this.colorPaletteContent.style.display = "none";
            this.colorPickerContent.style.display = "block";
        }
    }

    // Canvas
    changeColor(color) {
        if (color === "none") color = "#000000";

        const ctx = this.canvas.canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        this.currentColorDiv.style.backgroundColor = color;
        this.currentColor = color;
    }
}

class ColorPalette {
    constructor(content, changeColorCallback) {
        this.content = content;
        this.changeColorCallback = changeColorCallback;

        // elements in content div
        this.colorPalette = this.content.querySelector("#color-palette-content");
        this.deleteColorBtn = this.content.querySelector("#delete-color-btn");

        // other variables
        this.colorCount = 48;
        this.basicColors = ["#000000", "#ffffff", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#ff4000"];
        this.colorButtons = [];
        this.currentColorBtnId = 0;

        // init/events
        this.initColorButtons();

        this.deleteColorBtn.addEventListener("click", () => {
            this.deleteCurrentColorFromPalette();
        });
    }

    initColorButtons() {
        // color buttons dataset:
        // data-id = "1"
        // data-focus = "true" / "false"
        // data-color = "#ffffff" / "none"

        for(let i = 0; i < this.colorCount; i++) {
            const color = this.basicColors[i] ?? "none";

            const button = document.createElement("button");

            button.className = "color-button";
            button.dataset.id = i;
            button.dataset.focus = "false";
            button.dataset.color = color;
            button.style.backgroundColor = (color === "none") ? "transparent" : color;

            button.addEventListener("click", () => {
                if (button.dataset.color === "none") return;

                this.colorButtons.forEach(btn => {
                    btn.dataset.focus = "false";
                });

                button.dataset.focus = "true";
                this.currentColorBtnId = Number(button.dataset.id);

                this.changeColorCallback?.(button.dataset.color);
            });

            this.colorButtons.push(button);
            this.colorPalette.appendChild(button);
        }

        // init first button color
        const firstBtn = this.colorButtons[0];

        this.changeColorCallback?.(firstBtn.dataset.color);
        this.currentColorBtnId = 0;
        firstBtn.dataset.focus = "true";
    }

    deleteColorFromPalette(buttonId) {
        if (buttonId < 0 || buttonId >= this.colorButtons.length) return;

        // move buttons back by 1
        for (let i = buttonId; i < this.colorButtons.length - 1; i++) {
            this.swapButtons(i, i+1);
        }

        // reset last button -> "delete" color
        const lastButton = this.colorButtons[this.colorButtons.length-1];
        lastButton.dataset.focus = "false";
        lastButton.dataset.color = "none";
        lastButton.style.backgroundColor = (lastButton.dataset.color === "none") ? "transparent" : lastButton.dataset.color;

        // reset currentColorBtnId
        this.currentColorBtnId = null;
    }

    deleteCurrentColorFromPalette() {
        if (this.currentColorBtnId == null) return;

        this.deleteColorFromPalette(this.currentColorBtnId);
    }

    addColorToPalette() {
        let button = null;

        // find first button with color == "none"
        for (let i = 0; i < this.colorButtons.length; i++) {
            const btn = this.colorButtons[i];

            if (btn.dataset.color === "none") {
                button = btn;
                break;
            }
        }

        // change button color
        button.dataset.color = this.currentColor;
        button.style.backgroundColor = this.currentColor;
    }

    swapButtons(id1, id2) {
        const focus_temp = this.colorButtons[id1].dataset.focus;
        const color_temp = this.colorButtons[id1].dataset.color;

        this.colorButtons[id1].dataset.focus = this.colorButtons[id2].dataset.focus;
        this.colorButtons[id1].dataset.color = this.colorButtons[id2].dataset.color;
        this.colorButtons[id1].style.backgroundColor = (this.colorButtons[id2].dataset.color === "none") ? "transparent" : this.colorButtons[id2].dataset.color;

        this.colorButtons[id2].dataset.focus = focus_temp;
        this.colorButtons[id2].dataset.color = color_temp;
        this.colorButtons[id2].style.backgroundColor = (color_temp === "none") ? "transparent" : color_temp;

    }
}

class ColorPicker {
    constructor(content, changeColorCallback) {
        this.content = content;
        this.changeColorCallback = changeColorCallback;

        // elements in content div
        this.colorCanvas = this.createColorCanvas();
        this.colorSlider = this.createColorSlider();
        this.transparencySlider = this.createTransparencySlider();

        // this.r;
        // this.g;
        // this.b;

        // other variables

        // init/events
        this.content.appendChild(this.colorCanvas);
        this.content.appendChild(this.colorSlider);
        this.content.appendChild(this.transparencySlider);

        this.renderHsvSquare(0);
    }

    createColorCanvas() {
        const colorCanvas = document.createElement("canvas");

        colorCanvas.width = 256;
        colorCanvas.height = 256;
        colorCanvas.style.width = 100 + "px";
        colorCanvas.style.height = 100 + "px";
        colorCanvas.style.border = "1px solid #000000";

        return colorCanvas;
    }

    createColorSlider() {
        const colorSlider = document.createElement("input");

        colorSlider.type = "range";
        colorSlider.min = 0;
        colorSlider.max = 255;

        return colorSlider;
    }

    createTransparencySlider() {
        const transparencySlider = document.createElement("input");

        transparencySlider.type = "range";
        transparencySlider.min = 0;
        transparencySlider.max = 255;

        return transparencySlider;
    }

    renderHsvSquare(h) {
        // h - hue [0,360]
        
        const ctx = this.colorCanvas.getContext("2d");
        const width = this.colorCanvas.width;
        const height = this.colorCanvas.height;

        const imageData = ctx.getImageData(0, 0, this.colorCanvas.width, this.colorCanvas. height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const x = (i/4) % width;
            const y = Math.floor((i/4) / width);

            const s = x / (width - 1);
            const v = 1 - (y / (height - 1));

            const {r, g, b} = this.hsvToRgb(h, s, v);

            data[i] = r;
            data[i+1] = g;
            data[i+2] = b;
            data[i+3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    //https://www.rapidtables.com/convert/color/hsv-to-rgb.html
    hsvToRgb(h, s, v) {
        // h - hue [0,360]
        // s - saturation [0,1]
        // v - value [0,1]

        // normalize and clamp values
        h = ((h % 360) + 360) % 360;
        s = Math.max(0, Math.min(s, 1));
        v = Math.max(0, Math.min(v, 1));

        // algorithm
        const c = v * s;
        const x = c * (1 - Math.abs((h/60) % 2 - 1));
        const m = v - c;

        let r = 0;
        let g = 0;
        let b = 0;

        const hIndex = Math.trunc(h/60);

        switch(hIndex) {
            case 0:
                r = c;
                g = x;
                b = 0;
                break;
            case 1:
                r = x;
                g = c;
                b = 0;
                break;
            case 2:
                r = 0;
                g = c;
                b = x;
                break;
            case 3:
                r = 0;
                g = x;
                b = c;
                break;
            case 4:
                r = x;
                g = 0;
                b = c;
                break;
            case 5:
                r = c;
                g = 0;
                b = x;
                break;
        }

        r = (r+m) * 255;
        g = (g+m) * 255;
        b = (b+m) * 255;

        return {r: r, g: g, b: b};
    }
}