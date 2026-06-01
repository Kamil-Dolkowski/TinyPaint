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

        this.colorPickerContent.appendChild(this.colorSlider);
        this.content.appendChild(this.colorPickerContent);
        this.content.appendChild(this.addToPaletteBtn);

        this.renderHsvSquare(0);
        this.colorSlider.style.setProperty("--thumb-color", `hsl(${this.colorSlider.value}, 100%, 50%)`)

        // === SLIDER ===
        this.colorSlider.addEventListener("input", e => {
            this.renderHsvSquare(e.target.value);

            const {r,g,b} = this.getRgb();

            const colorHex = this.rgbToHex(r,g,b);
            this.changeColorCallback?.(colorHex);

            this.colorSlider.style.setProperty("--thumb-color", `hsl(${e.target.value}, 100%, 50%)`)
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
        const colorSlider = document.createElement("input");
        colorSlider.type = "range";
        colorSlider.min = 0;
        colorSlider.max = 360;
        colorSlider.value = 0;
        colorSlider.id = "color-slider";

        return colorSlider;
    }

    createAddToPaletteBtn() {
        const addToPaletteBtn = document.createElement("button");

        addToPaletteBtn.id = "add-to-palette-btn";
        addToPaletteBtn.className = "button-small";

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

    // ==================== METHODS ====================

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

    getRgb() {
        const h = this.colorSlider.value;
        const s = this.currentX / (this.canvasWidth - 1);
        const v = 1 - (this.currentY / (this.canvasHeight - 1));

        return this.hsvToRgb(h, s, v);
    }

    setColor(hexColor) {
        const {r,g,b} = this.hexToRgb(hexColor);
        const {h,s,v} = this.rgbToHsv(r,g,b);

        this.colorSlider.value = h;
        this.renderHsvSquare(h);
    }

    // ==================== CONVERSIONS ====================

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

    // https://www.rapidtables.com/convert/color/rgb-to-hsv.html
    rgbToHsv(r, g, b) {
        // The R,G,B values are divided by 255 to change the range from 0..255 to 0..1:
        r = r/255;
        g = g/255;
        b = b/255;

        const cMax = Math.max(r,g,b);
        const cMin = Math.min(r,g,b);

        const delta = cMax - cMin;

        // H
        let h = 0;

        switch (cMax) {
            case cMin:
                break;
            case r:
                h = 60 * (((g-b) / delta) % 6);
                break;
            case g:
                h = 60 * (((b-r) / delta) + 2);
                break;
            case b:
                h = 60 * (((r-g) / delta) + 4);
                break;
        }

        // S
        let s = 0;

        if (cMax != 0) {
            s = delta / cMax;
        }

        // V
        const v = cMax;

        return {h,s,v};
    }

    rgbToHex(r, g, b) {
        return "#" + this.decimalToHex(r) + this.decimalToHex(g) + this.decimalToHex(b);
    }

    hexToRgb(hex) {
        // 1. delete '#' on front
        hex = hex.slice(1); 

        // 2. divide into 3 parts (RGB)
        const rStr = hex.slice(0,2);
        const gStr = hex.slice(2,4);
        const bStr = hex.slice(4,6);

        // 3. calculate RGB [hexadecimal to decimal]
        const r = this.hexToDec(rStr[1]) + 16 * this.hexToDec(rStr[0]);
        const g = this.hexToDec(gStr[1]) + 16 * this.hexToDec(gStr[0]);
        const b = this.hexToDec(bStr[1]) + 16 * this.hexToDec(bStr[0]);

        return {r: r, g: g, b: b};
    }

    decimalToHex(decimal) {
        return decimal.toString(16).padStart(2, '0');
    }

    hexToDec(hex) {
        switch(hex) {
            case 'a':
                return 10;
            case 'b':
                return 11;
            case 'c':
                return 12;
            case 'd':
                return 13;
            case 'e':
                return 14;
            case 'f':
                return 15;
            default:
                if (!Number.isInteger(Number(hex))) return null;

                const number = Number(hex);
                if (number < 0 || number > 9) return null;

                return number;
        }
    }
}