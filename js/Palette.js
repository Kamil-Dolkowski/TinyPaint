export default class Palette {
    constructor(paletteWindow, paletteBtn, currentColorDiv, canvas) {
        this.paletteWindow = paletteWindow;
        this.paletteBtn = paletteBtn;
        this.currentColorDiv = currentColorDiv;
        this.canvas = canvas;

        this.colorPalette = this.paletteWindow.querySelector("#color-palette-content");
        this.colorPicker = this.paletteWindow.querySelector("#color-picker");

        this.isPaletteVisible = false;
        this.basicColors = ["#000000", "#ffffff", "#ff0000", "#0000ff", "#00ff00", "#ffff00", "#ff00ff", "#ff4000"];

        this.colorButtons = [];
        this.currentColorBtnId = 0;

        this.currentColor = this.basicColors[0];

        this.initColorButtons();

        window.addEventListener("resize", this.updatePosition.bind(this));
        
    }

    initColorButtons() {
        // color buttons dataset:
        // data-id = "1"
        // data-focus = "true" / "false"
        // data-color = "#ffffff" / "none"

        const count = 48;

        for(let i = 0; i < count; i++) {
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

                this.changeColor(button.dataset.color);
            });

            this.colorButtons.push(button);
            this.colorPalette.appendChild(button);
        }

        // init first button color
        const firstBtn = this.colorButtons[0];

        this.changeColor(firstBtn.dataset.color);
        this.currentColorBtnId = 0;
        firstBtn.dataset.focus = "true";
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

    // Canvas
    changeColor(color) {
        if (color === "none") color = "#000000";

        const ctx = this.canvas.canvas.getContext("2d");

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        this.currentColorDiv.style.backgroundColor = color;
        this.currentColor = color;
    }

    // Color Palette
    deleteColorFromPalette(buttonId) {
        if (buttonId < 0 || buttonId >= this.colorButtons.length) return;

        // move buttons back by 1
        for (let i = buttonId; i < this.colorButtons.length - 1; i++) {
            this.swapButtons(i, i+1);
        }

        // reset last button
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

        for (let i = 0; i < this.colorButtons.length; i++) {
            const btn = this.colorButtons[i];

            if (btn.dataset.color === "none") {
                button = btn;
                break;
            }
        }

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