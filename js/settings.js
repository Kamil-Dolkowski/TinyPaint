// elements
const settingsBtn = document.getElementById("settings-btn");
const modal = document.getElementById("settings-modal");
const closeBtn = modal.querySelector(".modal-close");
const saveBtn = modal.querySelector("#settings-save");

// inputs
const widthInput = modal.querySelector("#canvas-size-width-input");
const heightInput = modal.querySelector("#canvas-size-height-input");
const backgroundInput = modal.querySelector("#background-input");

let canvas = null;

settingsBtn.addEventListener("click", () => {
    switchModalVisibility();
});

closeBtn.addEventListener("click", () => {
    switchModalVisibility();
});

modal.addEventListener("pointerdown", e => {
    if (e.target === modal) {
        switchModalVisibility();
    }
});

widthInput.addEventListener("blur", () => {
    let value = Number(widthInput.value);

    if (isNaN(value)) value = 1;

    value = Math.max(1, Math.min(value, 3840));

    widthInput.value = value;
});

heightInput.addEventListener("blur", () => {
    let value = Number(heightInput.value);

    if (isNaN(value)) value = 1;

    value = Math.max(1, Math.min(value, 2160));

    heightInput.value = value;
});

saveBtn.addEventListener("click", () => {
    save();
});

function switchModalVisibility() {
    modal.classList.toggle("hidden");
}

function initSettingsModal(canvasR) {
    canvas = canvasR;
}

function save() {
    // Canvas size
    if (canvas) canvas.setSize(widthInput.value, heightInput.value);

    // Background
    // if (canvas) canvas.setBackground(backgroundInput.value);
}