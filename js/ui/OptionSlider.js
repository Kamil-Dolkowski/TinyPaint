export default class OptionSlider {
    constructor(min=1, max=100, value=1, iconClass=null) {
        this.min = min;
        this.max = max;
        this.value = value;

        this.iconBtn = this.createIconBtn(iconClass);
        this.minusBtn = this.createMinusBtn();
        this.slider = this.createSlider();
        this.plusBtn = this.createPlusBtn();
        this.label = this.createLabel();

        this.content = this.createContent();

        this.element = this.createElement();

        // events
        // -- iconBtn
        this.iconBtn.addEventListener("click", () => {
            this.switchVisibility();
        });

        // -- minusBtn
        this.minusBtn.addEventListener("click", () => {
            if (this.value - 1 < this.min) return;
            this.value -= 1;
            this.updateSlider();
            this.updateLabel();
        });

        // -- plusBtn
        this.plusBtn.addEventListener("click", () => {
            if (this.value + 1 > this.max) return;
            this.value += 1;
            this.updateSlider();
            this.updateLabel();
        });

        // -- slider
        this.slider.addEventListener("input", e => {
            this.value = Number(e.target.value);
            this.updateLabel();
        });
    }

    createIconBtn(iconClass) {
        const button = document.createElement("button");
        button.classList.add("toolbar-button");
        
        const icon = document.createElement("i");
        if(iconClass) icon.className = iconClass;

        button.appendChild(icon);

        return button;
    }

    createMinusBtn() {
        const minusBtn = document.createElement("button");
        minusBtn.classList.add("toolbar-button");

        const minusIcon = document.createElement("i");
        minusIcon.classList.add("fa-solid", "fa-minus")

        minusBtn.appendChild(minusIcon);

        return minusBtn;
    }

    createSlider() {
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = this.min;
        slider.max = this.max;
        slider.value = this.value;

        return slider;
    }

    createPlusBtn() {
        const plusBtn = document.createElement("button");
        plusBtn.classList.add("toolbar-button");

        const plusIcon = document.createElement("i");
        plusIcon.classList.add("fa-solid", "fa-plus")

        plusBtn.appendChild(plusIcon);

        return plusBtn;
    }

    createLabel() {
        const label = document.createElement("div");
        label.classList.add("toolbar-button");
        label.textContent = this.value;

        return label;
    }

    createContent() {
        const content = document.createElement("div")
        content.classList.add("option-slider-content");
        // content.classList.add("hidden");

        content.appendChild(this.minusBtn);
        content.appendChild(this.slider);
        content.appendChild(this.plusBtn);
        content.appendChild(this.label);

        return content;
    }

    createElement() {
        const root = document.createElement("div");
        root.className = "option-slider";

        root.appendChild(this.iconBtn);
        root.appendChild(this.content);

        return root;
    }

    switchVisibility() {
        this.content.classList.toggle("hidden");
    }

    updateLabel() {
        this.label.textContent = this.value;
    }

    updateSlider() {
        this.slider.value = this.value;
    }
}