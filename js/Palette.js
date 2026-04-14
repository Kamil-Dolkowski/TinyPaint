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

        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;

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

        this.canvasWidth = 256;
        this.canvasHeight = 256;
        this.canvasCssWidth = 150;
        this.canvasCssHeight = 150;

        this.canvasScaleX = this.canvasWidth / this.canvasCssWidth;
        this.canvasScaleY = this.canvasHeight / this.canvasCssHeight;

        // elements in content div
        this.canvasDiv = this.createCanvasDiv();
        this.colorCanvas = this.createColorCanvas();
        this.cursorCanvas = this.createCursorCanvas();
        this.colorSlider = this.createColorSlider();
        this.transparencySlider = this.createTransparencySlider();

        this.customColorSlider = new Slider();

        content.appendChild(this.customColorSlider.slider);

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

        this.content.appendChild(this.canvasDiv);
        this.content.appendChild(this.colorSlider);
        this.content.appendChild(this.transparencySlider);

        this.renderHsvSquare(0);

        this.colorSlider.addEventListener("input", e => {
            this.renderHsvSquare(e.target.value);

            const {r,g,b} = this.getRgb();
            const a = parseInt(this.transparencySlider.value);

            const colorHex = this.rgbaToHex(r,g,b,a);
            this.changeColorCallback?.(colorHex);
        });

        this.transparencySlider.addEventListener("input", e => {
            const {r,g,b} = this.getRgb();
            const a = parseInt(this.transparencySlider.value);

            const colorHex = this.rgbaToHex(r,g,b,a);
            this.changeColorCallback?.(colorHex);
        });

        // === CURSOR CANVAS ===
        this.drawCursor();

        this.cursorCanvas.addEventListener("pointerdown", e => {
            this.isPointerPressed = true;
            this.isDirty = true;

            this.currentX = e.offsetX * this.canvasScaleX;
            this.currentY = e.offsetY * this.canvasScaleY;
        });

        window.addEventListener("pointermove", e => {
            if (!this.isPointerPressed) return;

            this.isDirty = true;

            const rect = this.cursorCanvas.getBoundingClientRect();

            this.currentX = Math.max(0, Math.min((e.clientX - rect.left) * this.canvasScaleX, this.canvasWidth-1));
            this.currentY = Math.max(0, Math.min((e.clientY - rect.top) * this.canvasScaleY, this.canvasHeight-1));
        });

        window.addEventListener("pointerup", e => {
            if (!this.isPointerPressed) return;

            this.isDirty = true;
            this.isPointerPressed = false;
        });

        const colorPickerLoop = () => {
            if (this.isDirty) {
                const {r,g,b} = this.getRgb();
                const a = parseInt(this.transparencySlider.value);

                const colorHex = this.rgbaToHex(r,g,b,a);

                this.changeColorCallback?.(colorHex);

                this.drawCursor();

                this.isDirty = false;
            }

            requestAnimationFrame(colorPickerLoop);
        }

        colorPickerLoop();
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

        colorSlider.id = "color-slider"
        colorSlider.type = "range";
        colorSlider.min = 0;
        colorSlider.max = 360;
        colorSlider.value = 0;

        return colorSlider;
    }

    createTransparencySlider() {
        const transparencySlider = document.createElement("input");

        transparencySlider.id = "transparency-slider"
        transparencySlider.type = "range";
        transparencySlider.min = 0;
        transparencySlider.max = 255;
        transparencySlider.value = 255;

        return transparencySlider;
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

    rgbaToHex(r, g, b, a) {
        return "#" + this.decimalToHex(r) + this.decimalToHex(g) + this.decimalToHex(b) + this.decimalToHex(a);
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

class Slider {
    constructor(min = 0, max = 100, value = min) {
        // variables
        this.min = min;
        this.max = max;
        this.value = value;

        this.width = 150;
        this.height = 10;
        this.isHorizontal = this.width > this.height;

        this.isPointerPressed = false;

        // elements
        this.slider = this.createSlider();
        this.track = this.createTrack();
        this.thumb = this.createThumb();

        // init/events
        this.track.addEventListener("pointerdown", e => {
            this.isPointerPressed = true;

            this.pointerDownAndMoveHandler(e);
            this.track.setPointerCapture(e.pointerId);
        });

        this.track.addEventListener("pointermove", e => {
            if (!this.isPointerPressed) return;

            this.pointerDownAndMoveHandler(e);
        });

        this.track.addEventListener("pointerup", e => {
            if (!this.isPointerPressed) return;

            this.isPointerPressed = false;
            this.track.releasePointerCapture(e.pointerId);
        });
    }

    createSlider() {
        const slider = document.createElement("div");

        slider.className = "custom-slider";

        // size
        slider.style.width = this.width + "px";
        slider.style.height = this.height + "px";

        slider.style.margin = "10px";
        slider.style.position = "relative";

        return slider;
    }

    createTrack() {
        const track = document.createElement("div");

        track.className = "track";

        // size
        track.style.width = this.width + "px";
        track.style.height = this.height + "px";

        // look
        track.style.borderRadius = "5px";
        track.style.backgroundColor = "#006AE8";

        this.slider.appendChild(track);

        return track;
    }

    createThumb() {
        const thumb = document.createElement("div");

        thumb.className = "thumb";

        // size
        const size = Math.min(this.width, this.height);
        thumb.style.width = size + "px";
        thumb.style.height = size + "px";

        // position
        thumb.style.position = "absolute";
        
        if (this.isHorizontal) {
            thumb.style.left = "0px";
        } else {
            thumb.style.top = "0px";
        }

        // look
        thumb.style.borderRadius = "10px";
        thumb.style.boxShadow = "0 0 0 3px #213d5f";
        thumb.style.backgroundColor = "#006AE8";

        this.track.appendChild(thumb);

        return thumb;
    }

    // for events 'pointerdown' and 'pointermove'
    pointerDownAndMoveHandler(e) {
        const rect = this.track.getBoundingClientRect()

        if (this.isHorizontal) {
            let pos = e.clientX - rect.left;
            pos = Math.max(0, Math.min(pos, this.width));

            this.value = (this.normalize(pos));
            this.thumb.style.left = pos - this.height/2 + "px";
        } else {
            let pos = e.clientY - rect.top;
            pos = Math.max(0, Math.min(pos, this.height));

            this.value = (this.normalize(pos));
            this.thumb.style.top = pos - this.width/2 + "px";
        }
    }

    normalize(x) {
        // range: [a, b]
        // norm = (x - min) / (max - min) * (b - a) + a
        // min = 0, max = Math.max(this.width, this.height)

        const max = Math.max(this.width, this.height);
        return (x / max) * (this.max - this.min) + this.min;
    }
}