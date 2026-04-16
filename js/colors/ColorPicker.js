import Slider from '../../ui/Slider.js';

export default class ColorPicker {
    constructor(content, changeColorCallback) {
        this.content = content;
        this.changeColorCallback = changeColorCallback;

        this.canvasWidth = 256;
        this.canvasHeight = 256;
        this.canvasCssWidth = 150;
        this.canvasCssHeight = 150;

        this.canvasScaleX = this.canvasWidth / this.canvasCssWidth;
        this.canvasScaleY = this.canvasHeight / this.canvasCssHeight;

        // elements in content div
        // -- color picker content
        this.colorPickerContent = this.createColorPickerContent();
        // -- canvases
        this.canvasDiv = this.createCanvasDiv();
        this.colorCanvas = this.createColorCanvas();
        this.cursorCanvas = this.createCursorCanvas();
        // -- slider
        this.colorSlider = this.createColorSlider();
        // -- button
        this.addToPaletteBtn = this.createAddToPaletteBtn();

        // canvas
        this.ctx = this.colorCanvas.getContext("2d", { willReadFrequently: true });
        this.cursorCtx = this.cursorCanvas.getContext("2d");

        this.imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);

        // other variables
        this.isPointerPressed = false;
        this.isDirty = false;
        this.currentX = 0;
        this.currentY = 255;

        // init/events
        this.canvasDiv.appendChild(this.colorCanvas);
        this.canvasDiv.appendChild(this.cursorCanvas);
        this.colorPickerContent.appendChild(this.canvasDiv);

        this.colorSlider.mount(this.colorPickerContent);
        this.content.appendChild(this.colorPickerContent);
        this.content.appendChild(this.addToPaletteBtn);

        this.renderHsvSquare(0);
        this.colorSlider.thumb.style.backgroundColor = `hsl(${this.colorSlider.value}, 100%, 50%)`;

        // === SLIDER ===
        this.colorSlider.slider.addEventListener("change", e => {
            this.renderHsvSquare(e.detail.value);

            const {r,g,b} = this.getRgb();

            const colorHex = this.rgbToHex(r,g,b);
            this.changeColorCallback?.(colorHex);

            this.colorSlider.thumb.style.backgroundColor = `hsl(${e.detail.value}, 100%, 50%)`;
        });

        // === CURSOR CANVAS ===
        this.drawCursor();

        this.cursorCanvas.addEventListener("pointerdown", e => {
            this.isPointerPressed = true;
            this.isDirty = true;

            this.currentX = e.offsetX * this.canvasScaleX;
            this.currentY = e.offsetY * this.canvasScaleY;

            this.cursorCanvas.setPointerCapture(e.pointerId);
        });

        this.cursorCanvas.addEventListener("pointermove", e => {
            if (!this.isPointerPressed) return;

            this.isDirty = true;

            const rect = this.cursorCanvas.getBoundingClientRect();

            this.currentX = Math.max(0, Math.min((e.clientX - rect.left) * this.canvasScaleX, this.canvasWidth-1));
            this.currentY = Math.max(0, Math.min((e.clientY - rect.top) * this.canvasScaleY, this.canvasHeight-1));
        });

        this.cursorCanvas.addEventListener("pointerup", e => {
            if (!this.isPointerPressed) return;

            this.isDirty = true;
            this.isPointerPressed = false;

            this.cursorCanvas.releasePointerCapture(e.pointerId);
        });

        const colorPickerLoop = () => {
            if (this.isDirty) {
                const {r,g,b} = this.getRgb();

                const colorHex = this.rgbToHex(r,g,b);

                this.changeColorCallback?.(colorHex);

                this.drawCursor();

                this.isDirty = false;
            }

            requestAnimationFrame(colorPickerLoop);
        }

        colorPickerLoop();
    }

    createColorPickerContent() {
        const colorPickerContent = document.createElement("div");

        colorPickerContent.id = "color-picker-content";
        colorPickerContent.style.display = "flex";

        return colorPickerContent;
    }

    createCanvasDiv() {
        const canvasDiv = document.createElement("div");

        canvasDiv.style.position = "relative";

        return canvasDiv;
    }

    createColorCanvas() {
        const colorCanvas = document.createElement("canvas");

        colorCanvas.width = this.canvasWidth;
        colorCanvas.height = this.canvasHeight;

        colorCanvas.style.width = this.canvasCssWidth + "px";
        colorCanvas.style.height = this.canvasCssHeight + "px";

        colorCanvas.style.outline = "1px solid #000000";

        return colorCanvas;
    }

    createCursorCanvas() {
        const cursorCanvas = document.createElement("canvas");

        cursorCanvas.width = this.canvasWidth;
        cursorCanvas.height = this.canvasHeight;

        cursorCanvas.style.width = this.canvasCssWidth + "px";
        cursorCanvas.style.height = this.canvasCssHeight + "px";
        cursorCanvas.style.zIndex = parseInt(this.colorCanvas.style.zIndex) + 1;

        cursorCanvas.style.position = "absolute";
        cursorCanvas.style.left = 0;
        cursorCanvas.style.top = 0;

        return cursorCanvas;
    }

    createColorSlider() {
        const colorSlider = new Slider(0, 360, 0, "color-slider");

        return colorSlider;
    }

    createAddToPaletteBtn() {
        const addToPaletteBtn = document.createElement("button");

        addToPaletteBtn.id = "add-to-palette-btn";
        addToPaletteBtn.className = "button-22-small";

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-plus";
        icon.style.margin = "2px 10px 2px 0px";

        const text = document.createTextNode("Dodaj do palety");

        addToPaletteBtn.appendChild(icon);
        addToPaletteBtn.appendChild(text);

        return addToPaletteBtn;
    }

    drawCursor() {
        this.cursorCtx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);

        this.cursorCtx.lineWidth = 4;
        this.cursorCtx.strokeStyle = "black"

        this.cursorCtx.beginPath();
        this.cursorCtx.arc(this.currentX, this.currentY, 10, 0, 2 * Math.PI);
        this.cursorCtx.stroke();
    }

    renderHsvSquare(h) {
        // h - hue [0,360]

        const width = this.colorCanvas.width;
        const height = this.colorCanvas.height;

        const data = this.imageData.data;

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

        this.ctx.putImageData(this.imageData, 0, 0);
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

        r = Math.round((r+m) * 255);
        g = Math.round((g+m) * 255);
        b = Math.round((b+m) * 255);

        return {r: r, g: g, b: b};
    }

    rgbToHex(r, g, b) {
        return "#" + this.decimalToHex(r) + this.decimalToHex(g) + this.decimalToHex(b);
    }

    decimalToHex(decimal) {
        return decimal.toString(16).padStart(2, '0');
    }

    // slower
    getRgbFromImageData() {
        const data = this.imageData.data;
        const i = (parseInt(this.currentY) * this.canvasWidth + parseInt(this.currentX)) * 4;

        return {r: data[i], g: data[i+1], b: data[i+2]};
    }

    // faster
    getRgb() {
        const h = this.colorSlider.value;
        const s = this.currentX / (this.canvasWidth - 1);
        const v = 1 - (this.currentY / (this.canvasHeight - 1));

        return this.hsvToRgb(h, s, v);
    }
}