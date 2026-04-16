export default class ColorPalette {
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

    addColorToPalette(color) {
        let button = null;

        // find first button with color == "none"
        for (let i = 0; i < this.colorButtons.length; i++) {
            const btn = this.colorButtons[i];

            if (btn.dataset.color === "none") {
                button = btn;
                break;
            }
        }

        if (button == null) return;

        // change button color
        this.currentColor = color;
        button.dataset.color = color;
        button.style.backgroundColor = color;
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