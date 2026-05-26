export default class OptionSlider {
    constructor(min=1, max=100, value=1, iconClass=null) {
        this.min = min;
        this.max = max;
        this.value = value;

        this.icon = this.createIcon(iconClass);
        this.minusBtn = this.createMinusBtn();
        this.slider = this.createSlider();
        this.plusBtn = this.createPlusBtn();
        this.label = this.createLabel();

        this.element = this.createElement();

        // events
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

    createIcon(iconClass) {
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

    createElement() {
        const root = document.createElement("div");
        root.style.display = "flex";

        root.appendChild(this.icon);
        root.appendChild(this.minusBtn);
        root.appendChild(this.slider);
        root.appendChild(this.plusBtn);
        root.appendChild(this.label);

        return root;
    }

    updateLabel() {
        this.label.textContent = this.value;
    }

    updateSlider() {
        this.slider.value = this.value;
    }
}