import OptionSlider from "../ui/OptionSlider.js";

export default class ContextualToolbarManager {
    constructor(toolbar, palette) {
        this.toolbar = toolbar;
        this.palette = palette;

        this.options = {
            palette: this.palette.element,
            size: new OptionSlider(1, 40, 1, "fa-solid fa-pen-nib").element,
            alpha: new OptionSlider(1, 100, 100, "fa-solid fa-a").element,
        }
    }

    update(options) {
        // clear toolbar
        this.toolbar.innerHTML = "";

        // update toolbar
        options.forEach(option => {
            const element = this.createOption(option);

            if (element) {
                this.toolbar.appendChild(element);
            }
        });
    }

    createOption(option) {
        const element = this.options[option];

        if (!element) {
            return null;
        }

        return element;
    }
}