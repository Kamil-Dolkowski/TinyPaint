export default class PaletteControl {
    constructor() {
        this.iconBtn = this.createIconBtn();
        this.currentColorDiv = this.createCurrentColor();
        this.currentColor = this.currentColorDiv.querySelector("#current-color");

        this.element = this.createElement();
    }

    createIconBtn() {
        const button = document.createElement("button");
        button.classList.add("toolbar-button");
        
        // icon
        const SVG_NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(SVG_NS, "svg");
        const use = document.createElementNS(SVG_NS, "use");

        use.setAttribute("href", "assets/icons/controls.svg#palette");

        svg.appendChild(use);
        button.appendChild(svg);

        return button;
    }

    createCurrentColor() {
        const div = document.createElement("div");

        const checkerboard = document.createElement("div");
        checkerboard.id = "current-color-checkerboard";
        checkerboard.className = "toolbar-button";

        const color = document.createElement("button");
        color.id = "current-color";
        color.className = "toolbar-button";
        
        div.appendChild(checkerboard);
        div.appendChild(color);

        return div;
    }

    createElement() {
        const element = document.createElement("div");
        element.style.display = "flex";

        element.appendChild(this.iconBtn);
        element.appendChild(this.currentColor);

        return element;
    }

    changeCurrentColor(color) {
        this.currentColor.style.backgroundColor = color;
    }
}